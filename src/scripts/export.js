#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OPENSCAD_PATH = '/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD';

function checkOpenSCAD() {
  if (!fs.existsSync(OPENSCAD_PATH)) {
    console.error('❌ Error: OpenSCAD not found at', OPENSCAD_PATH);
    process.exit(1);
  }
}

function checkInputFile(inputFile) {
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Error: Input file '${inputFile}' not found`);
    process.exit(1);
  }
}

function exportFile(inputFile, format = 'stl') {
  checkOpenSCAD();
  checkInputFile(inputFile);

  // Generate output filename based on input file
  const inputDir = path.dirname(inputFile);
  const inputName = path.basename(inputFile, path.extname(inputFile));
  const outputFile = path.join(inputDir, `${inputName}.${format}`);

  console.log(`🔄 Exporting ${inputFile} to ${outputFile}...`);
  console.log(`📍 Using OpenSCAD at: ${OPENSCAD_PATH}`);

  try {
    const command = `"${OPENSCAD_PATH}" -o "${outputFile}" "${inputFile}"`;
    execSync(command, { stdio: 'inherit' });

    console.log('✅ Export successful!');
    console.log(`📁 Output: ${outputFile}`);

    // Show file size
    const stats = fs.statSync(outputFile);
    const fileSizeInBytes = stats.size;
    const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(1);
    console.log(`📊 File size: ${fileSizeInKB} KB`);

  } catch (error) {
    console.error('❌ Export failed!');
    console.error(error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log('GridPockets Export Tool');
  console.log('=======================');
  console.log('');
  console.log('Usage:');
  console.log('  node export.js <file.scad> [format]');
  console.log('  npm run export <file.scad> [format]');
  console.log('');
  console.log('Supported formats: stl, png, svg, 3mf (default: stl)');
  console.log('');
  console.log('Examples:');
  console.log('  node export.js src/test/test.scad');
  console.log('  node export.js src/test/test.scad stl');
  console.log('  node export.js src/test/test.scad png');
  console.log('  npm run export src/test/test.scad');
}

// Main execution
const inputFile = process.argv[2];
const format = process.argv[3] || 'stl';

if (!inputFile || inputFile === 'help' || inputFile === '--help' || inputFile === '-h') {
  showHelp();
  process.exit(inputFile ? 0 : 1);
}

switch (format.toLowerCase()) {
  case 'stl':
  case 'png':
  case 'svg':
  case '3mf':
    exportFile(inputFile, format.toLowerCase());
    break;
  default:
    console.error(`❌ Unknown format: ${format}`);
    console.log('💡 Supported formats: stl, png, svg, 3mf');
    console.log('💡 Run with "help" argument for more info');
    process.exit(1);
} 