import vine from '@vinejs/vine'

export const addPatientValidator = vine.compile(
  vine.object({
    fullName: vine.string().alpha({
      allowSpaces: true,
    }),
    nik: vine.string().regex(/^[0-9]+$/),
    address: vine.string(),
    gender: vine.enum(['male', 'female']),
    occupationId: vine.number(),
    pob: vine.string().alpha({
      allowSpaces: true,
    }),
    phone: vine.string().mobile(() => {
      return {
        locale: ['id-ID'],
      }
    }),
    allergy: vine.string().optional(),
    dob: vine.string(),
  })
)

export const patientQueueValidator = vine.compile(
  vine.object({
    doctorId: vine.number(),
  })
)
