#!/usr/bin/env node

/**
 * Automatic Photo List Generator for Sigma Club Website
 * 
 * This script scans the components folders and generates a JSON file
 * with all photo filenames, which the website will automatically load.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const componentsDir = path.join(publicDir, 'components');
const outputFile = path.join(componentsDir, 'photo-data.json');

// Function to get all image files in a directory with their relative paths
function getImageFiles(dir) {
  try {
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️ Directory does not exist: ${dir}`);
      return [];
    }
    
    const stats = fs.statSync(dir);
    if (!stats.isDirectory()) {
      console.warn(`⚠️ Path is not a directory: ${dir}`);
      return [];
    }
    
    const files = fs.readdirSync(dir);
    const imageFiles = files
      .filter(file => {
        // Skip hidden files and non-image files
        if (file.startsWith('.')) return false;
        if (!/\.(jpe?g|png|webp)$/i.test(file)) return false;
        
        const filePath = path.join(dir, file);
        try {
          return fs.statSync(filePath).isFile();
        } catch (e) {
          console.warn(`⚠️ Could not access file ${filePath}:`, e.message);
          return false;
        }
      })
      .map(file => {
        // Get the relative path from the public directory
        const relativePath = path.relative(
          path.join(__dirname, '../public'),
          path.join(dir, file)
        ).replace(/\\/g, '/'); // Convert Windows paths to forward slashes
        
        // Ensure the path starts with 'components/'
        if (!relativePath.startsWith('components/')) {
          return `components/${relativePath}`;
        }
        return relativePath;
      });
      
    return imageFiles;
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
    return [];
  }
}

// Function to get all PDF files in a directory with their relative paths
function getPDFFiles(dir) {
  try {
    if (!fs.existsSync(dir)) {
      console.warn(`⚠️ PDF directory does not exist: ${dir}`);
      return [];
    }
    
    const stats = fs.statSync(dir);
    if (!stats.isDirectory()) {
      console.warn(`⚠️ PDF path is not a directory: ${dir}`);
      return [];
    }
    
    const files = fs.readdirSync(dir);
    const pdfFiles = files
      .filter(file => {
        // Skip hidden files and non-PDF files
        if (file.startsWith('.')) return false;
        if (!/\.pdf$/i.test(file)) return false;
        
        const filePath = path.join(dir, file);
        try {
          return fs.statSync(filePath).isFile();
        } catch (e) {
          console.warn(`⚠️ Could not access PDF file ${filePath}:`, e.message);
          return false;
        }
      })
      .map(file => {
        // Get the relative path from the public directory
        const relativePath = path.relative(
          path.join(__dirname, '../public'),
          path.join(dir, file)
        ).replace(/\\/g, '/'); // Convert Windows paths to forward slashes
        
        // Ensure the path starts with 'components/'
        if (!relativePath.startsWith('components/')) {
          return `components/${relativePath}`;
        }
        return relativePath;
      });
      
    return pdfFiles;
  } catch (error) {
    console.error(`❌ Error reading PDF directory ${dir}:`, error.message);
    return [];
  }
}

// Get all alumni photos (no batch folders, just all photos in alumni directory)
function getAllAlumniPhotos(alumniDir) {
  try {
    if (!fs.existsSync(alumniDir)) {
      console.warn(`⚠️ Alumni directory does not exist: ${alumniDir}`);
      return [];
    }
    
    const stats = fs.statSync(alumniDir);
    if (!stats.isDirectory()) {
      console.warn(`⚠️ Alumni path is not a directory: ${alumniDir}`);
      return [];
    }
    
    return getImageFiles(alumniDir);
  } catch (error) {
    console.error('❌ Error reading alumni directory:', error.message);
    return [];
  }
}

// Generate the photo data
console.log('🔍 Scanning folders for photos...\n');

// Ensure the public directory exists
if (!fs.existsSync(publicDir)) {
  console.error('❌ Public directory does not exist:', publicDir);
  process.exit(1);
}

// Ensure the components directory exists
if (!fs.existsSync(componentsDir)) {
  console.error('❌ Components directory does not exist:', componentsDir);
  process.exit(1);
}

// Define member directories with their corresponding paths
const memberDirs = {
  '1st': path.join(componentsDir, 'members/1styear'),
  '2nd': path.join(componentsDir, 'members/2ndyear'),
  '3rd': path.join(componentsDir, 'members/3rdyear'),
  '4th': path.join(componentsDir, 'members/4thyear')
};

// Only include member directories that exist
const memberPhotos = {};
Object.entries(memberDirs).forEach(([year, dir]) => {
  if (fs.existsSync(dir)) {
    memberPhotos[year] = getImageFiles(dir);
  } else {
    console.warn(`⚠️ Member directory for ${year} year does not exist: ${dir}`);
    memberPhotos[year] = [];
  }
});

const photoData = {
  memberPhotos,
  alumniPhotos: getAllAlumniPhotos(path.join(componentsDir, 'alumni')),
  aboutImages: getImageFiles(path.join(componentsDir, 'about')),
  homeImages: getImageFiles(path.join(componentsDir, 'home')),
  magazinePDFs: getPDFFiles(path.join(componentsDir, 'magazines')),
  generatedAt: new Date().toISOString()
};

// Display results
console.log('📸 Found photos:\n');
console.log('Members:');
console.log(`  1st Year: ${photoData.memberPhotos['1st'].length} photos`);
photoData.memberPhotos['1st'].forEach(photo => console.log(`    - ${photo}`));
console.log(`  2nd Year: ${photoData.memberPhotos['2nd'].length} photos`);
photoData.memberPhotos['2nd'].forEach(photo => console.log(`    - ${photo}`));
console.log(`  3rd Year: ${photoData.memberPhotos['3rd'].length} photos`);
photoData.memberPhotos['3rd'].forEach(photo => console.log(`    - ${photo}`));
console.log(`  4th Year: ${photoData.memberPhotos['4th'].length} photos`);
photoData.memberPhotos['4th'].forEach(photo => console.log(`    - ${photo}`));

console.log('\nAlumni:');
console.log(`  ${photoData.alumniPhotos.length} photos`);
photoData.alumniPhotos.forEach(photo => console.log(`    - ${photo}`));

console.log('\nAbout:');
console.log(`  ${photoData.aboutImages.length} photos`);
photoData.aboutImages.forEach(photo => console.log(`    - ${photo}`));

console.log('\nHome:');
console.log(`  ${photoData.homeImages.length} photos`);
photoData.homeImages.forEach(photo => console.log(`    - ${photo}`));

console.log('\nMagazines:');
console.log(`  ${photoData.magazinePDFs.length} PDFs`);
photoData.magazinePDFs.forEach(pdf => console.log(`    - ${pdf}`));

// Write to file
fs.writeFileSync(outputFile, JSON.stringify(photoData, null, 2));

console.log(`\n✅ Photo list generated: ${outputFile}`);
console.log('🚀 Restart your dev server to see the changes!\n');
