import DataNotFoundException from '#exceptions/data_not_found_exception'
import ValidationException from '#exceptions/validation_exception'
import Drug from '#models/drug'
import DrugCategory from '#models/drug_category'
import { addDrugCategoryValidator, addDrugValidator } from '#validators/drug'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

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
    // const categoryData = await DrugCategory.query().where('clinic_id', auth.user!.clinicId)
    const categoryData = await db.rawQuery("SELECT * FROM clinics WHERE id = ?", [auth.user?.clinicId])

    return response.ok({ message: 'Data fetched!', data: categoryData[0] })
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

  async getCategoryDetail({ response, params }: HttpContext) {
    try {
      const categoryData = await DrugCategory.findOrFail(params.id)

      return response.ok({ message: 'Data fetched!', data: categoryData })
    } catch (error) {
      if (error.status === 404) {
        throw new DataNotFoundException('Data kategori tidak ditemukan!')
      }
    }
  }

  async addDrug({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(addDrugValidator)
      console.log("data", data)

      const newDrug = new Drug()
      newDrug.drug = data.drug
      newDrug.drugGenericName = data.drugGenericName
      newDrug.dose = data.dose
      newDrug.shelve = data.shelve
      newDrug.purchasePrice = data.purchasePrice
      newDrug.sellingPrice = data.sellingPrice
      newDrug.drugCategoryId = data.categoryId
      newDrug.drugFactoryId = data.factoryId
      newDrug.clinicId = auth.user!.clinicId

      await newDrug.save()

      return response.created({ message: 'Obat berhasil ditambahkan!' })
    } catch (error) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      }
    }
  }

  async getDrugs({ response, auth }: HttpContext) {
    const drugData = await Drug.query()
      .preload('drugCategory')
      .where('clinic_id', auth.user!.clinicId)

    return response.ok({ message: 'Data fetched!', data: drugData })
  }

  async deleteDrug({ response, params }: HttpContext) {
    try {
      const drugData = await Drug.findOrFail(params.id)

      await drugData.delete()

      return response.ok({ message: 'Data obat berhasil dihapus!' })
    } catch (error) {
      if (error.status === 404) {
        throw new DataNotFoundException('Data obat tidak ditemukan!')
      }
    }
  }

  async updateDrug({ request, response, params }: HttpContext) {
    try {
      const data = await request.validateUsing(addDrugValidator)

      const drugData = await Drug.findOrFail(params.id)
      drugData.drug = data.drug
      drugData.drugGenericName = data.drugGenericName
      drugData.dose = data.dose
      drugData.drugCategoryId = data.categoryId
      drugData.drugFactoryId = data.factoryId
      drugData.shelve = data.shelve
      drugData.purchasePrice = data.purchasePrice
      drugData.sellingPrice = data.sellingPrice

      await drugData.save()

      return response.ok({ message: 'Data obat berhasil diubah!' })
    } catch (error) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      } else if (error.status === 404) {
        throw new DataNotFoundException('Data obat tidak ditemukan!')
      }
    }
  }

  async getDrugDetail({ response, params }: HttpContext) {
    try {
      const drugData = await Drug.query()
        .preload('drugCategory')
        .preload('drugFactory')
        .where('id', params.id)
        .firstOrFail()

      return response.ok({ message: 'Data fetched!', data: drugData })
    } catch (error) {
      if (error.status === 404) {
        throw new DataNotFoundException('Data obat tidak ditemukan!')
      }
    }
  }
}
