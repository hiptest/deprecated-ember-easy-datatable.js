module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-qunit-istanbul');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.initConfig({
    concat: {
      dist: {
        src: [
          'src/utils.js',
          'src/highlighter.js',
          'src/keyboard.js',
          'src/editor.js',
          'src/orderer.js',
          'src/insert.js',
          'src/remove.js',
          'src/ember-easy-datatable.js'
        ],
        dest: 'dist/ember-easy-datatable.js',
        nonull: true,
      },
    },
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
      sources: {
        src: ['src/**/*.js']
      },
      tests: {
        options: {
          'debug': true,
        },
        src: ['tests/unit/*.js', 'tests/integration/*.js'],
      }
    }
  });

  grunt.registerTask('default', 'jshint');
  grunt.registerTask('travis', ['jshint:sources',  'qunit']);
};