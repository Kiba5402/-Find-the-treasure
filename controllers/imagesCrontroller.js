//constantes
//const fs = require('fs');

//variables
//var imagen = require('../model/imagesModel');
var { clave, imagenes } = require('../bd/imagesBD.json');

//funcion que crea coordenadas aleatoria para x Y y
function coordRandom(x, y) {
    return {
        "coorX": Math.ceil(Math.random() * x),
        "coorY": Math.ceil(Math.random() * y)
    };
}

//funcion que comprueba la distancia del click con la coordenada del tesoro
function compruebaDist(xT, yT, xC, yC) {
    if (xT != undefined && yT != undefined && xC != undefined && yC != undefined) {
        distX = Number.parseInt(xT) - Number.parseInt(xC);
        distY = Number.parseInt(yT) - Number.parseInt(yC);
        distTotal = (distX ** 2 + distY ** 2) ** (1 / 2);
        return verificaTesoro(distTotal);
    } else {
        return "datos incompletos";
    }
}

//funcion que devuleve un mensaje segun lo cerca que este el click del tesoro
function verificaTesoro(dist) {
    if (dist <= 100) {
        return 0;
    } else if (dist < 30) {
        return 1;
    } else if (dist < 80) {
        return 2;
    } else if (dist < 150) {
        return 3;
    } else {
        return 4;
    }
}


//exportamos el modulo 
module.exports = {
    //metodo para traer todas la imagenes
    "traerImagenes": () => {
        return imagenes;
    },
    //metodo para traer un aimagen por su id
    "traerImagen": (id, x, y) => {
        for (let i = 0; i < imagenes.length; i++) {
            if (imagenes[i].ID == id) {
                return imagenes[i];
            }
        }
    },
    //metodo que genera las coordenadas aleatorias dle tesoro
    "getCoor": (x, y) => {
        return coordRandom(x, y);
    },
    //metodo que comprueba lña distancia de los puntos 
    "compDist": (xT, yT, xC, yC) => {
        return compruebaDist(xT, yT, xC, yC);
    }
};




