# Steak Knives and Bagels

Jonas Heinke's personal website: [allknivesnobagel.com](https://www.allknivesnobagel.com).
Projects, writing, thoughts, talks, teaching, and a gallery of signed dither drawings.
Built with Jekyll; deployed by GitHub Actions to GitHub Pages behind Cloudflare.

## Local development

Install Ruby and Bundler, then run from this repository:

```sh
bundle install
ruby scripts/llms_full.rb
ruby scripts/gallery_bundle.rb
bundle exec jekyll serve
```

Visit http://localhost:4000. For a production build, run both pre-build scripts
again, then `bundle exec jekyll build`.

See [CLAUDE.md](CLAUDE.md) for repository conventions,
[scripts/README.md](scripts/README.md) for asset tooling, and
[AGENTS-WELCOME.md](AGENTS-WELCOME.md) for the footer gallery invitation.
