const skipData = (page: number, perPage: number): number => {
  const skip = (page - 1) * perPage

  return skip
}

export default skipData
