"""Generate brand assets (logo, favicons, OpenGraph images) for Auto Nexus BJ."""

from __future__ import annotations

from pathlib import Path
from typing import Iterable, Tuple

import PIL
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT_DIR = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT_DIR / "public"
BRAND_DIR = PUBLIC_DIR / "brand"
FAVICON_DIR = PUBLIC_DIR / "favicons"
OG_DIR = PUBLIC_DIR / "og"
APP_DIR = ROOT_DIR / "src" / "app"

BRAND_BLUE = (24, 120, 200, 255)
BRAND_DARK = (14, 44, 74, 255)
ACCENT_GREEN = (22, 163, 74, 255)
WHITE = (255, 255, 255, 255)
MUTED = (228, 235, 242, 230)

FONTS_DIR = Path(PIL.__file__).resolve().parent / "fonts"

BOLD_FONT_CANDIDATES = [
    FONTS_DIR / "DejaVuSans-Bold.ttf",
    Path("C:/Windows/Fonts/arialbd.ttf"),
    Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf"),
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
]

REGULAR_FONT_CANDIDATES = [
    FONTS_DIR / "DejaVuSans.ttf",
    Path("C:/Windows/Fonts/arial.ttf"),
    Path("/System/Library/Fonts/Supplemental/Arial.ttf"),
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
]


def load_font(candidates: Iterable[Path], size: int) -> ImageFont.FreeTypeFont:
    for path in candidates:
        try:
            return ImageFont.truetype(str(path), size=size)
        except OSError:
            continue
    raise RuntimeError(f"Unable to load any font from: {', '.join(str(p) for p in candidates)}")


def _text_bbox(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> Tuple[int, int]:
    bbox = draw.textbbox((0, 0), text, font=font)
    width = bbox[2] - bbox[0]
    height = bbox[3] - bbox[1]
    return width, height


def create_logo_mark(size: int = 1024) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    margin = int(size * 0.08)
    radius = int(size * 0.22)
    draw.rounded_rectangle(
        (margin, margin, size - margin, size - margin),
        radius=radius,
        fill=BRAND_BLUE,
    )

    # Subtle inner highlight for depth.
    highlight = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    highlight_draw = ImageDraw.Draw(highlight)
    highlight_draw.rounded_rectangle(
        (margin + 6, margin + 6, size - margin - 6, size - margin - 6),
        radius=radius - 4,
        outline=(255, 255, 255, 44),
        width=8,
    )
    canvas = Image.alpha_composite(canvas, highlight)

    text = "ANX"
    font = load_font(BOLD_FONT_CANDIDATES, int(size * 0.42))
    text_width, text_height = _text_bbox(draw, text, font)
    text_x = (size - text_width) // 2
    text_y = int(size * 0.28)
    draw.text((text_x, text_y), text, fill=WHITE, font=font)

    accent_width = int(text_width * 0.92)
    accent_height = int(size * 0.08)
    accent_x = (size - accent_width) // 2
    accent_y = text_y + text_height + int(size * 0.08)
    draw.rounded_rectangle(
        (accent_x, accent_y, accent_x + accent_width, accent_y + accent_height),
        radius=accent_height // 2,
        fill=ACCENT_GREEN,
    )

    return canvas


def create_wordmark(mark: Image.Image, width: int = 1800, height: int = 640) -> Image.Image:
    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    mark_target = int(height * 0.68)
    mark_resized = mark.resize((mark_target, mark_target), Image.LANCZOS)
    mark_x = int(height * 0.05)
    mark_y = (height - mark_target) // 2
    canvas.paste(mark_resized, (mark_x, mark_y), mark_resized)

    title_font = load_font(BOLD_FONT_CANDIDATES, int(height * 0.42))
    bj_font = load_font(BOLD_FONT_CANDIDATES, int(height * 0.35))
    tagline_font = load_font(REGULAR_FONT_CANDIDATES, int(height * 0.18))

    text_x = mark_x + mark_target + int(height * 0.08)
    text_y = int(height * 0.22)

    auto_text = "AUTO"
    nexus_text = "NEXUS"
    auto_width, auto_height = _text_bbox(draw, auto_text, title_font)
    nexus_width, nexus_height = _text_bbox(draw, nexus_text, title_font)
    main_height = max(auto_height, nexus_height)

    draw.text((text_x, text_y), auto_text, fill=BRAND_DARK, font=title_font)
    nexus_x = text_x + auto_width + int(height * 0.04)
    draw.text((nexus_x, text_y), nexus_text, fill=BRAND_BLUE, font=title_font)

    bj_text = "BJ"
    bj_width, bj_height = _text_bbox(draw, bj_text, bj_font)
    pill_padding_x = int(height * 0.06)
    pill_padding_y = int(height * 0.04)
    pill_width = bj_width + pill_padding_x * 2
    pill_height = bj_height + pill_padding_y * 2
    pill_x = nexus_x + nexus_width + int(height * 0.05)
    pill_y = text_y + (main_height - pill_height) // 2
    draw.rounded_rectangle(
        (pill_x, pill_y, pill_x + pill_width, pill_y + pill_height),
        radius=pill_height // 2,
        fill=ACCENT_GREEN,
    )
    bj_text_x = pill_x + pill_padding_x
    bj_text_y = pill_y + pill_padding_y - (draw.textbbox((0, 0), bj_text, font=bj_font)[1])
    draw.text((bj_text_x, bj_text_y), bj_text, fill=WHITE, font=bj_font)

    tagline_text = "Marketplace auto au Bénin"
    tagline_width, tagline_height = _text_bbox(draw, tagline_text, tagline_font)
    tagline_y = pill_y + pill_height + int(height * 0.08)
    draw.text((text_x, tagline_y), tagline_text, fill=BRAND_DARK[:3] + (220,), font=tagline_font)

    accent_line_y = tagline_y + tagline_height + int(height * 0.04)
    accent_line_width = int(tagline_width * 0.4)
    accent_line_height = max(4, int(height * 0.01))
    draw.rounded_rectangle(
        (
            text_x,
            accent_line_y,
            text_x + accent_line_width,
            accent_line_y + accent_line_height,
        ),
        radius=accent_line_height // 2,
        fill=ACCENT_GREEN,
    )

    return canvas


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, format="PNG")
    print(f"Saved {path.relative_to(ROOT_DIR)} ({image.width}x{image.height})")


