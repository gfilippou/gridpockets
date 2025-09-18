#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
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

function compileCheck() {
  checkOpenSCAD();
  checkInputFile();

  // Create a temporary file in the system temp directory
  const tempFile = path.join(os.tmpdir(), 'openscad_compile_check.stl');

  console.log(`🔍 Checking compilation of ${INPUT_FILE}...`);
  console.log(`📍 Using OpenSCAD at: ${OPENSCAD_PATH}`);

  try {
    const command = `"${OPENSCAD_PATH}" -o "${tempFile}" "${INPUT_FILE}"`;
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

// Main execution
console.log('GridPockets Compile Check');
console.log('========================');
compileCheck(); 