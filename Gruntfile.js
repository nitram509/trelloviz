/*global module:false*/
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
       '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
       '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
       '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
       ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: [
          'src/app/js/Trelloviz.js',
          'src/app/js/TrellovizCoreEngine.js',
          'src/app/js/knockout.binding/color_picker.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    copy: {
      develop: {
        files: [
          {expand: true, cwd: 'src/', src: ['app/js/**/*.*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, cwd: 'src/', src: ['app/css/**/*.*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, cwd: 'src/', src: ['js/**/*.*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, cwd: 'src/', src: ['css/**/*.*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, cwd: 'src/', src: ['img/**/*.*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, cwd: 'src/', src: ['partials/**/*.*'], dest: 'dist/', filter: 'isFile'},
          {expand: true, cwd: 'src/', src: ['*.html'], dest: 'dist/', filter: 'isFile'},
        ]
      }
    },

    less: {
      develop: {
        options: {
          paths: ["src/app/css"],
          compress: false,
          yuicompress: false
        },
        files: {
          "dist/app/css/trelloviz.css": "src/app/css/trelloviz.less"
        }
      },
      release: {
        options: {
          paths: ["src/app/css"],
          compress: true,
          yuicompress: true
        },
        files: {
          "dist/app/css/trelloviz.css": "src/app/css/trelloviz.min.less"
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      // define the files to lint
//      files: [
//        'gruntfile.js',
//        'src/**/*.js',
//        'test/**/*.js'
//      ],
      gruntfile: {
        src: [
          'Gruntfile.js',
          '<%= concat.dist.src %>'
        ]
      },
      lib_test: {
        src: [
          'src/app/**/*.js',
          'test/**/*.js'
        ]
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      src: {
        files: ['src/**'],
        tasks: ['default']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('default', [ 'concat', 'copy:develop', 'less:develop']);

};
