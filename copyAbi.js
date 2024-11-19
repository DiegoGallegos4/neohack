const path = require('path');
const fs = require('fs-extra');

const artifactsDir = path.resolve(__dirname, 'artifacts/contracts');
const destinations = [path.resolve(__dirname, 'frontend/neohack/src/abis')];

// Recursive function to copy ABI files
function copyAbiFilesFlat(srcDir, destDirs) {
    fs.readdirSync(srcDir).forEach((entry) => {
        const fullPath = path.join(srcDir, entry);

        // Check if the entry is a directory or a file
        if (fs.lstatSync(fullPath).isDirectory()) {
            // If it's a directory, call the function recursively
            copyAbiFilesFlat(fullPath, destDirs);
        } else if (entry.endsWith('.json')) {
            // If it's a JSON file, read the ABI and copy it
            const contractData = require(fullPath);

            if (contractData.abi) {
                // Proceed only if the file has an ABI field
                const fileName = path.basename(fullPath); // Get only the file name
                destDirs.forEach((dest) => {
                    const destFile = path.join(dest, fileName); // Save directly in destination folder
                    fs.ensureDirSync(dest); // Ensure the directory exists
                    fs.writeFileSync(destFile, JSON.stringify(contractData.abi, null, 2), 'utf-8');
                });
            } else {
                console.warn(`Skipping ${fullPath} as it does not contain an ABI.`);
            }
        }
    });
}

// Start the process
copyAbiFilesFlat(artifactsDir, destinations);

console.log('ABI files copied successfully to flat structure!');
