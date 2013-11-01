module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/dummy.js', 'src/util.js', 'src/textae.js'],
        dest: 'js/textae.js',
      }
    },
    watch: {
      files: 'src/*.js',
      tasks: 'concat'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
};