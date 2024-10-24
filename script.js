const casillero = [
  "Hierro",
  "Rata",
  "Rino",
  "RAM",
  "Roca",
  "Rulo",
  "Rosa",
  "Rifa",
  "Reja",
  "Rabo",
  "Toro",
  "Dado",
  "Duna",
  "Time",
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
  "Celo",
  "Kos",
  "Cafe",
  "Coche",
  "Copa",
  "Loro",
  "Lote", // De productos - carro compra
  "Lana",
  "Lima",
  "Loco",
  "Lulu",
  "Lazo",
  "Elfo",
  "Lucha",
  "Lobo",
  "Ser", // o no ser - calavera
  "Seta",
  "Seno",
  "Suma",
  "Saco",
  "Sol",
  "Seso",
  "Sofa",
  "Soja",
  "Zipo", // Mechero zippo
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
  "Puma",
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

function generateMatrix(container, matrixSize, rows, columns = 3) {
  container.innerHTML = ''; // Clear previous matrix
  container.classList.add("matrix")
  container.style.gridTemplateRows = `repeat(${rows}, ${matrixSize}px)`; // Dynamic row definition
  container.style.gridTemplateColumns = `repeat(${columns}, ${matrixSize}px)`; // Dynamic row definition
  container.style.gap = 0

  const max_bin = Math.pow(2, columns)
  let matrix = ""

  for (let i = 0; i < rows; i++) {
    const randomBinRow = Math.floor(Math.random() * max_bin).toString(2).padStart(columns, '0');
    matrix += randomBinRow + "\n"
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      // Generate a 3-digit binary number and set color based on its value
      const binaryValue = randomBinRow[j];
      cell.style.backgroundColor = binaryValue === '1' ? 'blue' : 'white';
      cell.style.width = `${matrixSize}px`
      cell.style.height = `${matrixSize}px`

      container.appendChild(cell);
    }
  }
  return matrix
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
  const numRowsInput = document.getElementById("numRows");
  const numColsInput = document.getElementById("numCols");
  const matrixSizeInput = document.getElementById("matrixSize");
  const formatSelect = document.getElementById("format");
  const usuarioSelect = document.getElementById("usuario");
  const numbersContainer = document.querySelector(".bottom");
  const fontSizeInput = document.getElementById("fontSize");
  const practicarFallos = document.getElementById("practicarFallos");
  const reducirTiempo = document.getElementById("reducirTiempo");

  const numRows = 5; // Set R, the number of rows

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
      fallosSet = new Set()
      colors.style.display = "none";
      fallos.style.display = "none";
      if (fallos.previouselementsibling) {
        fallos.previouselementsibling.style.display = "none";
      }
      if (colors.previouselementsibling) {
        colors.previouselementsibling.style.display = "none";
      }
    }
  });

  // Muestra casillero aleatoriamente(controlando el porcentaje)
  const muestraCasillaElement = document.getElementById("casillero");
  const muestraImagenesElement = document.getElementById("imagenes");

  const matrixElement = document.getElementById('matrix'); // Correctly reference the matrix container

  let interval;
  let randomIndex = 0;

  let numbers = [];

  goButton.addEventListener("click", function () {
    randomIndex = 0;
    let timeout = parseInt(timeoutInput.value);
    let showTime = parseInt(showTimeInput.value);
    const amount = parseInt(amountInput.value);
    const format = formatSelect.value; // Fetch the selected format
    const usuario = usuarioSelect.value

    numbersContainer.innerHTML = ""; // Clear previous numbers
    let counter = 0;
    const numPairs = parseInt(numPairsInput.value);
    const numRows = parseInt(numRowsInput.value);
    const numCols = parseInt(numColsInput.value);
    const matrixSize = parseInt(matrixSizeInput.value)

    interval = setInterval(function () {
      if (counter >= amount) {
        clearInterval(interval);
        for (const n of numbers) {
          console.log(n);
        }
        console.log("------");
        numbers = [];
        return;
      }

      if (reducirTiempo.checked) {
        showTime *= Math.pow(0.8, parseInt(counter / 3))
        timeout *= Math.pow(0.8, parseInt(counter / 3))
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

            if (muestraImagenesALaVez) {
              const imgElement = document.createElement("img");
              let wordIdx = parseInt(randomNumber)

              imgElement.src = casilleros.get(usuario)[wordIdx].src;
              imgElement.alt = randomNumber;

              imgElement.style.display = 'block';  // Replace 200px with your desired width
              imgElement.style.width = '350px';  // Replace 200px with your desired width
              imgElement.style.height = '350px';  // Replace 200px with your desired width
              imgElement.style.marginBottom = '15px';  // Replace 200px with your desired width

              // Optionally, you can add object-fit to preserve the aspect ratio
              imgElement.style.objectFit = 'cover';

              numberElement.appendChild(imgElement);
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

      if (format === "matrices") {
        // Display a random number between 1 and 9
        const randomNumberElement = document.createElement("div")
        randomIndex +=  1;
        randomIndex %=  10;
        if(randomIndex === 0)
          randomIndex = 1;
        randomNumberElement.textContent = randomIndex
        randomNumberElement.style.fontSize = fontSize
        numberElement.appendChild(randomNumberElement)

        const matrixElement = document.createElement("div")
        const matrix = generateMatrix(matrixElement, matrixSize, numRows, numCols);
        numberElement.appendChild(matrixElement)
        const nextElement = ` ${randomIndex}\n${matrix}`
        numbers.push(nextElement);
      } else {
        numbers.push(randomNumber);
        // Display binary numbers in rows
        if (format === "binary6" || format === "binary8") {
          const rows = Math.ceil(randomNumber.length / binaryDigits);
          for (let i = 0; i < rows; i++) {
            const rowElement = document.createElement("div");
            // rowElement.classList.add("binary-row");
            rowElement.classList.add("word");
            const start = i * binaryDigits;
            const end = start + binaryDigits;
            rowElement.textContent = randomNumber.slice(start, end);
            numberElement.appendChild(rowElement);
          }
        } else if (format === "decimal") {
          numberElement.textContent = randomNumber;
        }

        if (format !== "figures") {
          // Casillero
          if (muestraCasillaALaVez) {
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

            numberElement.appendChild(imgElement);
          }
        }
      }

      setTimeout(function () {
        numbersContainer.removeChild(numberElement);
      },
        showTime
      );

      counter++;
    },
      showTime + timeout);
  });

  stopButton.addEventListener("click", function () {
    randomIndex = 0;
    clearInterval(interval);
    numbersContainer.innerHTML = "";
  });
});
