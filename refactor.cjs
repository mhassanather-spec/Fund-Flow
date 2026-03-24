const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Global text colors
    content = content.replace(/text-white/g, 'text-gray-900');
    content = content.replace(/text-gray-400/g, 'text-gray-500');
    content = content.replace(/text-gray-300/g, 'text-gray-600');
    
    // Backgrounds and borders
    content = content.replace(/bg-white\/5/g, 'bg-gray-50');
    content = content.replace(/bg-white\/10/g, 'bg-gray-100');
    content = content.replace(/bg-white\/20/g, 'bg-gray-200');
    content = content.replace(/bg-\[\#1C1C21\]\/60/g, 'bg-white');
    content = content.replace(/bg-gradient-to-br from-\[\#1C1C21\] to-\[\#121215\]/g, 'bg-white');
    content = content.replace(/border-white\/5/g, 'border-gray-100');
    content = content.replace(/border-white\/10/g, 'border-gray-200');
    content = content.replace(/border-white\/20/g, 'border-gray-200');
    content = content.replace(/border-gray-800/g, 'border-gray-100');
    content = content.replace(/bg-black\/20/g, 'bg-gray-50');
    content = content.replace(/bg-black\/40/g, 'bg-gray-200');
    content = content.replace(/bg-\[\#141419\]\/80/g, 'bg-white');
    content = content.replace(/bg-transparent/g, 'bg-white');
    content = content.replace(/bg-clip-text text-transparent bg-gradient-to-r from-white to-white\/70/g, 'text-gray-900');
    content = content.replace(/bg-clip-text text-transparent bg-gradient-to-r from-white to-white\/60/g, 'text-gray-900');
    
    // LineChart/AreaChart tooltip colors in recharts
    content = content.replace(/backgroundColor: 'rgba\(20,20,25,0.9\)'/g, "backgroundColor: '#ffffff'");
    content = content.replace(/borderColor: 'rgba\(255,255,255,0.1\)'/g, "borderColor: '#f3f4f6'");
    content = content.replace(/color: '#fff'/g, "color: '#111827'");
    
    // Stroke adjustments
    content = content.replace(/stroke-gray-800/g, 'stroke-gray-100');
    content = content.replace(/rgba\(255,255,255,0.05\)/g, '#f3f4f6');
    content = content.replace(/border-primary\/30/g, 'border-primary/20');
    
    // Specific SadaPay accent replacements
    content = content.replace(/bg-emerald-500\/10/g, 'bg-emerald-50');
    content = content.replace(/bg-emerald-500\/20/g, 'bg-emerald-100');
    content = content.replace(/text-emerald-400/g, 'text-emerald-600');
    content = content.replace(/text-emerald-500/g, 'text-emerald-600');
    content = content.replace(/bg-red-500\/10/g, 'bg-red-50');
    content = content.replace(/text-red-400/g, 'text-red-600');

    fs.writeFileSync(filePath, content);
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') && !fullPath.includes('Sidebar') && !fullPath.includes('Layout') && !fullPath.includes('Header')) {
            replaceInFile(fullPath);
        }
    }
}

processDir(path.join(__dirname, 'src'));
