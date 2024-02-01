import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { Role } from '../enums/role_enum.js'
import Clinic from '#models/clinic'
import Profile from '#models/profile'
import { Gender } from '../enums/gender_enum.js'
import InvalidCredentialException from '#exceptions/invalid_credential_exception'
import ValidationException from '#exceptions/validation_exception'

export default class AuthController {
  async registerAdmin({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)

      const newClinic = new Clinic()
      newClinic.clinicName = data.clinicName
      newClinic.clinicPhone = data.clinicPhone

      const newUser = new User()
      newUser.email = data.email
      newUser.password = data.password
      newUser.roleId = Role['ADMIN']

      const newProfile = new Profile()
      newProfile.fullName = data.fullName
      newProfile.gender = data.gender as Gender
      newProfile.phone = data.phone

      await newClinic.related('users').save(newUser)
      await newUser.related('profile').save(newProfile)

      return response.created({
        message: 'Registrasi berhasil!',
      })
    } catch (error: any) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      }
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(loginValidator)

      const userData = await User.verifyCredentials(data.email, data.password)

      const paymentStatusData = await Clinic.query()
        .select('payment_status')
        .from('clinics')
        .where('id', userData.clinicId)
        .firstOrFail()

      const token = await User.authTokens.create(userData)

      return response.ok({
        message: 'Login berhasil',
        token,
        paymentStatus: paymentStatusData.paymentStatus,
      })
    } catch (error: any) {
      if (error.status === 422) {
        throw new ValidationException(error.messages)
      } else {
        throw new InvalidCredentialException()
      }
    }
  }
}
