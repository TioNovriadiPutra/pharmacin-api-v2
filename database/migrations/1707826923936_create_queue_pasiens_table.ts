import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'queue_pasiens'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('queue_number').notNullable()
      table.integer('transaction_id').unsigned().references('id').inTable('pasien_transaction_headers').notNullable().onDelete('cascade')
      table.integer('dokter_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
      table.integer('perawat_id').unsigned().references('id').inTable('users').notNullable().onDelete('cascade')
      table.boolean('status_panggil_perawat')
      // butuh pertanyaan utk diatas
      table.enum('status_periksa', ['pending', 'ongoing', 'done'])
      table.enum('status_bayar_obat', ['pending', 'ongoing', 'done'])
      table.boolean('status_ambil_obat')
      table.dateTime('time_queue_start').nullable()
      table.dateTime('time_queue_end').nullable()
      table.dateTime('time_panggil_perawat').nullable()
      table.dateTime('time_periksa').nullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}