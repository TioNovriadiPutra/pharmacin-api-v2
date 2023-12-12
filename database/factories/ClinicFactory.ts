import Clinic from "App/Models/Clinic";
import Factory from "@ioc:Adonis/Lucid/Factory";
import UserFactory from "./UserFactory";

const ClinicFactory = Factory.define(Clinic, ({ faker }) => {
  return {
    clinicName: faker.company.name(),
    clinicPhone: faker.phone.number(),
  };
})
  .relation("employees", () => UserFactory)
  .build();

export default ClinicFactory;
