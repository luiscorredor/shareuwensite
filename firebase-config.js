// Configuración de la aplicación web ShareU.
// Completa apiKey con el valor de Firebase Console antes de probar el registro.
export const firebaseConfig = {
  apiKey: "REEMPLAZAR_API_KEY",
  authDomain: "shareu-96e84.firebaseapp.com",
  projectId: "shareu-96e84",
  storageBucket: "shareu-96e84.firebasestorage.app",
  messagingSenderId: "552313986658",
  appId: "1:552313986658:web:b337efb3028b33371bfb3b",
  measurementId: "G-X6J37P0WDH"
};

export const isFirebaseConfigured = !Object.values(firebaseConfig).some(
  value => typeof value === "string" && value.startsWith("REEMPLAZAR_")
);
