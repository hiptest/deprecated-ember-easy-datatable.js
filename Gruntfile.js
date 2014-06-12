module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    qunit: {
      files: ['tests/index.html']
    },
    jshint: {
      all: ['src/*.js']
    }
  });

  grunt.registerTask('default', 'jshint');
  grunt.registerTask('travis', ['jshint',  'qunit']);
}