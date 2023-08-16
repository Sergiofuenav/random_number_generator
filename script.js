document.addEventListener("DOMContentLoaded", function() {
  const goButton = document.getElementById("goButton");
  const stopButton = document.getElementById("stopButton");
  const timeoutInput = document.getElementById("timeout");
  const showTimeInput = document.getElementById("showTime");
  const amountInput = document.getElementById("amount");
  const numbersContainer = document.querySelector(".numbers");
  let interval;

  goButton.addEventListener("click", function() {
    const timeout = parseInt(timeoutInput.value);
    const showTime = parseInt(showTimeInput.value);
    const amount = parseInt(amountInput.value);

    numbersContainer.innerHTML = ""; // Clear previous numbers
    let counter = 0;

    interval = setInterval(function() {
      if (counter >= amount) {
        clearInterval(interval);
        return;
      }

      const randomNumber = Math.floor(Math.random() * 100);
      const numberElement = document.createElement("div");
      numberElement.classList.add("number");
      numberElement.textContent = randomNumber;
      numbersContainer.appendChild(numberElement);

      setTimeout(function() {
        numbersContainer.removeChild(numberElement);
      }, showTime);

      counter++;
    }, timeout + showTime);
  });

  stopButton.addEventListener("click", function() {
    clearInterval(interval);
    numbersContainer.innerHTML = "";
  });
});

