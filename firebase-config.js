// Copia aquí la configuración de tu proyecto Firebase (Firebase Console > Project settings > Your apps).
// No pongas claves privadas de cuentas de servicio en archivos del navegador.
export const firebaseConfig = {
  apiKey: "REEMPLAZAR_API_KEY",
  authDomain: "REEMPLAZAR_PROJECT_ID.firebaseapp.com",
  projectId: "REEMPLAZAR_PROJECT_ID",
  storageBucket: "REEMPLAZAR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "REEMPLAZAR_SENDER_ID",
  appId: "REEMPLAZAR_APP_ID"
};

export const isFirebaseConfigured = !Object.values(firebaseConfig).some(
  value => typeof value === "string" && value.startsWith("REEMPLAZAR_")
);
