import DataNotFoundException from '#exceptions/data_not_found_exception'
import ValidationException from '#exceptions/validation_exception'
import Clinic from '#models/clinic'
import DrugFactory from '#models/drug_factory'
import { addClinicDrugFactory } from '#validators/drug_factory'
import type { HttpContext } from '@adonisjs/core/http'

export default class DrugFactoriesController {
  async addDrugFactory({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(addClinicDrugFactory)

      const clinicData = await Clinic.findOrFail(auth.user!.clinicId)

      const drugFactoryData = await DrugFactory.firstOrCreate(
        {
          factoryName: data.factoryName,
        },
        {
          factoryName: data.factoryName,
          factoryEmail: data.factoryEmail,
          factoryPhone: data.factoryPhone,
        }
      )

      await clinicData.related('partnerships').attach([drugFactoryData.id])

      return response.created({ message: 'Data pabrik berhasil ditambahkan!' })
    } catch (error) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      } else if (error.status === 404) {
        throw new DataNotFoundException('Data klinik tidak ditemukan!')
      }
    }
  }

  async getFactories({ response, auth }: HttpContext) {
    const factoryData = await DrugFactory.query().whereHas('partnerships', (tmp) => {
      tmp.where('clinic_id', auth.user!.clinicId)
    })

    return response.ok({ message: 'Data fetched!', data: factoryData })
  }

  async deleteFactory({ response, params, auth }: HttpContext) {
    try {
      const factoryData = await DrugFactory.findOrFail(params.id)

      await factoryData.related('partnerships').detach([auth.user!.clinicId])

      return response.ok({ message: 'Data pabrik berhasil dihapus!' })
    } catch (error) {
      if (error.status === 404) {
        throw new DataNotFoundException('Data pabrik tidak ditemukan!')
      }
    }
  }

  async getFactoryDetail({ response, params }: HttpContext) {
    try {
      const factoryData = await DrugFactory.query()
        .preload('drugs', (tmp) => {
          tmp.preload('drugCategory')
        })
        .where('id', params.id)
        .firstOrFail()

      return response.ok({ message: 'Data fetched!', data: factoryData })
    } catch (error) {
      if (error.status === 404) {
        throw new DataNotFoundException('Drug factory data not found!')
      }
    }
  }
}
