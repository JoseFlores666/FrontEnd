import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from '@rollup/plugin-babel';

export default defineConfig({
  plugins: [
    react(), // Plugin de React para Vite
    babel({
      babelHelpers: 'bundled', // Incluir helpers de Babel en el bundle
      exclude: 'node_modules/**', // Excluir node_modules por defecto
    }),
  ],
});
