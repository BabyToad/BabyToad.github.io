# Collection tags share one namespace. Keep spellings canonical in front matter;
# fail on unsafe URL segments rather than silently giving distinct tags one URL.
module TagPages
  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      grouped = Hash.new { |hash, tag| hash[tag] = [] }
      { 'blog' => 'Blog', 'projects' => 'Project', 'thoughts' => 'Thought' }.each do |name, kind|
        site.collections.fetch(name).docs.each do |doc|
          next if doc.data['published'] == false || doc.data['draft'] || doc.data['noindex']
          next if %w[private draft unlisted].include?(doc.data['visibility'])

          Array(doc.data['tags']).uniq.each do |tag|
            unless tag.is_a?(String) && tag.match?(/\A[a-z0-9]+(?:-[a-z0-9]+)*\z/)
              raise Jekyll::Errors::FatalException, "Noncanonical tag #{tag.inspect} in #{doc.relative_path}"
            end

            grouped[tag] << {
              'title' => doc.data['title'], 'url' => doc.url, 'date' => doc.date,
              'kind' => kind,
              'description' => doc.data['description'] || doc.content.lines.find { |line| !line.strip.empty? }
            }
          end
        end
      end

      tags = grouped.keys.sort.map do |tag|
        entries = grouped.fetch(tag).sort_by { |entry| [entry['date'], entry['url']] }.reverse
        page = Jekyll::PageWithoutAFile.new(site, site.source, "tags/#{tag}", 'index.html')
        page.content = ''
        page.data.merge!(
          'layout' => 'tag', 'title' => "Tagged #{tag}", 'tag' => tag,
          'description' => "Blog posts, projects and thoughts tagged #{tag} on Steak Knives and Bagels.",
          'entries' => entries, 'sitemap' => true,
          # jekyll-last-modified-at's post_init hook assumes a real source file.
          'last_modified_at' => nil
        )
        site.pages << page
        { 'name' => tag, 'url' => page.url, 'count' => entries.length }
      end

      index = Jekyll::PageWithoutAFile.new(site, site.source, 'tags', 'index.html')
      index.content = ''
      index.data.merge!(
        'layout' => 'tag-index', 'title' => 'Tags', 'tags' => tags, 'sitemap' => true,
        'last_modified_at' => nil,
        'description' => 'Browse blog posts, projects and thoughts by topic on Steak Knives and Bagels.'
      )
      site.pages << index
    end
  end
end
