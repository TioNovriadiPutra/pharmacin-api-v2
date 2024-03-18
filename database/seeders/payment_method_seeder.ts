import PaymentMethod from '#models/payment_method'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await PaymentMethod.createMany([
      {
        methodName: 'Tunai'
      },
      {
        methodName: 'Debit'
      }
    ])
  }
}