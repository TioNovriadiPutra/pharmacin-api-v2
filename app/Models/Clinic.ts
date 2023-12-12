import { DateTime } from "luxon";
import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Clinic extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public clinicName: string;

  @column()
  public clinicPhone?: string;

  @column({
    serialize: (value: number) => {
      return Boolean(value);
    },
  })
  public cashierStatus: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => User)
  public employees: HasMany<typeof User>;
}
