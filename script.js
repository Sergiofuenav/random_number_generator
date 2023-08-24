const casillero = [
  "Hierro",
  "Rata",
  "Rino",
  "Rama",
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
  "Lira",
  "Late",
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
  "Sumo",
  "Saco",
  "Sol",
  "Seso",
  "Sofia",
  "Soja",
  "Sapo",
  "Faro",
  "Foto",
  "Faena",
  "Fama",
  "Foca",
  "Fila",
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
  "Bach",
  "Papa",
];

const preloadedImages = [];
for (let i = 0; i < 100; i++) {
  if (i >= 10 && i < 30) {
    preloadedImages.push(null);
    continue;
  }
  const img = new Image();
  const imageName = i.toString().padStart(2, "0"); // Format the image name
  img.src = `images/${imageName}.png`; // Adjust the path based on your images' actual location
  preloadedImages.push(img);
}

function generateForm() {
  const randomNumber = Math.floor(Math.random() * 8) + 3; // Generate number between 3 and 10
  return randomNumber === 10 ? 0 : randomNumber;
}

document.addEventListener("DOMContentLoaded", function () {
  const goButton = document.getElementById("goButton");
  const stopButton = document.getElementById("stopButton");
  const timeoutInput = document.getElementById("timeout");
  const showTimeInput = document.getElementById("showTime");
  const amountInput = document.getElementById("amount");
  const formatSelect = document.getElementById("format");
  const numbersContainer = document.querySelector(".bottom");
  const fontSizeInput = document.getElementById("fontSize");
  const boldCheckbox = document.getElementById("bold");
  const muestraCasillaElement = document.getElementById("casillero");

  let interval;

  let numbers = [];
  goButton.addEventListener("click", function () {
    const timeout = parseInt(timeoutInput.value);
    const showTime = parseInt(showTimeInput.value);
    const amount = parseInt(amountInput.value);
    const format = formatSelect.value; // Fetch the selected format

    numbersContainer.innerHTML = ""; // Clear previous numbers
    let counter = 0;

    interval = setInterval(function () {
      if (counter >= amount) {
        clearInterval(interval);
        console.log(numbers);
        numbers = [];
        return;
      }

      let randomNumber;
      let binaryDigits = 0;

      const fontSize = parseInt(fontSizeInput.value);
      const isBold = boldCheckbox.checked;
      const muestraCasillaALaVez = muestraCasillaElement.checked;

      const numberElement = document.createElement("div");
      numberElement.style.fontSize = `${fontSize}px`; // Apply font size
      numberElement.style.fontWeight = isBold ? "bold" : "normal"; // Apply font weight
      numberElement.classList.add("number");
      numbersContainer.appendChild(numberElement);

      switch (format) {
        case "binary6":
          randomNumber = Math.floor(Math.random() * 64)
            .toString(2)
            .padStart(6, "0");
          binaryDigits = 3; // 2 rows of 3 binary digits each
          break;
        case "binary8":
          randomNumber = Math.floor(Math.random() * 256)
            .toString(2)
            .padStart(8, "0");
          binaryDigits = 4; // 2 rows of 4 binary digits each
          break;
        case "figures":
          const form = generateForm();
          const color = Math.floor(Math.random() * 9);
          randomNumber = `${form}${color}`;

          if (muestraCasillaALaVez) {
            const wordElement = document.createElement("div");
            let wordIdx = randomNumber % casillero.length;
            if (format.includes("bin")) {
              wordIdx = parseInt(randomNumber, 2);
            }
            wordElement.textContent = casillero[wordIdx];
            wordElement.classList.add("word");
            numberElement.appendChild(wordElement);
          }
          const imgElement = document.createElement("img");
          imgElement.src = preloadedImages[parseInt(randomNumber)].src;
          imgElement.alt = randomNumber;
          numberElement.appendChild(imgElement);
          break;
        default:
          randomNumber = Math.floor(Math.random() * 100)
            .toString()
            .padStart(2, "0");
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

      if (muestraCasillaALaVez && format !== "figures") {
        const wordElement = document.createElement("div");
        let wordIdx = randomNumber % casillero.length;
        if (format.includes("bin")) {
          wordIdx = parseInt(randomNumber, 2);
        }
        wordElement.textContent = casillero[wordIdx];
        wordElement.classList.add("word");
        numberElement.appendChild(wordElement);
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
