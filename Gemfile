source "https://rubygems.org"

# Actions builds directly; no GitHub Pages dependency/theme bundle.
gem "jekyll", "~> 4.4"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-last-modified-at", "~> 1.3"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:windows, :jruby]

# Windows file-watcher for `jekyll serve --watch` (skipped on Linux/CI)
gem 'wdm', '>= 0.1.0', platforms: [:windows]

gem "webrick", "~> 1.8"
