import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
const usuarioID = sessionStorage.getItem("usuarioActivo");

async function cargarCuenta() {
  if (!usuarioID) return;
  const ref = doc(db, "usuarios", usuarioID);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    document.getElementById("cci").textContent = "CCI: " + (data.cci || "Sin CCI");
    document.getElementById("saldo").textContent = "S/ " + (data.saldo || "0.00");
  }
}

cargarCuenta();