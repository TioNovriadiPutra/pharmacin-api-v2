import vine from '@vinejs/vine'
import { uniqueRule } from '../rules/unique.js'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().alpha({
      allowSpaces: true,
      allowDashes: false,
      allowUnderscores: false,
    }),
    gender: vine.enum(['male', 'female']),
    phone: vine.string().mobile(() => {
      return {
        locale: ['id-ID'],
      }
    }),
    clinicName: vine.string(),
    clinicPhone: vine.string().mobile(() => {
      return {
        locale: ['id-ID'],
      }
    }),
    email: vine
      .string()
      .email({
        ignore_max_length: true,
      })
      .use(uniqueRule({ table: 'users', column: 'email' })),
    password: vine.string().minLength(8).confirmed(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string(),
    password: vine.string(),
  })
)
