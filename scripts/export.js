#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OPENSCAD_PATH = '/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD';
const INPUT_FILE = 'test.scad';

function checkOpenSCAD() {
  if (!fs.existsSync(OPENSCAD_PATH)) {
    console.error('❌ Error: OpenSCAD not found at', OPENSCAD_PATH);
    process.exit(1);
  }
}

function checkInputFile() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`❌ Error: Input file '${INPUT_FILE}' not found`);
    process.exit(1);
  }
}

function exportFile(format = 'stl') {
  checkOpenSCAD();
  checkInputFile();

  const outputFile = `test.${format}`;

  console.log(`🔄 Exporting ${INPUT_FILE} to ${outputFile}...`);
  console.log(`📍 Using OpenSCAD at: ${OPENSCAD_PATH}`);

  try {
    const command = `"${OPENSCAD_PATH}" -o "${outputFile}" "${INPUT_FILE}"`;
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
  console.log('Available commands:');
  console.log('  npm run compile     - Check compilation for errors');
  console.log('  npm run export      - Export to STL (default)');
  console.log('  npm run export:stl  - Export to STL format');
  console.log('  npm run export:png  - Export to PNG image');
  console.log('  npm run clean       - Remove generated files');
  console.log('  npm run help        - Show this help');
  console.log('');
  console.log('Direct usage:');
  console.log('  node compile.js     - Check compilation');
  console.log('  node export.js [format]');
  console.log('  node export.js stl');
  console.log('  node export.js png');
  console.log('  node export.js help');
}

// Main execution
const format = process.argv[2] || 'stl';

switch (format.toLowerCase()) {
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  case 'stl':
  case 'png':
  case 'svg':
  case '3mf':
    exportFile(format.toLowerCase());
    break;
  default:
    console.error(`❌ Unknown format: ${format}`);
    console.log('💡 Supported formats: stl, png, svg, 3mf');
    console.log('💡 Run "npm run help" for more info');
    process.exit(1);
} 