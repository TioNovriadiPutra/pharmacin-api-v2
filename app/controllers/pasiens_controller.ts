import type { HttpContext } from '@adonisjs/core/http'
import skipData from '../helpers/pagination.js';
import db from '@adonisjs/lucid/services/db';
import { addPasienValidator } from '#validators/pasien';
import Pasien from '#models/pasien';
import { Gender } from '../enums/gender_enum.js';
import idConverter from '../helpers/id_converter.js';
import ValidationException from '#exceptions/validation_exception';
import { DateTime } from 'luxon';

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
}