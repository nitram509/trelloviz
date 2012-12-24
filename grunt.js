module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-targethtml');

  // Project configuration.
  grunt.initConfig({

    pkg: '<json:package.json>',

//    lint: {
//      all: ['trelloviz.js', 'src/js/*.js', 'assets/js/**/*.js',  'test/js/*.js']
//    },

//    jshint: {
//      options: {
//        browser: true
//      }
//    },

    min: {
      dist: {
        src: [
          'src/app.js',
          'src/utils.js',
          'src/register.js',
          'src/templates/compiled.js',
          'src/setup.js'
        ],
        dest: 'dist/<%= pkg.name %>.modules.min.js'
      }
    },

//    mincss: {
//      dist: {
//        files: {
//          'dist/css/': [
//            "assets/css/bootstrap-responsive.css",
//            "assets/css/bootstrap.css",
//            "assets/css/colorPicker.css"
//          ]
//        }
//      }
//    },

    copy: {
      dist: {
        files: {
          'dist/css/': "assets/css/**/*.css",
          'dist/js/': "assets/js/**/*.js",
          'dist/img/': "assets/img/**/*.*"
        }
      },
      develop: {
        files: {
          'dist/js/': "src/js/**/*.*"
        }
      }
    },

    meta: {
      banner: '/* <%= pkg.name %>\n' +
          '* <%= pkg.homepage %> \n' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %>' +
          ' <%= pkg.author.name %>\n' +
          '* Licensed under AGPLv3. */'
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
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    targethtml: {
      dist: {
        src: 'src/index.html',
        dest: 'dist/index.html'
      }
    },

    clean: {
      dist: ['dist/**/*.*']
    }
  });

  // Default task.
  grunt.registerTask('default', 'clean:dist targethtml copy:dist copy:develop');
  grunt.registerTask('release', 'clean:dist min concat mincss targethtml copy');
};