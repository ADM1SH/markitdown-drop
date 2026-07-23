document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const uploadOverlay = document.getElementById("upload-overlay");
    const uploadStatusText = document.getElementById("upload-status-text");

    const resultSection = document.getElementById("result-section");
    const emptyPreview = document.getElementById("empty-preview");
    const activeResult = document.getElementById("active-result");

    const currentFilename = document.getElementById("current-filename");
    const currentFileMeta = document.getElementById("current-file-meta");
    const fileTypeIcon = document.getElementById("file-type-icon");

    const markdownOutput = document.getElementById("markdown-output");
    const renderedOutput = document.getElementById("rendered-output");

    const tabRaw = document.getElementById("tab-raw");
    const tabPreview = document.getElementById("tab-preview");
    const viewRawContainer = document.getElementById("view-raw-container");
    const viewPreviewContainer = document.getElementById("view-preview-container");

    const copyBtn = document.getElementById("copy-btn");
    const copyText = document.getElementById("copy-text");
    const downloadBtn = document.getElementById("download-btn");

    const queueContainer = document.getElementById("queue-container");
    const fileQueueList = document.getElementById("file-queue-list");
    const clearQueueBtn = document.getElementById("clear-queue-btn");

    // State Management
    let convertedFiles = []; // { filename, markdown, file_size, extension }
    let activeIndex = -1;

    // Supported Icon Mapping
    const ICON_MAP = {
        ".pdf": "fa-file-pdf",
        ".docx": "fa-file-word",
        ".pptx": "fa-file-powerpoint",
        ".xlsx": "fa-file-excel",
        ".xls": "fa-file-excel",
        ".csv": "fa-file-csv",
        ".json": "fa-file-code",
        ".html": "fa-file-code",
        ".jpg": "fa-file-image",
        ".jpeg": "fa-file-image",
        ".png": "fa-file-image",
        ".wav": "fa-file-audio",
        ".mp3": "fa-file-audio",
        ".zip": "fa-file-zipper"
    };

    // -------------------------------------------------------------
    // Drag and Drop Event Listeners
    // -------------------------------------------------------------
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add("drag-over"), false);
    });

    ["dragleave", "drop"].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove("drag-over"), false);
    });

    dropZone.addEventListener("drop", handleDrop, false);
    fileInput.addEventListener("change", (e) => handleFiles(e.target.files), false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // -------------------------------------------------------------
    // File Upload & Conversion API Call
    // -------------------------------------------------------------
    async function handleFiles(files) {
        if (!files || files.length === 0) return;

        showLoading(true, `Processing ${files.length} file(s)...`);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            uploadStatusText.textContent = `Converting ${file.name} (${i + 1}/${files.length})...`;

            try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("/api/convert", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    addConvertedFile({
                        filename: data.filename,
                        markdown: data.markdown,
                        file_size: data.file_size,
                        extension: data.extension
                    });
                } else {
                    alert(`Error converting ${file.name}: ${data.error}`);
                }
            } catch (err) {
                console.error("Upload error:", err);
                alert(`Failed to convert ${file.name}. Please check server logs.`);
            }
        }

        showLoading(false);
        fileInput.value = ""; // Reset input
    }

    function showLoading(isLoading, text = "Converting file...") {
        if (isLoading) {
            uploadStatusText.textContent = text;
            uploadOverlay.classList.remove("hidden");
        } else {
            uploadOverlay.classList.add("hidden");
        }
    }

    // -------------------------------------------------------------
    // State & UI Update Functions
    // -------------------------------------------------------------
    function addConvertedFile(fileData) {
        convertedFiles.unshift(fileData); // add to top
        activeIndex = 0;
        renderQueue();
        displayActiveFile();
    }

    function displayActiveFile() {
        if (activeIndex < 0 || activeIndex >= convertedFiles.length) {
            emptyPreview.classList.remove("hidden");
            activeResult.classList.add("hidden");
            resultSection.classList.add("empty-state");
            return;
        }

        const file = convertedFiles[activeIndex];
        emptyPreview.classList.add("hidden");
        activeResult.classList.remove("hidden");
        resultSection.classList.remove("empty-state");

        currentFilename.textContent = file.filename.replace(/\.[^/.]+$/, "") + ".md";
        currentFileMeta.textContent = formatBytes(file.file_size) + " • " + file.filename;

        // Set Icon
        const iconClass = ICON_MAP[file.extension.toLowerCase()] || "fa-file-lines";
        fileTypeIcon.className = `fa-solid ${iconClass} file-icon`;

        // Set Markdown content
        markdownOutput.value = file.markdown;

        // Render HTML Preview
        if (window.marked) {
            renderedOutput.innerHTML = marked.parse(file.markdown);
        } else {
            renderedOutput.textContent = file.markdown;
        }
    }

    function renderQueue() {
        if (convertedFiles.length === 0) {
            queueContainer.classList.add("hidden");
            return;
        }

        queueContainer.classList.remove("hidden");
        fileQueueList.innerHTML = "";

        convertedFiles.forEach((item, index) => {
            const li = document.createElement("li");
            li.className = `queue-item ${index === activeIndex ? "active" : ""}`;
            
            const iconClass = ICON_MAP[item.extension.toLowerCase()] || "fa-file-lines";
            
            li.innerHTML = `
                <div class="queue-item-info">
                    <i class="fa-solid ${iconClass}"></i>
                    <span class="queue-item-name">${escapeHtml(item.filename)}</span>
                </div>
                <i class="fa-solid fa-chevron-right" style="font-size: 11px; opacity: 0.5;"></i>
            `;

            li.addEventListener("click", () => {
                activeIndex = index;
                renderQueue();
                displayActiveFile();
            });

            fileQueueList.appendChild(li);
        });
    }

    clearQueueBtn.addEventListener("click", () => {
        convertedFiles = [];
        activeIndex = -1;
        renderQueue();
        displayActiveFile();
    });

    // -------------------------------------------------------------
    // Tab Switching (Raw Markdown vs Rendered Preview)
    // -------------------------------------------------------------
    tabRaw.addEventListener("click", () => switchTab("raw"));
    tabPreview.addEventListener("click", () => switchTab("preview"));

    function switchTab(tab) {
        if (tab === "raw") {
            tabRaw.classList.add("active");
            tabPreview.classList.remove("active");
            viewRawContainer.classList.remove("hidden");
            viewPreviewContainer.classList.add("hidden");
        } else {
            tabPreview.classList.add("active");
            tabRaw.classList.remove("active");
            viewPreviewContainer.classList.remove("hidden");
            viewRawContainer.classList.add("hidden");
        }
    }

    // -------------------------------------------------------------
    // Copy & Download Functionality
    // -------------------------------------------------------------
    copyBtn.addEventListener("click", () => {
        const text = markdownOutput.value;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            copyText.textContent = "Copied!";
            copyBtn.style.background = "#10b981";
            setTimeout(() => {
                copyText.textContent = "Copy";
                copyBtn.style.background = "";
            }, 2000);
        }).catch(err => {
            console.error("Could not copy text: ", err);
        });
    });

    downloadBtn.addEventListener("click", () => {
        if (activeIndex < 0 || activeIndex >= convertedFiles.length) return;
        const file = convertedFiles[activeIndex];
        const mdFileName = file.filename.replace(/\.[^/.]+$/, "") + ".md";
        
        const blob = new Blob([file.markdown], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = mdFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // -------------------------------------------------------------
    // Helper Functions
    // -------------------------------------------------------------
    function formatBytes(bytes, decimals = 1) {
        if (!bytes || bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
});
