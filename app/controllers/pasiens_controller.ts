import type { HttpContext } from '@adonisjs/core/http'
import skipData from '../helpers/pagination.js';
import db from '@adonisjs/lucid/services/db';
import { addPasienValidator } from '#validators/pasien';
import Pasien from '#models/pasien';
import { Gender } from '../enums/gender_enum.js';
import idConverter from '../helpers/id_converter.js';
import ValidationException from '#exceptions/validation_exception';
import { DateTime } from 'luxon';
import PasienTransactionHeader from '#models/pasien_transaction_header';
import QueuePasien from '#models/queue_pasien';
import { Status } from '../enums/status_enum.js';

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

            newPasienData.noRm = `RM/${registerDate.year}${registerDate.month}${registerDate.day}/${idConverter(newPasienData.id)}`
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

          // if found
          if(pasienData) {
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
            newQueuePasien.statusBayarObat = false
            newQueuePasien.statusAmbilObat = false
            newQueuePasien.timeQueueStart = timeNow
            newQueuePasien.timePangilPerawat = timeNow
            newQueuePasien.timePeriksa = timeNow
            newQueuePasien.timeQueueEnd = timeNow
            await newQueuePasien.save()
            
            return response.ok({
              message : `Tambah nomor antrian berhasil`,
            })


          // else condition where pasien data not found
          } 
        } catch(error) {
          console.log(error)
          if(error.status === 422){
            throw new ValidationException(error.messages)
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
          newQueuePasien.statusBayarObat = false
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
}