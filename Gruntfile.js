module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-qunit-istanbul');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    qunit: {
      options: {
        coverage: {
          disposeCollector: true,
          src: ['src/*.js'],
          instrumentedFiles: 'temp/',
          lcovReport: 'report',
          linesThresholdPct: 95
        }
      },
      files: ['tests/index.html']
    },
    jshint: {
      source: {
        src: ['src/**/*.js']
      },
      tests: {
        options: {
          'debug': true,
        },
        src: ['tests/**/*.js'],
      }
    }
  });

  grunt.registerTask('default', 'jshint');
  grunt.registerTask('travis', ['jshint',  'qunit']);
};