import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "profiles";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("full_name", 40).notNullable();
      table.enum("gender", ["male", "female"]).notNullable();
      table.string("phone", 50).notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .onDelete("CASCADE")
        .notNullable();
      table
        .timestamp("created_at", { useTz: true })
        .notNullable()
        .defaultTo(this.now());
      table
        .timestamp("updated_at", { useTz: true })
        .notNullable()
        .defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
