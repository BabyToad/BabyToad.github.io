source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
gem "github-pages", group: :jekyll_plugins

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem 'jekyll-last-modified-at'
  gem 'jekyll-katex'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :x64_mingw, :mswin, :jruby]

# Remove the WDM gem temporarily
# gem 'wdm', '~> 0.1.1' if Gem.win_platform?

gem "webrick", "~> 1.8"

# Lock `http_parser.rb` gem to `v0.6.x` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

gem 'faraday-retry'

gem 'wdm', '>= 0.1.0' if Gem.win_platform?