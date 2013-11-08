module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: ['src/dummy.js', 'src/util.js', 'src/buttonUtil.js', 'src/jquery.textae.js', 'src/textae.js'],
        dest: 'js/textae.js',
      }
    },
    watch: {
      files: 'src/*.js',
      tasks: 'concat'
    },
    qunit: {
      all: 'test/util.html'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
};