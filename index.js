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
    console.log('Servidor corriendo en el puerto 3000');
});

//importamos el modulo os
const os = require('os');

//ahora mostraremos la plataforma
//de la maquina donde esta corriendo Node JS
console.log('La plataforma es: ' + os.platform());

//la release de la maquina
console.log('La release es: ' + os.release());

//la memoria ram libre de la maquina 
console.log('Memoria Ram Libre: ' + os.freemem());

//la memoria Ram total de la maquina
console.log('Memoria total: ' + Number.parseFloat(os.totalmem()/1024**3).toFixed(2), 'GB');
