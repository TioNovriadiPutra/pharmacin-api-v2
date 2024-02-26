import Occupation from '#models/occupation'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Occupation.createMany([
      {
        occupationName: 'PNS',
      },
      {
        occupationName: 'Swasta',
      },
      {
        occupationName: 'Freelance',
      },
      {
        occupationName: 'Entrepreneur',
      },
    ])
  }
}
