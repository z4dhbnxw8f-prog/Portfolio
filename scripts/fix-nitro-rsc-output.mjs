import fs from 'node:fs';
import path from 'node:path';

const outputFile = path.resolve('.output/server/_ssr/rsc.mjs');

if (!fs.existsSync(outputFile)) {
  console.warn(`Skipped patch: ${outputFile} not found.`);
  process.exit(0);
}

const source = fs.readFileSync(outputFile, 'utf8');
const brokenExport = 'var km=Dm??{};export{km as default};';
const fixedExport = 'var km=async function(e,t,n){return Dm.fetch(e,t,n)};export{km as default};';

if (!source.includes(brokenExport)) {
  console.log('No broken rsc export detected; leaving output untouched.');
  process.exit(0);
}

fs.writeFileSync(outputFile, source.replace(brokenExport, fixedExport));
console.log('Patched generated RSC output to export a callable default handler.');
