import ExpoModulesCore
import Vision
import UIKit

/// Native Expo module wrapping Apple Vision's VNRecognizeTextRequest.
/// Called from TypeScript via: OcrModule.recognizeText(imageUri)
public class OcrModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Ocr")

    /// Recognise text in an image file.
    /// - Parameter imageUri: file:// URI pointing to a JPEG/PNG image.
    /// - Returns: Array of recognised text blocks with bounding boxes.
    AsyncFunction("recognizeText") { (imageUri: String, promise: Promise) in
      guard let url = URL(string: imageUri) else {
        promise.reject("ERR_INVALID_URI", "Invalid image URI: \(imageUri)")
        return
      }

      guard let imageData = try? Data(contentsOf: url),
            let image = UIImage(data: imageData),
            let cgImage = image.cgImage else {
        promise.reject("ERR_LOAD_IMAGE", "Could not load image from URI")
        return
      }

      let request = VNRecognizeTextRequest { request, error in
        if let error = error {
          promise.reject("ERR_OCR", "OCR failed: \(error.localizedDescription)")
          return
        }

        guard let observations = request.results as? [VNRecognizedTextObservation] else {
          promise.resolve([])
          return
        }

        let blocks: [[String: Any]] = observations.compactMap { observation in
          guard let candidate = observation.topCandidates(1).first else {
            return nil
          }

          let bbox = observation.boundingBox
          return [
            "text": candidate.string,
            "confidence": candidate.confidence,
            "x": bbox.origin.x,
            "y": bbox.origin.y,
            "width": bbox.size.width,
            "height": bbox.size.height,
          ]
        }

        promise.resolve(blocks)
      }

      // Use accurate (slow) recognition for receipt text
      request.recognitionLevel = .accurate
      request.usesLanguageCorrection = true
      request.recognitionLanguages = ["en-GB", "en-US"]

      let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

      DispatchQueue.global(qos: .userInitiated).async {
        do {
          try handler.perform([request])
        } catch {
          promise.reject("ERR_OCR", "OCR request failed: \(error.localizedDescription)")
        }
      }
    }
  }
}
