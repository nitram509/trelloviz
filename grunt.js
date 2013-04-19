module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-targethtml');

  // Project configuration.
  grunt.initConfig({

    pkg: '<json:package.json>',


    clean: {
      dist: ['dist/**/*.*']
    },


    copy: {
      develop: {
        files: {
          'dist/js/': ["assets/js/**/*.js", "src/js/**/*.*"],
          'dist/css/': "assets/css/**/*.css",
          'dist/img/': "assets/img/**/*.*"
        }
      },
      release: {
        files: {
          'dist/js/': "assets/js/**/*.js",
          'dist/img/': "assets/img/**/*.*"
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
            "assets/css/bootstrap.css",
            "assets/css/bootstrap-responsive.css",
            "assets/css/colorPicker.css"
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
          'src/js/Trelloviz.js',
          'src/js/TrellovizCoreEngine.js',
          'src/js/knockout.binding/color_picker.js'
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