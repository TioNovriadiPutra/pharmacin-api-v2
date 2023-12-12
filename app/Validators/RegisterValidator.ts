import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    fullName: schema.string([
      rules.alpha({
        allow: ["space"],
      }),
    ]),
    gender: schema.enum(["male", "female"]),
    phone: schema.string([
      rules.mobile({
        locale: ["id-ID"],
      }),
    ]),
    clinicName: schema.string(),
    clinicPhone: schema.string([
      rules.mobile({
        locale: ["id-ID"],
      }),
    ]),
    email: schema.string([
      rules.email({
        ignoreMaxLength: true,
      }),
      rules.unique({
        table: "users",
        column: "email",
      }),
    ]),
    password: schema.string([rules.minLength(8), rules.confirmed()]),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    "fullName.required": "Nama Lengkap harus diisi!",
    "fullName.alpha": "Nama Lengkap hanya boleh berisi alfabet!",
    "gender.required": "Jenis Kelamin harus diisi!",
    "phone.required": "Nomor Handphone harus diisi!",
    "phone.mobile": "Format Nomor Handphone salah! (harus nomor Indonesia)",
    "clinicName.required": "Nama Klinik harus diisi!",
    "clinicPhone.requred": "Nomor Telepon Klinik harus diisi!",
    "clinicPhone.mobile":
      "Format Nomor Telepon Klinik salah! (harus nomor Indonesia)",
    "email.required": "Email harus diisi!",
    "email.email": "Format email salah!",
    "email.unique": "Email sudah terdaftar!",
    "password.required": "Password harus diisi!",
    "password.minLength": "Password harus lebih dari 8 karakter!",
    "password_confirmation.confirmed": "Konfirmasi Password gagal!",
  };
}
