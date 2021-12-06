export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number)
}

export const round = (number: number, exponent: number = 4) => {
  return Math.round(number * Math.pow(10, number)) / Math.pow(10, number)
}