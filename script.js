document.addEventListener("DOMContentLoaded", () => {
  let modoCronometro = false;
  let tiempoInicio = 0;
  let tiempoActual = 0;
  let tiempoFinal = 0;
  let intervaloCronometro = 0;
  const tablero = document.getElementById("tablero");
  const intentosSpan = document.getElementById("intentos");
  var intentos = 0; //contador de intentos
  var paresEncontrados = 0; //contador de pares
  const imagenes = ["🐱", "🐶", "🦊", "🐰"]; //imágenes para las cartas con íconos, array

  //duplicamos para hacer los pares
  var cartas = [...imagenes, ...imagenes];

  //variables para el control del juego
  var primeraCarta = null; //guarda la primera carta que se voltea
  var segundaCarta = null; //guarda la segunda carta
  var bloqueoTablero = false; //evita que el jugador voltee más de dos cartas

  function crearTablero() {
    cartas.sort(() => Math.random() - 0.5); // Mezclamos antes de crear las cartas
    cartas.forEach((imagen) => {
      //crea un nuevo elemento div, que será una carta:
      const carta = document.createElement("div");
      //estilo css
      carta.classList.add("carta");
      //definimos su contenido: 2 divs, uno la cara trasera y otro la parte frontal
      carta.innerHTML = ` <div class="cara trasera">${imagen}</div><div class="cara"></div>`;

      carta.addEventListener("click", () => clickCarta(carta));

      tablero.appendChild(carta);
  
    });
  }

  function iniciarJuego() {
    // 🔥 Reiniciamos variables sin necesidad de una función extra
    intentos = 0;
    paresEncontrados = 0;
    bloqueoTablero = false;
    primeraCarta = null;
    segundaCarta = null;
    intentosSpan.textContent = intentos;
    barajarCartas();
    //detenemos cronometro
    clearInterval(intervaloCronometro); // 💥 Aquí detenemos el cronómetro
    document.getElementById("cronometroVisible").textContent = "00:00";
    modoCronometro = false;
  
    console.log("Modo cronómetro:", modoCronometro);
    //  tablero.innerHTML = ""; //Limpia el tablero antes de agregar cartas nuevas
    //     cartas.sort(() => Math.random() - 0.5); //reordena elementos del array con aleatoriedad
  }

  function clickCarta(carta) {
    // si bloqueoTablero es TRUE, impide que el usuario interactúe
    // si la carta ya está volteada tambie´n bloquea el click
    if (bloqueoTablero || carta.classList.contains("volteada")) return;

    //añade la clase "volteada" , activa la animación de volteo de css
    carta.classList.add("volteada");

    //logica de emparejamiento de cartas
    if (!primeraCarta) {
      // si la primera carta está vacía se guarda la primera carta
      primeraCarta = carta;
    } else {
      // si ya hay primera carta, la segunda carta se guarda y se activa el bloqueo del tablero
      segundaCarta = carta;
      bloqueoTablero = true;
    }
    //Comprobar si son iguales:
    // Si ambas cartas son iguales
    if (primeraCarta.innerHTML === segundaCarta.innerHTML) {
      primeraCarta = null; //se limpian
      segundaCarta = null;
      bloqueoTablero = false; // se habilita le tablero
      //se quedan volteadas

      // contador de pares encontrados:
      paresEncontrados++; //esta variable no se muestra al usuario (todavía), no tiene innerhtml o span
      console.log("pares encontrados : ", paresEncontrados);

      //vericación de victoria:
      if (paresEncontrados === cartas.length / 2) {
        //llamar a funcion de mostrar victoria
        console.log("pares encontrados : ", paresEncontrados);
        console.log("bloqueoTablero : ", bloqueoTablero);
        mostrarVictoria();
      }
    } else {
      //Si no coinciden
      setTimeout(() => {
        // se espera un segundo
        primeraCarta.classList.remove("volteada"); //se eliminan las clases volteadas
        segundaCarta.classList.remove("volteada");
        primeraCarta = null; // se reestablecen las variables
        segundaCarta = null;
        bloqueoTablero = false;
      }, 1000);
    }
    //si agrego acá los intentos, contabiliza un intentao cada dos cartas volteadas
    intentos++;
    intentosSpan.textContent = intentos;
  }

  function barajarCartas() {
    cartas.sort(() => Math.random() - 0.5);
    let cartasDOM = document.querySelectorAll(".carta");
    cartasDOM.forEach((carta, index) => {
      carta.classList.remove("volteada"); // Desvoltear
      carta.querySelector(".trasera").textContent = cartas[index]; // Actualizar imagen
    });
  }

  document
    .getElementById("activarTiempo")
    .addEventListener("click", function () {
      // Detener si ya hay un intervalo corriendo (reinicio)
      //  clearInterval(intervaloCronometro);

      // Aquí se activa el cronómetro ⏱️ que llama a actualizarCronometro() cada 1000ms
      //Sólo se activa si está limpia la partida para iniciar, es decir, si intentos = 0
      if (intentos == 0){
        modoCronometro = true;
        tiempoInicio = Date.now();
        intervaloCronometro = setInterval(tiempo, 1000);
      } else {
        alert("Reinicia el juego para iniciar el cronómetro")
        modoCronometro = false;
      }
      
      console.log("IntervaloCronometro:", intervaloCronometro);
      console.log("Modo cronómetro:", modoCronometro);
    });

  //actualizamos tiempo visible
  function tiempo() {
    const ahora = Date.now();
    const tiempoTranscurrido = Math.floor((ahora - tiempoInicio) / 1000);

    // document.getElementById("cronometroVisible").textContent = `Tiempo: ${tiempoTranscurrido} s`;
    const cronometroElemento = document.getElementById("cronometroVisible");

    if (cronometroElemento) {
      cronometroElemento.textContent = `Tiempo: ${tiempoTranscurrido}s`;
    }
  }

  function mostrarVictoria() {
    //document.getElementById("textoVictoria").textContent = `Ganaste en ${intentos} intentos!`; //personalización

    // 🎵 Reproducir sonido de victoria
    const sonidoVictoria = new Audio("assets/sounds/spin.mp3");
    sonidoVictoria.play();

    // 🎉 Lluvia de confetti
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
    });



    let tiempoSegundos = 0;
    // ⭐ Calculamos las estrellas
    const estrellas = calcularEstrellas(
      intentos,
      tiempoSegundos,
      modoCronometro
    );

    //Mostrar las estrellas
    const estrellasDiv = document.getElementById("resultadosEstrellas");
    estrellasDiv.innerHTML =
      "☆🌟".repeat(estrellas) + "☆".repeat(3 - estrellas);

    //Mensaje condicional según variables
    if (modoCronometro==true) {
      tiempoFinal = Date.now();
      clearInterval(intervaloCronometro); // 💥 Aquí detenemos el cronómetro
      

      tiempoSegundos = Math.floor((tiempoFinal - tiempoInicio) / 1000);
      mensaje = `Ganaste en ${intentos} intentos y ${tiempoSegundos} segundos!`;
    } else {
      mensaje = `Ganaste en ${intentos} intentos!`;
    }

    // const mensaje = modoCronometro
    //   ? `Ganaste en ${intentos} intentos y ${tiempoSegundos} segundos!`
    //   : `Ganaste en ${intentos} intentos!`;

    document.getElementById("textoVictoria").textContent = mensaje;

    document.getElementById("modalVictoria").style.display = "block"; // al ganar cambia el display a block y el modal es visible
  }

  //cierra el modal, fuera de la función de apertura
  document.getElementById("cerrarModal").addEventListener("click", function () {
    document.getElementById("modalVictoria").style.display = "none";
  });

  //Reinicia partida
  document.getElementById("reiniciar").addEventListener("click", iniciarJuego);

  // Iniciar la primera partida al cargar la página
  crearTablero();
  iniciarJuego();
});

