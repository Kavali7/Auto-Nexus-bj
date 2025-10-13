# -*- coding: utf-8 -*-
import hashlib
import pathlib
import re

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[1]
VEHICLE_DEF = ROOT / "src/data/vehicle-definitions.ts"
DEALER_DEF = ROOT / "src/data/dealer-definitions.ts"

vehicle_paths = set(re.findall(r'"(vehicles/[^"\\]+)"', VEHICLE_DEF.read_text(encoding="utf-8")))
dealer_paths = set(re.findall(r'"(dealers/[^"\\]+)"', DEALER_DEF.read_text(encoding="utf-8")))

for folder in [
    ROOT / "public/vehicles",
    ROOT / "public/vehicles/blur",
    ROOT / "public/dealers",
    ROOT / "public/dealers/blur",
    ROOT / "public/brand",
]:
    folder.mkdir(parents=True, exist_ok=True)


def colors_from_name(name: str):
    digest = hashlib.sha1(name.encode("utf-8")).hexdigest()
    base = tuple(int(digest[i : i + 2], 16) for i in range(0, 6, 2))
    highlight = tuple(min(255, c + 60) for c in base)
    return base, highlight


def create_placeholder(path: pathlib.Path, label: str, size=(1600, 900)):
    base, highlight = colors_from_name(label)
    img = Image.new("RGB", size, base)
    draw = ImageDraw.Draw(img)
    for y in range(size[1]):
        ratio = y / max(size[1] - 1, 1)
        line_color = tuple(
            int(base[i] * (1 - ratio) + highlight[i] * ratio) for i in range(3)
        )
        draw.line([(0, y), (size[0], y)], fill=line_color)

    title = label.replace("_", " ").replace("-", " ").title()
    try:
        font = ImageFont.truetype("arial.ttf", 64)
    except Exception:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), title, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    box = [
        (size[0] * 0.05, size[1] * 0.75 - text_h * 1.5),
        (size[0] * 0.8, size[1] * 0.75 + text_h * 0.5),
    ]
    draw.rectangle(box, fill=(0, 0, 0, 140))
    draw.text(
        (size[0] * 0.07, size[1] * 0.75 - text_h * 0.5),
        title,
        font=font,
        fill=(255, 255, 255),
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, optimize=True, quality=88)
    blur = img.resize((48, 32)).filter(ImageFilter.GaussianBlur(2))
    blur_path = path.parent / "blur" / path.name
    blur_path.parent.mkdir(parents=True, exist_ok=True)
    blur.save(blur_path, format="WEBP", quality=70)


for rel in vehicle_paths:
    target = ROOT / "public" / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        target = target.with_suffix(".webp")
    create_placeholder(target, pathlib.Path(rel).stem)

for rel in dealer_paths:
    target = ROOT / "public" / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        target = target.with_suffix(".webp")
    create_placeholder(target, pathlib.Path(rel).stem, size=(1400, 840))

logo_path = ROOT / "public/brand/anx-logo.png"
logo = Image.new("RGBA", (600, 240), (0, 0, 0, 0))
draw_logo = ImageDraw.Draw(logo)
primary = (24, 120, 200)
draw_logo.rounded_rectangle([32, 32, 208, 208], radius=88, fill=primary)
draw_logo.rounded_rectangle([196, 48, 576, 208], radius=52, outline=primary, width=6)
try:
    font_main = ImageFont.truetype("arial.ttf", 96)
    font_sub = ImageFont.truetype("arial.ttf", 48)
except Exception:
    font_main = ImageFont.load_default()
    font_sub = ImageFont.load_default()
draw_logo.text((72, 90), "AN", font=font_main, fill=(255, 255, 255))
draw_logo.text((210, 88), "AUTO", font=font_main, fill=primary)
draw_logo.text((210, 156), "NEXUS BJ", font=font_sub, fill=primary)
logo = ImageOps.expand(logo, border=8, fill=(0, 0, 0, 0))
logo.save(logo_path, optimize=True)
print("Placeholders & logo générés.")
