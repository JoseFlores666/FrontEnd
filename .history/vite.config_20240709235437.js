import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import babel from '@rollup/plugin-babel'; // Asegúrate de importar el plugin de babel

export default defineConfig({
  plugins: [
    react(),
    babel({ 
      babelHelpers: 'bundled', // Usa 'bundled' o 'runtime'
      exclude: 'node_modules/**' // Excluye node_modules de la transpilación si es necesario
    })
  ],
});
