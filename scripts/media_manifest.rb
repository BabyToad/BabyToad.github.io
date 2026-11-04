#!/usr/bin/env ruby
# Inventory only: never uploads, deletes, or reads account configuration.
require 'csv'
require 'digest'
require 'uri'

root = File.expand_path('..', __dir__)
paths = %w[
  assets/games/schneekugel/schneekugel-godot.wasm
  assets/games/schneekugel/schneekugel-godot.pck
  assets/games/mondnacht.zip
]
paths.concat(Dir.chdir(root) { Dir['assets/videos/thoughts/*.mp4'] + Dir['assets/iso-engine/audio/**/*'].select { |p| File.file?(p) } })
manifest = CSV.generate(col_sep: "\t", row_sep: "\n") do |csv|
  csv << %w[path bytes sha256 url content_type]
  paths.sort.each do |path|
    file = File.join(root, path)
    type = { '.wasm' => 'application/wasm', '.pck' => 'application/octet-stream',
             '.zip' => 'application/zip', '.mp4' => 'video/mp4', '.mp3' => 'audio/mpeg' }.fetch(File.extname(path))
    csv << [path, File.size(file), Digest::SHA256.file(file).hexdigest,
            "https://media.allknivesnobagel.com/#{URI::DEFAULT_PARSER.escape(path)}", type]
  end
end
target = File.join(__dir__, 'media-manifest.txt')
if ARGV == ['--check']
  abort 'Media manifest differs; regenerate with ruby scripts/media_manifest.rb' unless File.binread(target) == manifest
else
  abort 'Usage: ruby scripts/media_manifest.rb [--check]' unless ARGV.empty?
  File.binwrite(target, manifest)
end
puts "Media manifest: #{paths.size} objects, #{paths.sum { |p| File.size(File.join(root, p)) }} bytes"
