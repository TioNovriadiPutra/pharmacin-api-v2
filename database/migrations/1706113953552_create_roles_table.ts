import { BaseSchema } from '@adonisjs/lucid/schema'
import { Role } from '../../app/enums/role_enum.js'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('role_name', 15).notNullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())

      this.defer(async (db) => {
        await db.table(this.tableName).multiInsert([
          {
            id: Role.ADMIN,
            role_name: 'Admin',
          },
          {
            id: Role.DOCTOR,
            role_name: 'Dokter',
          },
          {
            id: Role.NURSE,
            role_name: 'Perawat',
          },
          {
            id: Role.DOCTOR_ASSISTANT,
            role_name: 'Asisten Dokter',
          },
          {
            id: Role.ADMINISTRATOR,
            role_name: 'Administrator',
          },
        ])
      })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
