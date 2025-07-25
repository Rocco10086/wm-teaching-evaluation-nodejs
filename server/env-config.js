// eslint-disable-next-line no-unused-vars
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const fileName = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const filePath = path.resolve(__dirname, '../', fileName);
dotenv.config({ path: filePath });
