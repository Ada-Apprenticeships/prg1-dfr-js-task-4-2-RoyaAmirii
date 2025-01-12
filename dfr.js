const fs = require("fs");
const { stringify } = require("querystring");

function fileExists(filename) {
  return fs.existsSync(filename); //returns true if file exits
}

function validNumber(value) { //value can be string or numeric, returns a boolean
  const number = parseFloat(value); //parseFloat is used to check if value can be converted into a finite number
  const isValidFormat = /^-?\d+(\.\d+)?$/.test(value);
  return isValidFormat && !isNaN(number) && isFinite(number); //we return true only if isValidFormat is true and the parsed number is finite
}

function dataDimensions(dataframe) {
  // Check if the dataframe is a valid array and not empty
  if (!Array.isArray(dataframe) || dataframe.length === 0) {
    return [-1, -1]; // If dataframe is not a valid array or it's empty, return [-1, -1]
  }

  // Check if the first element is not an array, indicating it's a 1D array
  if (!Array.isArray(dataframe[0])) {
    return [dataframe.length, -1]; // Return [rows, -1] for 1D arrays
  }

  // If the dataframe is a 2D array
  const rows = dataframe.length; // Number of rows
  const cols = dataframe[0].length; // Number of columns (assuming all rows have the same length)
  return [rows, cols]; // Return dimensions as [rows, cols]
}

// Sample data for testing dataDimensions
const df1 = [
  ['tcp', 1, 2, 3],
  ['icmp', 4, 5, 6],
  ['tcp', 7, 8, 9]
];  // Added missing comma between the second and third arrays

const ds1 = [1.1, 1.2, 0, 0, 1.1];
const ds2 = ['AAA', 'BBB', 'CCC'];
const ds3 = undefined;

// Test cases for dataDimensions
console.log(dataDimensions(df1)); // [3, 4]
console.log(dataDimensions(ds1)); // [5, -1]
console.log(dataDimensions(ds2)); // [3, -1]
console.log(dataDimensions(ds3)); // [-1, -1]

//calculate the total of numeric values in an array
function findTotal(dataset) { //checks for invalid inputs (non-array or 2D array)
  if (!Array.isArray(dataset) || (Array.isArray(dataset[0]))) {
    return 0; //return 0 for non-array inputs and 2D arrays
  }

  let total = 0

  //Iterate through the data and sum valid numbers
  for (const item of dataset) {
    const num = parseFloat(item); //convert item to number
    if (!isNaN(num)) {
      total += num; //add valid number to total
    }
  }
  return total;
}

function convertToFloat(dataframe, col) { 
  if (!Array.isArray(dataframe) || dataframe.length === 0 || col< 0) return 0;

  let count = 0
  dataframe.forEach(row => { 
    if (Array.isArray(row) && validNumber(row[col]) && typeof row[col] !== 'number'){
      row[col] = parseFloat(row[col]);
      count++;
    }
  })
  return count
}

function calculateMean(dataset) {
  // Check if the input is a valid array
  if (!Array.isArray(dataset) || dataset.length === 0) return 0;

  const validNumbers = dataset
    .map(Number) // Converts each item to a number
    .filter(num => !isNaN(num)); // Filters out invalid numbers (NaN)

  if (validNumbers.length === 0) return 0; // No valid numbers

  const sum = validNumbers.reduce((acc, num) => acc + num, 0);
  return sum / validNumbers.length;
}

function calculateMedian(dataset) {
  if (!Array.isArray(dataset)) return 0;

  const validNumbers = dataset
  .map(Number)
  .filter(num => !isNaN(num));

  if (validNumbers.length === 0) return 0

  validNumbers.sort((a, b) => a - b);
  const midIndex = Math.floor(validNumbers.length / 2)

  if (validNumbers.length % 2 === 0){
    return (validNumbers[midIndex - 1] + validNumbers[midIndex]) / 2;
  }
  return validNumbers[midIndex];
}

function convertToNumber(dataframe, col) {
  if (!Array.isArray(dataframe) || dataframe.length === 0 || col < 0) return 0;

  let count = 0;
  dataframe.forEach(row => {
    if (Array.isArray(row) && validNumber (row[col])){
      row[col] = parseFloat(row[col]);
      count++;
    }
  })
  return count;

}

function flatten(dataframe) {
  if (!Array.isArray(dataframe))return[]//return empty array if input is invalid

  return dataframe.map(row => row[0]); //return first element of each row

}
function loadCSV(csvFile, ignoreRows, ignoreCols) {
  if (!fileExists(csvFile)) return [[], -1, -1]; // Return empty if file doesn't exist

  const data = fs.readFileSync(csvFile, 'utf-8').trim().split('\n'); // Read and split the file into lines
  const totalRows = data.length; // Total number of rows
  const totalColumns = data[0].split(',').length; // Correct column split by comma

  const dataframe = data
    .map((row, index) => {
      if (ignoreRows.includes(index)) return null; // Ignore specified rows
      const columns = row.split(','); // Split each row into columns
      return columns.filter((_, colIndex) => !ignoreCols.includes(colIndex)); // Filter out ignored columns
    })
    .filter(row => row !== null); // Remove null entries

  return [dataframe, totalRows, totalColumns];
}


//create a slice of the dataframe based on a pattern in a specified column
function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {
  if (!Array.isArray(dataframe) || dataframe.length === 0 || columnIndex < 0) {
    return []; //return empty if input is invalid
  
  }
  const result = [];

  for (const row of dataframe) {
    if (!Array.isArray(row) || row.length <= columnIndex) continue; //skip invalid rows

    const cellValue = row[columnIndex];

    //check for pattern match
    const matchesPattern = (pattern === '*' || String(cellValue) === String(pattern));

    if (matchesPattern) {
      const outputRow = exportColumns.length > 0
      ? exportColumns.map(colIndex => (row[colIndex] !== undefined ? row[colIndex] : null))
      :row;

      result.push(outputRow);
    }
  }
  return result; //return the filtered and possibly transformed rows

}

module.exports = {
  fileExists,
  validNumber,
  dataDimensions,
  calculateMean,
  findTotal,
  convertToNumber,
  flatten,
  loadCSV,
  calculateMedian,
  createSlice,
};