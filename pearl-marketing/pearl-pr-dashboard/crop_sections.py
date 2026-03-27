"""Crop dashboard PDF into individual section PNGs with transparent backgrounds."""
from PIL import Image
import numpy as np
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(SCRIPT_DIR, "output", "dashboard_full.png")
OUT = os.path.join(SCRIPT_DIR, "output")

img = Image.open(SRC).convert("RGBA")
W, H = img.size  # 2550 x 3300
print(f"Source: {W}x{H}")

# PDF coordinate conversion (612x792pt page at 300dpi = 2550x3300px)
# PDF y=0 is bottom, image y=0 is top
S = 600 / 72  # 8.3333 px per pt

def pdf_to_px(x_pt, y_pt):
    return int(x_pt * S), int((792 - y_pt) * S)

def crop_section(name, x1_pt, y1_pt, x2_pt, y2_pt, pad=4):
    """Crop a section. y1 < y2 in PDF coords (y1=bottom, y2=top)."""
    px1, py2 = pdf_to_px(x1_pt, y2_pt)  # top-left in image
    px2, py1 = pdf_to_px(x2_pt, y1_pt)  # bottom-right in image
    # Add padding
    px1 = max(0, px1 - pad)
    py2_img = max(0, py2 - pad)
    px2 = min(W, px2 + pad)
    py1_img = min(H, py1 + pad)
    cropped = img.crop((px1, py2_img, px2, py1_img))
    # Make background transparent (#f5f6f8)
    arr = np.array(cropped)
    bg = np.array([245, 246, 248, 255])
    tolerance = 8
    mask = np.all(np.abs(arr.astype(int) - bg.astype(int)) < tolerance, axis=-1)
    arr[mask] = [0, 0, 0, 0]
    result = Image.fromarray(arr)
    path = os.path.join(OUT, f"section_{name}.png")
    result.save(path, "PNG")
    print(f"  {name}: {result.size[0]}x{result.size[1]} -> {path}")
    return path

# Dashboard layout from dashboard.py:
# M = 24pt, page = 612x792pt
M = 24
PAGE_W = 612
PAGE_H = 792
hh = 44  # header height
col_split = PAGE_W * 0.48  # ~293.76

# Section coordinates (x1, y_bottom, x2, y_top) in PDF points
sections = {
    # Sprint Timeline (title at ty=724, box bottom at 628)
    "timeline": (M - 4, 624, PAGE_W - M + 4, 730),
    # Press Release Performance (left)
    "press_perf": (M - 4, 466, col_split + 2, 620),
    # Q1 Progress Rings (right)
    "q1_rings": (col_split + 6, 466, PAGE_W - M + 4, 620),
    # Press Release Pipeline (left top of row 3)
    "press_pipeline": (M - 4, 380, col_split - 2, 460),
    # Earned Media Coverage (left bottom of row 3)
    "earned_media": (M - 4, 290, col_split - 2, 384),
    # Thought Leadership Pipeline (right top of row 3)
    "thought_leadership": (col_split + 2, 296, PAGE_W - M + 4, 460),
    # Active Media Conversations + Pitching (right bottom of row 3)
    "active_media": (col_split + 2, 196, PAGE_W - M + 4, 300),
}

print("Cropping sections...")
paths = {}
for name, (x1, y1, x2, y2) in sections.items():
    paths[name] = crop_section(name, x1, y1, x2, y2)

print(f"\nDone! {len(paths)} sections exported.")
