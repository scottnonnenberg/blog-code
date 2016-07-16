function assembleTag(strings, ...values) {
  return strings.reduce((result, item, i) => result + values[i - 1] + item);
}

function composeTag(...processors) {
  return function tag(...args) {
    const value = assembleTag(...args);
    console.log('raw:');
    console.log(`'${value}'`);
    return processors.reduce((result, item) => item(result), value);
  };
}

function trimNewlines(value) {
  return value
    .replace(/^\r\n|\n|\r/, '')
    .replace(/\r\n|\n|\r$/, '');
}

function removeNewlines(value) {
  return value
    .replace(/\r\n|\n|\r/g, ' ');
}

function removeIndent(value) {
  const matches = value.match(/^[ \t]*(?=\S)/gm);
  const lengths = matches.map(match => match.length);
  const minLength = Math.min(...lengths);

  if (!minLength) {
    return value;
  }

  const regexp = new RegExp(`^[ \\t]{${minLength}}`, 'gm');
  return value.replace(regexp, '');
}

const removeIndentTag = composeTag(trimNewlines, removeIndent);
const removeNewlinesTag = composeTag(trimNewlines, removeIndent, removeNewlines);

const newIndented = removeIndentTag`
  one
    two
  three
`;
const oldIndented =
  'one\n' +
  '  two\n' +
  'three';
console.log('indented:');
console.log(newIndented);
console.log(newIndented === oldIndented ? 'match!' : 'no match!');

console.log('---');

const newSingleLine = removeNewlinesTag`
  one
  two
  three
`;
const oldSingleLine =
  'one' +
  ' two' +
  ' three';

console.log('singleLine:');
console.log(newSingleLine);
console.log(newSingleLine === oldSingleLine ? 'match!' : 'no match!');
