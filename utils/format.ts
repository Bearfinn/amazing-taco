export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number)
}

export const getExtractorImageUrl = (label: string) => {
  const key = label.split(' ')[0].toLowerCase()
  return `https://ipfs.io/ipfs/QmXiYe93DykwMbrfduuZyMa96YH7sZr3UrFfpH4WDkXtqF/${key}/${key}.png`
}

export const round = (number: number, exponent: number = 4) => {
  return Math.round(number * Math.pow(10, number)) / Math.pow(10, number)
}