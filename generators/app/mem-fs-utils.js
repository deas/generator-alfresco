'use strict';
var path = require('path');

module.exports = {

  /**
   * Check if a path exists in the provided memfs Store.
   *
   * As memfs only stores files (and not paths) we simply make sure we find at least one valid file
   * with the provided path as a prefix (or complete match). I'm not aware of
   *
   * @param {!Store|!EditionInterface} storeOrEditor
   * @param {string} file path or folder path
   */
  existsInMemory: function(storeOrEditor, path) {
    var store = (storeOrEditor && storeOrEditor.store ? storeOrEditor.store : storeOrEditor);
    var retv = false;
    store.each(function(file) {
      if (0 === file.path.indexOf(path) && file.contents !== null && file.state !== 'deleted') {
        retv = true;
      }
    });
    return retv;
  },

  /**
   * Given the path for a virtual file or folder and a destination path perform a copy
   * completely within mem-fs.
   *
   * @param {!Store|!EditionInterface} storeOrEditor
   * @param {string} from - file path or folder path
   * @param {string} to - folder path
   */
  inMemoryCopy: function(storeOrEditor, from, to) {
    var store = (storeOrEditor && storeOrEditor.store ? storeOrEditor.store : storeOrEditor);
    var fromLen = from.length;
    store.each(function(file) {
      var idx = file.path.indexOf(from);
      if (0 === idx && file.contents !== null && file.state !== 'deleted') {
        var absTo = path.join(to, file.path.substr(fromLen));
        // exact match so we are copying a single file and not a folder
        if (fromLen === file.path.length) {
          absTo = path.join(to, path.basename(file.path));
        }
        // console.log("CREATING: " + absTo);
        var newFile = store.get(absTo);
        newFile.contents = file.contents;
        store.add(newFile);
      }
    });
  }

};

// vim: autoindent expandtab tabstop=2 shiftwidth=2 softtabstop=2
