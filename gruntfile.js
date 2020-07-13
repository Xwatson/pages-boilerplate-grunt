const loadGruntTasks = require('load-grunt-tasks')
const bsServer = require('browser-sync').create()

module.exports = grunt => {
  let data = {
    menus: [
      {
        name: 'Home',
        icon: 'aperture',
        link: 'index.html'
      },
      {
        name: 'About',
        link: 'about.html'
      }
    ],
    pkg: require('./package.json'),
    date: new Date()
  }
  grunt.initConfig({
    // 清除文件
    clean: ['.temp/**', 'dist/**'],
    // 处理sass
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/assets/styles',
            src: ['*.scss'],
            dest: '.temp/assets/styles',
            ext: '.css'
          }
        ]
      }
    },
    // 压缩js
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          '.temp/assets/scripts/vendor.js': ['node_modules/jquery/dist/jquery.js', 'node_modules/popper.js/dist/umd/popper.js', 'node_modules/bootstrap/dist/js/bootstrap.js'],
        }
      }
    },
    // 压缩css
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          '.temp/assets/styles/vendor.css': ['node_modules/bootstrap/dist/css/bootstrap.css']
        }
      }
    },
    // 处理js
    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/assets/scripts',
            src: ['*.js'],
            dest: '.temp/assets/scripts',
            ext: '.js'
          }
        ]
      }
    },
    // 处理图片/字体
    imagemin: {
      dynamic: {
        files: [
          {
            expand: true,
            cwd: 'src/assets/images',
            src: ['**/*.{png,jpg,jpeg,gif,svg}'],
            dest: '.temp/assets/images'
          },
          {
            expand: true,
            cwd: 'src/assets/fonts',
            src: ['**'],
            dest: '.temp/assets/fonts'
          }
        ]
      }
    },
    // 处理html
    web_swig: {
      options: {
        swigOptions: {
          cache: false
        },
        getData: function (tpl) {
          return data
        }
      },
      your_target: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: ['**/*.html', '*.html'],
            dest: '.temp'
          }
        ]
      },
    },
    copy: {
      public: {
        files: [
          {
            expand: true,
            cwd: 'public',
            src: ['**'],
            dest: 'dist'
          }
        ]
      },
      temp: {
        files: [
          {
            expand: true,
            cwd: '.temp',
            src: ['**'],
            dest: 'dist/'
          }
        ]
      }
    },
    useref: {
      html: '.temp/*.html',
      temp: '.temp'
    },
    // 服务
    browserSync: {
      default_options: {
        bsFiles: {
          src: ['.temp/**']
        },
        options: {
          notify: false,
          port: 3001,
          server: {
            baseDir: ['.temp', 'src', 'public'],
            routes: {
              '/node_modules': 'node_modules',
            },
          },
        }
      }
    },
    // 监听任务
    watch: {
      styles: {
        files: ['src/assets/styles/**.scss'],
        tasks: ['sass'],
        options: {
          interrupt: true,
        },
      },
      scripts: {
        files: ['src/assets/scripts/**.js'],
        tasks: ['babel'],
        options: {
          interrupt: true,
        },
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['web_swig'],
        options: {
          interrupt: true,
        },
      }
    },
  })
  loadGruntTasks(grunt)
  // 公共编译任务
  grunt.registerTask('compile', ['sass', 'babel', 'web_swig'])

  // 开发任务
  grunt.registerTask('dev', ['clean', 'compile', 'browserSync'])

  // 上线任务
  grunt.registerTask('build', ['clean', 'compile', 'imagemin', 'uglify', 'cssmin', 'useref', 'copy'])

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action)
  })

}
