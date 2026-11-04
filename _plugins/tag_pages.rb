# Collection tags share one namespace. Normalize URL segments and warn so authors
# can keep front matter canonical; spelling aliases count each document only once.
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

          tags = Array(doc.data['tags']).map do |original|
            tag = original.to_s.downcase.strip.gsub(/[\s_]+/, '-').gsub('&', 'and')
                          .gsub(/[^a-z0-9-]/, '').gsub(/-+/, '-').gsub(/\A-|-\z/, '')
            if tag.empty?
              raise Jekyll::Errors::FatalException, "Empty normalized tag #{original.inspect} in #{doc.relative_path}"
            end
            if tag != original
              Jekyll.logger.warn 'Tag normalization:', "#{doc.relative_path}: #{original.inspect} -> #{tag.inspect}"
            end
            tag
          end.uniq
          # Linked chips must use the same normalized spelling as their archives.
          doc.data['tags'] = tags if doc.data.key?('tags')

          tags.each do |tag|
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
          'entries' => entries, 'noindex' => entries.length == 1, 'sitemap' => entries.length > 1,
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
