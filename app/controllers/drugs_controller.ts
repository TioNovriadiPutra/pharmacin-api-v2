import DataNotFoundException from '#exceptions/data_not_found_exception'
import ValidationException from '#exceptions/validation_exception'
import Drug from '#models/drug'
import DrugCategory from '#models/drug_category'
import { addDrugCategoryValidator, addDrugValidator } from '#validators/drug'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import idConverter from '../helpers/id_converter.js'
import skipData from '../helpers/pagination.js'

export default class DrugsController {
  async addDrugCategory({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(addDrugCategoryValidator)

      const newDrugCategory = new DrugCategory()
      newDrugCategory.categoryName = data.categoryName
      newDrugCategory.clinicId = auth.user!.clinicId

      await newDrugCategory.save()

      newDrugCategory.categoryNumber = `KTO${idConverter(newDrugCategory.id)}`

      await newDrugCategory.save()

      return response.created({ message: 'Kategori obat berhasil ditambahkan!' })
    } catch (error) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      }
    }
  }

  async getCategories({ request, response, auth }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const searchTerm = request.input('searchTerm', '');
    const search = `%${searchTerm}%`;
    const categoryData = await db.rawQuery(
      `SELECT id, category_number, category_name 
      FROM drug_categories 
      WHERE clinic_id = ?
      AND (category_name LIKE ?)
      LIMIT ?
      OFFSET ?`,
      [auth.user!.clinicId, search, perPage, skipData(page, perPage)]
    )

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
      const categoryData = await db.rawQuery(
        'SELECT id, category_name FROM drug_categories WHERE id = ?',
        [params.id]
      )

      if (categoryData[0].length === 0) {
        throw new DataNotFoundException('Data kategori tidak ditemukan')
      }

      return response.ok({ message: 'Data fetched!', data: categoryData[0][0] })
    } catch (error) {
      if (error.status === 404) {
        throw error
      }
    }
  }

  async addDrug({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(addDrugValidator)
      console.log('data', data)

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

      newDrug.drugNumber = `OBT${idConverter(newDrug.id)}`

      await newDrug.save()

      return response.created({ message: 'Obat berhasil ditambahkan!' })
    } catch (error) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      }
    }
  }

  async getDrugs({ request, response, auth }: HttpContext) {
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 10)
    const searchTerm = request.input('searchTerm', '');
    const search = `%${searchTerm}%`;
    const drugData = await db.rawQuery(
      `SELECT 
        drugs.id,
        drugs.drug, 
        drugs.drug_generic_name, 
        drug_categories.category_name, 
        drugs.shelve, 
        drugs.selling_price, 
        drugs.dose 
        FROM drugs 
        JOIN drug_categories ON drugs.drug_category_id = drug_categories.id 
        WHERE drugs.clinic_id = ?
        AND (drugs.drug LIKE ? OR drugs.drug_generic_name LIKE ? OR drugs.shelve LIKE ? OR drug_categories.category_name LIKE ?)
        LIMIT ?
        OFFSET ?`,
      [auth.user!.clinicId, search, search, search, search, perPage, skipData(page, perPage)]
    )

    return response.ok({ message: 'Data fetched!', data: drugData[0] })
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
      const drugData = await db.rawQuery(
        `SELECT
          drugs.id,
          drugs.drug_number,
          drugs.drug,
          drugs.drug_generic_name,
          drugs.dose,
          drugs.shelve,
          drugs.purchase_price,
          drugs.selling_price,
          drugs.total_stock,
          JSON_OBJECT(
            "id", drug_categories.id,
            "category_name", drug_categories.category_name
          ) AS drug_category,
          JSON_OBJECT(
            "id", drug_factories.id,
            "factory_name", drug_factories.factory_name
          ) AS drug_factory
          FROM drugs 
          JOIN drug_categories ON drugs.drug_category_id = drug_categories.id 
          JOIN drug_factories ON drugs.drug_factory_id = drug_factories.id 
          WHERE drugs.id = ?`,
        [params.id]
      )

      if (drugData[0].length === 0) {
        throw new DataNotFoundException('Data obat tidak ditemukan!')
      }

      Object.assign(drugData[0][0], {
        drug_category: JSON.parse(drugData[0][0].drug_category),
        drug_factory: JSON.parse(drugData[0][0].drug_factory),
      })

      return response.ok({ message: 'Data fetched!', data: drugData[0][0] })
    } catch (error) {
      if (error.status === 404) {
        throw error
      }
    }
  }
}
