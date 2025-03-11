import { MULTIPLE_PAIRS_SEPARATOR } from "./constants.js";

export function displayBinaryNumbers(randomNumber, binaryDigits, numberElement) {
    const groups = randomNumber.split(MULTIPLE_PAIRS_SEPARATOR);

    // Map each group to split into two 3-bit parts and transpose them
    const result = groups.map(group => [group.slice(0, binaryDigits), group.slice(binaryDigits)]);

    // Format the result as required for output
    const rows = result[0].map((_, colIndex) => result.map(row => row[colIndex]).join(' · '));

    for (let i = 0; i < rows.length; i++) {
        const rowElement = document.createElement("div");
        const content = rows[i];
        rowElement.textContent = content;
        numberElement.appendChild(rowElement);
    }
}
