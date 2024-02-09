import vine from '@vinejs/vine'

export const addPurchaseTransactionValidator = vine.compile(
  vine.object({
    factoryId: vine.number(),
    totalPrice: vine.number(),
    purchaseItems: vine
      .array(
        vine.object({
          drugId: vine.number(),
          totalPrice: vine.number(),
          expired: vine.string(),
          quantity: vine.number(),
        })
      )
      .minLength(1),
  })
)
