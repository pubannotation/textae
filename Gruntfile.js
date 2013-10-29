module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/dummy.js','src/textae.js'],
        dest: 'js/textae.js',
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
};