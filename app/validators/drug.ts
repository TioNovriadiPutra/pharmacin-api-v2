import vine from '@vinejs/vine'

export const addDrugCategoryValidator = vine.compile(
  vine.object({
    categoryName: vine.string(),
  })
)
