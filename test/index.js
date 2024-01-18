// const searcher = require('../dist/utils/displacement').default
const { build, getRegions, buildDoc, createTypes } = require('..');
const Fs = require('@timeax/utilities').Fs


// const other = Fs.join(__dirname, '../assets/src/components/_header.trx');

// const doc = createTypes(Fs.content(other), other).doc;

// console.log(doc)

// return;


// const TEXT = `this kind of test is irritating \n said David.`
// const values = TEXT.split('');

// const find = searcher(values);


// find.distort(' bloody ', 4);
// find.distort('--i', 6);

// const text = values.join('');

// const a = find.offsetAt(4),
// b = find.offsetAt(9);

// console.log(text.slice(a, b));

// console.log(find.inverseOffsetAt(b))

const pathA = Fs.join(__dirname, '../assets/src/components/_header.trx')
// const pathB = Fs.join(__dirname, '../assets/_button.trx');
const cA = Fs.content(pathA);
// const cB = Fs.content(pathB);

const { builder, doc } = build(getRegions(pathA, cA, {type: 'ts'}).regions, pathA, cA);

// console.log(doc)
const pos = 1113;
const offset = builder.offsetAt(pos);
const span = 5;

console.log(doc.slice(offset - span, offset).split(''), '\n',cA.slice(pos -span, pos).split(''), offset);
console.log(pos, builder.inverseOffsetAt(offset))

// console.log(cA.slice(pos, pos + span))

console.log('passed....');
