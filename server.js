/**
* @function
* @author Emon Islam
* @name Billing created back end applications  
* @description Billing informations update , delete , and create
* @param {Number} PORT - Server Listen PORT
*/
require('dotenv').config()
const express = require('express');
const cors = require('cors')
const connectedDb = require('./config/db');
const PORT = process.env.PORT || 5000;
const app = express();
const { errorLog, errorHandlerNotify } = require('express-error-handle');
const userRoutes = require('./api/routes/userRoutes');
const billingRoutes =require('./api/routes/billingRoutes')
//all requrire routes
//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
//db connected
connectedDb()
//all apis
app.use('/api', [userRoutes,billingRoutes])
app.get('/', (req, res) => {
    res.status(200).send('Server connected Billing')
})

app.listen(PORT, () => {
    console.log('Sever Started on PORT', PORT)
})

//handel error
app.use(errorLog)
app.use(errorHandlerNotify)