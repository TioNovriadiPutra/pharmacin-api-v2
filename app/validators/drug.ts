import vine from '@vinejs/vine'

export const addDrugCategoryValidator = vine.compile(
  vine.object({
    categoryName: vine.string(),
  })
)

export const addDrugValidator = vine.compile(
  vine.object({
    drug: vine.string(),
    drugGenericName: vine.string().optional(),
    dose: vine.string(),
    categoryId: vine.number(),
    shelve: vine.number().optional(),
    factoryId: vine.number(),
    purchasePrice: vine.number(),
    sellingPrice: vine.number(),
  })
)
