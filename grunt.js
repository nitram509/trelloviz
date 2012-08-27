module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    'closure-compiler': {
      frontend: {
        closurePath: '/src/to/closure-compiler',
        js: 'static/src/frontend.js',
        jsOutputFile: 'static/js/frontend.min.js',
        options: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT'
        }
      }
    }
  });

  // ******************************************************************
  grunt.loadTasks('/~/AppData/Roaming/npm/node_modules/grunt-closure-compiler'); // windows structure ;-)
  //grunt.loadNpmTasks('grunt-closure-compiler');

  // ******************************************************************
  // Default task.
  grunt.registerTask('default', 'closure-compiler');

};