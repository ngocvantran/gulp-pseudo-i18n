'use strict';
var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var gettext = require('gettext-parser');
var i18n = require('./index');

it('should create qps-ploc/example.po', function(cb) {

    var stream = i18n({
        pathMode: 'dir'
    });

    stream.write(new gutil.File({
        path: __dirname + '/example.pot',
        contents: fs.readFileSync(__dirname + '/example.pot'),
    }));

    stream.on('data', function (file) {
        var path = file.path.replace(/\\/g,'/');
        assert(/qps-ploc\/example\.po/gi.test(path))
        cb();
    });
});

it('should create example.qps-ploc.po', function(cb) {

    var stream = i18n();

    stream.write(new gutil.File({
        path: __dirname + '/example.pot',
        contents: fs.readFileSync(__dirname + '/example.pot'),
    }));

    stream.on('data', function (file) {
        var path = file.path.replace(/\\/g,'/');
        assert(/example\.qps-ploc\.po/gi.test(path))
        cb();
    });
});