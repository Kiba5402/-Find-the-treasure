//constantes
const express = require('express');
const app = express();
const morgan = require('morgan');
const router = require('./router/router');
const bodyParser = require('body-parser');

//configuracion
app.set('views', './views/html');
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//middleware
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(router);

//ruta principal
app.use('/', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.send('asdasd');
});

//inicializando el servidor
app.listen(app.get('port'), () => {
    console.log('Servidor corriendo en el puerto', app.get('port'));
});

