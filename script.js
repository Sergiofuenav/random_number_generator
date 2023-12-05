const casillero = [
  "Hierro",
  "Rata",
  "Rino",
  "Remo",
  "Roca",
  "Rulo",
  "Rosa",
  "Rifa",
  "Reja",
  "Rabo",
  "Toro",
  "Dado",
  "Duna",
  "Timo",
  "Taco",
  "Tela",
  "Tos",
  "Tufo",
  "Ducha",
  "Tubo",
  "Noria",
  "Nata",
  "Nene",
  "Nemo",
  "Nuca",
  "Nilo",
  "Anis",
  "Nife",
  "Nicho",
  "Nube",
  "Mir",
  "Moto",
  "Mina",
  "Momia",
  "Hamaca",
  "Miel",
  "Mesa",
  "Mafia",
  "Mecha",
  "Mapa",
  "Cura",
  "Cohete",
  "Cono",
  "Cama",
  "Caca",
  "Kilo",
  "Kos",
  "Cafe",
  "Coche",
  "Copa",
  "Loro",
  "Lata",
  "Lana",
  "Lima",
  "Loco",
  "Lulu",
  "Lazo",
  "Elfo",
  "Leche",
  "Lobo",
  "Sor",
  "Seta",
  "Seno",
  "Suma",
  "Saco",
  "Sol",
  "Seso",
  "Sofa",
  "Soja",
  "Sebo",
  "Faro",
  "Foto",
  "Faena",
  "Fama",
  "Foca",
  "Filo",
  "Foso",
  "Fofo",
  "Ficha",
  "Fobia",
  "Hachero",
  "Chita",
  "Chan",
  "Gema",
  "Choco",
  "Chal",
  "Chess",
  "Chufa",
  "Gogó",
  "Chivo",
  "Bar",
  "Puta",
  "Poni",
  "Pum",
  "Buque",
  "Bola",
  "Vaso",
  "Bofia",
  "Bache",
  "Papa",
];

