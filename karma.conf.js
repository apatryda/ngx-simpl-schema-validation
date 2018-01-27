process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    browsers: ['ChromeHeadless'],
    files: [
      'src/**/*.ts',
    ],
    frameworks: ['mocha', 'karma-typescript'],
    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        transforms: [
          require("karma-typescript-angular2-transform"),
        ]
      },
      compilerOptions: {
        lib: ["es2017", "dom"],
      },
    },
    preprocessors: { '**/*.ts': 'karma-typescript' },
    reporters: ['progress', 'karma-typescript'],
  });
};
