import { DateTime } from "luxon";
import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public roleName: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @hasMany(() => User)
  public users: HasMany<typeof User>;
}
