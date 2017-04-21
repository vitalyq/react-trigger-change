// SauceLabs unit tests setup.

module.exports = function gruntConfig(grunt) {
  var browsers = [
    { browserName: 'chrome', version: '57.0', platform: 'Windows 10' },
    { browserName: 'firefox', version: '52.0', platform: 'Windows 10' },
    { browserName: 'safari', version: '10.0', platform: 'macOS 10.12' },
    { browserName: 'MicrosoftEdge', version: '14.14393', platform: 'Windows 10' },
    { browserName: 'internet explorer', version: '11.103', platform: 'Windows 10' },
    { browserName: 'internet explorer', version: '10.0', platform: 'Windows 7' },
    { browserName: 'internet explorer', version: '9.0', platform: 'Windows 7' }
  ];

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
          urls: [
            'http://127.0.0.1:9999/test/test.html'
          ],
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
