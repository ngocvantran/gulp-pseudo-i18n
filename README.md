# [gulp](http://gulpjs.com)-pseudo-i18n

> Generate Pseudo translation using [node-pseudo-i18n](https://github.com/maxnachlinger/node-pseudo-l10n)

## Install

Install with [npm](https://npmjs.org/package/gulp-pseudo-i18n)

```
npm install --save-dev gulp-pseudo-i18n
```

## Example

```
var gulp = require('gulp');
var pseudo = require('gulp-pseudo-i18n');

gulp.task('pseudo', function () {
    return gulp.src('localize/**/*.pot')
        .pipe(pseudo({
            // optional parameters to pass to node-pseudo-l10n
        }))
        .pipe(gulp.dest('po/'));
});