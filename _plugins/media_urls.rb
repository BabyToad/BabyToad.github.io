# Front matter keeps site-relative source paths; Liquid is not evaluated in YAML.
# Apply only at media call sites, leaving existing absolute/video-service URLs alone.
module MediaUrls
  def media_url(path)
    return path unless path.to_s.start_with?('/')

    @context.registers[:site].config.fetch('media_base', '').to_s + path
  end
end
Liquid::Template.register_filter(MediaUrls)
