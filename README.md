# MarkItDown Drop

A drag-and-drop web tool that converts documents into Markdown. It runs a local Flask server and uses the Microsoft `markitdown` library. It accepts PDF, Word, PowerPoint, Excel, images, audio, and structured data files.

![Python](https://img.shields.io/badge/python-3.10%2B-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- **Drag and drop.** Drop a supported file onto the target zone.
- **Split view.** The raw Markdown sits beside a rendered HTML preview.
- **One-click actions.** Copy the result to the clipboard, or download it as a `.md` file.
- **Batch queue.** Convert several files in one batch, then move between the results.
- **Dark theme.** A glassmorphism interface written in vanilla CSS.
- **Local only.** The server runs on `127.0.0.1`. No file leaves the machine.

## Supported formats

`app.py` holds the authoritative list in `SUPPORTED_EXTENSIONS`.

| Category | Extensions | Result |
| --- | --- | --- |
| Office documents | `.docx`, `.pptx`, `.xlsx`, `.xls` | Keeps headings, bullet lists, tables, and layout structure |
| PDF | `.pdf` | Extracts text, headings, and tabular content |
| Images | `.jpg`, `.jpeg`, `.png` | Extracts EXIF metadata |
| Audio | `.wav`, `.mp3` | Speech-to-text transcription |
| Structured data | `.csv`, `.json`, `.xml`, `.html`, `.htm` | Formats the data as Markdown tables and code blocks |
| Text | `.txt`, `.md` | Passes the text through |
| Archives and email | `.zip`, `.epub`, `.msg` | Unpacks the container and converts what it holds |

Note: image conversion returns EXIF metadata. It does not read text out of the picture. Text extraction from an image needs an LLM client that this build does not configure.

## Prerequisites

- Python 3.10 or later.
- macOS, Linux, or Windows.

## Quick start

Run the launcher script:

```bash
./run.sh
```

The script creates a virtual environment in `.venv`, installs the dependencies, starts the server on `http://127.0.0.1:5050`, and opens a browser.

## Manual install

1. Create and activate a virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the server:

   ```bash
   python app.py
   ```

4. Open `http://127.0.0.1:5050`.

To use a different port, set `PORT` before you start the server:

```bash
PORT=8080 python app.py
```

## Dependencies

`requirements.txt` pins these packages:

```
markitdown[docx,pptx,xlsx,xls,pdf,outlook,audio-transcription]>=0.1.6
flask>=3.0.0
audioop-lts; python_version >= "3.13"
```

The extras list decides which converters exist. If you add a format, add its extra here as well.

## API

| Method and path | Purpose |
| --- | --- |
| `GET /` | Serve the interface |
| `GET /api/formats` | Return the supported extension map |
| `POST /api/convert` | Accept an upload and return Markdown |

## Project structure

```
app.py                              Flask server and conversion endpoints
requirements.txt                    Python dependencies
run.sh                              macOS launcher script
static/app.js                       Drag and drop logic, fetch calls, preview, tabs
static/style.css                    Dark theme design system
templates/index.html                Interface markup
MarkItDown Drop.app/                macOS application bundle that calls run.sh
LICENSE                             MIT
```

## Notes

`app.py` runs Flask with `debug=True`. This is correct for local use.

CAUTION: Do not expose this server to a network while `debug=True` is set. The Werkzeug debugger runs code that a request sends it. Set `debug=False` and bind a real WSGI server first.

## License

MIT. See [LICENSE](LICENSE).
