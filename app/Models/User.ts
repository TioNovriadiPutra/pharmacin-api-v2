import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  belongsTo,
  BelongsTo,
  hasOne,
  HasOne,
} from "@ioc:Adonis/Lucid/Orm";
import Role from "./Role";
import Clinic from "./Clinic";
import Profile from "./Profile";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column({
    serialize: (value: number) => {
      return Boolean(value);
    },
  })
  public validate: boolean;

  @column()
  public roleId: number;

  @column()
  public clinicId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>;

  @belongsTo(() => Clinic)
  public clinic: BelongsTo<typeof Clinic>;

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>;
}
