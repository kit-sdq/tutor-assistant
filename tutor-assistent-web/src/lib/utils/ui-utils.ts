export function isHslColorLightOrDark(h: number, s: number, l: number): boolean {
  let r: number, g: number, b: number
  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return luminance > 0.5
}

export function parseHSL(hsl: string): [number, number, number] | undefined {
  const match = hsl.match(/^hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)$/)
  if (match) {
    const h = parseFloat(match[1]) / 360
    const s = parseFloat(match[2]) / 100
    const l = parseFloat(match[3]) / 100
    return [h, s, l]
  }
}
