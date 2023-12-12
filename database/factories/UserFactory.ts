import User from "App/Models/User";
import Factory from "@ioc:Adonis/Lucid/Factory";
import Profile from "App/Models/Profile";
import { Gender } from "App/Enums/Gender";
import { Role } from "App/Enums/Role";

const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    roleId: faker.number.int({ min: Role.ADMIN, max: Role.USER }),
  };
})
  .relation("profile", () => ProfileFactory)
  .state("login", (user) => (user.password = "secretpassword"))
  .build();

const ProfileFactory = Factory.define(Profile, ({ faker }) => {
  return {
    fullName: faker.person.fullName(),
    gender: faker.person.sex() as Gender,
    phone: faker.phone.number(),
  };
}).build();

export default UserFactory;
