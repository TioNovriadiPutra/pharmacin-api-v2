import vine from '@vinejs/vine'

export const addPurchaseTransactionValidator = vine.compile(
    vine.object({
        factory_id: vine.number(),
        // purchase_item: vine.object({
        //     drug_id: vine.number(),
        //     drug_purchase_price: vine.number(),
        //     // subtotal_discount: vine.number(),
        //     expired: vine.number(),
        //     quantity: vine.number()
        // })
        purchase_item: vine.array(
            vine.object({
                drug_id: vine.number(),
                drug_purchase_price: vine.number(),
                expired: vine.date(),
                quantity: vine.number()
            })
        )
    })
)