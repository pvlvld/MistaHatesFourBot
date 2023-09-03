function breakNewLineToSpaces(str: string) {
  return str.replace(/(\r\n|\r|\n)/g, ' ');
}

export default breakNewLineToSpaces;
