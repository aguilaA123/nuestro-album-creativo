// --- MENÚ LATERAL ---
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("abierto");
}
document.addEventListener("click", function (e) {
  const menu = document.getElementById("menu");
  const menuIcon = document.querySelector(".menu-icon");
  if (!menu.contains(e.target) && !menuIcon.contains(e.target)) {
    menu.classList.remove("abierto");
  }
});
function redirigirEditarPerfil() {
  window.location.href = "/perfil";
}

// --- TEMPORIZADOR AMOR ---
const tiempoEl = document.getElementById("tiempo");
const fechaInicio = new Date("2023-09-25T00:00:00");
function actualizarTiempo() {
  const ahora = new Date();
  const diff = ahora - fechaInicio;
  const segundos = Math.floor(diff / 1000) % 60;
  const minutos = Math.floor(diff / (1000 * 60)) % 60;
  const horas = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const años = ahora.getFullYear() - fechaInicio.getFullYear();
  const meses = ahora.getMonth() - fechaInicio.getMonth() + años * 12;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30;
  tiempoEl.textContent = `${Math.floor(meses / 12)} años ${meses % 12} meses ${dias} días ${horas}h ${minutos}min ${segundos}s`;
}
actualizarTiempo();
setInterval(actualizarTiempo, 1000);

// --- HORA ---
const horaPeru = document.getElementById("horaPeru");
const horaEspana = document.getElementById("horaEspana");
function actualizarHoras() {
  const ahora = new Date();
  const horaES = ahora.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' });
  const horaPE = new Date(ahora.getTime() - 5 * 60 * 60 * 1000).toLocaleTimeString("es-PE", { hour: '2-digit', minute: '2-digit' });
  horaPeru.textContent = `Hora: ${horaPE}`;
  horaEspana.textContent = `Hora: ${horaES}`;
}
actualizarHoras();
setInterval(actualizarHoras, 1000);

// --- CLIMA FIJO (sin API para Perú) ---
document.getElementById("climaPeru").textContent = "Clima: 18° ☁️";

// --- FIREBASE + API para Tormenta España ---
const firebaseConfig = {
  apiKey: "AIzaSyBhGxuS88U0UgGYfcLkricEXKv8lIQm2aU",
  authDomain: "wolf-streaming.firebaseapp.com",
  projectId: "wolf-streaming",
  storageBucket: "wolf-streaming.firebasestorage.app",
  messagingSenderId: "892543202823",
  appId: "1:892543202823:web:29262419377d78491a5ca2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const alertaTormenta = document.getElementById("alertaTormenta");
const climaEspana = document.getElementById("climaEspana");
const API_KEY = "2b03a6be43f93c0c1fbab1da976f8810";
const emojisClima = {
  Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Drizzle: "🌦️", Thunderstorm: "⛈️",
  Snow: "❄️", Mist: "🌫️", Smoke: "💨", Haze: "🌫️", Dust: "🌪️", Fog: "🌁",
  Sand: "🏜️", Ash: "🌋", Squall: "💨", Tornado: "🌪️"
};

function mostrarAlerta(mensaje) {
  alertaTormenta.textContent = mensaje;
}

async function cargarClimaEspana() {
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Torrelavega&appid=${API_KEY}&units=metric&lang=es`);
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const estado = data.weather[0].main;
    const icono = emojisClima[estado] || "🌈";
    climaEspana.textContent = `Clima: ${temp}° ${icono}`;
    if (estado === "Thunderstorm") {
      mostrarAlerta("España: Alerta de tormenta (moderado)");
    } else {
      mostrarAlerta("");
    }
  } catch {
    climaEspana.textContent = "Clima: No disponible";
    mostrarAlerta("");
  }
}

function verificarAlertaManual() {
  db.collection("estadoAlerta").doc("alertaManual").onSnapshot(doc => {
    const data = doc.data();
    if (doc.exists && data.estado === "On") {
      mostrarAlerta("España: Alerta de tormenta (moderado)");
      climaEspana.textContent = "Clima: 20° ⛅";
    } else {
      cargarClimaEspana(); // Solo si está en "Off"
    }
  });
}
verificarAlertaManual();
setInterval(() => verificarAlertaManual(), 10 * 60 * 1000); // Refresca cada 10 min
