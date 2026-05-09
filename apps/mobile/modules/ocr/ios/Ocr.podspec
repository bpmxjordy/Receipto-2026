require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'Ocr'
  s.version        = package['version']
  s.summary        = 'OCR module wrapping Apple Vision for Receipto'
  s.description    = 'Expo native module that wraps VNRecognizeTextRequest for on-device OCR'
  s.author         = package['author']
  s.homepage       = 'https://github.com/jordancartwright/receipto'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = '**/*.{h,m,mm,swift,cpp}'
end
