var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    bump = require('gulp-bump'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jasmine = require('gulp-jasmine'),
    prompt = require('prompt'),
    git = require('gulp-git'),
    wait = require('gulp-wait'),
    concat = require('gulp-concat'),
    removeLogs = require('gulp-removelogs'),
    header = require('gulp-header'),
    banner = ['/*!', ' * <%= pkg.name %>', ' * @version v<%= pkg.version %>', ' * @link <%= pkg.homepage %>', ' * @license <%= pkg.license %>', ' */\n\n'].join("\n"),
    testCode, code, buildDist;


/*
  Test Tool. This function can be ran at command line by:
    `gulp test`

  It will compile coffeescript jasmine tests and run them
 */

testCode = function(){
  gulp.src('./tests/*.js')
    .pipe(jasmine()); // Run jasmine tests
};


/*
  Default Gulp Task. Can be ran via the following commands.
    ```bash
      gulp
      gulp code
    ```

  This will watch any changes on files within src
    Then run jshint and test the code

 */

code = function(){
  gulp.watch(['src/*', 'tests/*'], function(){
    gulp.src('src/*.js')
      .pipe(jshint()) // JSHint
      .pipe(jshint.reporter('default'));

    testCode();
  });
};


/*
  Build Tools. This function can be ran at command line by:
    `gulp build --type STRING`

  It will run a jslint, code test, version bump,
    uglifyier, minifiyer, console.log remover, script header.

  @params (String) build bump ammount
    major = first number = 1.0.0
    minor = second number = 0.1.0
    patch = third number = 0.0.1

  @params (BashArg) --release Optional.
    If this is passed, it will push the code to github
    and create a release.
 */


gulp.task('bump', function(){
  var bumpTypes = ['major', 'minor', 'patch'],
      bumpType = gutil.env.type, stream;


  if (!bumpType) {
    console.log("\nYou must pass a build bump type [major, minor, patch]");
    console.log("\n\n   gulp build --type patch\n");
    return;
  }

  // Check if type matches a needed bump version
  if (bumpTypes.lastIndexOf(bumpType.toLowerCase()) == -1) {
    return console.log("\nInvalid build type. Must be major, minor, or patch\n");
  }


  stream = gulp.src('./bower.json')
    .pipe(bump({ type: bumpType.toLowerCase() }))
    .pipe(gulp.dest('./'));

  stream = gulp.src('./package.json')
    .pipe(bump({ type: bumpType.toLowerCase() }))
    .pipe(gulp.dest('./'));


  return stream;
});



buildDist = function(){
  var pkg, tagName;


  pkg = require('./bower.json');


  gulp.src(['vendor/promise-polyfill.js', 'src/*.js'])
    .pipe(removeLogs())
    .pipe(concat('hp-prefill.js'))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('dist'));

  // Add information for minified version of the polyfill
  banner += ['/*!', ' * @overview es6-promise', ' * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)', ' * @version 2.0.0', ' * @license MIT', " **/\n\n"].join("\n")

  // Build Minified and unminified Javascript
  gulp.src(['vendor/promise-polyfill.js', 'src/*.js'])
    .pipe(concat('hp-prefill.min.js'))
    .pipe(removeLogs())
    .pipe(uglify()) // Uglify && Minify
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('dist'));





  // Create Github Release
  if (gutil.env.release) {
    tagName = "v" + pkg.version;

    gulp.src('./')
      .pipe(wait(2000))
      .pipe(git.add())
      .pipe(git.commit("[RELEASE: "+ pkg.version +"]" + pkg.name + " " + Date.now()))
      .pipe(git.push('origin', 'master'))
      .pipe(git.tag(tagName, pkg.version + "Release"))
      .pipe(git.push('origin', tagName));
  }

};



/*
  Bash Implementations.
 */

gulp.task('default', code);
gulp.task('code', code);
gulp.task('build', ['bump'], buildDist);
gulp.task('test', testCode);
