const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const docxToPDF = require('docx-pdf');
const path = require('path');
const fs = require('fs');
require('./Database/Connection')

const app = express();

// Enable CORS
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// File storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'upload/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// File conversion route
app.post('/convertFile', upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }

    // Define output file path
    const outputDir = path.join(__dirname, 'files');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const outputPath = path.join(outputDir, `${req.file.originalname}.pdf`);

    docxToPDF(req.file.path, outputPath, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: 'Error converting docx to pdf',
        });
      }
      res.download(outputPath, () => {
        console.log('File downloaded');
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
});

// Start server
app.listen(5400, () => {
  console.log('Your server is running on port 5400');
});







































// const express = require('express');
// const app = express();
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const docxToPDF = require('docx-pdf');
// const path = require('path');
// const fs = require('fs');

// // Middlewares
// app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Database connection
// require('./Database/Connection');

// // Welcome route
// app.get('/', (req, res) => {
//   res.send('<h1>Welcome to Node.js with Express backend</h1>');
// });

// // File storage setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = 'upload/';
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // File conversion route
// app.post('/convertFile', upload.single('file'), (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         message: 'No file uploaded',
//       });
//     }

//     // Define output file path
//     const outputDir = path.join(__dirname, 'files');
//     if (!fs.existsSync(outputDir)) {
//       fs.mkdirSync(outputDir);
//     }
//     const outputPath = path.join(outputDir, `${req.file.originalname}.pdf`);

//     docxToPDF(req.file.path, outputPath, (err, result) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({
//           message: 'Error converting docx to pdf',
//         });
//       }
//       res.download(outputPath, () => {
//         console.log('File downloaded');
//       });
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: 'Internal server error',
//     });
//   }
// });

// // Start server
// app.listen(5400, () => {
//   console.log('Your server is running on port 5400');
// });
