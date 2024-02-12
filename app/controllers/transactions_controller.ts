import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { addPurchaseTransactionValidator } from '#validators/transaction'
import PurchaseTransaction from '#models/purchase_transaction'
import PurchaseShoppingCart from '#models/purchase_shopping_cart'
import DrugStock from '#models/drug_stock'
import Drug from '#models/drug'
import DrugFactory from '#models/drug_factory'
import { DateTime } from 'luxon'
import idConverter from '../helpers/id_converter.js'
import ValidationException from '#exceptions/validation_exception'
import DataNotFoundException from '#exceptions/data_not_found_exception'
import skipData from '../helpers/pagination.js'

export default class TransactionsController {
  async getPurchaseTransactions({ request, response, auth }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const perPage = request.input('perPage', 10)
      const searchTerm = request.input('searchTerm', '');
      const search = `%${searchTerm}%`;

      const purchaseDataList = await db.rawQuery(
        'SELECT purchase_transactions.id, invoice_number, total_price, purchase_transactions.factory_name, DATE_FORMAT(purchase_transactions.created_at, "%Y-%m-%d") AS created_at FROM purchase_transactions JOIN drug_factories on purchase_transactions.drug_factory_id = drug_factories.id WHERE clinic_id = ? AND (invoice_number LIKE ? OR purchase_transactions.factory_name LIKE ?) LIMIT ? OFFSET ?',
        [auth.user!.clinicId, search, search, perPage, skipData(page, perPage)]
      )

      return response.ok({
        message: 'Data fetched!',
        data: purchaseDataList[0],
      })
    } catch (error) {
      return response.badRequest({
        message: 'ERROR',
        error: error,
      })
    }
  }

  async showDetailPurchaseTransaction({ request, response, auth }: HttpContext) {
    try {
      if (auth.user) {
        var params = request.params()

        var id = params.id

        const purchaseDataHeader = await db.rawQuery(
          'SELECT purchase_transactions.factory_name,clinic_name,invoice_number,total_price FROM purchase_transactions JOIN drug_factories ON purchase_transactions.drug_factory_id = drug_factories.id JOIN clinics ON purchase_transactions.clinic_id = clinics.id WHERE purchase_transactions.id = ?',
          [id]
        )

        const purchaseDataDetail = await db.rawQuery(
          'SELECT drug_name, expired, quantity, purchase_price, total_price FROM purchase_shopping_carts WHERE purchase_transaction_id = ?',
          [id]
        )

        return response.ok({
          message: 'Data fetched!',
          dataHeader: purchaseDataHeader[0],
          dataDetail: purchaseDataDetail[0],
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async addPurchaseTransaction({ request, response, auth }: HttpContext) {
    try {
      const data = await request.validateUsing(addPurchaseTransactionValidator)

      const factoryData = await DrugFactory.findOrFail(data.factoryId)

      const invoiceDate = DateTime.now()

      const newPurchaseTransaction = new PurchaseTransaction()
      newPurchaseTransaction.totalPrice = data.totalPrice
      newPurchaseTransaction.factoryName = factoryData.factoryName
      newPurchaseTransaction.factoryEmail = factoryData.factoryEmail
      newPurchaseTransaction.factoryPhone = factoryData.factoryPhone
      newPurchaseTransaction.clinicId = auth.user!.clinicId
      newPurchaseTransaction.drugFactoryId = data.factoryId

      await newPurchaseTransaction.save()

      newPurchaseTransaction.invoiceNumber = `INV/${invoiceDate.year}${invoiceDate.month}${invoiceDate.day}/${idConverter(newPurchaseTransaction.id)}`

      await newPurchaseTransaction.save()

      data.purchaseItems.forEach(async (item) => {
        const drugData = await Drug.findOrFail(item.drugId)
        drugData.totalStock = drugData.totalStock + item.quantity

        const newPurchaseShoppingCart = new PurchaseShoppingCart()
        newPurchaseShoppingCart.expired = DateTime.fromISO(item.expired)
        newPurchaseShoppingCart.quantity = item.quantity
        newPurchaseShoppingCart.totalPrice = item.totalPrice
        newPurchaseShoppingCart.drugName = drugData.drug
        newPurchaseShoppingCart.purchasePrice = drugData.purchasePrice
        newPurchaseShoppingCart.purchaseTransactionId = newPurchaseTransaction.id
        newPurchaseShoppingCart.drugId = item.drugId

        await newPurchaseShoppingCart.save()

        const newDrugStock = new DrugStock()
        newDrugStock.totalStock = item.quantity
        newDrugStock.activeStock = item.quantity
        newDrugStock.expired = DateTime.fromISO(item.expired)
        newDrugStock.drugId = item.drugId
        newDrugStock.purchaseShoppingCartId = newPurchaseShoppingCart.id

        await drugData.save()
        await newDrugStock.save()

        newDrugStock.batchNumber = `BN${invoiceDate.year}${invoiceDate.month}${invoiceDate.day}${idConverter(newDrugStock.id)}`

        await newDrugStock.save()
      })

      return response.created({
        message: 'Pembelian obat berhasil!',
      })
    } catch (error) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      } else if (error.status === 404) {
        throw new DataNotFoundException('Data pabrik atau obat tidak ditemukan!')
      }
    }
  }
}
