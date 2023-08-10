// const searcher = require('../dist/utils/displacement').default
const { build, getRegions } = require('..');
const Fs = require('@timeax/utilities').Fs


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

const pathA = Fs.join(__dirname, '../assets/index.trx')
const pathB = Fs.join(__dirname, '../assets/_button.trx');
const cA = Fs.content(pathA);
const cB = Fs.content(pathB);

const { builder, doc } = build(getRegions(pathB, cB).regions, pathB, cB);

const pos = 43;
const offset = builder.offsetAt(pos);
const span = 2;

// console.log(doc.slice(builder.offsetAt(offset), builder.offsetAt(offset + 5)));

// console.log(cB.slice(offset, offset + 5))

console.log(doc.slice(
    offset,
    offset + span
));

console.log(cB.slice(pos, pos + span))

console.log('passed....')