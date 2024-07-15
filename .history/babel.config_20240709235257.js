module.exports = function (api) {
  api.cache(true);

  const presets = [
    "@babel/preset-env", // Configura Babel para compilar JavaScript moderno a una versión compatible con los navegadores específicados.
    "@babel/preset-react", // Permite a Babel compilar JSX a JavaScript estándar.
  ];

  const plugins = [
    "@babel/plugin-transform-optional-chaining", // Habilita la transformación de encadenamiento opcional.
    // Otros plugins que puedas necesitar
  ];

  return {
    presets,
    plugins,
  };
};
