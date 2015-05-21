var gulp = require('gulp');
var exec = require('child_process').exec;

var paths = {
  scripts: ['common/models/*.js', 'test/*.js']
};

gulp.task('bdd', function (cb) {
  exec('npm test', function (err, stdout, stderr) {
    if(err) return cb(err);
    console.log('STDOUT:',stdout)
    console.log('STDERR:',stderr)
    cb();
  })
});

gulp.task('default', function() {
  gulp.watch(paths.scripts, ['bdd']);
});