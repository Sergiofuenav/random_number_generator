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

  let interval;

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
        return;
      }

      let randomNumber;
      let binaryDigits = 0;

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
          const randomFigure = `${form}${color}`
          content = `<img src="images/${randomFigure}.png" alt="${randomFigure}" />`;
          break;
        default:
          randomNumber = Math.floor(Math.random() * 100).toString();
      }

      const fontSize = parseInt(fontSizeInput.value);
      const isBold = boldCheckbox.checked;

      const numberElement = document.createElement("div");
      numberElement.style.fontSize = `${fontSize}px`; // Apply font size
      numberElement.style.fontWeight = isBold ? "bold" : "normal"; // Apply font weight
      numberElement.classList.add("number");
      numbersContainer.appendChild(numberElement);

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
      } else if (format === "figures") {
        numberElement.innerHTML = content;
      } else {
        numberElement.textContent = randomNumber;
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
