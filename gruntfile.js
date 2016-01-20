module.exports = function (grunt) {

    var path = {
        src: 'static',
        templateSrc: 'templates',
        dest: 'dist',
        tmp: '.tmp'
    };
    // Project configuration.
    grunt.initConfig({
        path: path,
        clean: {
            beforebuild: {
                files: [{
                    src: ['<%= path.dest %>/',
                        '<%= path.tmp %>/']
                }
                ]
            },
            afterbuild: {
                files: [{
                    src: ['<%= path.dest %>/list.js',
                        '<%= path.dest %>/styles.css',
                        '<%= path.dest %>/style',
                        'styles/main.css',
                        'js/template.js',
                        '<%= path.tmp %>/']
                }
                ]
            }
        },
        /*ngtemplates: {
            src: 'templates/!**.html',
            dest: 'dist/js/template.js',
            options: {
                usemin: '<%= path.dest %>/js/main.js'
            }
        },*/
        /*sprite: {
         all: {
         src: ['<%= path.src %>/images/icon/!*.png'],
         dest: '<%= path.src %>/images/icons.png',
         destCss: '<%= path.src %>/styles/icons.css',
         padding: 2
         }
         },*/
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "styles/main.css": "styles/main.less" // destination file and source file
                }
            }
        },
        preprocess: {
            options: {},
            multifile: {
                files: {
                    '<%= path.dest %>/index.html': 'index.html',
                    '<%= path.dest %>/login.html': 'login.html'
                }
            }
        },
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: '',
                    src: ['index.html', 'login.html'],
                    dest: '<%= path.dest %>/'
                }, {
                    expand: true,
                    cwd: 'images/',
                    src: ['**'],
                    dest: '<%= path.dest %>/images'
                }, {
                    expand: true,
                    cwd: 'styles/',
                    src: ['login.css'],
                    dest: '<%= path.dest %>/styles'
                },
                {
                    expand: true,
                    cwd: 'templates/',
                    src: ['**'],
                    dest: '<%= path.dest %>/templates'
                }
                ]
            }
        },
        /*cssmin: {
         target: {
         files: {
         '<%= path.dest %>/styles/login.css': ['styles/login.css']
         }
         }
         },*/
        useminPrepare: {
            build: {
                src: ['index.html', 'login.html'],
                options: {
                    dest: '<%= path.dest %>/'
                }
            }
        },
        rev: {
            options: {
                algorithm: 'sha512',
                length: 16
            },
            build: {
                files: {
                    src: ['<%= path.dest %>/js/**.js',
                        '<%= path.dest %>/styles/*.css',
                        '<%= path.dest %>/image/*.png']
                }
            }
        },
        usemin: {
            html: {
                files: [{
                    src: ['<%= path.dest %>/index.html', '<%= path.dest %>/login.html']
                }
                ]
            },
            css: {
                files: [{
                    src: ['<%= path.dest %>/styles/*.css']
                }
                ]
            },
            js: {
                files: [{
                    src: ['<%= path.dest %>/js/main.js', '<%= path.dest %>/js/vendor.js', '<%= path.dest %>/js/login.js']
                }
                ]
            }
        }
    });

    // 加载插件
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build-less', ['less']);
    grunt.registerTask('image', ['sprite']);
    grunt.registerTask('vue', ['uglify']);
    // 默认被执行的任务列表。
    grunt.registerTask('list', ['sprite']);
    grunt.registerTask('default', ['clean:beforebuild', 'less', 'copy:build', 'useminPrepare', /*'ngtemplates',*/
        'concat', 'cssmin', 'uglify', 'preprocess', 'rev', 'usemin', 'clean:afterbuild']);

};