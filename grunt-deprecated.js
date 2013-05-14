module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-targethtml');

  // Project configuration.
  grunt.initConfig({

    pkg: '<json:package.json>',


    clean: {
      dist: {
        src : ['dist/**/*.*']
      }
    },


    copy: {
      develop: {
        files: {
          'dist/app/js/': "src/app/js/**/*.*",
          'dist/js/': "src/js/**/*.js",
          'dist/css/': "src/css/**/*.css",
          'dist/img/': "src/img/**/*.*"
        }
      },
      release: {
        files: {
          'dist/js/': "src/js/**/*.js",
          'dist/img/': "src/img/**/*.*"
        }
      }
    },


    targethtml: {
      develop: {
        src: 'src/index.html',
        dest: 'dist/index.html'
      },
      release: {
        src: 'src/index.html',
        dest: 'dist/index.html'
      }
    },


    mincss: {
      dist: {
        files: {
          'dist/css/trelloviz.min.css': [
            "src/css/bootstrap.css",
            "src/css/bootstrap-responsive.css",
            "src/css/colorPicker.css"
          ]
        }
      }
    },


    meta: {
      banner: '/* <%= pkg.name %> <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n' +
         '* <%= pkg.homepage %> \n' +
         '* Copyright (c) <%= grunt.template.today("yyyy") %>' +
         ' <%= pkg.author.name %>\n' +
         '* Licensed under Apache License, Version 2.0 */'
    },


    min: {
      dist: {
        src: [
          'src/app/js/Trelloviz.js',
          'src/app/js/TrellovizCoreEngine.js',
          'src/app/js/knockout.binding/color_picker.js'
        ],
        dest: 'dist/js/trelloviz.modules.min.js'
      }
    },


    concat: {
      dist: {
        src: [
          '<banner>',
//          'lib/modernizr.min.js',
//          'lib/underscore.min.js',
//          'lib/backbone.min.js',
          '<config:min.dist.dest>'
        ],
        dest: 'dist/js/trelloviz.min.js'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'clean copy:develop targethtml:develop');
  grunt.registerTask('release', 'clean copy:release targethtml:release mincss min concat');

};