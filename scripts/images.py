"""Generate committed responsive images. See scripts/README.md for usage."""

import argparse
import hashlib
import json
import re
from pathlib import Path

from PIL import Image, ImageOps, __version__, features

ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "assets/images"
MANIFEST = ROOT / "_data/images.json"
SETTINGS = {"widths": [480, 960], "webp_quality": 82, "avif_quality": 55,
            "webp_method": 6, "avif_speed": 6}
GENERATED = re.compile(r"-\d+w\.(webp|avif)$", re.I)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def url(path):
    return "/" + path.relative_to(ROOT).as_posix()


def originals():
    return sorted(p for p in IMAGE_ROOT.rglob("*")
                  if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
                  and not GENERATED.search(p.name))


def generate():
    for codec in ("webp", "avif"):
        if not features.check(codec):
            raise SystemExit(f"Pillow needs {codec} support; see scripts/README.md")
    images = {}
    outputs = set()
    for source in originals():
        with Image.open(source) as raw:
            if getattr(raw, "is_animated", False):
                print(f"Skip animation (keep original): {url(source)}")
                continue
            image = ImageOps.exif_transpose(raw).convert("RGBA")
            if image.getextrema()[3] == (255, 255):
                image = image.convert("RGB")
            entry = {"width": image.width, "height": image.height,
                     "sha256": digest(source), "webp": [], "avif": []}
            for width in sorted({min(w, image.width) for w in SETTINGS["widths"]}):
                height = max(1, round(image.height * width / image.width))
                resized = image.resize((width, height), Image.Resampling.LANCZOS)
                for codec in ("webp", "avif"):
                    target = source.with_name(f"{source.stem}-{width}w.{codec}")
                    if target in outputs or target == source:
                        raise SystemExit(f"Conflicting image stems: {source}")
                    outputs.add(target)
                    options = {"quality": SETTINGS[f"{codec}_quality"]}
                    if codec == "webp":
                        options["method"] = SETTINGS["webp_method"]
                    else:
                        options.update(speed=SETTINGS["avif_speed"], max_threads=1)
                    resized.save(target, format=codec.upper(), **options)
                    size = target.stat().st_size
                    if size > 500_000:
                        raise SystemExit(f"Derivative exceeds 500 KB: {target}")
                    entry[codec].append({"src": url(target), "width": width,
                                         "height": height, "bytes": size,
                                         "sha256": digest(target)})
            images[url(source)] = entry
            print(f"Generated {url(source)}")
    # Only remove derivatives with our reserved suffix, inside assets/images.
    for old in IMAGE_ROOT.rglob("*"):
        if GENERATED.search(old.name) and old not in outputs:
            old.unlink()
    MANIFEST.write_text(json.dumps({"settings": SETTINGS, "pillow": __version__,
                                   "images": images}, indent=2) + "\n", encoding="utf-8")


def check():
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assert data["settings"] == SETTINGS, "Encoder settings changed; regenerate"
    expected = set()
    for source in originals():
        with Image.open(source) as image:
            if getattr(image, "is_animated", False):
                continue
            oriented = ImageOps.exif_transpose(image)
            dimensions = oriented.size
        key = url(source)
        expected.add(key)
        entry = data["images"][key]
        assert entry["sha256"] == digest(source), f"Changed original: {key}"
        assert dimensions == (entry["width"], entry["height"]), key
        widths = sorted({min(w, dimensions[0]) for w in SETTINGS["widths"]})
        for codec in ("webp", "avif"):
            assert [v["width"] for v in entry[codec]] == widths, key
            for variant in entry[codec]:
                path = ROOT / variant["src"].lstrip("/")
                assert path.stat().st_size == variant["bytes"] <= 500_000, path
                assert digest(path) == variant["sha256"], path
                with Image.open(path) as image:
                    image.load()
                    assert image.size == (variant["width"], variant["height"]), path
    assert set(data["images"]) == expected, "Removed originals; regenerate"
    listed = {v["src"] for entry in data["images"].values()
              for codec in ("webp", "avif") for v in entry[codec]}
    actual = {url(p) for p in IMAGE_ROOT.rglob("*") if GENERATED.search(p.name)}
    assert actual == listed, "Stale derivatives; regenerate"
    print(f"Verified {len(expected)} originals and {len(listed)} derivatives")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="verify without writing")
    args = parser.parse_args()
    if args.check:
        check()
    else:
        generate()
