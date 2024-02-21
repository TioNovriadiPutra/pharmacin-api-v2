import vine from '@vinejs/vine'

export const addPasienValidator = vine.compile(
    vine.object({
        namaPasien: vine.string().alpha({
            allowSpaces: true,
            allowDashes: false,
            allowUnderscores: false,
        }),
        nikPasien: vine.number(),
        alamatPasien: vine.string(),
        gender: vine.enum(['male', 'female']),
        jenisPekerjaan: vine.string(),
        tempatLahir: vine.string(),
        tanggalLahir: vine.date({
            formats: ['DD/MM/YYYY']
        }),
        noHp: vine.string().mobile(() => {
            return {
                locale: ['id-ID']
            }
        }),
        alergiObat: vine.string().optional()
    })
)

export const startPeriksa = vine.compile(
    vine.object({
        statusPeriksa: vine.enum(['pending', 'ongoing', 'done'])
    })
)