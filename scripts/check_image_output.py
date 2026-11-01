"""Audit built responsive images and the projects index's conservative byte budget."""

import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class Images(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.images = []
        self.sources = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "picture":
            assert self.sources is None, "Nested picture"
            self.sources = []
        elif tag == "source" and self.sources is not None:
            self.sources.append(attrs)
        elif tag == "img":
            self.images.append((attrs, list(self.sources or [])))

    def handle_endtag(self, tag):
        if tag == "picture":
            self.sources = None


def local(site, src):
    return site / unquote(urlsplit(src).path).lstrip("/")


def candidates(source):
    return [(part.strip().split()[0], int(part.strip().split()[1][:-1]))
            for part in source["srcset"].split(",")]


def budget(site):
    images = Images((site / "projects/index.html").read_text(encoding="utf-8")).images
    assert images, "No project card images found; review budget"
    print(f"Projects: {len(images)} thumbnail images")
    for codec in ("avif", "webp", "img fallback"):
        small, large = set(), set()
        for img, sources in images:
            source = next((s for s in sources if s.get("type") == f"image/{codec}"), None)
            variants = candidates(source) if source else [(img["src"], 0)]
            small.add(local(site, min(variants, key=lambda v: v[1])[0]))
            large.add(local(site, max(variants, key=lambda v: v[1])[0]))
        low = sum(p.stat().st_size for p in small)
        high = sum(p.stat().st_size for p in large)
        print(f"Projects {codec}: small {low:,} bytes; largest {high:,} bytes")
        yield high


def audit(site):
    count = 0
    for page in site.rglob("*.html"):
        if page.relative_to(site).parts[0] in {"assets", "teaching"}:
            continue
        html = page.read_text(encoding="utf-8")
        if "/assets/images/" not in html:
            continue
        for img, sources in Images(html).images:
            if not img.get("src", "").startswith("/assets/images/"):
                continue
            assert local(site, img["src"]).is_file(), (page, img)
            assert int(img.get("width", 0)) > 0 and int(img.get("height", 0)) > 0, (page, img)
            assert {s["type"] for s in sources} == {"image/avif", "image/webp"}, (page, img)
            for source in sources:
                assert source.get("sizes"), (page, source)
                for src, width in candidates(source):
                    assert width > 0 and local(site, src).is_file(), (page, src)
            count += 1
    assert count > 0
    print(f"Verified {count} local image occurrences: dimensions, sources, sizes, output files")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, default=Path("_site"))
    parser.add_argument("--baseline", type=Path)
    args = parser.parse_args()
    if args.baseline:
        print("Baseline:")
        list(budget(args.baseline))
    print("Current:")
    sizes = list(budget(args.site))
    assert max(sizes[:2]) < 1_000_000, "Projects responsive sources exceed 1 MB"
    audit(args.site)
