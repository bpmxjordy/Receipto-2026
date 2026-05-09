/**
 * Config plugin that copies OcrModule.swift into the Xcode project.
 * Autolinking handles the pod registration via expo-module.config.json.
 */

const { withDangerousMod } = require('expo/config-plugins');
const path = require('path');
const fs = require('fs');

function withOcr(config) {
  config = withDangerousMod(config, [
    'ios',
    (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const srcFile = path.join(projectRoot, 'modules', 'ocr', 'ios', 'OcrModule.swift');
      const destDir = path.join(projectRoot, 'ios', 'Receipto');
      const destFile = path.join(destDir, 'OcrModule.swift');

      if (fs.existsSync(srcFile)) {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(srcFile, destFile);
        console.log('  ✅ Copied OcrModule.swift');
      }
      return config;
    },
  ]);

  return config;
}

module.exports = withOcr;
