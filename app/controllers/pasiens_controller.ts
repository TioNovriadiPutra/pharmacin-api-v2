import type { HttpContext } from '@adonisjs/core/http'
import skipData from '../helpers/pagination.js';
import db from '@adonisjs/lucid/services/db';
import { addPasienValidator, startPeriksaValidator } from '#validators/pasien';
import Pasien from '#models/pasien';
import { Gender } from '../enums/gender_enum.js';
import idConverter from '../helpers/id_converter.js';
import ValidationException from '#exceptions/validation_exception';
import { DateTime } from 'luxon';
import PasienTransactionHeader from '#models/pasien_transaction_header';
import QueuePasien from '#models/queue_pasien';
import { Status } from '../enums/status_enum.js';
import { assignDokterValidator } from '#validators/dokter';
import DataNotFoundException from '#exceptions/data_not_found_exception';

export default class PasiensController {
    async getPasien({ request, response, auth }: HttpContext) {
        try {
          const page = request.input('page', 1)
          const perPage = request.input('perPage', 10)
          const searchTerm = request.input('searchTerm', '');
          const search = `%${searchTerm}%`;
    
          const pasienDataList = await db.rawQuery(
            `
            SELECT * FROM pasiens 
            WHERE clinic_id = ?
            AND (nama_pasien LIKE ? OR nik_pasien LIKE ? OR no_rm LIKE ?)
            LIMIT ?
            OFFSET ?
            `,
            [auth.user!.clinicId, search, search, search, perPage, skipData(page, perPage)]
          )
    
          return response.ok({
            message: 'Data fetched!',
            data: pasienDataList[0],
          })
        } catch (error) {
            console.log(error);
          return response.badRequest({
            message: 'ERROR',
            error: error,
          })
        }
      }

      async addPasienData({request, response, auth}: HttpContext) {
        try {
            const data = await request.validateUsing(addPasienValidator)

            const registerDate = DateTime.now()

            const newPasienData = new Pasien()
            newPasienData.namaPasien = data.namaPasien
            newPasienData.nikPasien = data.nikPasien
            newPasienData.alamatPasien = data.alamatPasien
            newPasienData.gender = data.gender as Gender
            newPasienData.occupation = data.jenisPekerjaan
            newPasienData.tempatLahirPasien = data.tempatLahir
            newPasienData.tanggalLahirPasien = data.tanggalLahir
            newPasienData.noHp = data.noHp
            newPasienData.alergiObat = data.alergiObat
            newPasienData.clinicId = auth.user!.clinicId
            await newPasienData.save()

            newPasienData.noRm = `RM${idConverter(newPasienData.id).padStart(6, '0')}`
            await newPasienData.save()

            console.log(data)
            return response.created({
                message: 'Penambahan pasien berhasil!',
            })
        } catch (error: any) {
            if(error.status === 422){
                throw new ValidationException(error.messages)
            }
        }
      }

      async pasienQueue({request, response, auth}: HttpContext) {
        try {
          const pasienData = await Pasien.findOrFail(request.id)
          let queue_number = 0
          const timeNow = DateTime.now()

            const addPasienHeader = new PasienTransactionHeader()
            addPasienHeader.pasienId = pasienData.id
            addPasienHeader.dokterId = 0
            addPasienHeader.perawatId = 0
            addPasienHeader.clinicId = auth.user!.clinicId
            addPasienHeader.noRm = pasienData.noRm
            addPasienHeader.noRegistrasi = "1"
            await addPasienHeader.save()
            queue_number += 1
            
            const newQueuePasien = new QueuePasien()
            newQueuePasien.queueNumber =  queue_number
            newQueuePasien.transactionId = addPasienHeader.id
            newQueuePasien.dokterId = addPasienHeader.dokterId
            newQueuePasien.perawatId = addPasienHeader.perawatId
            newQueuePasien.statusPanggilPerawat = false
            newQueuePasien.statusPeriksa = 'pending' as Status
            newQueuePasien.statusBayarObat = 'pending' as Status
            newQueuePasien.statusAmbilObat = false
            newQueuePasien.timeQueueStart = timeNow
            newQueuePasien.timePangilPerawat = timeNow
            newQueuePasien.timePeriksa = timeNow
            newQueuePasien.timeQueueEnd = timeNow
            await newQueuePasien.save()
            
            return response.ok({
              message : `Tambah nomor antrian berhasil`,
            })

        } catch(error) {
          console.log(error)
          if (error.status === 404) {
            throw new DataNotFoundException('Data pasien tidak ditemukan!')
          }
        }
      }

