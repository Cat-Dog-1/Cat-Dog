// ===== Configuración de Karma =====
// Karma abre Chrome (sin ventana), carga las pruebas escritas con Jasmine
// (carpeta karma/) y muestra el resultado en la terminal.
// Se ejecuta con:  npm run test:karma

// babel-preset-react-app necesita saber en qué "ambiente" está
process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

const webpack = require("webpack");

module.exports = function (config) {
  config.set({
    // Jasmine = el idioma de las pruebas. webpack = junta los archivos y entiende JSX.
    frameworks: ["jasmine", "webpack"],

    // Archivos de prueba (terminan en .spec.js)
    files: [{ pattern: "karma/**/*.spec.js", watched: false }],

    // Antes de enviarlos al navegador, webpack los transforma (JSX → JavaScript)
    preprocessors: { "karma/**/*.spec.js": ["webpack"] },

    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: { loader: "babel-loader", options: { presets: [["react-app", { runtime: "automatic" }]] } },
          },
          { test: /\.css$/, use: ["style-loader", "css-loader"] },
        ],
      },
      resolve: { extensions: [".js", ".jsx"] },
      plugins: [new webpack.DefinePlugin({ "process.env": JSON.stringify({ NODE_ENV: "test" }) })],
    },

    reporters: ["progress"],
    browsers: ["ChromeHeadless"], // Chrome sin ventana
    singleRun: true,              // corre una vez y termina
  });
};
