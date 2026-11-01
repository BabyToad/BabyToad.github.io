"""Validate built sharing metadata, Atom entries, and the main-build comparison."""

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://www.allknivesnobagel.com"
ATOM = {"a": "http://www.w3.org/2005/Atom"}


class Head(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.meta = {}
        self.links = []
        self.feed(html.split("</head>", 1)[0])

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta":
            key = attrs.get("property", attrs.get("name"))
            if key:
                assert key not in self.meta, f"Duplicate metadata: {key}"
                self.meta[key] = attrs.get("content", "")
        elif tag == "link":
            self.links.append(attrs)


def metadata(site):
    count = 0
    for path in sorted(site.rglob("*.html")):
        html = path.read_text(encoding="utf-8")
        if "<!-- Begin Jekyll SEO tag" not in html:
            continue  # Standalone tools, redirects and copied teaching pages.
        head = Head(html)
        for key in ("og:title", "og:description", "og:image", "og:type"):
            assert head.meta.get(key), (path, key)
        assert head.meta["twitter:card"] == "summary_large_image", path
        assert head.meta["og:type"] in {"article", "website"}, path
        image = head.meta["og:image"]
        parts = urlsplit(image)
        assert parts.scheme == "https" and parts.netloc, (path, image)
        assert parts.path.lower().endswith((".png", ".jpg", ".jpeg", ".webp")), image
        if image.startswith(ORIGIN + "/"):
            assert (site / unquote(parts.path).lstrip("/")).is_file(), image
        feeds = [link for link in head.links
                 if link.get("rel") == "alternate"
                 and link.get("type") == "application/atom+xml"]
        assert len(feeds) == 1 and feeds[0]["href"] == ORIGIN + "/feed.xml", path
        count += 1
    assert count > 0
    print(f"Validated {count} SEO heads: OG title/description/image/type, Twitter card, feed link")


def feed_entries(site):
    feed = ET.parse(site / "feed.xml").getroot()
    entries = feed.findall("a:entry", ATOM)
    ids = [entry.findtext("a:id", namespaces=ATOM) for entry in entries]
    assert len(ids) == len(set(ids)), "Duplicate Atom IDs"
    dates = [entry.findtext("a:published", namespaces=ATOM) for entry in entries]
    assert dates == sorted(dates, reverse=True), "Feed is not newest first"
    return {entry.findtext("a:id", namespaces=ATOM): entry for entry in entries}


def body(html, variants):
    html = re.sub(r"<head\b[^>]*>.*?</head>", "<head></head>", html,
                  count=1, flags=re.S | re.I)
    for variant, original in variants.items():
        html = html.replace(f'src="{variant}"', f'src="{original}"')
    # Existing image-alternates script uses site.time, unrelated to this change.
    return re.sub(r"(image-alternates\.js\?v=)\d+", r"\1BUILD_TIME", html)


def compare(site, baseline):
    manifest = json.loads((ROOT / "_data/images.json").read_text(encoding="utf-8"))
    variants = {v["src"]: original for original, entry in manifest["images"].items()
                for codec in ("avif", "webp") for v in entry[codec]}
    old_pages = {p.relative_to(baseline) for p in baseline.rglob("*.html")}
    new_pages = {p.relative_to(site) for p in site.rglob("*.html")}
    assert old_pages == new_pages, (old_pages - new_pages, new_pages - old_pages)
    changed = []
    for name in sorted(old_pages):
        old = (baseline / name).read_text(encoding="utf-8")
        new = (site / name).read_text(encoding="utf-8")
        assert body(old, variants) == body(new, variants), f"Body changed: {name}"
        if old != new:
            changed.append(str(name))
    print(f"Compared {len(old_pages)} HTML files; {len(changed)} changed only in heads/img fallback")

    old_feed, new_feed = feed_entries(baseline), feed_entries(site)
    assert old_feed.keys() <= new_feed.keys(), "Existing feed entries were lost"
    for key, old in old_feed.items():
        new = new_feed[key]
        for field in ("title", "link", "published", "content"):
            before, after = old.find("a:" + field, ATOM), new.find("a:" + field, ATOM)
            assert before is not None and after is not None
            assert before.attrib == after.attrib, (key, field)
            assert before.text == after.text, (key, field)
    thought_urls = {ORIGIN + "/thoughts/" + p.stem[11:] + "/"
                    for p in (ROOT / "_thoughts").glob("*.md")}
    links = {e.find("a:link", ATOM).get("href") for e in new_feed.values()}
    assert thought_urls <= links, "A thought is absent from the combined feed"
    print(f"Feed: {len(new_feed)} entries, all {len(old_feed)} baseline entries retained, "
          f"all {len(thought_urls)} thoughts included")

    before = (baseline / "sitemap.xml").read_bytes()
    after = (site / "sitemap.xml").read_bytes()
    assert before == after, "Sitemap differs from baseline"
    print("Sitemap is byte-for-byte unchanged")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, default=Path("_site"))
    parser.add_argument("--baseline", type=Path)
    args = parser.parse_args()
    metadata(args.site)
    feed_entries(args.site)
    if args.baseline:
        compare(args.site, args.baseline)