//Calcular puntaje según variables, devuelve cantidad de estrellas
function calcularEstrellas(intentos, tiempoSegundos, modoCronometro) {
  let estrellas = 0;

  if (modoCronometro == false) {
    //sin modo cronometro, solo evaluar intentos
    if (intentos <= 7) estrellas = 3;
    else if (intentos <= 14) estrellas = 2;
    else estrellas = 1;
  } else {
    //con cronometro activado, evaluar intentos + tiempo
    if (intentos <= 12 && tiempoSegundos <= 60) estrellas = 3;
    else if (intentos <= 16 && tiempoSegundos <= 90) estrellas = 2;
    else estrellas = 1;
  }

  return estrellas;
}

// Mejoras a realizar
// 1 implementar nuevas funcionalidades
//  ok  - Pop-up de victoria con texto dinámico que muestre el número de intentos al ganar.
// ok Con efectos de celebración. confetti y sonido!
//  - Entrega de estrellas o puntaje según el desempeño del jugador.
//  ok  - Botón de reinicio para empezar una nueva partida sin recargar la página. -> función de reinicio partida
//  ok - Opcionalidad de cronómetro, activable con un botón:
//  ok - Si está activado, el tiempo influye en la cantidad de puntos o estrellas obtenidas.
//  - Si está desactivado, el jugador puede jugar sin presión de tiempo.
//  - Efectos visuales y de sonido para hacer el juego más atractivo (animaciones al voltear cartas, sonido al hacer match, etc.).
//  - Transición suave al ganar en lugar de solo reiniciar el tablero abruptamente.
//  - Mejoras en la interfaz para hacerla más atractiva y clara (botones más visibles, colores llamativos, animaciones sutiles).
// 2 revisar la estructura, elementos bien organizado y css
// 3 elementos graficos y detalles visuales
// 4 optimizar

//ok -  agregar al modal el tiempo que se demoró y la cantidad de pares encontrados
//ok -  por corregir, el reinicio debe volver a cero el cronometro
//ok - Falta función en que se detiene el cronometro
//ok -  cronometro debe ser igual a tiempo que indica que gana, ahora indica dos tiempos distinto
