#!/usr/bin/env ruby
# Writes llms-full.txt at the site root: the raw markdown of every public
# thought, blog post, project page and For Want of Fuel chapter, one entry per
# heading with its source URL. Companion to llms.txt (a Liquid page).
#
# Runs before `jekyll build` (see .github/workflows/pages.yml). It is a plain
# script rather than a Jekyll plugin because the github-pages gem disables
# custom _plugins. Output is gitignored; Jekyll copies it through as a static
# file. Local check: `ruby scripts/llms_full.rb && head llms-full.txt`.
require 'yaml'
require 'date'

ROOT = File.expand_path('..', __dir__)
CONFIG = YAML.safe_load(File.read(File.join(ROOT, '_config.yml')), permitted_classes: [Date, Time]) || {}
BASE = CONFIG['url'].to_s

def read_doc(path)
  text = File.read(path, encoding: 'utf-8')
  return [{}, text] unless text.start_with?('---')
  _, fm, body = text.split(/^---\s*$/, 3)
  data = YAML.safe_load(fm.to_s, permitted_classes: [Date, Time]) || {}
  [data, body.to_s]
end

def clean(text)
  text.gsub(/\{%.*?%\}/m, '').gsub(/\{\{.*?\}\}/m, '').gsub(/\n{3,}/, "\n\n").strip
end

def slug_of(path)
  File.basename(path, File.extname(path)).sub(/^\d{4}-\d{2}-\d{2}-/, '')
end

def date_of(data, path)
  d = data['date']
  d = Date.parse(d.to_s) rescue nil unless d.is_a?(Date) || d.is_a?(Time)
  d ||= (Date.parse($1) rescue nil) if File.basename(path) =~ /^(\d{4}-\d{2}-\d{2})/
  d
end

def collection(dir)
  Dir[File.join(ROOT, dir, '*.{md,markdown,html}')].sort.map do |path|
    data, body = read_doc(path)
    { path: path, data: data, body: body, slug: slug_of(path), date: date_of(data, path) }
  end
end

def url_for(doc, pattern)
  return doc[:data]['permalink'] if doc[:data]['permalink']
  pattern.sub(':name', doc[:slug]).sub(':title', doc[:slug])
end

def entry(out, doc, url)
  d = doc[:data]
  out << ''
  out << "### #{d['title'] || doc[:slug]}"
  out << ''
  out << "Source: #{BASE}#{url}"
  out << "Date: #{doc[:date].strftime('%Y-%m-%d')}" if doc[:date]
  out << "Context: #{d['context']}" if d['context']
  out << "Description: #{d['description']}" if d['description']
  media = Array(d['videos']).map { |v| v['title'] || v['src'] }
  out << "Media: #{media.join(', ')}" unless media.empty?
  out << ''
  out << clean(doc[:body])
end

out = []
out << '# Steak Knives and Bagels — full text'
out << ''
out << "> Every public thought, blog post, project page and For Want of Fuel chapter on #{BASE},"
out << '> as the raw markdown it was written in. One entry per heading, each with its source URL.'
out << "> Index with one-line descriptions: #{BASE}/llms.txt"
out << ''

about = File.join(ROOT, 'about.md')
if File.exist?(about)
  _, body = read_doc(about)
  out << '## About' << '' << "Source: #{BASE}/about.html" << '' << clean(body) << ''
end

thoughts = collection('_thoughts').sort_by { |d| d[:date] || Date.new(1970) }.reverse
blog = collection('_blog').select { |d| d[:data]['visibility'] == 'public' }.sort_by { |d| d[:date] || Date.new(1970) }.reverse
projects = collection('_projects')
fwof = collection('_for_want_of_fuel')

out << '## Thoughts'
thoughts.each { |d| entry(out, d, url_for(d, '/thoughts/:title/')) }
out << '' << '## Blog'
blog.each { |d| entry(out, d, url_for(d, '/blog/:title/')) }
out << '' << '## Projects'
projects.each { |d| entry(out, d, url_for(d, "/projects/#{d[:slug]}.html")) }
out << '' << '## For Want of Fuel'
fwof.each { |d| entry(out, d, url_for(d, "/for-want-of-fuel/#{d[:slug].tr('_', '-')}/")) }
out << ''

File.write(File.join(ROOT, 'llms-full.txt'), out.join("\n") + "\n", encoding: 'utf-8')
puts "llms-full.txt: #{out.join("\n").bytesize} bytes, #{out.count { |l| l.start_with?('### ') }} entries"
