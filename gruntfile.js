const loadGruntTasks = require('load-grunt-tasks')

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
        swigOptions:{
          cache: false
        },
        getData: function(tpl){
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
    // 清除文件
    clean: ['.temp/**', 'dist/**'],
    useref: {
      html: '.temp/*.html',
      temp: 'dist'
  }
  })
  loadGruntTasks(grunt)

  grunt.registerTask('build', ['clean', 'sass', 'babel', 'imagemin', 'web_swig', 'useref'])

}
