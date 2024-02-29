const idConverter = (id: number, length: number = 4) => {
  const finalId: String = `${id.toString().padStart(length, '0')}`

  return finalId
}

export default idConverter