      async addPasienAndQueue({request, response, auth}: HttpContext) {
        try {
          const data = await request.validateUsing(addPasienValidator)

          let queue_number = 0
          const timeNow = DateTime.now()

          const newPasienData = new Pasien()
          newPasienData.namaPasien = data.namaPasien
          newPasienData.nikPasien = data.nikPasien
          newPasienData.alamatPasien = data.alamatPasien
          newPasienData.gender = data.gender as Gender
          newPasienData.occupation = data.jenisPekerjaan
          newPasienData.tempatLahirPasien = data.tempatLahir
          newPasienData.tanggalLahirPasien = data.tanggalLahir
          newPasienData.noHp = data.noHp
          newPasienData.alergiObat = data.alergiObat
          newPasienData.clinicId = auth.user!.clinicId
          await newPasienData.save()

          newPasienData.noRm = `RM/${timeNow.year}${timeNow.month}${timeNow.day}/${idConverter(newPasienData.id)}`
          await newPasienData.save()

          const addPasienHeader = new PasienTransactionHeader()
          addPasienHeader.pasienId = newPasienData.id
          addPasienHeader.dokterId = 0
          addPasienHeader.perawatId = 0
          addPasienHeader.clinicId = auth.user!.clinicId
          addPasienHeader.noRm = newPasienData.noRm
          addPasienHeader.noRegistrasi = "1"
          await addPasienHeader.save()
          queue_number += 1
          
          const newQueuePasien = new QueuePasien()
          newQueuePasien.queueNumber =  queue_number
          newQueuePasien.transactionId = addPasienHeader.id
          newQueuePasien.dokterId = addPasienHeader.dokterId
          newQueuePasien.perawatId = addPasienHeader.perawatId
          newQueuePasien.statusPanggilPerawat = false
          newQueuePasien.statusPeriksa = 'pending' as Status
          newQueuePasien.statusBayarObat = 'pending' as Status
          newQueuePasien.statusAmbilObat = false
          newQueuePasien.timeQueueStart = timeNow
          newQueuePasien.timePangilPerawat = timeNow
          newQueuePasien.timePeriksa = timeNow
          newQueuePasien.timeQueueEnd = timeNow
          await newQueuePasien.save()
          
          return response.ok({
            message : `Tambah nomor antrian berhasil`,
          })
        } catch (error) {
          console.log(error)
          if(error.status === 422){
            throw new ValidationException(error.messages)
          }
        }
      }

      async assignDokter({request, response, params}: HttpContext) {
        try {
          // param queue_id, dokter_id
          const data = await request.validateUsing(assignDokterValidator)
          const queueData = await QueuePasien.findOrFail(params.id)
          console.log(queueData)
          if(queueData.dokterId != undefined) {
            return response.badRequest({
              code: 400,
              message: `Pasien dengan queue ${queueData.queueNumber} sudah memiliki dokter`
            })
          } 
          // save pasien table
          queueData.dokterId = data.dokterId
          queueData.statusPanggilPerawat = true
          queueData.timePangilPerawat = DateTime.now()
          await queueData.save()

          // save transaction header
          const pasienTransHeader = await PasienTransactionHeader.findOrFail(params.id)
          pasienTransHeader.dokterId = data.dokterId
          await pasienTransHeader.save()


          return response.ok({message: `Berhasil assign dokter ke pasien dengan antrian ${queueData.queueNumber}`})

        } catch (error) {
          console.log(error)
          if (error.status === 404) {
            throw new DataNotFoundException('Data queue tidak ditemukan!')
          }
        }
      }

      async startPeriksa({request, response, params}: HttpContext) {
        try {
          // params queue id
          const data = await request.validateUsing(startPeriksaValidator)
          const queueData = await QueuePasien.findOrFail(params.id)
          queueData.statusPeriksa = data.statusPeriksa as Status
          await queueData.save()

          return response.ok({
            status: "SUCCESS",
            message: `Pasien dengan antrian ${queueData.queueNumber} mulai diperiksa!`
          })
        } catch (error) {
          if (error.status === 404) {
            throw new DataNotFoundException('Data queue tidak ditemukan!')
          } 
        }
      }
}