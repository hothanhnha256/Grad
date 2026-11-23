"""Resize source photos (photo/) and campus map (map/) into web-ready files in public/img/.

Run: python3 scripts/optimize_images.py
"""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC_PHOTOS = ROOT / "photo"
SRC_MAP = ROOT / "map" / "image.png"
OUT = ROOT / "public" / "img"
KB = 1024

HERO = "QN801080.jpg"
GALLERY = ["QN801080.jpg", "QN800648.jpg", "QN801025.jpg", "QN800641.jpg", "QN800848.jpg"]


def load(path: Path) -> Image.Image:
    return ImageOps.exif_transpose(Image.open(path)).convert("RGB")


def resize_width(im: Image.Image, width: int) -> Image.Image:
    if im.width <= width:
        return im.copy()
    height = round(im.height * width / im.width)
    return im.resize((width, height), Image.LANCZOS)


def save_budget(im: Image.Image, dest: Path, fmt: str, budget: float, quality: int = 80) -> None:
    """Save im, lowering quality by 5 until the file fits the byte budget."""
    while True:
        kwargs = {"quality": quality}
        if fmt == "WEBP":
            kwargs["method"] = 6
        else:
            kwargs.update(optimize=True, progressive=True)
        im.save(dest, fmt, **kwargs)
        size = dest.stat().st_size
        if size <= budget or quality <= 40:
            print(f"{dest.name}: {size // KB} KB (q={quality})")
            return
        quality -= 5


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    hero = load(SRC_PHOTOS / HERO)
    save_budget(resize_width(hero, 1600), OUT / "hero-1600.webp", "WEBP", 350 * KB)
    save_budget(resize_width(hero, 800), OUT / "hero-800.webp", "WEBP", 150 * KB)

    for i, name in enumerate(GALLERY, start=1):
        im = load(SRC_PHOTOS / name)
        save_budget(resize_width(im, 1200), OUT / f"gallery-{i}-1200.webp", "WEBP", 400 * KB)
        save_budget(resize_width(im, 600), OUT / f"gallery-{i}-600.webp", "WEBP", 120 * KB)

    campus = Image.open(SRC_MAP).convert("RGB")
    save_budget(campus, OUT / "campus-map.webp", "WEBP", 400 * KB, quality=85)

    # Open Graph preview: 1200x630 band around the face (upper third of the hero).
    w = hero.width
    h = round(w * 630 / 1200)
    top = max(0, round(hero.height * 0.30) - h // 2)
    og = hero.crop((0, top, w, top + h)).resize((1200, 630), Image.LANCZOS)
    save_budget(og, OUT / "og.jpg", "JPEG", 200 * KB, quality=82)


if __name__ == "__main__":
    main()
