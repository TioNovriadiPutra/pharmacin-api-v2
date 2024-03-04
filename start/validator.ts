import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
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
  'categoryName.required': 'Kategori obat harus diisi!',
  'drug.required': 'Nama obat harus diisi!',
  'dose.required': 'Takaran harus diisi!',
  'categoryId.required': 'Kategori harus dipilih!',
  'shelve.number': 'Rak harus berisi angka!',
  'factoryId.required': 'Pabrik harus dipilih!',
  'purchasePrice.required': 'Harga beli harus diisi!',
  'purchasePrice.number': 'Harga beli harus berisi angka!',
  'sellingPrice.required': 'Harga jual harus diisi!',
  'sellingPrice.number': 'Harga jual harus berisi angka!',
  'totalPrice.required': 'Harga total harus diisi!',
  'totalPrice.number': 'Harga total harus berisi angka!',
  'drugId.required': 'Obat harus dipilih!',
  'expired.required': 'Kadaluarsa harus dipilih!',
  'quantity.required': 'Qty harus diisi!',
  'quantity.number': 'Qty harus berisi angka!',
  'purchaseItems.required': 'Keranjang pembelian harus diisi!',
  'purchaseItems.array.minLength': 'Keranjang pembelian harus minimal 1!',
  'specialityId.required': 'Spesialisasi harus diisi!',
  'address.required': 'Alamat harus diisi!',
  'doctorId.required': 'Dokter harus dipilih!',
})
