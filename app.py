import os
import tempfile
import traceback
from flask import Flask, render_template, request, jsonify
from markitdown import MarkItDown

app = Flask(__name__, static_folder="static", template_folder="templates")

# Initialize MarkItDown converter
try:
    md_converter = MarkItDown()
except Exception as e:
    print(f"Warning initializing MarkItDown: {e}")
    md_converter = None


SUPPORTED_EXTENSIONS = {
    ".pdf": "PDF Document",
    ".docx": "Word Document",
    ".pptx": "PowerPoint Presentation",
    ".xlsx": "Excel Spreadsheet",
    ".xls": "Excel Spreadsheet (Legacy)",
    ".csv": "CSV Spreadsheet",
    ".json": "JSON Data",
    ".xml": "XML Document",
    ".html": "HTML Document",
    ".htm": "HTML Document",
    ".txt": "Plain Text",
    ".md": "Markdown Document",
    ".epub": "EPub eBook",
    ".jpg": "JPEG Image (OCR/EXIF)",
    ".jpeg": "JPEG Image (OCR/EXIF)",
    ".png": "PNG Image (OCR/EXIF)",
    ".wav": "Audio File (Audio Transcript)",
    ".mp3": "Audio File (Audio Transcript)",
    ".zip": "ZIP Archive",
    ".msg": "Outlook Email Message"
}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/formats", methods=["GET"])
def get_formats():
    return jsonify({
        "success": True,
        "formats": SUPPORTED_EXTENSIONS
    })


@app.route("/api/convert", methods=["POST"])
def convert_file():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded in request."}), 400

    file = request.files["file"]
    if not file or file.filename == "":
        return jsonify({"success": False, "error": "No selected file."}), 400

    filename = file.filename
    _, ext = os.path.splitext(filename.lower())

    # Create temporary file to pass path to markitdown
    temp_dir = tempfile.mkdtemp()
    temp_path = os.path.join(temp_dir, filename)

    try:
        file.save(temp_path)
        file_size = os.path.getsize(temp_path)

        # Initialize MarkItDown dynamically if needed
        converter = md_converter or MarkItDown()
        result = converter.convert(temp_path)

        markdown_content = result.text_content if hasattr(result, "text_content") else str(result)

        return jsonify({
            "success": True,
            "filename": filename,
            "extension": ext,
            "file_size": file_size,
            "markdown": markdown_content
        })

    except Exception as err:
        error_msg = str(err)
        print(f"Error converting {filename}: {error_msg}")
        traceback.print_exc()
        return jsonify({
            "success": False,
            "filename": filename,
            "error": f"Conversion failed: {error_msg}"
        }), 500

    finally:
        # Clean up temporary files
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
        if os.path.exists(temp_dir):
            try:
                os.rmdir(temp_dir)
            except Exception:
                pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5050))
    print(f"🚀 MarkItDown Drop running on http://127.0.0.1:{port}")
    app.run(host="127.0.0.1", port=port, debug=True)
