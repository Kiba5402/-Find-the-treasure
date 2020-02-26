/* constantes */
const express = require('express');
const router = express.Router();
const controlRanking = require('../controllers/rankingController');
const controlImage = require('../controllers/imagesCrontroller');

//rutas

//comprobar si un score entra en el ranking y en que posicion
router.post('/chekranking', (req, res) => {
    let tiempo = req.body.tiempo;
    let clics = req.body.clics;
    if (tiempo !== undefined && clics !== undefined) {
        let response = controlRanking.checkRanking(tiempo, clics);
        let datos = {
            "posicion": response[0],
            "clicks": clics,
            "tiempo": tiempo
        };
        //usamos la funcion render y en el callback podemos
        //utilizar la variable del html el cual es enviado 
        //por medio d el afuncion json
        res.render('modalScore.ejs', {
            "datos": datos
        }, (err, html) => {
            console.log(err);            
            res.json({
                "bandera": true,
                "html": html
            });
        });

    } else {
        res.json({
            "bandera": false,
            "msg": "Datos incompletos"
        });
    }

});

//setear un score entre el ranking en caso tal de entrar
router.post('/setscore', (req, res) => {
    let score = req.body;
    let response = controlRanking.setScoreRanking(score);
    res.json(response);
});

//traer todo el ranking de puntajes
router.get('/getrankings', (req, res) => {
    let response = controlRanking.getScoreRanking();
    res.json(response);
});

//traer el listado de imagenes disponibles
router.get('/getimages', (req, res) => {
    let response = controlImage.traerImagenes();
    res.json(response);
});

//traer una imagen segun su id
router.get('/getimages/:id', (req, res) => {
    let id = req.params.id;
    let response = controlImage.traerImagen(id);
    res.json(response);
});

//traer coordenadas aleatorias del tesoro
router.get('/getcoor/:x/:y', (req, res) => {
    let x = req.params.x;
    let y = req.params.y;
    let response = controlImage.getCoor(x, y);
    res.json(response);
});

//comprobar la distancia entre los puntos
router.post('/compdist', (req, res) => {
    let xT = req.body.xT;
    let yT = req.body.yT;
    let xC = req.body.xC;
    let yC = req.body.yC;
    let response = controlImage.compDist(xT, yT, xC, yC);
    res.json({
        "distancia": response
    });
});


//Exportar
module.exports = router;

