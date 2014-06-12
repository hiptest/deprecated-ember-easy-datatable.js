module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.initConfig({
    qunit: {
      all: ['tests/index.html']
    }
  });
}