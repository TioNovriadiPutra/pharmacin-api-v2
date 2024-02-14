import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pasiens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('nama_pasien', 255).notNullable()
      table.integer('clinic_id').unsigned().references('id').inTable('clinics').notNullable().onDelete('cascade')
      table.integer('nik_pasien').notNullable()
      table.string('no_rm', 50).notNullable()
      table.enum('gender', ['male', 'female']).notNullable()
      table.string('occupation', 100).notNullable()
      table.date('tanggal_lahir_pasien').notNullable()
      table.string('tempat_lahir_pasien', 50).notNullable()
      table.text('alamat_pasien').notNullable()
      table.string('no_hp', 20).notNullable()
      table.string('alergi_obat').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}