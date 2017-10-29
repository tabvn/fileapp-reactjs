import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import multer from 'multer'
import path from 'path';

import {connect} from "./database";
import AppRouter from './router'
import nodemailer from 'nodemailer'
import {smtp} from './config'

// Setup Email

let email = nodemailer.createTransport(smtp);


// File storage config

const storageDir = path.join(__dirname, '..', 'storage');

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storageDir)
    },
    filename:  (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storageConfig });

// End file storage config

const PORT = 3000;
const app = express();
app.server = http.createServer(app);


app.use(morgan('dev'));


app.use(cors({
    exposedHeaders: "*"
}));

app.use(bodyParser.json({
    limit: '50mb'
}));


app.set('root', __dirname);
app.set('storageDir', storageDir);
app.set('upload', upload);
app.email = email;

//Connect to the database.

connect((err, db) => {

    if(err){
        console.log("An error connecting to the database", err);
        throw (err);
    }

    app.set('db', db);


    // init routers.
    new AppRouter(app);


    app.server.listen(process.env.PORT || PORT, () => {
        console.log(`App is running on port ${app.server.address().port}`);
    });

});



export default app;