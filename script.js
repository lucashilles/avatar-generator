const canvas = document.getElementById('canvas');

/**
 * @type {HTMLInputElement}
 */
const usernameField = document.getElementById("username");
usernameField.value = '';

usernameField.addEventListener('keyup', (event) => {
  generateAvatar(event.target.value);
})

/**
 * @type {CanvasRenderingContext2D}
 */
const context = canvas.getContext('2d');

const margin = 10;
const columnSpacing = (canvas.clientWidth - (2 * margin)) / 5;
const rowSpacing = (canvas.clientHeight - (2 * margin)) / 5;

function drawSquare(leftTopX, leftTopY) {
  context.fillRect(leftTopX, leftTopY, columnSpacing, rowSpacing);
  context.fillRect(
    canvas.clientWidth - leftTopX - columnSpacing,
    leftTopY,
    columnSpacing,
    rowSpacing
  );
}

function generateAvatar(string) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const strHashValue = crc25hash(string);
  const binValue = strHashValue.toString(2).padStart(25, '0');

  context.fillStyle = `hsl(${strHashValue & 255}, 100%, 69%)`;

  // for(let i = 0; i < binValue.length; i++) {
  for(let i = 0; i < 15; i++) {
    if(binValue[i] == '1') {
      // let col = (i % 5) * columnSpacing + margin;
      // let row = parseInt(i / 5) * rowSpacing + margin;
      let col = (i % 3) * columnSpacing + margin;
      let row = parseInt(i / 3) * rowSpacing + margin;

      drawSquare(col, row);
    }
  }
}

/**
 * Hashing function
 * @param {String} str Base text to hash
 * @returns {Number} Hash with length os 25 bit
 */
function crc25hash(str) {
  // String to byte Array
  let strBytes = [];
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    strBytes.push(char >>> 8);
    strBytes.push(char & 0xff);
  }

  // crcTable is an array of 256 32-bit constants
  let crcTable = [];
  for (let divident = 0; divident < 256; divident++) {
    let currByte = (divident << (25 - 8)) & 0x1ffffff;
    for (let bit = 0; bit < 8; bit++) {
      if ((currByte & (0x01 << (25 - 1))) != 0) {
        currByte <<= 1;
        currByte ^= 0x0a618db;
      } else {
        currByte <<= 1;
      }
    }
    crcTable[divident] = currByte & 0x1ffffff;
  }

  // Calculate the CRC value
  let crc25 = 0x1ffffff;
  for (let i = 0; i < strBytes.length; i++) {
    let lookupIndex = (crc25 ^ strBytes[i]) & 0xff;
    crc25 = (crc25 >> 8) ^ crcTable[lookupIndex];
  }

  // Finalize the CRC-32 value by inverting all the bits
  crc25 ^= 0x1ffffff;
  return crc25;
}
