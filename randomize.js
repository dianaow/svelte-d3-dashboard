const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Define the input and output file paths
const inputFilePath = './src/data/active_users_daily.csv';
const outputFilePath = './src/data/output/sales_daily.csv';

// Create a read stream for the input file
const readStream = fs.createReadStream(inputFilePath)
  .pipe(csv({ separator: ',' }));
// Create an array to store the modified rows
const modifiedData = [];

// Process each row and modify the data as needed
readStream.on('data', (row) => {
  // Parse the date string from the CSV row
  const currentDate = new Date(row.date);

  // Shift the date by one month and one day back
  const modifiedDate = new Date(currentDate);
  //modifiedDate.setYear(currentDate.getFullYear() - 1);
  modifiedDate.setMonth(currentDate.getMonth() - 2);
  //modifiedDate.setDate(currentDate.getDate() - 1);

  // Randomize the value while retaining the trend
  const randomizedValueWW = Math.round(+row.au_ww + (Math.random() * 5 - 10) * (+row.au_ww / 50));
  const randomizedValueAU = Math.round(+row.au_au + (Math.random() * 5 - 10) * (+row.au_au / 50));
  const randomizedValueAS = Math.round(+row.au_as + (Math.random() * 5 - 10) * (+row.au_as / 50));
  const randomizedValueAF = Math.round(+row.au_af + (Math.random() * 5 - 10) * (+row.au_af / 50));
  const randomizedValueEU = Math.round(+row.au_eu + (Math.random() * 5 - 10) * (+row.au_eu / 50));
  const randomizedValueSA = Math.round(+row.au_sa + (Math.random() * 5 - 10) * (+row.au_sa / 50));
  const randomizedValueNA = Math.round(+row.au_na + (Math.random() * 5 - 10) * (+row.au_na / 50));

  // Create a modified row with the updated date and randomized value
  const modifiedRow = {
    date: row.date,
    //date: modifiedDate.toISOString().slice(0, 10),
    //date: modifiedDate.toISOString(),
    au_ww: randomizedValueWW,
    au_au: randomizedValueAU,
    au_as: randomizedValueAS,
    au_af: randomizedValueAF,
    au_eu: randomizedValueEU,
    au_sa: randomizedValueSA,
    au_na: randomizedValueNA
  };

  // Add the modified row to the array
  modifiedData.push(modifiedRow);
});

readStream.on('end', () => {
  // Create a write stream for the output file
  const csvWriter = createCsvWriter({
    path: outputFilePath,
    header: Object.keys(modifiedData[0]).map((key) => ({ id: key, title: key })),
  });

  // Write the modified data to the output file
  csvWriter.writeRecords(modifiedData.filter(d => new Date(d.date) >= new Date('2020-01-01')))
    .then(() => console.log('Modified CSV file saved successfully'))
    .catch((err) => console.error('Error saving modified CSV file:', err));
});