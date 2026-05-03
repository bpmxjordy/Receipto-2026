/**
 * Expo config plugin that:
 * 1. Copies OcrModule.swift into the Xcode project
 * 2. Patches the Podfile so use_expo_modules! finds our module
 *
 * This bypasses the broken autolinking for local modules.
 */

const {
  withXcodeProject,
  withDangerousMod,
  withPodfile,
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
      const appName = 'Receipto';

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

  // Step 2: Patch Podfile to tell use_expo_modules! where to find our module
  config = withPodfile(config, (config) => {
    let podfile = config.modResults.contents;

    // Add our modules directory to the autolinking search paths
    podfile = podfile.replace(
      'use_expo_modules!',
      "use_expo_modules!(searchPaths: [File.join(__dir__, '..', 'modules')])"
    );

    config.modResults.contents = podfile;
    console.log('  ✅ Patched Podfile with modules search path');
    return config;
  });

  // Step 3: Add the Swift file to the Xcode project
  config = withXcodeProject(config, (config) => {
    const project = config.modResults;
    const appName = config.modRequest.projectName;

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
      const group = project.hash.project.objects.PBXGroup[appGroupKey];
      const alreadyAdded = group.children.some((child) => {
        const ref =
          project.hash.project.objects.PBXFileReference?.[child.value];
        return ref && ref.path === 'OcrModule.swift';
      });

      if (!alreadyAdded) {
        project.addSourceFile(
          appName + '/OcrModule.swift',
          null,
          appGroupKey,
        );
        console.log('  ✅ Added OcrModule.swift to Xcode project');
      }
    } else {
      project.addSourceFile(appName + '/OcrModule.swift');
      console.log('  ✅ Added OcrModule.swift to Xcode project (root)');
    }

    return config;
  });

  return config;
}

module.exports = withOcr;
