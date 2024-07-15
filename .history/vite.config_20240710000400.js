// babel.config.js
module.exports = function(api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-react',
  ];

  const plugins = [
    '@babel/plugin-transform-optional-chaining',
    // Otros plugins que puedas necesitar
  ];

  return {
    presets,
    plugins,
  };
};
