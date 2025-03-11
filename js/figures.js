export function generateShape() {
    const randomNumber = Math.floor(Math.random() * 8) + 3; // Generate number between 3 and 10
    return randomNumber === 10 ? 0 : randomNumber;
}

export const preloadedFigures = [];
for (let i = 0; i < 100; i++) {
    if (i >= 10 && i < 30) {
        preloadedFigures.push(null);
        continue;
    }
    const img = new Image();
    const imageName = i.toString().padStart(2, "0"); // Format the image name
    img.src = `figuras/${imageName}.png`; // Adjust the path based on your images' actual location
    preloadedFigures.push(img);
}

const preloadedImagesCasilleroSergio = [];
for (let i = 0; i < 100; i++) {
    const img = new Image();
    const imageName = i.toString().padStart(2, "0"); // Format the image name
    img.src = `imagenes_casillero_sergio/${imageName}.webp`; // Adjust the path based on your images' actual location
    preloadedImagesCasilleroSergio.push(img);
}

const preloadedImagesCasilleroEkhi = [null];
// Falta la imagen para el 00
for (let i = 1; i < 100; i++) {
    const img = new Image();
    const imageName = i.toString().padStart(2, "0"); // Format the image name
    img.src = `imagenes_casillero_ekhi/${imageName}.webp`; // Adjust the path based on your images' actual location
    preloadedImagesCasilleroEkhi.push(img);
}

export const casilleros = new Map([
    ["sergio", preloadedImagesCasilleroSergio],
    ["ekhi", preloadedImagesCasilleroEkhi],
])