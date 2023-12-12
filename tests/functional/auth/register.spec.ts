import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { Gender } from "App/Enums/Gender";
import { Role } from "App/Enums/Role";
import { UserInput } from "App/Interfaces/InputType";
import User from "App/Models/User";

test.group("Auth register", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    return () => Database.rollbackGlobalTransaction();
  });

  test("should response with status code 400 when user not provide all the data", async ({
    client,
  }) => {
    const response = await client.post("/api/auth/register");

    response.assertStatus(400);
  });

  test("should response with error messages for every error of each input when the input not provided", async ({
    client,
  }) => {
    const response = await client.post("/api/auth/register");

    response.assertBodyContains({
      error: {
        flashToSession: false,
        messages: {
          errors: [
            {
              rule: "required",
              field: "fullName",
              message: "Nama Lengkap harus diisi!",
            },
            {
              rule: "required",
              field: "gender",
              message: "Jenis Kelamin harus diisi!",
            },
            {
              rule: "required",
              field: "phone",
              message: "Nomor Handphone harus diisi!",
            },
            {
              rule: "required",
              field: "clinicName",
              message: "Nama Klinik harus diisi!",
            },
            {
              rule: "required",
              field: "clinicPhone",
              message: "required validation failed",
            },
            {
              rule: "required",
              field: "email",
              message: "Email harus diisi!",
            },
            {
              rule: "required",
              field: "password",
              message: "Password harus diisi!",
            },
          ],
        },
      },
    });
  });

  test("should response with status code 201 when registration success", async ({
    client,
  }) => {
    const userInput: UserInput = {
      fullName: "Test Full Name",
      gender: "male" as Gender,
      phone: "081234567890",
      clinicName: "Test Clinic Name",
      clinicPhone: "081234567890",
      email: "test@gmail.com",
      password: "secretpassword",
      password_confirmation: "secretpassword",
    };

    const response = await client.post("/api/auth/register").form(userInput);

    response.assertStatus(201);
  });

  test("should response with succes message when registration is success", async ({
    client,
  }) => {
    const userInput: UserInput = {
      fullName: "Test Full Name",
      gender: "male" as Gender,
      phone: "081234567890",
      clinicName: "Test Clinic Name",
      clinicPhone: "081234567890",
      email: "test@gmail.com",
      password: "secretpassword",
      password_confirmation: "secretpassword",
    };

    const response = await client.post("/api/auth/register").form(userInput);

    response.assertBody({ message: "Registrasi berhasil!" });
  });

  test("should create an admin account", async ({ client, assert }) => {
    const userInput: UserInput = {
      fullName: "Test Full Name",
      gender: "male" as Gender,
      phone: "081234567890",
      clinicName: "Test Clinic Name",
      clinicPhone: "081234567890",
      email: "test@gmail.com",
      password: "secretpassword",
      password_confirmation: "secretpassword",
    };

    await client.post("/api/auth/register").form(userInput);

    const userData = await User.findByOrFail("email", userInput.email);

    assert.equal(userData.roleId, Role.ADMIN);
  });
});
