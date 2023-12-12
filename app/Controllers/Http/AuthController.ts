import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { Gender } from "App/Enums/Gender";
import { Role } from "App/Enums/Role";
import Clinic from "App/Models/Clinic";
import Profile from "App/Models/Profile";
import User from "App/Models/User";
import RegisterValidator from "App/Validators/RegisterValidator";
import { ValidationException } from "@ioc:Adonis/Core/Validator";
import { InvalidCredentialsException } from "@adonisjs/auth/build/src/Exceptions/InvalidCredentialsException";
import LoginValidator from "App/Validators/LoginValidator";
import CustomValidationException from "App/Exceptions/CustomValidationException";

export default class AuthController extends Error {
  public async register({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(RegisterValidator);

      const newClinic = new Clinic();
      newClinic.clinicName = data.clinicName;
      newClinic.clinicPhone = data.clinicPhone;

      const newUser = new User();
      newUser.email = data.email;
      newUser.password = data.password;
      newUser.roleId = Role.ADMIN;

      const newProfile = new Profile();
      newProfile.fullName = data.fullName;
      newProfile.gender = data.gender as Gender;
      newProfile.phone = data.phone;

      await newClinic.related("employees").save(newUser);
      await newUser.related("profile").save(newProfile);

      return response.created({ message: "Registrasi berhasil!" });
    } catch (error) {
      if (error instanceof ValidationException) {
        return response.badRequest({ error: error });
      } else {
        console.log(error);
      }
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const data = await request.validate(LoginValidator);

      const token = await auth.use("api").attempt(data.email, data.password);

      return response.ok({
        message: "Login berhasil!",
        token: token.token,
        userId: token.user.id,
        clinicId: token.user.clinicId,
      });
    } catch (error) {
      if (error.messages) {
        throw new CustomValidationException(false, error.messages);
      } else if (error instanceof InvalidCredentialsException) {
        return response.unauthorized({ error: "Email atau Password salah!" });
      }
    }
  }
}
