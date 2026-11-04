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
  essay = add.call('blog', 'essay', 1, [' Shared ', 'SHARED', 'shared', 'singleton'], 'description' => 'Essay description.')
  add.call('projects', 'tool', 3, ['shared'])
  note = add.call('thoughts', 'note', 2, ['shared', ' -- GAME__Design & AI!!! -- ', 'game-design-and-ai'])
  [{ 'visibility' => 'private' }, { 'visibility' => 'draft' }, { 'visibility' => 'unlisted' },
   { 'noindex' => true }, { 'draft' => true }, { 'published' => false }].each_with_index do |extra, i|
    add.call('thoughts', "hidden-#{i}", 4, ['hidden'], extra)
  end
  add.call('projects', 'untagged', 5, nil)

  warnings = []
  original_warn = Jekyll.logger.method(:warn)
  Jekyll.logger.define_singleton_method(:warn) { |*args| warnings << args.join(' ') }
  begin
    TagPages::Generator.new.generate(site)
  ensure
    Jekyll.logger.define_singleton_method(:warn, original_warn)
  end
  check(warnings.length == 3, 'Only changed spellings should warn')
  [['essay', ' Shared '], ['essay', 'SHARED'], ['note', ' -- GAME__Design & AI!!! -- ']].each do |file, spelling|
    check(warnings.any? { |warning| warning.include?("/#{file}.md") && warning.include?(spelling.inspect) },
          'Warnings must identify the source file and original spelling')
  end
  check(essay.data['tags'] == %w[shared singleton], 'Normalize and deduplicate linked chips')
  check(note.data['tags'] == %w[shared game-design-and-ai], 'Normalize punctuation, whitespace, underscores and ampersands')
  index = site.pages.find { |page| page.url == '/tags/' }
  check(index.data['tags'].map { |tag| [tag['name'], tag['count']] } == [['game-design-and-ai', 1], ['shared', 3], ['singleton', 1]],
        'Index must sort alphabetically, count documents once, and omit hidden content')
  shared = site.pages.find { |page| page.url == '/tags/shared/' }
  check(shared.data['entries'].map { |entry| entry['kind'] } == %w[Project Thought Blog],
        'All three kinds must appear newest first')
  check(shared.data['entries'][1]['description'].strip == 'First **line**.', 'Thought fallback must use first line')
  check(shared.data['entries'].last['description'] == 'Essay description.', 'Prefer explicit description')
  singletons = site.pages.select { |page| %w[/tags/singleton/ /tags/game-design-and-ai/].include?(page.url) }
  check(singletons.length == 2, 'Single-item tags need pages, even after alias deduplication')
  check(singletons.all? { |page| page.data['noindex'] == true && page.data['sitemap'] == false },
        'Single-item archives must be noindexed and excluded from the sitemap')
  check([shared, index].all? { |page| !page.data['noindex'] && page.data['sitemap'] == true },
        'Shared archives and the tag index must remain indexable')
  check(site.pages.all? { |page| page.data['description'] && page.data['layout'] },
        'Every generated page needs a layout and sharing description')
  check(shared.data['title'] == 'Tagged shared', 'Tag page needs its sharing title')
  check(site.pages.all? { |page| page.data['last_modified_at'].nil? },
        'Generated pages must not run a git/mtime lookup for a nonexistent source file')

  escaped = add.call('blog', 'unsafe', 6, ['../escape'])
  TagPages::Generator.new.generate(site)
  check(escaped.data['tags'] == ['escape'], 'Drop URL punctuation rather than failing')
  add.call('blog', 'empty', 7, [' !!! ___ '])
  begin
    TagPages::Generator.new.generate(site)
    raise 'Empty normalized tags must fail the build'
  rescue Jekyll::Errors::FatalException => error
    check(error.message.include?('Empty normalized tag') && error.message.include?('/empty.md') && error.message.include?(' !!! ___ '.inspect),
          'Empty-tag errors must identify the file and original spelling')
  end
end
puts 'Tag pages: mixed collections, ordering, alias counts, singleton indexing, visibility, summaries, normalization and warnings passed.'