def create_favicons(mark: Image.Image) -> None:
    sizes: Iterable[int] = (16, 32, 48, 64, 128, 180)
    for size in sizes:
        resized = mark.resize((size, size), Image.LANCZOS)
        save_png(resized, FAVICON_DIR / f"favicon-{size}.png")

    icon_192 = mark.resize((192, 192), Image.LANCZOS)
    save_png(icon_192, FAVICON_DIR / "icon-192.png")

    icon_512 = mark.resize((512, 512), Image.LANCZOS)
    save_png(icon_512, FAVICON_DIR / "icon-512.png")

    maskable = Image.new("RGBA", (512, 512), BRAND_BLUE)
    inset = mark.resize((int(512 * 0.78), int(512 * 0.78)), Image.LANCZOS)
    offset = ((512 - inset.width) // 2, (512 - inset.height) // 2)
    maskable.paste(inset, offset, inset)
    save_png(maskable, FAVICON_DIR / "icon-maskable.png")

    ico_sizes: Iterable[Tuple[int, int]] = [(16, 16), (32, 32), (48, 48), (64, 64)]
    ico_variants = [mark.resize(size, Image.LANCZOS) for size in ico_sizes]
    ico_path = APP_DIR / "favicon.ico"
    ico_path.parent.mkdir(parents=True, exist_ok=True)
    ico_variants[0].save(
        ico_path,
        format="ICO",
        sizes=[img.size for img in ico_variants],
    )
    print(f"Saved {ico_path.relative_to(ROOT_DIR)} (ICO with sizes {[img.size for img in ico_variants]})")


def create_open_graph(mark: Image.Image, width: int, height: int, filename: str) -> None:
    background = Image.new("RGBA", (width, height), BRAND_DARK)
    overlay = Image.new("RGBA", (width, height), BRAND_BLUE[:3] + (0,))
    overlay_draw = ImageDraw.Draw(overlay)
    ellipse_bounds = (
        int(-width * 0.2),
        int(-height * 0.6),
        int(width * 1.2),
        int(height * 1.4),
    )
    overlay_draw.ellipse(ellipse_bounds, fill=BRAND_BLUE[:3] + (210,))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=int(width * 0.08)))
    background = Image.alpha_composite(background, overlay)

    draw = ImageDraw.Draw(background)

    mark_size = int(min(width, height) * 0.22)
    mark_resized = mark.resize((mark_size, mark_size), Image.LANCZOS)
    mark_x = int(width * 0.08)
    mark_y = int(height * 0.18)
    background.paste(mark_resized, (mark_x, mark_y), mark_resized)

    title_font = load_font(BOLD_FONT_CANDIDATES, int(height * 0.18))
    subtitle_font = load_font(REGULAR_FONT_CANDIDATES, int(height * 0.08))
    footer_font = load_font(REGULAR_FONT_CANDIDATES, int(height * 0.06))

    title_text = "Auto Nexus BJ"
    subtitle_text = "Marketplace auto premium au Bénin"
    footer_text = "autonexus.bj • Explorez, comparez, engagez"

    title_width, title_height = _text_bbox(draw, title_text, title_font)
    title_x = mark_x
    title_y = mark_y + mark_size + int(height * 0.06)
    draw.text((title_x, title_y), title_text, fill=WHITE, font=title_font)

    subtitle_y = title_y + title_height + int(height * 0.03)
    draw.text((title_x, subtitle_y), subtitle_text, fill=MUTED, font=subtitle_font)

    footer_width, footer_height = _text_bbox(draw, footer_text, footer_font)
    footer_x = width - footer_width - int(width * 0.08)
    footer_y = height - footer_height - int(height * 0.08)
    draw.text((footer_x, footer_y), footer_text, fill=MUTED, font=footer_font)

    save_png(background.convert("RGB"), OG_DIR / filename)


def main() -> None:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    FAVICON_DIR.mkdir(parents=True, exist_ok=True)
    OG_DIR.mkdir(parents=True, exist_ok=True)

    mark = create_logo_mark()
    save_png(mark, BRAND_DIR / "anx-logo-mark.png")

    wordmark = create_wordmark(mark)
    save_png(wordmark, BRAND_DIR / "anx-logo.png")

    create_favicons(mark)
    create_open_graph(mark, 1200, 630, "og-default.png")
    create_open_graph(mark, 1200, 1200, "og-square.png")


if __name__ == "__main__":
    main()
