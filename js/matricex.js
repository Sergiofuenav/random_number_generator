
export function generateMatrix(container, matrixSize, rows, columns = 3) {
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