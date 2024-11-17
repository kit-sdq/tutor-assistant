export const randomId = () =>
  Math.random().toString().replace('.', '')

export function isBetweenIncluded(lower: number, value: number, upper: number) {
  return isBetweenExcluded(lower - 1, value, upper + 1)
}

export function isBetweenExcluded(lower: number, value: number, upper: number) {
  return lower < value && value < upper
}
