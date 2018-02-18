// SauceLabs unit tests setup.

module.exports = function gruntConfig(grunt) {
  var browsers = [
    { browserName: 'chrome', version: '63.0', platform: 'Windows 10' },
    { browserName: 'firefox', version: '58.0', platform: 'Windows 10' },
    { browserName: 'safari', version: '8.0', platform: 'OS X 10.10' },
    { browserName: 'MicrosoftEdge', version: '14.14393', platform: 'Windows 10' },
    { browserName: 'internet explorer', version: '11.0', platform: 'Windows 8.1' },
    { browserName: 'internet explorer', version: '10.0', platform: 'Windows 8' },
    { browserName: 'internet explorer', version: '9.0', platform: 'Windows 7' }
  ];
  var testURL = 'http://127.0.0.1:9999/test/test.html';
  var cdnURL = 'https://unpkg.com/';
  var reactPaths = [
    ['react@15.6.2/dist/react.min.js',
      'react-dom@15.6.2/dist/react-dom.min.js'],
    ['react@16.2.0/umd/react.production.min.js',
      'react-dom@16.2.0/umd/react-dom.production.min.js']
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
          testname: 'unit tests',
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
