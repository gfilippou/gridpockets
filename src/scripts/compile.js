#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
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

function compileCheck(inputFile) {
  checkOpenSCAD();
  checkInputFile(inputFile);

  // Create a temporary file in the system temp directory
  const tempFile = path.join(os.tmpdir(), 'openscad_compile_check.stl');

  console.log(`🔍 Checking compilation of ${inputFile}...`);
  console.log(`📍 Using OpenSCAD at: ${OPENSCAD_PATH}`);

  try {
    const command = `"${OPENSCAD_PATH}" -o "${tempFile}" "${inputFile}"`;
    const output = execSync(command, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Clean up temp file if it was created
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }

    // Check if there were any warnings or errors in the output
    if (output.includes('ERROR:')) {
      console.error('❌ Compilation failed with errors!');
      console.error(output);
      process.exit(1);
    } else if (output.includes('WARNING:')) {
      console.warn('⚠️  Compilation succeeded with warnings:');
      console.warn(output);
      console.log('✅ Syntax check passed (with warnings)');
    } else {
      console.log('✅ Compilation check passed - no errors or warnings!');
    }

  } catch (error) {
    // Clean up temp file if it exists
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }

    console.error('❌ Compilation failed!');

    // Try to extract meaningful error info
    if (error.stderr) {
      console.error(error.stderr);
    } else if (error.stdout) {
      console.error(error.stdout);
    } else {
      console.error(error.message);
    }

    process.exit(1);
  }
}

function showHelp() {
  console.log('GridPockets Compile Check');
  console.log('========================');
  console.log('');
  console.log('Usage:');
  console.log('  node compile.js <file.scad>');
  console.log('  npm run compile <file.scad>');
  console.log('');
  console.log('Example:');
  console.log('  node compile.js src/test/test.scad');
  console.log('  npm run compile src/test/test.scad');
}

// Main execution
const inputFile = process.argv[2];

if (!inputFile || inputFile === 'help' || inputFile === '--help' || inputFile === '-h') {
  showHelp();
  process.exit(inputFile ? 0 : 1);
}

console.log('GridPockets Compile Check');
console.log('========================');
compileCheck(inputFile); 