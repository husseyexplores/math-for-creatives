export function xPercentOf(x, total) {
  return total * (x / 100)
}

export function times(max, fn) {
  for (let i = 0; i < max; i++) fn(i)
}
