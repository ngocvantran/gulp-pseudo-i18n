[gulp](http://gulpjs.com)-pseudo-i18n
=====================================

> Generate Pseudo translation from GNU Gettext POT/PO files.

Install
-------

Install with [npm](https://npmjs.org/package/gulp-pseudo-i18n)

```
npm install --save-dev gulp-pseudo-i18n
```

Example
-------

```
var gulp = require('gulp');
var pseudo = require('gulp-pseudo-i18n');

gulp.task('pseudo', function () {
    return gulp.src('localize/**/*.pot')
        .pipe(pseudo({
            // optional parameters
        }))
        .pipe(gulp.dest('po/'));
});
```

The output file will be renamed to [Source filename without extension].[Language code].po, meaning `core.pot` with default language becomes `core.qps-ploc.po`.

Options
-------

* `language`: Language code for the generated file. Default: `qps-ploc`.
* `excludes`: Regular expression to detect parts of text that should be keep as-in. Default value excludes html tags (e.g. `<span>`) and AngularJS variables (e.g. `$count`).
* `charMap`: Custom charater map to create pseudo translation. Default: Map from [node-pseudo-l10n](https://github.com/maxnachlinger/node-pseudo-l10n).


Charater Map Example
-------------------

The following code

```
var gulp = require('gulp');
var pseudo = require('gulp-pseudo-i18n');

gulp.task('pseudo', function () {
    return gulp.src('localize/**/*.pot')
        .pipe(pseudo({
            charMap: {
              'a': '1',
              'b': '23'
            }
        }))
        .pipe(gulp.dest('po/'));
});
```

will create pseudo translation having 'a' replaced with number one, 'b' replaced with either number two or number three and all other characters left as-is.