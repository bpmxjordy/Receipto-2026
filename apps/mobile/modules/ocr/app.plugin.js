/**
 * Expo config plugin that adds OcrModule.swift directly to the
 * Xcode project. Bypasses autolinking entirely.
 */

const {
  withXcodeProject,
  withDangerousMod,
} = require('expo/config-plugins');
const path = require('path');
const fs = require('fs');

function withOcr(config) {
  // Step 1: Copy the Swift file into the ios project directory
  config = withDangerousMod(config, [
    'ios',
    (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iosDir = path.join(projectRoot, 'ios');
      const appName = config.modResults?.name || 'Receipto';

      const srcFile = path.join(
        projectRoot,
        'modules',
        'ocr',
        'ios',
        'OcrModule.swift',
      );
      const destDir = path.join(iosDir, appName);
      const destFile = path.join(destDir, 'OcrModule.swift');

      if (fs.existsSync(srcFile)) {
        // Ensure destination directory exists
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(srcFile, destFile);
        console.log('  ✅ Copied OcrModule.swift to ios/' + appName + '/');
      } else {
        console.warn('  ⚠️  OcrModule.swift not found at', srcFile);
      }

      return config;
    },
  ]);

  // Step 2: Add the Swift file to the Xcode project
  config = withXcodeProject(config, (config) => {
    const project = config.modResults;
    const appName = config.modRequest.projectName;

    // Find the main app group
    const mainGroup = project.getFirstProject().firstProject.mainGroup;
    const appGroupKey = Object.keys(project.hash.project.objects.PBXGroup)
      .find((key) => {
        const group = project.hash.project.objects.PBXGroup[key];
        return (
          typeof group === 'object' &&
          group.name === appName &&
          group.children
        );
      });

    if (appGroupKey) {
      // Check if already added
      const group = project.hash.project.objects.PBXGroup[appGroupKey];
      const alreadyAdded = group.children.some(
        (child) => {
          const ref = project.hash.project.objects.PBXFileReference?.[child.value];
          return ref && ref.path === 'OcrModule.swift';
        }
      );

      if (!alreadyAdded) {
        project.addSourceFile(
          appName + '/OcrModule.swift',
          null,
          appGroupKey,
        );
        console.log('  ✅ Added OcrModule.swift to Xcode project');
      }
    } else {
      // Fallback: add to root
      project.addSourceFile(appName + '/OcrModule.swift');
      console.log('  ✅ Added OcrModule.swift to Xcode project (root)');
    }

    return config;
  });

  return config;
}

module.exports = withOcr;
