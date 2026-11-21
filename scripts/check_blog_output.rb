#!/usr/bin/env ruby
# Audit actual emitted archives against Jekyll's collection, without new gems.
require 'jekyll'
require 'cgi'

root = File.expand_path('..', __dir__)
destination = File.expand_path(ARGV.fetch(0, '_site'), root)
site = Jekyll::Site.new(Jekyll.configuration('source' => root, 'destination' => destination, 'quiet' => true))
site.reset
site.read
expected = site.collections.fetch('blog').docs.select do |doc|
  doc.data['visibility'] == 'public' && doc.data['published'] != false
end.sort_by(&:date).reverse
raise 'Public Blog collection is empty' if expected.empty?

read = ->(path) { File.read(File.join(destination, path)) }
check = ->(condition, message) { raise message unless condition }
text = ->(html) { CGI.unescapeHTML(html.gsub(/<[^>]+>/, '').gsub(/\s+/, ' ').strip) }
archives = %w[blog/index.html blog.html].map do |path|
  html = read.call(path)
  check.call(html.scan(/<main\b/).length == 1, "#{path}: expected one main landmark")
  check.call(html.scan(/<h1\b/).length == 1, "#{path}: expected one archive heading")
  canonical = html.scan(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/).flatten
  check.call(canonical == ["#{site.config.fetch('url')}/blog/"], "#{path}: wrong canonical #{canonical.inspect}")
  rows = html.scan(/<article\b[^>]*class="post-row"[^>]*>(.*?)<\/article>/m).flatten
  check.call(rows.length == expected.length, "#{path}: expected #{expected.length} public posts, got #{rows.length}")
  rows.zip(expected).each do |row, doc|
    link = row.match(/<h2>\s*<a href="([^"]+)">(.*?)<\/a>/m)
    date = row.match(/<time datetime="([^"]+)">(.*?)<\/time>/m)
    check.call(link && date, "#{path}: post needs a level-two linked heading and date")
    check.call(link[1] == doc.url && text.call(link[2]) == doc.data.fetch('title'), "#{path}: wrong post/order for #{doc.url}")
    check.call(text.call(date[2]) == doc.date.strftime('%Y-%m-%d') && Date.parse(date[1]) == doc.date.to_date, "#{path}: wrong date for #{doc.url}")
    target = doc.destination(destination)
    check.call(File.file?(target), "#{path}: missing destination #{doc.url}")
    check.call(read.call(target.delete_prefix(destination + '/')).include?('<h1'), "#{path}: destination has no reading heading #{doc.url}")
  end
  rows
end
check.call(archives[0] == archives[1], 'Legacy and canonical archive rows differ')
legacy = read.call('blog.html')
check.call(legacy.match?(/<meta http-equiv="refresh" content="0; url=\/blog\/">/), 'Legacy archive must still redirect')
check.call(legacy.include?('<a href="/blog/">Blog</a>'), 'Legacy archive needs a manual canonical link')
check.call(read.call('index.html').include?('href="/blog/"'), 'Homepage must link to the canonical archive')
sitemap = read.call('sitemap.xml')
check.call(sitemap.include?("#{site.config.fetch('url')}/blog/</loc>") && !sitemap.include?('/blog.html</loc>'), 'Sitemap must list only the canonical archive')
puts "Blog output: both archives expose #{expected.length} matching dated public posts, reading destinations, landmarks, canonical and redirect; homepage and sitemap agree."
