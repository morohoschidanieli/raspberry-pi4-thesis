module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            main: {
                src: [
                    'ui-src/js/*.js',
                    'ui-src/js/**/*.js',
                    'ui-src/js/***/*.js',
                    'ui-src/js/****/*.js',
                ],
                dest: 'ui/js/main.js',
                options: {
                    separator: '\n\n',
                    interrupts: true
                }
            },
        },

        sass: {
            main: {
                src: [
                    'ui-src/css/main.scss'
                ],

                dest: 'ui/css/style.css'
            }
        },

        watch: {
            js: {
                files: [
                    'ui-src/js/*.js',
                    'ui-src/js/**/*.js',
                    'ui-src/js/***/*.js',
                    'node-modules/sass-rem/*.scss'
                ],

                tasks: ['concat']
            },

            sass: {
                files: [
                    'ui-src/css/*.scss',
                    'ui-src/css/**/*.scss',
                    'ui-src/css/**/**/*.scss',
                    'ui-src/css/**/**/**/*.scss'
                ],

                tasks: ['sass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['watch']);
};