function getRandomElementFromSet(set) {
  const items = Array.from(set);
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

const bin_to_int_map = new Map([
  ["000", 0],
  ["001", 1],
  ["011", 2],
  ["111", 3],
  ["100", 4],
  ["101", 5],
  ["110", 6],
  ["010", 9],
])

const preloadedFigures = [];
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

const casilleros = new Map([
  ["sergio", preloadedImagesCasilleroSergio],
  ["ekhi", preloadedImagesCasilleroEkhi],
])

function generateShape() {
  const randomNumber = Math.floor(Math.random() * 8) + 3; // Generate number between 3 and 10
  return randomNumber === 10 ? 0 : randomNumber;
}

const color_to_int_map = new Map([
  ["negro", 0],
  ["marron", 1],
  ["rojo", 2],
  ["naranja", 3],
  ["amarillo", 4],
  ["verde", 5],
  ["azul", 6],
  ["violeta", 7],
  ["gris", 8],
  ["blanco", 9],
])

document.addEventListener("DOMContentLoaded", function () {
  // Inicialmente no mostrar fallos
  colors.style.display = "none";
  fallos.style.display = "none";
  fallos.previousElementSibling.style.display = "none";
  colors.previousElementSibling.style.display = "none";

  const goButton = document.getElementById("goButton");
  const stopButton = document.getElementById("stopButton");
  const timeoutInput = document.getElementById("timeout");
  const showTimeInput = document.getElementById("showTime");
  const amountInput = document.getElementById("amount");
  const numPairsInput = document.getElementById("numPairs");
  const formatSelect = document.getElementById("format");
  const usuarioSelect = document.getElementById("usuario");
  const numbersContainer = document.querySelector(".bottom");
  const fontSizeInput = document.getElementById("fontSize");
  const practicarFallos = document.getElementById("practicarFallos");

  const fallosInput = document.getElementById("fallos");

  let coloresSet = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  let fallosSet = new Set();

  const colorCheckboxes = document.querySelectorAll("[id^='color_']");
  colorCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      const color = checkbox.value.toLowerCase();
      const int_from_color = color_to_int_map.get(color)
      if (checkbox.checked) {
        coloresSet.add(int_from_color);
      } else {
        coloresSet.delete(int_from_color);
      }
      console.log("Colores set", coloresSet)
    });
  });

  fallosInput.addEventListener("input", function () {
    const fallosString = fallosInput.value.trim().replace(/,$/, '');
    let array = []
    if (formatSelect.value.includes("bin")) {
      array = fallosString.split(",")
    } else {
      array = fallosString.split(",").map(Number);
    }
    fallosSet = array.length === 0 ? new Set() : new Set(array);
  });

  practicarFallos.addEventListener("change", function () {
    if (practicarFallos.checked) {
      colors.style.display = "inline";
      fallos.style.display = "inline";
      fallos.previousElementSibling.style.display = "inline";
      colors.previousElementSibling.style.display = "inline";
    } else {
      colors.style.display = "none";
      fallos.style.display = "none";
      fallos.previouselementsibling.style.display = "none";
      colors.previouselementsibling.style.display = "none";
    }
  });

  // Muestra casillero aleatoriamente(controlando el porcentaje)
  const muestraCasillaElement = document.getElementById("casillero");
  const muestraImagenesElement = document.getElementById("imagenes");

  let interval;

  let numbers = [];

  goButton.addEventListener("click", function () {
    const timeout = parseInt(timeoutInput.value);
    const showTime = parseInt(showTimeInput.value);
    const amount = parseInt(amountInput.value);
    const format = formatSelect.value; // Fetch the selected format
    const usuario = usuarioSelect.value

    numbersContainer.innerHTML = ""; // Clear previous numbers
    let counter = 0;
    const numPairs = parseInt(numPairsInput.value);

    interval = setInterval(function () {
      if (counter >= amount) {
        clearInterval(interval);
        console.log(numbers);
        numbers = [];
        return;
      }

      let randomNumber = "";
      let binaryDigits = 0;

      const fontSize = parseInt(fontSizeInput.value);
      const muestraCasillaALaVez =
        muestraCasillaElement.checked && numPairs === 1;

      const muestraImagenesALaVez =
        muestraImagenesElement.checked && numPairs === 1;

      const numberElement = document.createElement("div");
      numberElement.style.fontSize = `${fontSize}px`; // Apply font size
      numberElement.classList.add("number");

      numbersContainer.appendChild(numberElement);

      for (let i = 1; i <= numPairs; ++i) {
        switch (format) {
          case "binary6":
            randomNumber = "";

            let unidadBin6 = Math.floor(Math.random() * 8).toString(2).padStart(3, "0")
            let decenaBin6 = Math.floor(Math.random() * 8).toString(2).padStart(3, "0")

            if (practicarFallos && fallosSet.size > 0) {
              while (!fallosSet.has(unidadBin6) && !fallosSet.has(decenaBin6)) {
                unidadBin6 = Math.floor(Math.random() * 8).toString(2).padStart(3, "0")
                decenaBin6 = Math.floor(Math.random() * 8).toString(2).padStart(3, "0")
              }
            }
            randomNumber += decenaBin6 + unidadBin6
            binaryDigits = 3; // 2 rows of 3 binary digits each
            break;
          case "binary8":
            randomNumber = ""
            let unidadBin8 = Math.floor(Math.random() * 16).toString(2).padStart(4, "0")
            let decenaBin8 = Math.floor(Math.random() * 16).toString(2).padStart(4, "0")

            if (practicarFallos && fallosSet.size > 0) {
              while (!fallosSet.has(unidadBin8) && !fallosSet.has(decenaBin8)) {
                unidadBin8 = Math.floor(Math.random() * 16).toString(2).padStart(4, "0")
                decenaBin8 = Math.floor(Math.random() * 16).toString(2).padStart(4, "0")
              }
            }
            randomNumber += decenaBin8 + unidadBin8
            binaryDigits = 4; // 2 rows of 4 binary digits each
            break;
          case "figures":
            let form = generateShape();
            let color = Math.floor(Math.random() * 9);

            if (practicarFallos) {
              form = fallosSet.size > 0 ? getRandomElementFromSet(fallosSet) : generateShape()
              color = getRandomElementFromSet(coloresSet)
            }

            randomNumber += `${form}${color}`;

            if (muestraCasillaALaVez) {
              const wordElement = document.createElement("div");
              let wordIdx = randomNumber % casillero.length;
              wordElement.textContent = casillero[wordIdx];
              wordElement.classList.add("word");
              numberElement.appendChild(wordElement);
            }
            const imgElement = document.createElement("img");
            imgElement.src = preloadedFigures[parseInt(randomNumber)].src;
            imgElement.alt = randomNumber;
            numberElement.appendChild(imgElement);
            break;
          default:
            if (i > 1) {
              randomNumber += " · ";
            }
            let unidadDecimal = Math.floor(Math.random() * 10)
            let decenaDecimal = Math.floor(Math.random() * 10)
            if (practicarFallos && fallosSet.size > 0) {
              while (!fallosSet.has(unidadDecimal) && !fallosSet.has(decenaDecimal)) {
                unidadDecimal = Math.floor(Math.random() * 10)
                decenaDecimal = Math.floor(Math.random() * 10)
              }
            }
            const numero = new Number(decenaDecimal * 10 + unidadDecimal)
            randomNumber += (numero)
              .toString()
              .padStart(2, "0");
        }
      }
      numbers.push(randomNumber);

      // Display binary numbers in rows
      if (format === "binary6" || format === "binary8") {
        const rows = Math.ceil(randomNumber.length / binaryDigits);
        for (let i = 0; i < rows; i++) {
          const rowElement = document.createElement("div");
          rowElement.classList.add("binary-row");
          const start = i * binaryDigits;
          const end = start + binaryDigits;
          rowElement.textContent = randomNumber.slice(start, end);
          numberElement.appendChild(rowElement);
        }
      } else if (format === "decimal") {
        numberElement.textContent = randomNumber;
      }

      // Casillero
      if (muestraCasillaALaVez && format !== "figures") {
        const wordElement = document.createElement("div");

        let wordIdx = randomNumber % casillero.length;
        if (format.includes("bin")) {
          wordIdx = parseInt(randomNumber, 2);
          const arriba = randomNumber.slice(0, 3)
          const abajo = randomNumber.slice(3)
          const ai = bin_to_int_map.get(arriba)
          const abajo_int = bin_to_int_map.get(abajo)
          wordIdx = ai * 10 + abajo_int
        }
        wordElement.textContent = casillero[wordIdx];
        console.log(wordElement.textContent)
        wordElement.classList.add("word");
        wordElement.style.fontSize = "40px"; // Apply font size

        numberElement.appendChild(wordElement);
      }

      // Imágenes
        if (muestraImagenesALaVez) {
          const imgElement = document.createElement("img");
          let wordIdx = parseInt(randomNumber)

          if (format.includes("bin")) {
            wordIdx = parseInt(randomNumber, 2);
            const arriba = randomNumber.slice(0, 3)
            const abajo = randomNumber.slice(3)
            const ai = bin_to_int_map.get(arriba)
            const abajo_int = bin_to_int_map.get(abajo)
            wordIdx = ai * 10 + abajo_int
          }

          imgElement.src = casilleros.get(usuario)[wordIdx].src;
          imgElement.alt = randomNumber;

          imgElement.style.display = 'block';  // Replace 200px with your desired width
          imgElement.style.width = '350px';  // Replace 200px with your desired width
          imgElement.style.height = '350px';  // Replace 200px with your desired width

          // Optionally, you can add object-fit to preserve the aspect ratio
          imgElement.style.objectFit = 'cover';

          numberElement.appendChild(imgElement);
      }

      setTimeout(function () {
        numbersContainer.removeChild(numberElement);
      }, showTime);

      counter++;
    }, timeout + showTime);
  });

  stopButton.addEventListener("click", function () {
    clearInterval(interval);
    numbersContainer.innerHTML = "";
  });
});
