function numberRangeLimiter(number: number, min: number, max: number): number {
  number = number > max ? max : number;
  number = number < min ? min : number;

  return number;
}

export default numberRangeLimiter;
