import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserInput } from "App/Interfaces/InputType";
import ClinicFactory from "Database/factories/ClinicFactory";

test.group("Auth login", (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction();

    return () => Database.rollbackGlobalTransaction();
  });

  test("should response with status code 400 when email or password not provided", async ({
    client,
  }) => {
    const response = await client.post("/api/auth/login");

    response.assertStatus(400);
  });

  test("should response with error message when email or password not provided", async ({
    client,
  }) => {
    const response = await client.post("/api/auth/login");

    response.assertBody({ error: "Email dan Password harus diisi!" });
  });

  test("should response with status code 401 when credential invalid", async ({
    client,
  }) => {
    const userInput: UserInput = {
      email: "test@gmail.com",
      password: "secretpassword",
    };

    const response = await client.post("/api/auth/login").form(userInput);

    response.assertStatus(401);
  });

  test("should response with error message when credential invalid", async ({
    client,
  }) => {
    const userInput: UserInput = {
      email: "test@gmail.com",
      password: "secretpassword",
    };

    const response = await client.post("/api/auth/login").form(userInput);

    response.assertBody({
      error: "Email atau Password salah!",
    });
  });

  test("should response with status code 200 when login is success", async ({
    client,
  }) => {
    const newClinic = await ClinicFactory.with("employees", 1, (user) => {
      user.with("profile", 1).apply("login");
    }).create();

    const userInput: UserInput = {
      email: newClinic.employees[0].email,
      password: "secretpassword",
    };

    const response = await client.post("/api/auth/login").form(userInput);

    response.assertStatus(200);
  });

  test("should response with success message when login is success", async ({
    client,
  }) => {
    const newClinic = await ClinicFactory.with("employees", 1, (user) => {
      user.with("profile", 1).apply("login");
    }).create();

    const userInput: UserInput = {
      email: newClinic.employees[0].email,
      password: "secretpassword",
    };

    const response = await client.post("/api/auth/login").form(userInput);

    response.assertBodyContains({ message: "Login berhasil!" });
  });

  test("should response token, user id, and clinic id base on the credential", async ({
    client,
    assert,
  }) => {
    const newClinic = await ClinicFactory.with("employees", 1, (user) => {
      user.with("profile", 1).apply("login");
    }).create();

    const userInput: UserInput = {
      email: newClinic.employees[0].email,
      password: "secretpassword",
    };

    const response = await client.post("/api/auth/login").form(userInput);

    assert.exists(response.body().token);
    assert.exists(response.body().userId);
    assert.exists(response.body().clinicId);
  });
});
