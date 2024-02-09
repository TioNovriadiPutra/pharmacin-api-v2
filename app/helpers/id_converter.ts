const idConverter = (id: number) => {
  const finalId: String = `${id.toString().padStart(4, '0')}`

  return finalId
}

export default idConverter
