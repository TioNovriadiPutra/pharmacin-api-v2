const getRandomNumId = (length: number): string => {
  const num = []

  for (let i = 0; i < length; i++) {
    num.push(Math.floor(Math.random() * 10))
  }

  return num.join('')
}

export default getRandomNumId
