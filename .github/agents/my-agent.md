---
name:
description:
---

# My Agent

Describe what your agent does here...You are building a Windows desktop application named "SpicyFit" — an AI Clothing Try-On software that runs locally (no GPU required) and performs inference via the free Hugging Face Space API at [https://huggingface.co/spaces/HumanAIGC/OutfitAnyone](https://huggingface.co/spaces/HumanAIGC/OutfitAnyone).

Build the full project in Python with PyQt6, using this structure:

📁 Project Structure:

* main.py        → App entry, event loop
* ui.py          → PyQt6 UI
* backend.py     → Cloud inference with Hugging Face Space
* utils.py       → Image utilities
* requirements.txt
* README.md

───────────────────────────────────────────────
🖥️ UI (ui.py)

* Dark theme (use QDarkTheme or QDarkStyle).
* Window title: “SpicyFit — AI Clothing Try‑On”
* Two upload panels:
  • “Upload User Image”
  • “Upload Clothing Image”
* “Spice Level” slider (0–100)
* “Blur Background” checkbox
* “Try On” button
* “Save Result” button (disabled until image generated)
* Display area for the resulting image
* Status label for messages
  Use PyQt6 layouts, signals, slots.

───────────────────────────────────────────────
⚙️ Backend (backend.py)
Implement `generate_tryon_result(user_image_path, cloth_image_path, spice_level=50, blur=False)`.

This function should:

1. Upload the user and clothing images to the Hugging Face API endpoint of OutfitAnyone.
2. Example payload:

   ```python
   import requests, time, os

   def generate_tryon_result(user_image, cloth_image, spice_level=50, blur=False):
       url = "https://huggingface.co/spaces/HumanAIGC/OutfitAnyone/run/predict"
       files = {
           "data": (
               None,
               [
                   open(user_image, "rb"),
                   open(cloth_image, "rb"),
                   {"spice_level": spice_level}
               ]
           )
       }
       r = requests.post(url, files=files)
       result = r.json()
       image_url = result["data"][0]  # check actual JSON key
       img_data = requests.get(image_url).content
       with open("result.jpg", "wb") as f:
           f.write(img_data)
       return "result.jpg"
   ```
3. Handle all exceptions (network, API, file errors).

───────────────────────────────────────────────
🔗 main.py

* Launch UI.
* When “Try On” clicked:

  1. Validate both images.
  2. Call backend `generate_tryon_result()`.
  3. Display the result image in the preview area.
  4. Enable “Save Result” button.
* When “Save Result” clicked → open file dialog to save locally.
  Use threads or async calls so UI doesn’t freeze.

───────────────────────────────────────────────
🧩 utils.py

* Helpers for image format conversion, resizing, and background blur using OpenCV.

───────────────────────────────────────────────
📦 Packaging

* Create `requirements.txt` (PyQt6, requests, pillow, opencv-python, QDarkTheme).
* Add PyInstaller build config:
  Command: `pyinstaller --onefile --noconsole main.py`
* Output: SpicyFit.exe

───────────────────────────────────────────────
📘 README.md
Include:

* Installation guide
* How to run:

  ```bash
  pip install -r requirements.txt
  python main.py
  ```
* Example screenshots
* Notes about using the free API endpoint (latency, CPU only).
* Set expectation: “May take longer per image, but cost = zero”.

───────────────────────────────────────────────
🎯 Goal:
Generate clean, modular, production‑ready Python code for this full structure.
Ensure everything runs locally without GPU and uses the free Hugging Face Space API for AI inference.
