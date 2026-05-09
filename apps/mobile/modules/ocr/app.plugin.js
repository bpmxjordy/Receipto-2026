/**
 * Config plugin that manually adds the OCR pod to the Podfile
 * since autolinking won't do it.
 */

const { withPodfile, withDangerousMod } = require('expo/config-plugins');
const path = require('path');
const fs = require('fs');

function withOcr(config) {
  // Copy Swift file into the ios project
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

  // Add the pod to the Podfile
  config = withPodfile(config, (config) => {
    const podfile = config.modResults.contents;

    if (!podfile.includes("pod 'Ocr'")) {
      config.modResults.contents = podfile.replace(
        "use_expo_modules!",
        "use_expo_modules!\n  pod 'Ocr', :path => File.join(__dir__, '..', 'modules', 'ocr', 'ios')"
      );
      console.log('  ✅ Added Ocr pod to Podfile');
    }

    return config;
  });

  return config;
}

module.exports = withOcr;
