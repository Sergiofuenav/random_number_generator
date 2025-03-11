import { casillero, bin_to_int_map, MULTIPLE_PAIRS_SEPARATOR, color_to_int_map } from "./constants.js";
import { generateShape } from "./figures.js";
import { generateMatrix } from "./matricex.js";
import { getRandomElementFromSet } from "./utils.js";
import { preloadedFigures, casilleros } from "./figures.js";
import { displayBinaryNumbers } from "./binaries.js";

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
  const reviewColsInput = document.getElementById("reviewCols");
  const numPairsInput = document.getElementById("numPairs");
  const numPairsLabel = document.querySelector("label[for='numPairs']");
  const numRowsInput = document.getElementById("numRows");
  const numColsInput = document.getElementById("numCols");
  const matrixSizeInput = document.getElementById("matrixSize");
  const formatSelect = document.getElementById("format");
  const usuarioSelect = document.getElementById("usuario");
  const numbersContainer = document.querySelector(".bottom");
  const fontSizeInput = document.getElementById("fontSize");
  const practicarFallos = document.getElementById("practicarFallos");
  const reducirTiempo = document.getElementById("reducirTiempo");
  const minRangeInput = document.getElementById("minValue");
  const maxRangeInput = document.getElementById("maxValue");
  const minValueLabel = document.querySelector("label[for='minValue']");
  const maxValueLabel = document.querySelector("label[for='maxValue']");
  const lastAttemptGrid = document.getElementById("lastAttemptGrid")

  let minRange = 0;
  let maxRange = 99;

  // Ensure correct elements are selected
  const numRowsLabel = document.querySelector("label[for='numRows']");
  const numColsLabel = document.querySelector("label[for='numCols']");
  const matrixSizeLabel = document.querySelector("label[for='matrixSize']");

  const colorsContainer = document.getElementById("colors");

  const toggleMatrixSettings = () => {
    if (!formatSelect) return;

    const isMatrices = formatSelect.value === "matrices";
    const isFigures = formatSelect.value === "figures";

    // Show/Hide only the necessary fields & labels
    numRowsInput.style.display = isMatrices ? "inline-block" : "none";
    numColsInput.style.display = isMatrices ? "inline-block" : "none";
    matrixSizeInput.style.display = isMatrices ? "inline-block" : "none";

    numRowsLabel.style.display = isMatrices ? "inline-block" : "none";
    numColsLabel.style.display = isMatrices ? "inline-block" : "none";
    matrixSizeLabel.style.display = isMatrices ? "inline-block" : "none";

    numPairsInput.style.display = isMatrices || isFigures ? "none" : "inline-block";
    numPairsLabel.style.display = isMatrices || isFigures ? "none" : "inline-block";

    const isDecimal = formatSelect.value === "decimal";

    // Show/Hide Min & Max Value fields if NOT Decimal
    minRangeInput.style.display = isDecimal ? "inline-block" : "none";
    maxRangeInput.style.display = isDecimal ? "inline-block" : "none";
    minValueLabel.style.display = isDecimal ? "inline-block" : "none";
    maxValueLabel.style.display = isDecimal ? "inline-block" : "none";

    const isFallosChecked = practicarFallos.checked;
    colorsContainer.style.display = isFigures && isFallosChecked ? "inline-block" : "none";
  };

  if (formatSelect) {
    formatSelect.addEventListener("change", toggleMatrixSettings);
    toggleMatrixSettings(); // Run once on load to set initial state
  }

  const fallosInput = document.getElementById("fallos");
  colorsContainer.style.display = "none"

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
      colors.style.display = "figures" === formatSelect.value ? "inline" : "none";
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
  let matrixSize = parseInt(matrixSizeInput.value)
  let lastGameType = format

  function runIteration(showTime, timeout) {
    if (!running || counter >= parseInt(amountInput.value)) {
      running = false;
      return;
    }

    // Prepare dynamic time reduction logic
    if (reducirTiempo.checked && counter > 0) {
      const initialShowTime = parseInt(showTimeInput.value);
      const initialTimeout = parseInt(timeoutInput.value);

      if (counter <= 3) {
        showTime = Math.max(1, Math.floor(initialShowTime * 1.0));
        timeout = Math.max(1, Math.floor(initialTimeout * 1.0));
      } else if (counter <= 6) {
        showTime = Math.max(1, Math.floor(initialShowTime * 0.8));
        timeout = Math.max(1, Math.floor(initialTimeout * 0.8));
      } else if (counter <= 9) {
        showTime = Math.max(1, Math.floor(initialShowTime * 0.6));
        timeout = Math.max(1, Math.floor(initialTimeout * 0.6));
      } else if (counter <= 12) {
        showTime = Math.max(1, Math.floor(initialShowTime * 0.4));
        timeout = Math.max(1, Math.floor(initialTimeout * 0.4));
      } else {
        showTime = Math.max(1, Math.floor(initialShowTime * 0.2));
        timeout = Math.max(1, Math.floor(initialTimeout * 0.2));
      }
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

          const imgElement = document.createElement("img");
          imgElement.src = preloadedFigures[parseInt(randomNumber)].src;
          imgElement.alt = randomNumber;
          imgElement.style.display = 'block';  // Replace 200px with your desired width
          imgElement.style.width = '250px';  // Replace 200px with your desired width
          imgElement.style.height = '250px';  // Replace 200px with your desired width
          numberElement.appendChild(imgElement);

          if (muestraImagenesALaVez) {
            setTimeout(() => {
              numberElement.textContent = '';
              const imgElement = document.createElement("img");
              let wordIdx = parseInt(randomNumber)

              imgElement.src = casilleros.get(usuario)[wordIdx].src;
              imgElement.alt = randomNumber;

              imgElement.style.display = 'block';  // Replace 200px with your desired width
              imgElement.style.width = '250px';  // Replace 200px with your desired width
              imgElement.style.height = '250px';  // Replace 200px with your desired width
              imgElement.style.marginBottom = '15px';  // Replace 200px with your desired width

              // Optionally, you can add object-fit to preserve the aspect ratio
              imgElement.style.objectFit = 'cover';

              numberElement.appendChild(imgElement);
            }, parseInt(showTime * 0.4)); // Delay of 100ms
          }

          if (muestraCasillaALaVez) {
            const wordElement = document.createElement("div");
            let wordIdx = randomNumber % casillero.length;
            wordElement.textContent = casillero[wordIdx];
            wordElement.classList.add("word");
            numberElement.appendChild(wordElement);
          }

          break;
        default:
          if (i > 1) {
            randomNumber += MULTIPLE_PAIRS_SEPARATOR
          }
          let unidadDecimal = Math.floor(Math.random() * 10);
          let decenaDecimal = Math.floor(Math.random() * 10);
          let numero = decenaDecimal * 10 + unidadDecimal;

          while (numero < minRange || numero > maxRange || (practicarFallos && fallosSet.size > 0 && (!fallosSet.has(unidadDecimal) && !fallosSet.has(decenaDecimal)))) {
            unidadDecimal = Math.floor(Math.random() * 10);
            decenaDecimal = Math.floor(Math.random() * 10);
            numero = decenaDecimal * 10 + unidadDecimal;
          }
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
        displayBinaryNumbers(randomNumber, binaryDigits, numberElement);
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

  // ================== Game Execution ===================
  const startExecution = () => {
    if (running) return; // Prevent duplicate executions

    running = true;

    counter = 0;
    numbers = [];

    numbersContainer.innerHTML = "";
    lastAttemptGrid.innerHTML = ""

    const initialShowTime = parseInt(showTimeInput.value);
    const initialTimeout = parseInt(timeoutInput.value);

    format = formatSelect.value; // Fetch the selected format

    lastGameType = format
    numRows = parseInt(numRowsInput.value);
    numCols = parseInt(numColsInput.value);
    usuario = usuarioSelect.value;
    numPairs = parseInt(numPairsInput.value)

    minRange = parseInt(minRangeInput.value)
    maxRange = parseInt(maxRangeInput.value)

    runIteration(initialShowTime, initialTimeout);
  };

  goButton.addEventListener("click", startExecution);

  stopButton.addEventListener("click", function () {
    stopGame();
  });

  const stopGame = () => {
    running = false; // Stop execution gracefully
    counter = 0;
    numbersContainer.innerHTML = "";
    lastAttemptGrid.innerHTML = ""
  }

  // ================== Last Attempt Grid ===================
  const displayLastAttempt = () => {
    lastAttemptGrid.innerHTML = ""; // Clear previous grid

    let attemptData = numbers; // Fetch stored numbers
    let format = lastGameType; // Retrieve last game's format

    if (attemptData.length === 0) {
      lastAttemptGrid.innerHTML = "<p>No hay datos para mostrar.</p>";
      return;
    }

    const grid = document.createElement("div");
    grid.classList.add("grid");
    grid.style.gridTemplateColumns = `repeat(${reviewColsInput.value}, 1fr)`;

    attemptData.forEach(item => {
      const cell = document.createElement("div");
      cell.classList.add("grid-cell");

      if (format === "decimal") {
        // Decimal: Show number as is
        cell.textContent = item;
      } else if (format === "binary6" || format === "binary8") {
        displayBinaryNumbers(item, format === "binary6" ? 3 : 4, cell);
        cell.style.display = "block"
      } else if (format === "figures") {
        // Figures: Reconstruct the figure
        let figureIndex = parseInt(item);
        const img = document.createElement("img");
        img.src = preloadedFigures[figureIndex]?.src || "placeholder.png";
        img.alt = `Figure ${item}`;
        img.style.width = "250px";
        img.style.height = "250px";
        cell.appendChild(img);

      } else if (format === "matrices") {
        // Matrices: Reconstruct the stored matrix
        const idx = item.indexOf("\n")
        const matrixData = item.slice(idx).split("\n")
        const matrixElement = document.createElement("pre");
        generateMatrix(matrixElement, matrixSize, numRows, numCols, matrixData)
        cell.appendChild(matrixElement);
      }

      grid.appendChild(cell);
    });

    lastAttemptGrid.appendChild(grid);
  };

  checkButton.addEventListener("click", displayLastAttempt);
  reviewColsInput.addEventListener("change", displayLastAttempt);

  // ============ Controls ================  
  document.addEventListener("keydown", function (event) {
    switch (event.key.toLowerCase()) {
      case "enter":
        startExecution();
        break;
      case "b":
        formatSelect.value = "binary6";
        fontSizeInput.value = 80;
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
    toggleMatrixSettings()
  });
});
