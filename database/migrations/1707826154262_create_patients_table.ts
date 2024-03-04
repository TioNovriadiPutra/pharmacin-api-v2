import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'patients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nik', 20).notNullable()
      table.string('full_name', 50).notNullable()
      table.text('address').notNullable()
      table.string('record_number', 10).notNullable()
      table.enum('gender', ['male', 'female']).notNullable()
      table.string('pob', 45).notNullable()
      table.date('dob').notNullable()
      table.string('phone', 20).notNullable()
      table.string('occupation_name', 45).notNullable()
      table.string('allergy').nullable()
      table.boolean('ready').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
      table
        .integer('clinic_id')
        .unsigned()
        .references('id')
        .inTable('clinics')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('occupation_id')
        .unsigned()
        .references('id')
        .inTable('occupations')
        .onDelete('SET NULL')
        .nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
