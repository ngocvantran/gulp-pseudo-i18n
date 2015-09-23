'use strict';

var _ = require('lodash');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var gettext = require('gettext-parser');
var pseudoTranslator = require('./lib/pseudo');

var pluginName = require('./package.json').name;

module.exports = function (options) {
  options = _.extend({
    language: 'qps-ploc',
    pathMode: 'ext'
  }, options);

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(pluginName, 'Streaming not supported'));
      return cb();
    }

    // Parse PO/POT file
    var parsed = gettext.po.parse(file.contents);
    parsed.headers['language'] = options.language;

    // Translate
    var translations = parsed.translations;
    var pseudo = pseudoTranslator(options.charMap, options.excludes);

    Object.keys(translations).forEach(function (catalog) {
      Object.keys(translations[catalog]).forEach(function (key) {
        if (key.length === 0) return;

        var strObj = translations[catalog][key];
        strObj.msgstr[0] = pseudo(strObj.msgid);

        if (strObj.msgid_plural)
          strObj.msgstr[1] = pseudo(strObj.msgid_plural);
      });
    });

    file.contents = gettext.po.compile(parsed);

    // Rename abc.po or abc.pot to abc.[language].po
    var filePath = file.path;
    var dirname = path.dirname(filePath);
    var extension = path.extname(filePath);
    var basename = path.basename(filePath, extension);

    // the .NET i18n library expects folder-oriented structure
    // e.g. fr/messages.po instead of messages.fr.po

    switch (options.pathMode) {
        case 'dir': file.path = path.join(dirname, options.language, basename + '.po'); break;
        case 'ext': file.path = path.join(dirname, basename + '.' + options.language + '.po'); break;
        default: throw new Error('invalid options.pathMode');
    }

    this.push(file);
    cb();
  });
};