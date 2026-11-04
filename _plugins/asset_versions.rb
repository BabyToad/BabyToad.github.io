# Hash emitted CSS (after Sass), and static assets, rather than build timestamps.
require 'digest'

module AssetVersions
  def asset_version(path)
    "ASSET_SHA256[#{path}]"
  end
end
Liquid::Template.register_filter(AssetVersions)

Jekyll::Hooks.register :site, :post_render do |site|
  hashes = {}
  items = site.pages + site.collections.values.flat_map(&:docs)
  items.each do |item|
    next unless item.output

    item.output = item.output.gsub(/ASSET_SHA256\[([^\]]+)\]/) do
      path = Regexp.last_match(1)
      hashes[path] ||= begin
        rendered = site.pages.find { |page| page.url == path }
        bytes = rendered ? rendered.output : File.binread(site.in_source_dir(path))
        Digest::SHA256.hexdigest(bytes)[0, 16]
      end
    end
  end
end
