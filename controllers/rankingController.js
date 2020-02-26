/* --Plantilla de un Score--
    var score = {
    "idRank": id,
    "tiempo": {
        "seg": seg,
        "min": min,
        "hr": hr
    },
    "clics": clicks,
    "nombre": "nombre"
} */

//constantes 
const fs = require('fs');

//variables
var { ranking } = require('../model/rankingModel');
var rankings = null;

//funcion que lee el archivo
function getRanking() {
    try {
        rankings = JSON.parse(fs.readFileSync('./bd/rankingBD.json'));
    } catch (error) {
        console.log('Error al leer el archivo =>', error);
        rankings = -1;
    }
}

//funcion que escirbe el archivo
function setRanking() {
    try {
        let data = JSON.stringify(rankings);
        fs.writeFileSync('./bd/rankingBD.json', data);
    }
    catch (err) {
        console.log('Error al guardar el archivo =>', err);
    }
}

//funcion que verifica si un ranking esta entre los 10
function checkRanking(tiempo, clicks) {
    let indexEnc = -1;
    let indiceJuego = -1;
    try {
        //creamos variables
        let seg = Number.parseInt(tiempo.seg);
        let min = Number.parseInt(tiempo.min);
        let hr = Number.parseInt(tiempo.hr);
        let totalT = seg + (min * 60) + (hr * 3600);
        let totalV1 = totalT * clicks;
        //traemos el ranking del archivo
        getRanking();
        if (rankings !== -1) {
            //leemos el ranking
            for (let i = 0; i < rankings.ranking.length; i++) {
                //comparamos los indices
                let totalV2 = rankings.ranking[i].indicejuego;
                //index menor 
                if (totalV1 <= totalV2 || totalV2 == -1) {
                    indexEnc = i;
                    indiceJuego = totalV1;
                    break;
                }
            }
        }
        return [indexEnc, indiceJuego];
    }
    catch (err) {
        console.log('Error al momento de verificar un score nuevo =>', err);
        return [indexEnc, indiceJuego];
    }
}

//funcion que comprueba y setea si un score entra en el ranking 
function setScoreRanking(score) {
    try {
        //miramos si el puntaje entra dentro de los 10 
        let checkindex = checkRanking(score.tiempo, score.clics);
        if (checkindex[0] != -1) {
            //seteamos el id del score y el index de los rankings
            let ultId = rankings.indexID + 1;
            score.idRank = ultId;
            rankings.indexID = ultId;
            //seteamos el id del score
            score.idRank = ultId;
            //seteamos el indice del juego al objeto
            score.indicejuego = checkindex[1];
            //ingresamos el score en la posicion que le corresponde
            rankings.ranking.splice(checkindex[0], 0, score);
            //borramos el ultimo objeto, (el score 11)
            rankings.ranking.splice(10, 1);
            //guardamos el arreglo de score en el archivo
            setRanking();
            return checkindex[0] + 1;
        } else {
            console.error("Error al tratar de guardar el score nuevo");
            return -1;
        }

    } catch (err) {
        console.error("Error al tratar de guardar el score nuevo =>", err);
    }
};

//funcion uq enos tre un listado de todos los score en el ranking
function getScoreRanking() {
    try {
        getRanking();
        return (rankings != -1)
            ? {
                "bandera": true,
                "inf": rankings.ranking
            }
            : {
                "bandera": false,
                "inf": null
            };
    } catch (err) {
        console.log("Error al traer todos los puntajes =>", err);
    }
}

//exportamos el modulo 
module.exports = {
    "checkRanking": checkRanking,
    "setScoreRanking": setScoreRanking,
    "getScoreRanking": getScoreRanking
};