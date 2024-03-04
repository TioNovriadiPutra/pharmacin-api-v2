import vine from '@vinejs/vine'

export const addPurchaseTransactionValidator = vine.compile(
  vine.object({
    factoryId: vine.number(),
    totalPrice: vine.number().min(1),
    purchaseItems: vine
      .array(
        vine.object({
          drugId: vine.number(),
          totalPrice: vine.number().min(1),
          expired: vine.string(),
          quantity: vine.number().min(1),
        })
      )
      .minLength(1),
  })
)
