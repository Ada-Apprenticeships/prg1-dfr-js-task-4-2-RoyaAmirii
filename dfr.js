const fs = require("fs");

function fileExists(filename) {
  return fs.existsSync(filename); //returns true if file exits
}

function validNumber(value) { //value can be string or numeric// returns a boolean
  const number = parseFloat(value); //Parsefloat is used to check if value can be converted into a finite number
  const isValidFormat = /^=?\d+(\.\d+)?$/.test(value);
  return isValueFormat && !isNaN(number) && isFinite(number); //we return true only if isValidFormat is true and the parsed number is finite
  
}

function dataDimensions(dataframe) { //returns a list[rows (int), cols (int)]
  if (!Array.isArray(dataframe) || dataframe.length === 0){
    return [-1, -1]; //if dataframe is not a valid array/or if it's empty, then return [-1, -1]
  }
  if (!Array.isArray(dataframe[0])){
    return [dataframe.length, -1]; //return [rows,-1] for 1d arrays
  }
  const rows = dataframe.length; //number of rows
  const cols = dataframe[0].length; //number of columns
  return [rows, cols]; //return dimensions 

}
//sample data for testing datadimensions
const df1 = [
  ['tcp', 1, 2, 3],
  ['icmp', 4, 5, 6]
  ['tcp', 7, 8, 9]
];

const ds1 = [1.1, 1.2, 0, 0, 1.1];
const ds2 = ['AAA', 'BBB' ,'CCC'];
const ds3 = undefined;

//test cases for datadimensions
console.log(dataDimensions(df1)); // [3,4]
console.log(dataDimensions(ds1)); // [5, -1]
console.log(dataDimensions(ds2)); //[3, -1]
console.log(dataDimensions(ds3)); //[-1, -1]

//calculate the total of numeric values in an array
function findTotal(dataset) { //checks for invalid inputs (non-array or 2D array)
  if (!Array.isArray(data) || (Array.isArray(data) && Array.isArray(data[0]))){
    return 0; //return 0 for non-array inputs and 2D arrays
  }

  let total = 0

  //Iterate through the data and sum valid numbers
  for (const item of data) {
    const num = parseFloat(item); //convert item to number
    if (!isNaN(num)) {
      total += num; //add valid number to total
    }
  }
  return total;
}

function calculateMean(dataset) {
  if (!Array.isArray(dataset)|| dataset.length === 0) return 0;

  const validNumbers = dataset.filter(value => validNumber(value)).map(Number);
  if (validNumbers.length === 0) return 0;
  
  const total = validNumbers.reduce((acc,num) => acc+ num, 0);
  return total / validNumbers.length;
  
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

}

function loadCSV(csvFile, ignoreRows, ignoreCols) {

}


function createSlice(dataframe, columnIndex, pattern, exportColumns = []) {

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