/** Shared noise field for the research drawing and navigation deformation. */
export function signalNoise(u: number, row: number, time: number) {
  return .022 * Math.sin(u * 79 + row * 2.41 + time * .43)
    + .016 * Math.sin(u * 157 - row * 1.73 - time * .31)
    + .011 * Math.sin(u * 283 + row * 3.17 + time * .27)
    + .007 * Math.sin(u * 431 - row * 2.19 - time * .39);
}

export function smooth(value: number) {
  return value * value * (3 - 2 * value);
}

export function noiseAmount(time: number) {
  const phase = time % 18;
  if (phase < 2) return 1;
  if (phase < 7) return 1 - smooth((phase - 2) / 5);
  if (phase < 10) return 0;
  if (phase < 15) return smooth((phase - 10) / 5);
  return 1;
}
