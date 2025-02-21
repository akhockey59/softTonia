const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'djb3win6n',
  api_key: '755978859161753',
  api_secret: 'c7sJ4mLS3vo3oKHmhGDiIroomQs'
});

module.exports = cloudinary; 