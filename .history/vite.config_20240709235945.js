import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "@rollup/plugin-babel";

export default defineConfig({
  plugins: [
    react(), // Plugin de React para Vite
    babel({
      babelHelpers: "bundled", // Opciones de Babel
      exclude: "node_modules/**", // Excluir node_modules por defecto
      // Aquí puedes añadir más opciones según tu configuración específica
    }),
  ],
});
