import vine from '@vinejs/vine'

export const assignDokterValidator = vine.compile(
    vine.object({
        dokterId: vine.number(),
    })
)