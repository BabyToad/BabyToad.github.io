#!/usr/bin/env ruby
# Small in-memory Jekyll fixture: no site build, network or new test dependency.
require 'jekyll'
require 'tmpdir'
require_relative '../_plugins/tag_pages'

def check(condition, message)
  raise message unless condition
end

Dir.mktmpdir('tag-pages-') do |source|
  config = Jekyll.configuration(
    'source' => source, 'destination' => File.join(source, '_site'),
    'collections' => {
      'blog' => { 'output' => true, 'permalink' => '/blog/:title/' },
      'projects' => { 'output' => true },
      'thoughts' => { 'output' => true, 'permalink' => '/thoughts/:title/' }
    }
  )
  site = Jekyll::Site.new(config)
  add = lambda do |collection, slug, date, tags, extra = {}|
    doc = Jekyll::Document.new(
      File.join(source, "_#{collection}", "#{slug}.md"),
      site: site, collection: site.collections.fetch(collection)
    )
    doc.data.merge!({ 'title' => slug, 'date' => Time.utc(2026, 1, date), 'tags' => tags }.merge(extra))
    doc.content = "\nFirst **line**.\n\nSecond line.\n"
    site.collections.fetch(collection).docs << doc
    doc
  end
  add.call('blog', 'essay', 1, %w[shared shared singleton], 'description' => 'Essay description.')
  add.call('projects', 'tool', 3, ['shared'])
  add.call('thoughts', 'note', 2, ['shared'])
  [{ 'visibility' => 'private' }, { 'visibility' => 'draft' }, { 'visibility' => 'unlisted' },
   { 'noindex' => true }, { 'draft' => true }, { 'published' => false }].each_with_index do |extra, i|
    add.call('thoughts', "hidden-#{i}", 4, ['hidden'], extra)
  end
  add.call('projects', 'untagged', 5, nil)

  TagPages::Generator.new.generate(site)
  index = site.pages.find { |page| page.url == '/tags/' }
  check(index.data['tags'].map { |tag| [tag['name'], tag['count']] } == [['shared', 3], ['singleton', 1]],
        'Index must sort alphabetically, count documents once, and omit hidden content')
  shared = site.pages.find { |page| page.url == '/tags/shared/' }
  check(shared.data['entries'].map { |entry| entry['kind'] } == %w[Project Thought Blog],
        'All three kinds must appear newest first')
  check(shared.data['entries'][1]['description'].strip == 'First **line**.', 'Thought fallback must use first line')
  check(shared.data['entries'].last['description'] == 'Essay description.', 'Prefer explicit description')
  check(site.pages.any? { |page| page.url == '/tags/singleton/' }, 'Single-item tags need pages')
  check(site.pages.all? { |page| page.data['sitemap'] && page.data['description'] && page.data['layout'] },
        'Every generated page needs layout, sitemap inclusion and sharing description')
  check(shared.data['title'] == 'Tagged shared', 'Tag page needs its sharing title')

  add.call('blog', 'unsafe', 6, ['../escape'])
  begin
    TagPages::Generator.new.generate(site)
    raise 'Noncanonical tags must fail the build'
  rescue Jekyll::Errors::FatalException => error
    check(error.message.include?('Noncanonical tag'), 'Unexpected validation error')
  end
end
puts 'Tag pages: mixed collections, ordering, counts, singleton, visibility, summaries and URL validation passed.'
