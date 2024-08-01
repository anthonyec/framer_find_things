export interface ColorRGBA {
	r: number,
	g: number,
	b: number,
	a: number
}

export interface ColorHSLA {
  h: number,
  s: number,
  l: number,
  a: number,
}

export function createColorRGBA(r: number, g: number, b: number, a: number): ColorRGBA {
  return { r, g, b, a }
}

export function createColorHSLA(h: number, s: number, l: number, a: number): ColorHSLA {
  return { h, s, l, a }
}

// TODO(anthony): Written by ChatGPT. Write your own one to understand it.
export function convertRGBAtoHSLA(rgba: ColorRGBA): ColorHSLA {
  const { r, g, b, a } = rgba;

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / delta + 2) * 60;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h),
    s: parseFloat((s * 100).toFixed(1)),
    l: parseFloat((l * 100).toFixed(1)),
    a
  }
}

export function serializeColorRGBA(color: ColorRGBA): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
}

export function parseColorRGBA(rgba: string): ColorRGBA {
  const values = rgba.replace("rgba", "").replace("rgb", "").replace("(", "").replace(")", "").replace(" ", "")
  const components = values.split(",")

  const color: ColorRGBA = {
    r: parseInt(components[0]),
    g: parseInt(components[1]),
    b: parseInt(components[2]),
    a: 1
  }

  if (components.length === 4) {
    color.a = parseInt(components[3])
  }

  return color
}

export function getDistanceBetweenColorRGBA(a: ColorRGBA, b: ColorRGBA)  {
  const difference: ColorRGBA = {
    r: a.r - b.r,
    g: a.g - b.g,
    b: a.b - b.b,
    a: a.a - b.a,
  }

  return Math.sqrt(
    difference.r * difference.r +
    difference.g * difference.g +
    difference.b * difference.b +
    difference.a * difference.a
  )
}

export function getDistanceBetweenColorHSLA(a: ColorHSLA, b: ColorHSLA)  {
  const difference: ColorHSLA = {
    h: Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h)) / 360,
    s: (a.s - b.s) / 100,
    l: (a.l - b.l) / 100,
    a: a.a - b.a
  }

  return Math.sqrt(
    difference.h * difference.h +
    difference.s * difference.s +
    difference.l * difference.l +
    difference.a * difference.a
  )
}
