'use strict';

var pseudo = require('node-pseudo-l10n');
var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var _ = require('lodash');

var pluginName = require('./package.json').name;

module.exports = function (options) {
  options = _.extend({
    potFile: true,
    headerLanguage: 'qps-ploc'
  }, options);

  var emitStreamingError = function () {
      this.emit('error', new gutil.PluginError(pluginName, 'Streaming not supported'));
  }.bind(this);

  return through.obj(function (file, enc, cb) {
    
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      emitStreamingError();
      return cb();
    }

    var _this = this;
    options.fileContents = file.contents.toString();
    
    pseudo(options, function(err, poFileBuffer) {
      file.contents = poFileBuffer;
      
      var extension = path.extname(file.path);
      var extIndex = file.path.lastIndexOf(extension);
      file.path = file.path.substring(0, extIndex) + '.qps-ploc.po';
      
      _this.push(file);
      cb(err);
    });
  });
}; 