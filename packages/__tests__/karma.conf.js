const path = require('path');
const webpack = require('webpack');

const basePath = path.resolve(__dirname);

const commonChromeFlags = [
  '--no-default-browser-check',
  '--no-first-run',
  '--no-managed-user-acknowledgment-check',
  '--disable-background-timer-throttling',
  '--disable-backing-store-limit',
  '--disable-boot-animation',
  '--disable-cloud-import',
  '--disable-contextual-search',
  '--disable-default-apps',
  '--disable-extensions',
  '--disable-infobars',
  '--disable-translate'
];

module.exports = function (config) {
  let browsers;
  if (process.env.BROWSERS) {
    browsers = [process.env.BROWSERS];
  } else if (config.browsers) {
    browsers = config.browsers;
  } else {
    browsers = ['Chrome'];
  }

  const options = {
    basePath,
    frameworks: [
      'source-map-support',
      'mocha',
      'chai',
    ],
    files: [
      'dist/build/__tests__/setup-browser.js',
    ],
    preprocessors: {
      ['dist/build/__tests__/setup-browser.js']: [
        'webpack',
        'sourcemap',
      ],
      ['dist/build/__tests__/*/**/*.js']: [
        'sourcemap',
      ],
    },
    webpack: {
      mode: 'none',
      resolve: {
        extensions: [
          '.ts',
          '.js',
        ],
        modules: [
          'dist',
          'node_modules'
        ],
        mainFields: [
          'module',
        ],
      },
      devtool: 'inline-source-map',
      performance: {
        hints: false,
      },
      optimization: {
        namedModules: false,
        namedChunks: false,
        nodeEnv: false,
        usedExports: true,
        flagIncludedChunks: false,
        occurrenceOrder: false,
        sideEffects: true,
        concatenateModules: true,
        splitChunks: {
          hidePathInfo: false,
          minSize: Infinity,
          maxAsyncRequests: Infinity,
          maxInitialRequests: Infinity,
        },
        noEmitOnErrors: false,
        checkWasmTypes: false,
        minimize: false,
      },
      module: {
        rules: [
          {
            test: /\.js\.map$/,
            use: ['ignore-loader'],
          },
          {
            test: /\.js$/,
            use: ['source-map-loader'],
            enforce: 'pre',
          },
        ]
      }
    },
    mime: {
      'text/x-typescript': ['ts']
    },
    reporters: [config.reporter || (process.env.CI ? 'min' : 'progress')],
    browsers: browsers,
    customLaunchers: {
      ChromeDebugging: {
        base: 'Chrome',
        flags: [
          ...commonChromeFlags,
          '--remote-debugging-port=9333'
        ],
        debug: true
      },
      ChromeHeadlessOpt: {
        base: 'ChromeHeadless',
        flags: [
          ...commonChromeFlags
        ]
      }
    },
    client: {
      captureConsole: true,
      mocha: {
        bail: config['bail'],
        ui: 'bdd'
      }
    }
  };

  if (config.coverage) {
    options.webpack.module.rules.push({
      enforce: 'post',
      exclude: /(node_modules|\.spec\.ts$)/,
      loader: 'istanbul-instrumenter-loader',
      options: { esModules: true },
      test: /node_modules[\/\\]@aurelia[\/\\].+\.js$/
    });
    options.reporters = ['coverage-istanbul', ...options.reporters];
    options.coverageIstanbulReporter = {
      reports: ['html', 'text-summary', 'json', 'lcovonly', 'cobertura'],
      dir: 'coverage'
    };
    options.junitReporter = {
      outputDir: 'coverage',
      outputFile: 'test-results.xml',
      useBrowserName: false
    };
  }

  config.set(options);
}
