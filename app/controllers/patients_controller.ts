import type { HttpContext } from '@adonisjs/core/http'
import skipData from '../helpers/pagination.js'
import db from '@adonisjs/lucid/services/db'
import { addPatientValidator } from '#validators/patient'
import Patient from '#models/patient'
import { Gender } from '../enums/gender_enum.js'
import Occupation from '#models/occupation'
import ValidationException from '#exceptions/validation_exception'
import { DateTime } from 'luxon'
import idConverter from '../helpers/id_converter.js'
import DataNotFoundException from '#exceptions/data_not_found_exception'

export default class PatientsController {
  async getPatients({ request, response, auth }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const searchTerm = request.input('searchTerm', '')
    const search = `%${searchTerm}%`

    const patientData = await db.rawQuery(
      `SELECT
          full_name,
          record_number,
          phone,
          address,
          gender,
          DATE_FORMAT(dob, "%Y-%m-%d") AS date_birth,
          ready
        FROM patients 
        WHERE clinic_id = ?
        AND (full_name LIKE ? OR nik LIKE ? OR record_number LIKE ?)
        LIMIT ?
        OFFSET ?`,
      [auth.user!.clinicId, search, search, search, perPage, skipData(page, perPage)]
    )

    return response.ok({
      message: 'Data fetched!',
      data: patientData[0],
    })
  }

  async addPatient({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(addPatientValidator)

      const occupationData = await Occupation.findOrFail(data.occupationId)

      const newPatient = new Patient()
      newPatient.fullName = data.fullName
      newPatient.nik = data.nik
      newPatient.address = data.address
      newPatient.gender = data.gender as Gender
      newPatient.occupationName = occupationData.occupationName
      newPatient.pob = data.pob
      newPatient.dob = DateTime.fromISO(data.dob)
      newPatient.phone = data.phone
      newPatient.allergy = data.allergy
      newPatient.clinicId = auth.user!.clinicId

      await occupationData.related('patients').save(newPatient)

      newPatient.recordNumber = `RM${idConverter(newPatient.id, 6)}`

      await newPatient.save()

      return response.created({
        message: 'Penambahan pasien berhasil!',
      })
    } catch (error: any) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      } else if (error.status === 404) {
        throw new DataNotFoundException('Jenis pekerjaan tidak ditemukan!')
      }
    }
  }

  // async pasienQueue({ request, response, auth }: HttpContext) {
  //   try {
  //     const pasienData = await Pasien.findOrFail(request.id)
  //     let queue_number = 0
  //     const timeNow = DateTime.now()

  //     const addPasienHeader = new PasienTransactionHeader()
  //     addPasienHeader.pasienId = pasienData.id
  //     addPasienHeader.dokterId = 0
  //     addPasienHeader.perawatId = 0
  //     addPasienHeader.clinicId = auth.user!.clinicId
  //     addPasienHeader.noRm = pasienData.noRm
  //     addPasienHeader.noRegistrasi = '1'
  //     await addPasienHeader.save()
  //     queue_number += 1

  //     const newQueuePasien = new QueuePasien()
  //     newQueuePasien.queueNumber = queue_number
  //     newQueuePasien.transactionId = addPasienHeader.id
  //     newQueuePasien.dokterId = addPasienHeader.dokterId
  //     newQueuePasien.perawatId = addPasienHeader.perawatId
  //     newQueuePasien.statusPanggilPerawat = false
  //     newQueuePasien.statusPeriksa = 'pending' as Status
  //     newQueuePasien.statusBayarObat = false
  //     newQueuePasien.statusAmbilObat = false
  //     newQueuePasien.timeQueueStart = timeNow
  //     newQueuePasien.timePangilPerawat = timeNow
  //     newQueuePasien.timePeriksa = timeNow
  //     newQueuePasien.timeQueueEnd = timeNow
  //     await newQueuePasien.save()

  //     return response.ok({
  //       message: `Tambah nomor antrian berhasil`,
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     if (error.status === 422) {
  //       throw new ValidationException(error.messages)
  //     }
  //   }
  // }

  // async addPasienAndQueue({ request, response, auth }: HttpContext) {
  //   try {
  //     const data = await request.validateUsing(addPasienValidator)

  //     let queue_number = 0
  //     const timeNow = DateTime.now()

  //     const newPasienData = new Pasien()
  //     newPasienData.namaPasien = data.namaPasien
  //     newPasienData.nikPasien = data.nikPasien
  //     newPasienData.alamatPasien = data.alamatPasien
  //     newPasienData.gender = data.gender as Gender
  //     newPasienData.occupation = data.jenisPekerjaan
  //     newPasienData.tempatLahirPasien = data.tempatLahir
  //     newPasienData.tanggalLahirPasien = data.tanggalLahir
  //     newPasienData.noHp = data.noHp
  //     newPasienData.alergiObat = data.alergiObat
  //     newPasienData.clinicId = auth.user!.clinicId
  //     await newPasienData.save()

  //     newPasienData.noRm = `RM/${timeNow.year}${timeNow.month}${timeNow.day}/${idConverter(newPasienData.id)}`
  //     await newPasienData.save()

  //     const addPasienHeader = new PasienTransactionHeader()
  //     addPasienHeader.pasienId = newPasienData.id
  //     addPasienHeader.dokterId = 0
  //     addPasienHeader.perawatId = 0
  //     addPasienHeader.clinicId = auth.user!.clinicId
  //     addPasienHeader.noRm = newPasienData.noRm
  //     addPasienHeader.noRegistrasi = '1'
  //     await addPasienHeader.save()
  //     queue_number += 1

  //     const newQueuePasien = new QueuePasien()
  //     newQueuePasien.queueNumber = queue_number
  //     newQueuePasien.transactionId = addPasienHeader.id
  //     newQueuePasien.dokterId = addPasienHeader.dokterId
  //     newQueuePasien.perawatId = addPasienHeader.perawatId
  //     newQueuePasien.statusPanggilPerawat = false
  //     newQueuePasien.statusPeriksa = 'pending' as Status
  //     newQueuePasien.statusBayarObat = false
  //     newQueuePasien.statusAmbilObat = false
  //     newQueuePasien.timeQueueStart = timeNow
  //     newQueuePasien.timePangilPerawat = timeNow
  //     newQueuePasien.timePeriksa = timeNow
  //     newQueuePasien.timeQueueEnd = timeNow
  //     await newQueuePasien.save()

  //     return response.ok({
  //       message: `Tambah nomor antrian berhasil`,
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     if (error.status === 422) {
  //       throw new ValidationException(error.messages)
  //     }
  //   }
  // }
}
