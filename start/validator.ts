import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Registration error
  'fullName.required': 'Nama lengkap harus diisi!',
  'fullName.alpha': 'Nama lengkap harus terdiri dari alfabet saja!',
  'gender.required': 'Jenis kelamin harus diisi!',
  'gender.enum': 'Jenis kelamain harus antara "Laki-laki" atau "Perempuan" saja!',
  'phone.required': 'Nomor handphone harus diisi!',
  'phone.mobile': 'Format nomor handphone salah!',
  'clinicName.required': 'Nama klinik harus diisi!',
  'clinicPhone.required': 'Nomor telepon klinik harus diisi!',
  'clinicPhone.mobile': 'Format nomor telepon klinik salah!',
  'email.required': 'Email harus diisi!',
  'email.email': 'Format email salah!',
  'email.unique': 'Email sudah terdaftar!',
  'password.required': 'Password harus diisi!',
  'password.minLength': 'Password minimal 8 karakter!',
  'password.confirmed': 'Konfirmasi password gagal!',
  'factoryName.required': 'Nama pabrik harus diisi!',
  'factoryEmail.required': 'Email pabrik harus diisi!',
  'factoryEmail.email': 'Format email pabrik salah!',
  'factoryPhone.required': 'Nomor telepon pabrik harus diisi!',
  'factoryPhone.mobile': 'Format nomor telepon pabrik salah!',
})
