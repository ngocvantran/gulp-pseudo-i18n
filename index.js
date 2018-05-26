'use strict';

var _ = require('lodash');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var gettext = require('gettext-parser');
var pseudoTranslator = require('./lib/pseudo');

var pluginName = require('./package.json').name;

module.exports = function (options) {
  var today = new Date();
  options = _.extend({}, options, {
    language: 'pseudo language auto generated',
    PO_Revision_Date: today.getDate()+"/"+(today.getMonth()+1)+"/"+today.getFullYear(),
    Project_Id_Version: 'template',
    Last_Translator: 'template auto generated',
    language_team: 'template auto generated'
  });

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
    parsed.headers['po-revision-date'] = options.PO_Revision_Date;
    parsed.headers['project-id-version'] = options.Project_Id_Version;
    parsed.headers['Last-Translator'] = options.Last_Translator;
    parsed.headers['language-team'] = options.language_team;

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
    file.path = path.join(dirname, basename + '.' + options.language + '.po');
    
    this.push(file);
    cb();
  });
}; 