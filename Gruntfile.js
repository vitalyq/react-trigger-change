// SauceLabs unit tests setup.

module.exports = function gruntConfig(grunt) {
  var browsers = [
    { browserName: 'chrome', version: '57.0', platform: 'Windows 10' },
    { browserName: 'firefox', version: '52.0', platform: 'Windows 10' },
    { browserName: 'safari', version: '10.0', platform: 'macOS 10.12' },
    { browserName: 'MicrosoftEdge', version: '14.14393', platform: 'Windows 10' },
    { browserName: 'internet explorer', version: '11.0', platform: 'Windows 8.1' },
    { browserName: 'internet explorer', version: '10.0', platform: 'Windows 8' },
    { browserName: 'internet explorer', version: '9.0', platform: 'Windows 7' }
  ];
  var testURL = 'http://127.0.0.1:9999/test/test.html';
  var cdnURL = 'https://unpkg.com/';
  var reactPaths = [
    ['react@0.14.9/dist/react.js', 'react-dom@0.14.9/dist/react-dom.js'],
    ['react@0.14.9/dist/react.min.js', 'react-dom@0.14.9/dist/react-dom.min.js'],
    ['react@15.5.4/dist/react.js', 'react-dom@15.5.4/dist/react-dom.js'],
    ['react@15.5.4/dist/react.min.js', 'react-dom@15.5.4/dist/react-dom.min.js'],
    ['react@16.0.0-alpha.10/umd/react.development.js',
      'react-dom@16.0.0-alpha.10/umd/react-dom.development.js'],
    ['react@16.0.0-alpha.10/umd/react.production.min.js',
      'react-dom@16.0.0-alpha.10/umd/react-dom.production.min.js']
  ];
  var urls = reactPaths.map(function mapPaths(path) {
    return testURL + '?react=' + cdnURL + path[0] + '&dom=' + cdnURL + path[1];
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          base: '',
          port: 9999
        }
      }
    },
    'saucelabs-mocha': {
      all: {
        options: {
          urls: urls,
          browsers: browsers,
          build: process.env.TRAVIS_JOB_ID,
          testname: 'Mocha Unit Tests',
          throttled: 5,
          sauceConfig: {
            recordVideo: false,
            recordScreenshots: false,
            tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
          },
          tunneled: false
        }
      }
    },
    watch: {}
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-saucelabs');

  grunt.registerTask('default', ['connect', 'saucelabs-mocha']);
};
