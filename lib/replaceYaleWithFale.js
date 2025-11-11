function matchCase(replacement, source) {
  let result = '';

  for (let i = 0; i < replacement.length; i += 1) {
    const targetChar = replacement[i];
    const sourceChar = source[i] || source[source.length - 1];

    if (!sourceChar) {
      result += targetChar;
      continue;
    }

    if (sourceChar === sourceChar.toUpperCase() && sourceChar !== sourceChar.toLowerCase()) {
      result += targetChar.toUpperCase();
    } else if (sourceChar === sourceChar.toLowerCase() && sourceChar !== sourceChar.toUpperCase()) {
      result += targetChar.toLowerCase();
    } else {
      result += targetChar;
    }
  }

  return result;
}

function replaceYaleWithFale(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return value;
  }

  return value.replace(/yale/gi, (match) => matchCase('Fale', match));
}

module.exports = {
  replaceYaleWithFale,
};

