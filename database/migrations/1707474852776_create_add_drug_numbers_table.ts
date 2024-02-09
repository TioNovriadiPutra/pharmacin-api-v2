import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'drugs'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('drug_number', 50).nullable().unique()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
