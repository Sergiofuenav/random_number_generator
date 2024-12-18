const casillero = [
  "Hierro",
  "Rata",
  "Rino",
  "RAM",
  "Rook", // Grajo
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
  "Honor",
  "Nata",
  "Nene",
  "Nemo",
  "Nuca",
  "Nilo",
  "Anis",
  "Nife",
  "Niga",
  "Nube",
  "Mir",
  "Moto",
  "Mina",
  "Momia",
  "Hamaca",
  "Miel",
  "Mesa",
  "Mafia",
  "Mago",
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
  "Leroy", // Mago merlin
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
  "Fik", // Higo
  "Fil", // Hilo 
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
  "Gafa",
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

const WHITE_SPACES = " "
const MULTIPLE_PAIRS_SEPARATOR = `${WHITE_SPACES}·${WHITE_SPACES}`


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
  // Safely handle initial display state for optional UI elements
  const colors = document.getElementById("colors");
  const fallos = document.getElementById("fallos");
  if (colors) colors.style.display = "none";
  if (fallos) fallos.style.display = "none";

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
  const matrixSize = parseInt(matrixSizeInput.value)

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

  let randomIndex = 0;

  let counter = 0; // Tracks iteration count
  let running = false; // Flag to control execution state
  let numbers = []; // Stores generated numbers for later use
  let numPairs = parseInt(numPairsInput.value)
  let format = formatSelect.value; // Fetch the selected format
  let usuario = usuarioSelect.value
  let numRows = parseInt(numRowsInput.value)
  let numCols = parseInt(numColsInput.value)

  function runIteration(showTime, timeout) {
    if (!running || counter >= parseInt(amountInput.value)) {
      running = false;
      for (const n of numbers) {
        if (format !== "binary6") {
          console.log(n)
        } else {
          const groups = n.split(' · ');
          const size = 3
          const result = groups.map(group => [group.slice(0, size), group.slice(size)]);
          const rows = result[0].map((_, colIndex) => result.map(row => row[colIndex]).join(' · '));
          for (let i = 0; i < rows.length; ++i) {
            console.log(rows[i])
          }
        }
      }
          console.log("------");
      return;
    }

    // Prepare dynamic time reduction logic
    if (reducirTiempo.checked && counter > 0 && counter % 3 === 0) {
      showTime = Math.max(50, Math.floor(showTime * 0.8)); // Prevent too short times
      timeout = Math.max(50, Math.floor(timeout * 0.8));
    }

    const fontSize = parseInt(fontSizeInput.value);
    const numberElement = document.createElement("div");
    numberElement.style.fontSize = `${fontSize}px`;
    numberElement.classList.add("number");

    let randomNumber = "";
    let binaryDigits = 0;

    const muestraCasillaALaVez =
      muestraCasillaElement.checked && numPairs === 1;

    const muestraImagenesALaVez =
      muestraImagenesElement.checked && numPairs === 1;

    numbersContainer.appendChild(numberElement);

    // Generate the random numbers (string)
    for (let i = 1; i <= numPairs; ++i) {
      switch (format) {
        case "binary6":
          if (i > 1) {
            randomNumber += MULTIPLE_PAIRS_SEPARATOR
          }

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
          if (i > 1) {
            randomNumber += MULTIPLE_PAIRS_SEPARATOR
          }
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
          if (muestraImagenesALaVez) {
            setTimeout(() => {
              numberElement.textContent = '';
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
            }, parseInt(showTime * 0.3)); // Delay of 100ms
          }
          break;
        default:
          if (i > 1) {
            randomNumber += MULTIPLE_PAIRS_SEPARATOR
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

    // Render the numbers on the screen
    if (format === "matrices") {
      // Display a random number between 1 and 9
      const randomNumberElement = document.createElement("div")
      randomIndex += 1;
      randomIndex %= 10;
      if (randomIndex === 0)
        randomIndex = 1;
      randomNumberElement.textContent = randomIndex
      randomNumberElement.style.fontSize = fontSize
      numberElement.appendChild(randomNumberElement)

      const matrixElement = document.createElement("div")
      const matrix = generateMatrix(matrixElement, matrixSize, numRows, numCols);
      numberElement.appendChild(matrixElement)
      const nextElement = `${randomIndex}\n${matrix}`
      numbers.push(nextElement);
    } else {
      numbers.push(randomNumber);
      // Display binary numbers in rows
      if (format === "binary6" || format === "binary8") {
        const groups = randomNumber.split(MULTIPLE_PAIRS_SEPARATOR);

        // Map each group to split into two 3-bit parts and transpose them
        const result = groups.map(group => [group.slice(0, binaryDigits), group.slice(binaryDigits)]);

        // Format the result as required for output
        const rows = result[0].map((_, colIndex) => result.map(row => row[colIndex]).join(' · '));

        for (let i = 0; i < rows.length; i++) {
          const rowElement = document.createElement("div");
          rowElement.classList.add("word");
          const content = rows[i]
          rowElement.textContent = content;
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
          setTimeout(() => {
            numberElement.textContent = '';

            const imgElement = document.createElement("img");
            let wordIdx = parseInt(randomNumber);

            if (format.includes("bin")) {
              wordIdx = parseInt(randomNumber, 2);
              const arriba = randomNumber.slice(0, 3);
              const abajo = randomNumber.slice(3);
              const ai = bin_to_int_map.get(arriba);
              const abajo_int = bin_to_int_map.get(abajo);
              wordIdx = ai * 10 + abajo_int;
            }

            imgElement.src = casilleros.get(usuario)[wordIdx].src;
            imgElement.alt = randomNumber;

            imgElement.style.display = 'block';
            imgElement.style.width = '350px';
            imgElement.style.height = '350px';

            numberElement.appendChild(imgElement);
          }, parseInt(showTime * 0.5)); // Delay of 100ms
        }

      }
    }


    // Remove the element after showTime
    setTimeout(() => {
      numbersContainer.removeChild(numberElement);
    }, showTime);

    counter++;
    setTimeout(() => runIteration(showTime, timeout), showTime + timeout); // Recursive call
  }
  
  const startExecution = () => {
    if (running) return; // Prevent duplicate executions
    running = true;
    counter = 0;
    numbers = [];
    numbersContainer.innerHTML = "";

    const initialShowTime = parseInt(showTimeInput.value);
    const initialTimeout = parseInt(timeoutInput.value);

    format = formatSelect.value; // Fetch the selected format
    numRows = parseInt(numRowsInput.value);
    numCols = parseInt(numColsInput.value);
    usuario = usuarioSelect.value;
    numPairs = parseInt(numPairsInput.value)

    runIteration(initialShowTime, initialTimeout);
  };

  goButton.addEventListener("click", startExecution);

  stopButton.addEventListener("click", function () {
    stopGame();
  });
  const stopGame=()=>{
    running = false; // Stop execution gracefully
    counter = 0;
    numbers = [];
    numbersContainer.innerHTML = "";
  }

    document.addEventListener("keydown", function (event) {
      switch (event.key.toLowerCase()) {
        case "enter":
          startExecution();
          break;
        case "b":
          formatSelect.value = "binary6";
          break;
        case "f":
          formatSelect.value = "figures";
          fontSizeInput.value = 15;
          break;
        case "m":
          formatSelect.value = "matrices";
          fontSizeInput.value = 90;
          break;
        case "d":
          formatSelect.value = "decimal";
          break;
        case "s":
          stopGame()
          break;
        case "i":
          muestraImagenesElement.checked = !muestraImagenesElement.checked
          break;
        case "c":
          muestraCasillaElement.checked = !muestraCasillaElement.checked
          break;
        case "t":
          reducirTiempo.checked = !reducirTiempo.checked
          break;
      }
    });
});

