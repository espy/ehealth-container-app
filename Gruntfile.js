/*eslint-env node */

'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-atom-shell-app-builder');

  // Define the configuration for all the tasks
  grunt.initConfig({
    'build-atom-shell-app': {
      options: {
        platforms: ['darwin', 'win32', 'linux'],
        app_dir: 'app'
      }
    },
    clean: ['build']
  });

  grunt.registerTask('default', [
    'clean',
    'build-atom-shell-app'
  ]);

};
