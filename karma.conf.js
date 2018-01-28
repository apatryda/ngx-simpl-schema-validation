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
          require('karma-typescript-angular2-transform'),
        ]
      },
      compilerOptions: {
        declaration: true,
        downlevelIteration: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        lib: [
          'es2017',
          'dom'
        ],
        module: 'commonjs',
        moduleResolution: 'node',
        noImplicitAny: true,
        sourceMap: true,
        target: 'es5',
        typeRoots: [
          'node_modules/@types'
        ]
      },
      include: [
        'declarations.d.ts',
        'src/**/*',
      ],
    },
    preprocessors: { '**/*.ts': 'karma-typescript' },
    reporters: ['progress', 'karma-typescript'],
  });
};
