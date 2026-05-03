export function isNumber(input: string): boolean {
  return input?.match(/^\d+$/) !== null;
}
