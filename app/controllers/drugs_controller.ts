import DataNotFoundException from '#exceptions/data_not_found_exception'
import ValidationException from '#exceptions/validation_exception'
import DrugCategory from '#models/drug_category'
import { addDrugCategoryValidator } from '#validators/drug'
import type { HttpContext } from '@adonisjs/core/http'

export default class DrugsController {
  async addDrugCategory({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(addDrugCategoryValidator)

      const newDrugCategory = new DrugCategory()
      newDrugCategory.categoryName = data.categoryName
      newDrugCategory.clinicId = auth.user!.clinicId

      await newDrugCategory.save()

      return response.created({ message: 'Kategori obat berhasil ditambahkan!' })
    } catch (error) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      }
    }
  }

  async getCategories({ response, auth }: HttpContext) {
    const categoryData = await DrugCategory.query().where('clinic_id', auth.user!.clinicId)

    return response.ok({ message: 'Data fetched!', data: categoryData })
  }

  async deleteDrugCategory({ response, params }: HttpContext) {
    try {
      const categoryData = await DrugCategory.findOrFail(params.id)

      await categoryData.delete()

      return response.ok({ message: 'Data kategori berhasil dihapus!' })
    } catch (error) {
      if (error.status === 404) {
        throw new DataNotFoundException('Data kategori tidak ditemukan!')
      }
    }
  }

  async updateDrugCategory({ request, response, params }: HttpContext) {
    try {
      const data = await request.validateUsing(addDrugCategoryValidator)

      const categoryData = await DrugCategory.findOrFail(params.id)
      categoryData.categoryName = data.categoryName

      await categoryData.save()

      return response.ok({ message: 'Data kategori berhasil diubah!' })
    } catch (error) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      } else if (error.status === 404) {
        throw new DataNotFoundException('Data kategori tidak ditemukan!')
      }
    }
  }
}
