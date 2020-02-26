document.addEventListener('DOMContentLoaded', functIniRank);

//variables

function functIniRank() {
    getRankings();
}

function getRankings() {
    let ajax = new XMLHttpRequest();
    let url = `http://localhost:3000/getrankings/`;

    ajax.open('GET', url, true);

    ajax.onreadystatechange = () => {
        //damos aviso en caso de no haber una conexion 
        if (ajax.status == 0) {
            console.log("No se pudo conectar con el servidor");
        }
        //comprobamos la correcta conexion con el servidor
        if (ajax.status == 200 && ajax.readyState == 4) {
            let arrayRankings = JSON.parse(ajax.responseText);
            if (arrayRankings.bandera) {
                pintaRanking(arrayRankings.inf)
            }
        }
    }
    ajax.send();
}

//funcion que pinta los rergistros del raning de puntaje
function pintaRanking(infoRanking) {
    let bodyScore = document.getElementById('filasScore');
    //eliminamos las filas exstentes
    eliminaRa(bodyScore.getElementsByTagName('tr'))
    //recorremos la informacion
    for (let i = 0; i < infoRanking.length; i++) {
        //creamos fila
        let tr = document.createElement('tr');
        if (infoRanking[i].indicejuego == -1) {
            tr = pintaScoreVacio(tr, i);
        } else {
            tr = pintaScore(tr, infoRanking[i], i);
        }
        //agregamos la fila al body
        bodyScore.append(tr);
    }
}

//funcion que elimina los objetos de la tabla ranking
function eliminaRa(trs) {
    for (let i = trs.length - 1; i >= 0; i--) {
        trs[i].remove();
    }
}

//funcion que pinta una fila sin score 
function pintaScore(tr, info, i) {
    //creamos columna de numero
    let tdNum = document.createElement('td');
    tdNum.innerHTML = i + 1;
    tr.append(tdNum);
    //creamos columna de nombre
    let tdNombre = document.createElement('td');
    tdNombre.innerHTML = info.nombre;
    tr.append(tdNombre);
    //creamos columna de clicks
    let tdClicks = document.createElement('td');
    tdClicks.innerHTML = info.clics;
    tr.append(tdClicks);
    //creamos columna de tiempo
    let tdSinScore = document.createElement('td');
    tdSinScore.innerHTML = formatTiempo(info.tiempo);
    tr.append(tdSinScore);
    //retornamos le objeto tr
    return tr;
}

//funcion que pinta una fila con score 
function pintaScoreVacio(tr, i) {
    //creamos columna de numero
    let tdNum = document.createElement('td');
    tdNum.innerHTML = i + 1;
    //creamos columna de numero
    let tdSinScore = document.createElement('td');
    tdSinScore.innerHTML = 'Sin puntaje';
    tdSinScore.colSpan = 3;
    //se los agregamos a la fila
    tr.append(tdNum);
    tr.append(tdSinScore);
    //retornamos le objeto tr
    return tr;
}

//funcion que concatena un array de tiempo
function formatTiempo(tiempo) {
    let seg = ((tiempo.seg < 10) ? '0' + tiempo.seg : tiempo.seg);
    let min = ((tiempo.min < 10) ? '0' + tiempo.min : tiempo.min);
    let hr = ((tiempo.hr < 10) ? '0' + tiempo.hr : tiempo.hr);
    //retornamos la cadena
    return `${hr}:${min}:${seg}`;
}

//funcion que valida si un score entra en el ranking
function compRanking(tiempo, clicks) {

    let ajax = new XMLHttpRequest();
    let url = `http://localhost:3000/chekranking/`;

    ajax.open('POST', url, true);
    //seteamos los datos a ernviar
    let datos = {
        "tiempo": tiempo,
        "clics": clicks
    };

    ajax.onreadystatechange = () => {
        //damos aviso en caso de no haber una conexion 
        if (ajax.status == 0) {
            console.log("No se pudo conectar con el servidor");
        }
        //comprobamos la correcta conexion con el servidor
        if (ajax.status == 200 && ajax.readyState == 4) {
            let response = JSON.parse(ajax.responseText);
            setModal(response, datos);
        }
    }
    //setamos la cabecera y enviamos el request
    ajax.setRequestHeader('Content-Type', 'application/json');
    ajax.send(JSON.stringify(datos));
}

//funcion que setea el modal con la ifnormacion del html
function setModal(info, datos) {
    let modal = document.getElementsByClassName('modal-content').item(0);
    let modalContent = document.getElementById('modalMensaje');
    //ahora le pintamos la informaccion
    modalContent.innerHTML = info.html;
    //agregamos las clases para que se vean por pantalla
    modal.classList.add('modal-content-prueba');
    modalContent.classList.add('modal');
    //seteamos los datos del scrore
    document.getElementById('iniHid').value = JSON.stringify(datos);
}

//funcion que setea el modal con la ifnormacion del html
function hideModal() {
    let modal = document.getElementsByClassName('modal-content').item(0);
    let modalContent = document.getElementById('modalMensaje');
    //retiramos las clases para que no se vean por pantalla
    modal.classList.remove('modal-content-prueba');
    modalContent.classList.remove('modal');
}

//funcion que guarda el puntaje
function guardaPuntaje() {
    let modalMensaje = document.getElementById('sinNombre');
    let inputNom = document.getElementById('nombreJugador');
    if (inputNom.value.trim() == "") {
        modalMensaje.classList.remove('hidden');
    } else {
        modalMensaje.classList.add('hidden');
        sendScore(inputNom.value);
    }
}

//funcion que envia el nuevo score para ser guradado
function sendScore(nombre) {
    let ajax = new XMLHttpRequest();
    let url = 'http://localhost:3000/setscore';
    let gifCarga = document.getElementById('gifCargaModal');

    ajax.open('POST', url, true);

    ajax.onloadstart = () => {
        //mostramos el gif de carga
        gifCarga.classList.remove('hidden');
        //descativamos el input
        let inputNom = document.getElementById('nombreJugador');
        inputNom.setAttribute('disabled', 'true');
        //descativamos el boton de guardar
        let btn = document.getElementById('btnGuarda');
        btn.setAttribute('disabled', 'true');
    };

    ajax.onreadystatechange = () => {
        if (ajax.status == 200 && ajax.readyState == 4) {
            console.log(ajax.responseText);
            //ocultamos la carga
            gifCarga.classList.add('hidden');
            //comprobamos la respuesta 
            if (ajax.responseText != -1) {
                //reiniciamos el juego
                reiniciarJuego();
                //escondemos el modal
                hideModal();
                //cargamos la tabla de score de nuevo
                getRankings();
            } else {
                console.log('error al guardar el nuevo puntaje')
            }
        }
    }
    //seteamos cabecera y enviamos info
    ajax.setRequestHeader('Content-Type', 'application/json');
    ajax.send(JSON.stringify(scoreC(nombre)));

}

//funcion que crea un score para se guardado
function scoreC(nombre) {
    let info = JSON.parse(document.getElementById('iniHid').value);
    const score = {
        "tiempo": info.tiempo,
        "clics": info.clics,
        "nombre": nombre
    }
    console.log(score);
    return score;
}

function formatNum(num) {
    return ((num < 10) ? "0" + num : num);
} 
