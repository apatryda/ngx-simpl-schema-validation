module.exports = function(config) {
  config.set({
    files: [
      "declarations.d.ts",
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
