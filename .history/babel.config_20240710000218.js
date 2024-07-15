module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // Para soporte adecuado de Node.js
        },
      },
    ],
    '@babel/preset-react',
  ];

  const plugins = [
    '@babel/plugin-transform-optional-chaining',
    // Agrega otros plugins según tus necesidades
  ];

  return {
    presets,
    plugins,
  };
};
