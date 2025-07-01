import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhGxuS88U0UgGYfcLkricEXKv8lIQm2aU",
  authDomain: "wolf-streaming.firebaseapp.com",
  projectId: "wolf-streaming",
  storageBucket: "wolf-streaming.appspot.com",
  messagingSenderId: "892543202823",
  appId: "1:892543202823:web:29262419377d78491a5ca2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const puntoEstado = document.getElementById("puntoEstado");
const estadoRef = doc(db, "configuracion", "acceso");

// Indicador de estado
onSnapshot(estadoRef, (docSnap) => {
  const estado = docSnap.data().estado;
  puntoEstado.classList.toggle("verde", estado === "On");
  puntoEstado.classList.toggle("rojo", estado !== "On");
});

// Login
const loginForm = document.querySelector(".login-form");
const mensajeError = document.getElementById("mensajeError");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const estadoSnap = await getDoc(estadoRef);
  const estadoActual = estadoSnap.data().estado;

  try {
    const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
    let accesoPermitido = false;

    usuariosSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.usuario === username && data.contraseña === password) {
        sessionStorage.setItem("usuarioActivo", doc.id);
        accesoPermitido = true;

        setTimeout(() => {
          if (data.rol === "admin") {
            window.location.href = "admin.html";
          } else if (data.rol === "amor" && estadoActual === "On") {
            window.location.href = "amor/";
          } else if (estadoActual === "On") {
            window.location.href = "user.html";
          } else {
            mensajeError.textContent = "Acceso correcto, pero la web está en mantenimiento.";
            animarMensajeError();
          }
        }, 1000); // 🕐 Delay de 1 segundo para animación
      }
    });

    if (!accesoPermitido) {
      mensajeError.textContent = "Usuario o contraseña incorrectos.";
      animarMensajeError();
    }

  } catch (err) {
    console.error(err);
    mensajeError.textContent = "Error de conexión con el servidor.";
    animarMensajeError();
  }
});

// Animación del mensaje de error
function animarMensajeError() {
  mensajeError.classList.remove("error-pop", "visible");
  void mensajeError.offsetWidth; // Reinicia animación
  mensajeError.classList.add("error-pop", "visible");

  setTimeout(() => {
    mensajeError.classList.remove("error-pop", "visible");
    mensajeError.textContent = ""; // Limpia el texto para evitar parpadeos
  }, 2000); // ⏱️ Dura 2 segundos y desaparece
}

