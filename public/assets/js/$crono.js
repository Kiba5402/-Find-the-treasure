//declaracion de variables
var seg = 0;
var min = 0;
var hora = 0;
var timeOut;
var bandIni = false;
var cronoFlag = 0;

function inicarCrono() {
    if (cronoFlag == 0) {
        inicarConteo();
        cronoFlag = 1;
    }
}

//funcion para iniciar cronometro
function inicarConteo() {
    timeOut = setTimeout(() => {
        //sumamos un segundo
        seg++;
        //si ya hay 60 segundos sumamos minuto
        if (seg == 60) {
            seg = 0;
            min++;
        }
        //si ya hay 60 minutos sumamos hora
        if (min == 60) {
            min = 0;
            hora++;
        }
        //pintamos el cronograma
        pintarCrono();
        inicarConteo();
    }, 1000);
}

//funcion para detener cronometro
function detenerCrono() {
    clearTimeout(timeOut);
    cronoFlag = 0;
}

//funcion que resetea el cronometro
function resetCrono() {
    //detenemos el conteo
    detenerCrono();
    //reseteamos a 0 en html
    document.getElementById('horaCro').innerHTML = '00:';
    document.getElementById('minCro').innerHTML = '00:';
    document.getElementById('segCro').innerHTML = '00';
    //reseteamos bandera
    cronoFlag = 0;
    //reseteamos variables
    seg = 0;
    min = 0;
    hora = 0;
}

//funcion para pintar cronometro
function pintarCrono() {
    //traemos lo sobjetos crono del DOM
    let $horas = document.getElementById('horaCro');
    let $minutos = document.getElementById('minCro');
    let $segundos = document.getElementById('segCro');
    //modificamos su contenido
    $horas.innerHTML = ((hora < 10) ? `0${hora}:` : `${hora}:`);
    $minutos.innerHTML = ((min < 10) ? `0${min}:` : `${min}:`);
    $segundos.innerHTML = ((seg < 10) ? `0${seg}` : `${seg}`);
}

//funcion que regresa un arreglo con el tiempo corrido
function getTiempo() {
    return {
        "seg": seg,
        "min": min,
        "hr": hora
    }
}