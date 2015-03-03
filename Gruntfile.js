module.exports = function (grunt) {

  "use strict";

  // Project configuration.
  grunt.initConfig({

    pkg: '<json:package.json>',


    clean: {
      dist: ['dist/**/*.*']
    },


    copy: {
      develop: {
        files: [
          {expand: true, cwd: 'src/app/js', src: ['*.js'], dest: 'dist/app/js', filter: 'isFile'},
          {expand: true, cwd: 'src/js', src: ['*.js'], dest: 'dist/js', filter: 'isFile'},
          {expand: true, cwd: 'src/css', src: ['*.css'], dest: 'dist/css', filter: 'isFile'},
          {expand: true, cwd: 'src/img', src: ['*.*'], dest: 'dist/img', filter: 'isFile'}
        ]
      },
      release: {
        files: [
          {expand: true, cwd: 'src/js', src: ['**/*.js'], dest: 'dist/js', filter: 'isFile'},
          {expand: true, cwd: 'src/img', src: ['*.*'], dest: 'dist/img', filter: 'isFile'}
        ]
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


    cssmin: {
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


    uglify: {
      release: {
        options: {
          mangle: false,
          sourceMap: true
        },
        files: {
          'dist/js/trelloviz.min.js': [
            'src/app/js/Trelloviz.js',
            'src/app/js/TrellovizCoreEngine.js',
            'src/app/js/knockout.binding/color_picker.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-targethtml');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task.
  grunt.registerTask('default', ['clean', 'copy:develop', 'targethtml:develop']);
  grunt.registerTask('release', ['clean', 'copy:release', 'targethtml:release', 'cssmin', 'uglify']);
};