if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
} 

const express  = require('express');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
require('./database');

app.set('port', process.env.PORT || 4000);

// middlewares
app.use(morgan('dev'));
app.use(cors());

const storage = multer.diskStorage({
    destination:  ( req, file, cb) => {
    	cb(null, (path.join(__dirname, 'public/uploads')))
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    },
    fileFilter:  (req, file, cb) => {
    if (path.extname(file.originalname) !== '.jpg' || path.extname(file.originalname) !== '.jpeg' || path.extname(file.originalname) !== '.png') {
      return cb(new Error('Only jpg, jpeg and png are allowed'))
    }
    cb(null, true)
  }
});



app.use(multer({storage}).single('image'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/post'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// start the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});