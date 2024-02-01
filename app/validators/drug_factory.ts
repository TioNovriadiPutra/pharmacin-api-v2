import vine from '@vinejs/vine'

export const addClinicDrugFactory = vine.compile(
  vine.object({
    factoryName: vine.string(),
    factoryEmail: vine.string().email({
      ignore_max_length: true,
    }),
    factoryPhone: vine.string().mobile({
      locale: ['id-ID'],
    }),
  })
)
