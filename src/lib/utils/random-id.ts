export function randomId(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return new Array(6)
    .fill(0)
    .map(() => characters[Math.floor(Math.random() * characters.length)])
    .join("");
}