import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pasien_transaction_headers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('clinic_id').unsigned().references('id').inTable('clinics').notNullable().onDelete('CASCADE')
      table.integer('pasien_id').unsigned().references('id').inTable('pasiens').notNullable().onDelete('CASCADE')
      // ongoing
      table.integer('dokter_id').unsigned().references('id').inTable('users').notNullable().onDelete('CASCADE')
      table.integer('perawat_id').unsigned().references('id').inTable('users').notNullable().onDelete('CASCADE')
      table.integer('no_rm').notNullable()
      table.string('no_registrasi', 20).notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}