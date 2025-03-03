document.addEventListener("DOMContentLoaded", () => {
  const tablero = document.getElementById("tablero");
  const intentosSpan = document.getElementById("intentos");
  let intentos = 0;
  //imágenes para las cartas con íconos, array
  const imagenes = ["🐱", "🐶", "🦊", "🐰", "🐹", "🐸", "🐵", "🐺"];

  //duplicamos para hacer los pares
  let cartas = [...imagenes, ...imagenes];

  //reordena elementos del array con aleatoriedad
  cartas.sort(() => Math.random() - 0.5);

  //variables para el control del juego
  let primeraCarta = null; //guarda la primera carta que se voltea
  let segundaCarta = null; //guarda la segunda carta
  let bloqueoTablero = false; //evita que el jugador voltee más de dos cartas

  //crear el tablero de cartas dinámicamente
  cartas.forEach((imagen) => {
    //crea un nuevo elemento div, que será una carta:
    const carta = document.createElement("div");
    //estilo css
    carta.classList.add("carta");
    //definimos su contenido: 2 divs, uno la cara trasera y otro la parte frontal
    carta.innerHTML = ` <div class="cara trasera">${imagen}</div><div class="cara"></div>`;

    carta.addEventListener("click", () => {
      //añade una acción cuando la carta es clickeada

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
        // si agrego aquí los intentos, me cuenta cada vez que un par es encontrado.
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
    });
    tablero.appendChild(carta); // se agregan las caras al tablero
  });
});
