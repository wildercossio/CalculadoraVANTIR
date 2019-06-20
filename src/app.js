const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');

//import routes
const routesApp = require('./routes/routesApp');

//settings
app.set('port', process.env.PORT ||3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs')
//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
//routes
app.use('/', routesApp);

//starting the server
app.listen(app.get('port'),()=>{
    console.log(`Server on port ${app.get('port')}`);
});
