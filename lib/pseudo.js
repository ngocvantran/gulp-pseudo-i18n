// you can override the charMap if you'd like
module.exports = function (charMap, excludes) {
  charMap = charMap || {
    'a': 'ààà', 'b': 'ƀ', 'c': 'ç', 'd': 'ð', 'e': 'ééé', 'f': 'ƒ', 'g': 'ĝ', 'h': 'ĥ', 'i': 'îîî', 'l': 'ļ', 'k': 'ķ', 'j': 'ĵ', 'm': 'ɱ',
    'n': 'ñ', 'o': 'ôôô', 'p': 'þ', 'q': 'ǫ', 'r': 'ŕ', 's': 'š', 't': 'ţ', 'u': 'ûûû', 'v': 'ṽ', 'w': 'ŵ', 'x': 'ẋ', 'y': 'ý', 'z': 'ž',
    'A': 'ÀÀÀ', 'B': 'Ɓ', 'C': 'Ç', 'D': 'Ð', 'E': 'ÉÉÉ', 'F': 'Ƒ', 'G': 'Ĝ', 'H': 'Ĥ', 'I': 'ÎÎÎ', 'L': 'Ļ', 'K': 'Ķ', 'J': 'Ĵ', 'M': 'Ṁ',
    'N': 'Ñ', 'O': 'ÔÔÔ', 'P': 'Þ', 'Q': 'Ǫ', 'R': 'Ŕ', 'S': 'Š', 'T': 'Ţ', 'U': 'ÛÛÛ', 'V': 'Ṽ', 'W': 'Ŵ', 'X': 'Ẋ', 'Y': 'Ý', 'Z': 'Ž'
  };
  
  function translate(str, start, end) {
    var output = '', char, alternatives;
    
    for (var i = start; i <= end; i++) {
      char = str[i];

      alternatives = charMap[char];
      if (!alternatives) {
        output += char;
        continue;
      }

      output += alternatives[i % alternatives.length];
    }
    
    return output;
  }

  return function (str) {
    if (!str || str.length == 0) return str;
    var re = new RegExp(excludes || '(\\$[^\\s]+|\\{\\{.+?\\}\\}|<[^>]+?>|&[^;]+)', 'g');

    var position = 0, output = '';
    var match, i, char, alternatives;
    
    while (true) {
      match = re.exec(str);
      if (!match) break;
      
      output += translate(str, position, match.index -1);
      output += match[0];
      
      position = match.index + match[0].length;
    }
    
    if (position < str.length) {
      output += translate(str, position, str.length - 1);
    }
    
    return output;
  };
};
