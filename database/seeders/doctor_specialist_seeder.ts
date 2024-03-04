import DoctorSpecialist from '#models/doctor_specialist'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await DoctorSpecialist.createMany([
      {
        specialityName: 'Obgin',
        specialityTitle: 'Sp.OG',
      },
    ])
  }
}
