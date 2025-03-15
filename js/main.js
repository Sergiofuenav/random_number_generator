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
  const randomIndexCheckbox = document.getElementById("randomIndex")

  let minRange = 0;
  let maxRange = 99;

  // Ensure correct elements are selected
  const numRowsLabel = document.querySelector("label[for='numRows']");
  const numColsLabel = document.querySelector("label[for='numCols']");
  const matrixSizeLabel = document.querySelector("label[for='matrixSize']");
  const randomIndexLabel = document.querySelector("label[for='randomIndex']")

  const colorsContainer = document.getElementById("colors");

  const toggleMatrixSettings = () => {
    if (!formatSelect) return;

    const isMatrices = formatSelect.value === "matrices";
    const isFigures = formatSelect.value === "figures";

    // Show/Hide only the necessary fields & labels
    numRowsInput.style.display = isMatrices ? "inline-block" : "none";
    numColsInput.style.display = isMatrices ? "inline-block" : "none";
    matrixSizeInput.style.display = isMatrices ? "inline-block" : "none";
    randomIndexCheckbox.style.display = isMatrices ? "inline-block" : "none";

    numRowsLabel.style.display = isMatrices ? "inline-block" : "none";
    numColsLabel.style.display = isMatrices ? "inline-block" : "none";
    matrixSizeLabel.style.display = isMatrices ? "inline-block" : "none";
    randomIndexLabel.style.display = isMatrices ? "inline-block" : "none";

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
          numberElement.appendChild(imgElement);

          // if (muestraImagenesALaVez) {
          //   setTimeout(() => {
          //     numberElement.textContent = '';
          //     const imgElement = document.createElement("img");
          //     let wordIdx = parseInt(randomNumber)

          //     imgElement.src = casilleros.get(usuario)[wordIdx].src;
          //     imgElement.alt = randomNumber;

          //     imgElement.style.display = 'block';  // Replace 200px with your desired width
          //     imgElement.style.width = '250px';  // Replace 200px with your desired width
          //     imgElement.style.height = '250px';  // Replace 200px with your desired width
          //     imgElement.style.marginBottom = '15px';  // Replace 200px with your desired width

          //     // Optionally, you can add object-fit to preserve the aspect ratio
          //     imgElement.style.objectFit = 'cover';

          //     numberElement.appendChild(imgElement);
          //   }, parseInt(showTime * 0.4)); // Delay of 100ms
          // }

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
      // Display a random number between 1 and 12
      const randomNumberElement = document.createElement("div")
      if (randomIndexCheckbox.checked) {
        // Random index entre 1 y 9 para practicar lectura
        randomIndex = Math.floor(Math.random() * 9) + 1
      } else {
        randomIndex += 1;
        randomIndex %= 13;
        if (randomIndex === 0)
          randomIndex = 1;
      }
      randomNumberElement.textContent = randomIndex
      randomNumberElement.style.fontSize = fontSize
      numberElement.appendChild(randomNumberElement)

      const matrixElement = document.createElement("div")
      const matrix = generateMatrix(matrixElement, matrixSize, numRows, numCols);
      numberElement.appendChild(matrixElement)
      const nextElement = `${randomIndex}\n${matrix}`
      numbers.push(nextElement);
      randomNumber = nextElement
    } else {
      numbers.push(randomNumber);
    }

    // Display binary numbers in rows
    if (format === "binary6" || format === "binary8") {
      displayBinaryNumbers(randomNumber, binaryDigits, numberElement);
    } else if (format === "decimal") {
      numberElement.textContent = randomNumber;
    }
    // Casillero
    if (muestraCasillaALaVez) {
      const N = sacaNumber(format, randomNumber)
      renderCasillas(N, numberElement)
    }

    // Imágenes
    if (muestraImagenesALaVez && format !== "matrices") {
      setTimeout(() => {
        numberElement.textContent = '';

        const imgElement = document.createElement("img");
        const wordIdx = sacaNumber(format, randomNumber)
        imgElement.src = casilleros.get(usuario)[wordIdx].src;
        imgElement.alt = randomNumber;

        imgElement.style.display = 'block';
        imgElement.style.width = '350px';
        imgElement.style.height = '350px';

        numberElement.appendChild(imgElement);
      }, parseInt(showTime * 0.5)); // Delay of 100ms
    }


    // Remove the element after showTime
    setTimeout(() => {
      if (numberElement && numberElement.parentNode === numbersContainer) {
        numbersContainer.removeChild(numberElement);
      }
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

    lastAttemptGrid.style.display = "none";
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

    randomIndex = 0;

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
    if (running) return;
    lastAttemptGrid.innerHTML = ""; // Clear previous grid
    lastAttemptGrid.style.display = "block"; // Show the grid

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

      // Container to hold both the main content and "casilla"
      const contentWrapper = document.createElement("div");
      contentWrapper.classList.add("content-wrapper");

      // Create content container for the main display
      const contentContainer = document.createElement("div");
      contentContainer.classList.add("content-container");
      if (format === "decimal") {
        const decimal = document.createElement("p");
        decimal.textContent = item;
        contentContainer.appendChild(decimal);
      } else if (format === "binary6" || format === "binary8") {
        displayBinaryNumbers(item, format === "binary6" ? 3 : 4, contentContainer);
      } else if (format === "figures") {
        let figureIndex = parseInt(item);
        const img = document.createElement("img");
        img.src = preloadedFigures[figureIndex]?.src || "placeholder.png";
        img.alt = `Figure ${item}`;
        img.classList.add("figure-image");
        contentContainer.appendChild(img);
      } else if (format === "matrices") {
        const idx = item.indexOf("\n");
        const matrixData = item.split("\n").slice(1).filter(entry => entry.trim() !== "");

        // Add h3 with the value of idx
        const idxHeader = document.createElement("h3");
        idxHeader.textContent = item.substring(0, idx);
        contentContainer.appendChild(idxHeader);

        const matrixElement = document.createElement("pre");
        generateMatrix(matrixElement, matrixSize, numRows, numCols, matrixData);
        contentContainer.appendChild(matrixElement);
      }

      // Add the contentContainer inside the wrapper
      contentWrapper.appendChild(contentContainer);
      const number = sacaNumber(format, item)

      if (muestraImagenesElement.checked) {
        const numberChunks = number.toString().split("-");
        const imagesDiv = document.createElement("div");

        numberChunks.forEach(chunk => {
          const imgElement = document.createElement("img");
          const wordIdx = parseInt(chunk);

          imgElement.src = casilleros.get(usuario)[wordIdx]?.src || null;
          imgElement.alt = "";

          imgElement.style.display = 'block';
          imgElement.style.width = '200px';
          imgElement.style.height = '200px';

          imagesDiv.appendChild(imgElement);
        });

        contentWrapper.appendChild(imagesDiv);
      }

      // "Casilla" text div (placed below contentContainer)
      if (muestraCasillaElement.checked) {
        renderCasillas(number, contentWrapper);
      }

      // Append wrapper to cell
      cell.appendChild(contentWrapper);
      grid.appendChild(cell);
    });

    lastAttemptGrid.appendChild(grid);
  };

  checkButton.addEventListener("click", displayLastAttempt);
  reviewColsInput.addEventListener("change", displayLastAttempt);

  document.getElementById("casillero").addEventListener("change", displayLastAttempt);
  document.getElementById("imagenes").addEventListener("change", displayLastAttempt);


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
        stopGame();
        break;
      case "i":
        muestraImagenesElement.checked = !muestraImagenesElement.checked;
        break;
      case "c":
        muestraCasillaElement.checked = !muestraCasillaElement.checked;
        break;
      case "t":
        reducirTiempo.checked = !reducirTiempo.checked;
        break;
    }
    toggleMatrixSettings();
  });

});

