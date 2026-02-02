// src/config.ts
// Si existe la variable de entorno (Nube), úsala. Si no, usa localhost (Local).
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
