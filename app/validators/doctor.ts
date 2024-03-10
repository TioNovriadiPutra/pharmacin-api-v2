import vine from '@vinejs/vine'

export const updateDoctorValidator = vine.compile(
  vine.object({
    fullName: vine.string().alpha({
      allowSpaces: true,
    }),
    gender: vine.enum(['male', 'female']),
    phone: vine.string().mobile((_) => {
      return {
        locale: ['id-ID'],
        strictMode: false,
      }
    }),
    specialityId: vine.number(),
    address: vine.string().optional(),
  })
)
