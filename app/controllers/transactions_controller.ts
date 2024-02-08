import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { addPurchaseTransactionValidator } from '#validators/transaction'
import PurchaseTransaction from '#models/purchase_transaction'
import PurchaseShoppingCart from '#models/purchase_shopping_cart'
import moment from 'moment'
import DrugStock from '#models/drug_stock'

export default class TransactionsController {
    async showPurchaseTransaction({
        request, response, auth
    }: HttpContext){
        try {
            if(auth.user) {
                var qs = request.qs()

                var clinicId = auth.user.clinicId
                var page = qs.page ? page : 1;
                var count = qs.count ? count : 10;
                
                var offset = (page - 1) * count
                var limit = count

                const purchaseDataList = await db.rawQuery('SELECT purchase_transactions.id, invoice_number, total_price, purchase_transactions.factory_name, purchase_transactions.factory_email, purchase_transactions.factory_phone FROM purchase_transactions JOIN drug_factories on purchase_transactions.drug_factory_id = drug_factories.id WHERE clinic_id = ? LIMIT ? OFFSET ?',
                [clinicId, limit, offset]
                )
                return response.ok({
                    message: "Data fetched!",
                    data: purchaseDataList[0]
                })
            }
        } catch (error){
            return response.badRequest({
                message: "ERROR",
                error: error
            })
        }
    }

    async showDetailPurchaseTransaction({
        request, response, auth
    }: HttpContext) {
        try {
            if(auth.user) {
                var params = request.params()

                var id = params.id;

                const purchaseDataHeader = await db.rawQuery('SELECT purchase_transactions.factory_name,clinic_name,invoice_number,total_price FROM purchase_transactions JOIN drug_factories ON purchase_transactions.drug_factory_id = drug_factories.id JOIN clinics ON purchase_transactions.clinic_id = clinics.id WHERE purchase_transactions.id = ?', [id])

                const purchaseDataDetail = await db.rawQuery('SELECT drug_name, expired, quantity, purchase_price, total_price FROM purchase_shopping_carts WHERE purchase_transaction_id = ?', [id])

                return response.ok({
                    message: "Data fetched!",
                    dataHeader: purchaseDataHeader[0],
                    dataDetail: purchaseDataDetail[0]
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    async addPurchaseTransaction({
        request, response, auth,
    }: HttpContext) {
        try {
            if(auth.user) {
                const data = await request.validateUsing(addPurchaseTransactionValidator)

                const drugDetail = await db.rawQuery(
                    'SELECT drugs.id as drug_id, drug, drug_generic_name, drug_categories.id as category_id, category_name, drug_factory_id FROM drugs JOIN drug_categories ON drugs.drug_category_id = drug_categories.id WHERE drugs.clinic_id = ?',
                    [auth.user.clinicId]
                )
                var totalPrice = 0
                console.log("data", drugDetail[0])
                console.log("total price", totalPrice)
                
                var drugsList = {}
                
                for(var i in drugDetail[0]){
                    drugsList[drugDetail[0][i].drug_id] = drugDetail[0][i]
                }

                for(var i in data.purchase_item){
                    var item = data.purchase_item[i];
                    totalPrice+=(item.quantity*item.drug_purchase_price)
                    console.log(item.quantity*item.drug_purchase_price, item.quantity, item.drug_purchase_price)
                }
                
                var date = new Date();
                var month = date.getMonth()
                var year = date.getFullYear()
                
                // Ambil data factory utk insert ke transaction 
                // const data_factory = await db.rawQuery(
                //     'SELECT * FROM drug_factories WHERE id = ', [data.factory_id])
                
                const newPurchaseTransaction = new PurchaseTransaction();
                newPurchaseTransaction.drugFactoryId = data.factory_id
                // newPurchaseTransaction.factoryEmail = data_factory[0].factory_email
                // newPurchaseTransaction.factoryName = data_factory[0].factory_name
                // newPurchaseTransaction.factoryPhone = data_factory[0].factory_phone
                newPurchaseTransaction.clinicId = auth.user.clinicId
                newPurchaseTransaction.totalPrice = totalPrice
                await newPurchaseTransaction.save();
                console.log(newPurchaseTransaction.id)
                newPurchaseTransaction.invoiceNumber = "INV/"+year+"/"+month+"/"+newPurchaseTransaction.id
                await newPurchaseTransaction.save();

                console.log("DRUGS LIST", drugsList)

                for(var i in data.purchase_item){
                    var item = data.purchase_item[i]
                    console.log("item", item)
                    var newPurchaseShoppingCart  = new PurchaseShoppingCart();
                    newPurchaseShoppingCart.drugId = item.drug_id
                    // newPurchaseShoppingCart.DrugCategoryId = drugsList[item.drug_id].category_id
                    newPurchaseShoppingCart.purchaseTransactionId = newPurchaseTransaction.id
                    newPurchaseShoppingCart.expired = moment(item.expired).format('YYYY-MM-DD')
                    newPurchaseShoppingCart.quantity = item.quantity
                    newPurchaseShoppingCart.drugName = drugsList[item.drug_id].drug
                    newPurchaseShoppingCart.purchasePrice = item.drug_purchase_price
                    newPurchaseShoppingCart.totalPrice = totalPrice
                    newPurchaseShoppingCart.save()
                    console.log("data purchase", newPurchaseShoppingCart)
                }

                // Ongoing insert to stock
                // for(var i in data.purchase_item) {
                //     var stock_item = data.purchase_item[i]
                //     var newStock = new DrugStock()
                // }

                return response.created({
                    message: "Purchase Transaction added successfully"
                });
            }
        } catch (error){
            console.log(error);
            return response.unprocessableEntity(error.messages.errors);
        }
    }
}