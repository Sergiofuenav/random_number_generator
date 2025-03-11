export function getRandomElementFromSet(set) {
    const items = Array.from(set);
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}