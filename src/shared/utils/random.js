export function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}