function renderCasillas(number, contentWrapper) {
  const numberChunks = number.toString().split("-");
  const casillaDiv = document.createElement("div");

  numberChunks.forEach(chunk => {
    const chunkDiv = document.createElement("div");
    const casilla = casillero[parseInt(chunk)];
    chunkDiv.textContent = casilla;
    casillaDiv.appendChild(chunkDiv);
  });
  casillaDiv.classList.add("casilla-text");
  contentWrapper.appendChild(casillaDiv);
}

function sacaNumber(format, item) {
  // Handle different formats to extract the numeric value
  switch (format) {
    case "decimal":
    case "figures":
      return parseInt(item);

    case "binary6":
      // case "binary8":
      // Determine the number of bits per chunk based on format
      const bitsPerChunk = format === "binary6" ? 3 : 4;

      // Split the binary string into two chunks
      const firstPart = item.slice(0, bitsPerChunk);
      const secondPart = item.slice(bitsPerChunk, bitsPerChunk * 2);

      // Convert binary chunks to decimal
      // For binary6 use the map, for binary8 parse directly
      const firstDecimal = format === "binary6" ? bin_to_int_map.get(firstPart) : parseInt(firstPart, 2);
      const secondDecimal = format === "binary6" ? bin_to_int_map.get(secondPart) : parseInt(secondPart, 2);

      // Compute the integer (first decimal as tens, second as units)
      return firstDecimal * 10 + secondDecimal;

    case "matrices":
      // Split by newline to separate the index from the matrix
      const parts = item.split("\n").filter(e => e.trim !== "");
      const index = parseInt(parts[0]);

      // Process the matrix rows
      const numbers = [];

      // First row: combine index with first binary value
      if (parts.length > 1) {
        const firstRow = parts[1];
        const firstBinary = firstRow.slice(0, 3);
        const firstDecimal = bin_to_int_map.get(firstBinary);
        numbers.push(index * 10 + firstDecimal);

        // Process remaining rows like binary6
        for (let i = 2; i < parts.length - 1; i += 2) {
          const rowFirstPart = parts[i]
          const rowSecondPart = parts[i + 1]
          const rowFirstDecimal = bin_to_int_map.get(rowFirstPart);
          const rowSecondDecimal = bin_to_int_map.get(rowSecondPart);
          const finalNumber = rowFirstDecimal * 10 + rowSecondDecimal
          numbers.push(finalNumber);
        }
      }

      // Join all numbers with hyphens
      return numbers.join("-");
  }
  return format.includes("binary6") ?
    (() => {
      // For binary6, split the 6 digits into two 3-digit chunks
      const firstPart = item.slice(0, 3);
      const secondPart = item.slice(3, 6);

      // Convert binary chunks to decimal
      const firstDecimal = bin_to_int_map.get(firstPart);
      const secondDecimal = bin_to_int_map.get(secondPart);

      // Compute the integer (first decimal as tens, second as units)
      const computedInteger = firstDecimal * 10 + secondDecimal;

      return computedInteger;
    })() : parseInt(item);
}

