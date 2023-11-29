const fs = require('fs');
const path = require('path');

const READ_SIZE = 500 * 1024 * 1024; // 500 MB

function merge(left, right) {
 let merged = [];

 while (left.length > 0 && right.length > 0) {
    if (left[0] < right[0]) {
      merged.push(left.shift());
    } else {
      merged.push(right.shift());
    }
 }

 while (left.length > 0) {
    merged.push(left.shift());
 }

 while (right.length > 0) {
    merged.push(right.shift());
 }

 return merged;
}

function mergeSort(array) {
 if (array.length <= 1) {
    return array;
 }

 const mid = Math.floor(array.length / 2);
 const left = array.slice(0, mid);
 const right = array.slice(mid);

 return merge(mergeSort(left), mergeSort(right));
}

function externalSort(inputFile, outputFile) {
 let input = fs.createReadStream(inputFile, { highWaterMark: READ_SIZE });
 let output = fs.createWriteStream(outputFile);

 let data = '';
 input.on('data', (chunk) => {
    data += chunk;

    let lines = data.split('\n');
    lines.pop();

    output.write(mergeSort(lines).join('\n') + '\n');
    data = lines.pop();
 });

 input.on('end', () => {
    output.write(mergeSort(data.split('\n')).join('\n') + '\n');
    output.end();
 });
}

externalSort('input.txt', 'output.txt');