document.addEventListener('DOMContentLoaded', functIni);

//variables
var coorX = null;
var coorY = null;
var clicks = 0;

function functIni() {
    getImages();
}

function getImages() {

    let ajax = new XMLHttpRequest();
    let url = `http://localhost:3000/getimages/`;

    ajax.open('GET', url, true);

    ajax.onreadystatechange = () => {
        //damos aviso en caso de no haber una conexion 
        if (ajax.status == 0) {
            console.log("No se pudo conectar con el servidor");
        }
        //comprobamos la correcta conexion con el servidor
        if (ajax.status == 200 && ajax.readyState == 4) {
            let arrayImages = JSON.parse(ajax.responseText);
            listaImages(arrayImages);
        }
    }

    ajax.send();
}

//funcion que enlista la imagenes disponibles en el select
function listaImages(dataImg) {
    //obj select 
    let slc = document.getElementById('slcImg');
    for (let i = 0; i < dataImg.length; i++) {
        //creamos el objeto y le asignamos us atributos
        let option = document.createElement("option");
        option.value = dataImg[i].ID;
        option.innerHTML = dataImg[i].nombre;
        //lo agregamos al select 
        slc.appendChild(option);
    }
    //despues de agregar la opciones habilitamos el select 
    slc.removeAttribute('disabled');
}

//funcion que trae y pinta una imagen segun su id
function getImage(slc) {
    if (slc.value != -1) {
        let gifCarga = document.getElementById('gifCarga');
        let ajax = new XMLHttpRequest();
        let url = `http://localhost:3000/getimages/${slc.value}`;

        //abrimos la conexion
        ajax.open('GET', url, true);

        //funcion que se ejecuta cuando inicia la peticion
        ajax.onloadstart = function () {
            gifCarga.style.display = 'inline';
        }

        //funcion que se ejecuta cuando hay un cambio en el estado de la peticion
        ajax.onreadystatechange = () => {
            //damos aviso en caso de no haber una conexion 
            if (ajax.status == 0) {
                console.log("No se pudo conectar con el servidor");
            }
            //carga completa
            if (ajax.status == '200' && ajax.readyState == '4') {
                let info = JSON.parse(ajax.responseText);
                let img = document.getElementById('imgJuego');
                img.setAttribute('src', info.link);
                gifCarga.style.display = 'none';
                //reiniciamos le juego
                reiniciarJuego()
            }
        }

        //enviamos la peticion
        ajax.send();
    }
}

//funcion que trae las coordenadas del tesoro
function getCoor(x, y) {
    let ajax = new XMLHttpRequest();
    let url = `http://localhost:3000/getcoor/${x}/${y}`;

    //abrimos la conexion
    ajax.open('GET', url, false);

    //funcion que se ejecuta cuando hay un cambio en el estado de la peticion
    ajax.onreadystatechange = () => {
        //damos aviso en caso de no haber una conexion 
        if (ajax.status == 0) {
            console.log("No se pudo conectar con el servidor");
        }
        //carga completa
        if (ajax.status == '200' && ajax.readyState == '4') {
            let info = JSON.parse(ajax.responseText);
            coorX = info.coorX;
            coorY = info.coorY;
        }
    }

    ajax.send();
}

//escucha de clic de la imagen
function clickImg(event) {
    //se inicia el cronometro en caso de ser el primer click
    inicarCrono();
    //aumentamos un lcick y lo pintamos 
    clicks++;
    pintaClick();
    //comprobamos a que distancia estamos del tesoro
    comprobarCoor(event.offsetX, event.offsetY);
}

//funcion que trae las coordenadas del tesoro
function comprobarCoor(offX, offY) {
    let ajax = new XMLHttpRequest();
    let url = `http://localhost:3000/compdist/`;
    let gifCarga = document.getElementById('gifCarga');

    //seteamos los datos a ernviar
    let datos = {
        "xT": coorX,
        "yT": coorY,
        "xC": offX,
        "yC": offY
    };

    //abrimos la conexion
    ajax.open('POST', url, true);

    //funcion que se ejecuta cuando inicia la peticion
    ajax.onloadstart = function () {
        gifCarga.style.display = 'inline';
        document.getElementById('imgJuego').removeEventListener('click', clickImg);
    }

    //funcion que se ejecuta cuando hay un cambio en el estado de la peticion
    ajax.onreadystatechange = () => {
        //damos aviso en caso de no haber una conexion 
        if (ajax.status == 0) {
            console.log("No se pudo conectar con el servidor");
        }
        //carga completa
        if (ajax.status == '200' && ajax.readyState == '4') {
            let info = JSON.parse(ajax.responseText);
            document.getElementById('imgJuego').addEventListener('click', clickImg);
            gifCarga.style.display = 'none';
            //seteamos la pista segun la distancia
            pista(info.distancia);
        }
    }

    //seteamos la cabecera y enviamos el request
    ajax.setRequestHeader('Content-Type', 'application/json');
    ajax.send(JSON.stringify(datos));
}

//funcion que cambia la apariencia del span de pista
function pista(estado) {
    let span = document.getElementById('spanPista');
    span.classList.remove('animacionGanar');
    switch (estado) {
        case -1:
            //cambiamos el texto de la pista
            span.innerHTML = "Da un clic en la imagen";
            span.style.color = "#FFCC00";
            span.style.backgroundColor = "#6600CC";
            break;
        case 0:
            //cambiamos el texto de la pista
            span.innerHTML = "Encontraste el Tesoro!";
            span.classList.add('animacionGanar');
            //quitamos el evento click de la imagen
            document.getElementById('imgJuego').removeEventListener('click', clickImg);
            //paramos el cronometro
            detenerCrono();
            //llamamos la funcion que valida el puntaje
            compRanking(getTiempo(), clicks);
            break;
        case 1:
            //cambiamos el texto de la pista
            span.innerHTML = "Caliente";
            span.style.color = "#FFCC00";
            span.style.backgroundColor = "#ff2c2c";
            break;
        case 2:
            //cambiamos el texto de la pista
            span.innerHTML = "Tibio";
            span.style.color = "#000";
            span.style.backgroundColor = "#ffb251";
            break;
        case 3:
            //cambiamos el texto de la pista
            span.innerHTML = "Frio";
            span.style.color = "#FFCC00";
            span.style.backgroundColor = "#2151ff";
            break;
        case 4:
            //cambiamos el texto de la pista
            span.innerHTML = "Muy Frio";
            span.style.color = "#FFCC00";
            span.style.backgroundColor = "#7e95e8";
            break;
        default:
            break;
    }
}

//funcion que pinta los clicks
function pintaClick() {
    let click = document.getElementById('conteoClicks');
    click.innerHTML = clicks;
}

//funcion que nos permite reiniciar el juego
function reiniciarJuego() {
    //traemos la imagen
    let img = document.getElementById('imgJuego');
    //quitamos la escucha de la imagen en caso de que exista
    img.removeEventListener('click', clickImg);
    //reseteamos el cronometro
    resetCrono();
    //resteamos los clicks
    clicks = 0;
    pintaClick();
    //cambiamos el estado de la pista
    pista(-1);
    //traemos las coordenadas del tesoro segun el tamaño de la imagen
    getCoor(img.width, img.height);
    //agregamos la escucha a la imagen
    img.addEventListener('click', clickImg);
}