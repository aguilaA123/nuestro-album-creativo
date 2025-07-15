function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("abierto");
}

function redirigirEditarPerfil() {
  window.location.href = "user.html";
}

function confirmarDatos() {
  const correo = document.getElementById("correo").value.trim().toLowerCase();
  const fecha = document.getElementById("fecha").value;

  const correoCorrecto = "nuestro.album.creativo@gmail.com";
  const fechaCorrecta = "2023-09-25";

  if (correo === correoCorrecto && fecha === fechaCorrecta) {
    document.getElementById("popup").style.display = "none";
    document.getElementById("contenido").classList.remove("oculto");
    document.body.style.backgroundColor = "#fff0f5";
  } else {
    alert("Datos incorrectos. Inténtalo de nuevo o presiona la X para salir.");
  }
}

function copiarTexto(elemento) {
  const texto = elemento.textContent;
  navigator.clipboard.writeText(texto).then(() => {
    const mensaje = document.getElementById("mensaje-copiado");
    mensaje.classList.remove("oculto");

    setTimeout(() => {
      mensaje.classList.add("oculto");
    }, 3000);
  });
}

// Cierra menú al hacer clic fuera
document.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");
  const menuIcon = document.querySelector(".menu-icon");
  const isClickInside = menu.contains(e.target) || menuIcon.contains(e.target);
  if (!isClickInside) {
    menu.classList.remove("abierto");
  }
});

// Firebase config (asegúrate de tener esto en tu archivo o incluirlo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhGxuS88U0UgGYfcLkricEXKv8lIQm2aU",
  authDomain: "wolf-streaming.firebaseapp.com",
  projectId: "wolf-streaming",
  storageBucket: "wolf-streaming.firebasestorage.app",
  messagingSenderId: "892543202823",
  appId: "1:892543202823:web:29262419377d78491a5ca2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cargarCodigos() {
  const docRef = doc(db, "CodigosGoogle", "acceso");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const cuadros = document.querySelectorAll(".cuadro");
    let i = 0;

    for (let clave in data) {
      if (data.hasOwnProperty(clave) && cuadros[i]) {
        cuadros[i].textContent = data[clave];
        i++;
      }
    }
  } else {
    console.log("No se encontró el documento.");
  }
}

// Ejecutar cuando cargue la página
window.addEventListener("DOMContentLoaded", () => {
  cargarCodigos();
});


window.confirmarDatos = confirmarDatos;
window.toggleMenu = toggleMenu;
window.redirigirEditarPerfil = redirigirEditarPerfil;
window.copiarTexto = copiarTexto;