import fs from 'fs';
const buffer = fs.readFileSync('public/images/fan.png');
console.log('File size:', buffer.length);
