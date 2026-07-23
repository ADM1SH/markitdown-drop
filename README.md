# 📄 MarkItDown Drop

> **A sleek, drag-and-drop macOS desktop web tool to convert PDF, Word, PowerPoint, Excel, Images, and Audio into clean Markdown using Microsoft's MarkItDown.**

![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey.svg)
![Powered By](https://img.shields.io/badge/powered%20by-Microsoft%20MarkItDown-0078D4.svg)

---

## ✨ Features

- 🎯 **Drag & Drop Upload Zone**: Simply drag any supported file or document onto the drop target.
- 📑 **Wide Format Support**: Handles PDF, DOCX, PPTX, XLSX, XLS, CSV, JSON, XML, HTML, EPub, Images (EXIF + OCR), and Audio (transcription).
- 👁️ **Live Split View**: Side-by-side view with **Raw Markdown** code editor and **Rendered HTML Preview**.
- 📋 **One-Click Actions**: Instant copy to clipboard and `.md` file download.
- 🗂️ **Batch Conversion Queue**: Convert multiple files in a batch and toggle seamlessly between results.
- 🎨 **Glassmorphism Dark Theme**: Premium macOS-native dark mode user interface built with vanilla CSS.
- ⚡ **Zero External Heavy Dependencies**: Fast local Python backend server powered by Flask & Microsoft `markitdown`.

---

## 📊 Supported File Formats

| Category | File Extensions | Conversion Details |
| :--- | :--- | :--- |
| **Office Documents** | `.docx`, `.pptx`, `.xlsx`, `.xls` | Retains headings, bullet lists, tables & layout structure |
| **PDF Documents** | `.pdf` | Extracts text layout, headings, and tabular contents |
| **Images** | `.jpg`, `.jpeg`, `.png` | Extracts EXIF metadata & image OCR |
| **Audio Files** | `.wav`, `.mp3` | Audio speech-to-text transcription |
| **Structured Data** | `.csv`, `.json`, `.xml`, `.html` | Formats data into readable Markdown tables & code blocks |
| **Archives & E-Books**| `.zip`, `.epub`, `.msg` | Unpacks files recursively & converts contained docs |

---

## 🚀 Quick Start (macOS)

### 1. One-Command Launch
Simply open your Terminal and run the launcher script:

```bash
cd markitdown-drop
./run.sh
```

The script will automatically create a Python virtual environment, install the required dependencies (`markitdown[all]` and `flask`), launch the server on `http://127.0.0.1:5050`, and open your browser automatically.

---

## 🛠️ Manual Installation & Setup

If you prefer to set up manually:

1. **Clone or navigate to the repository:**
   ```bash
   git clone https://github.com/your-username/markitdown-drop.git
   cd markitdown-drop
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```
   Open `http://127.0.0.1:5050` in your web browser.

---

## 📂 Project Structure

```
markitdown-drop/
├── app.py              # Flask server & MarkItDown conversion endpoints
├── requirements.txt    # Python package dependencies
├── run.sh              # One-click macOS bash launcher script
├── static/
│   ├── app.js          # Drag & drop logic, fetch API, previewer & tab controls
│   └── style.css       # Glassmorphism dark mode CSS design system
├── templates/
│   └── index.html      # HTML5 app interface
├── .gitignore          # Git ignore rules for Python & macOS
├── LICENSE             # MIT License
└── README.md           # Documentation
```

---

## 📤 How to Push to Your GitHub Account

To host this repository under your personal GitHub profile:

1. **Create a new empty repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name it `markitdown-drop`
   - Do NOT check "Initialize with README" (since we already created one).

2. **Initialize Git and push from your Mac terminal**:
   ```bash
   cd "/Users/adamanwar/Desktop/Coding Projects/markitdown-drop"
   
   git init
   git add .
   git commit -m "Initial commit: MarkItDown Drop drag and drop converter"
   git branch -M main
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/markitdown-drop.git
   git push -u origin main
   ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the [Issues page](https://github.com/microsoft/markitdown/issues) for underlying MarkItDown capabilities.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
