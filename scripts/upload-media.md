# Media on Cloudflare R2

The 32 objects in `scripts/media-manifest.txt` are live in bucket `aknb-media`,
served at `https://media.allknivesnobagel.com`. They were uploaded and verified on
2026-11-06; the bucket now permits public browser reads through CORS.
`_config.yml` sets `media_base` to that host without a trailing slash. GitHub
Pages remains the site origin. The Bagel video on a GitHub release is unchanged.

The migration inventory records exact object keys, byte counts, SHA-256,
encoded URLs and Content-Type: 137,641,848 bytes (131.27 MiB), comprising two
Godot payloads, Mondnacht ZIP, four thought videos and 25 MP3s. These files are
untracked; ignored offline copies may remain, but Jekyll excludes them from
builds. Image originals, loaders, scripts, worklets and icons stay in Git.
History is retained: no purge or force push, and no historical clone-size saving.

## Add a large file

1. Keep the bytes out of Git. Use the existing `assets/...` object-key layout,
   with a new filename whenever content changes: year-cached keys are immutable.
   Add a matching `.gitignore` rule and Jekyll `exclude` entry if the existing
   media patterns do not already cover the new path.
2. Authenticate with Wrangler yourself if needed (`wrangler login`). Upload to
   the existing bucket, using the correct MIME type and these cache headers:

   ```powershell
   $mediaBucket = 'aknb-media'
   $mediaKey = 'assets/videos/thoughts/NEW-FILENAME.mp4'
   wrangler r2 object put "$mediaBucket/$mediaKey" --remote `
       --file $mediaKey --content-type 'video/mp4' `
       --cache-control 'public, max-age=31536000, immutable'
   if ($LASTEXITCODE -ne 0) { throw 'Upload failed' }
   ```

   MIME types: WASM `application/wasm`, PCK `application/octet-stream`, ZIP
   `application/zip`, MP4 `video/mp4`, MP3 `audio/mpeg`. Do not set Content-Encoding
   on uncompressed source files. Cloudflare may compress responses in transit.
3. Verify HTTPS 200, byte size, MIME, caching and CORS before publishing. Use
   `Accept-Encoding: identity` when checking Content-Length against source bytes.
   Download and compare SHA-256 for new objects; R2's ETag is not SHA-256.
4. Reference the site-relative path through Liquid's `media_url` filter:

   ```liquid
   <a href="{{ '/assets/games/NEW-FILENAME.zip' | media_url }}">Download</a>
   ```

   Thought front matter keeps literal site-relative `videos[].src` values;
   `thought-images.html` applies the filter to sources and download links.
   JavaScript values should use `| media_url | jsonify`. Existing external URLs
   pass through unchanged. Preserve Godot's `Engine.fileUrls` and iso-engine's
   `config.audioPath` integration when re-exporting; JS/worklets/icons and
   scene/image paths stay local.
5. Run both pre-build scripts, build, and check real browser loading, seeking
   and decoding. Never force-add the media bytes. The original migration
   manifest remains an audit record; `media_manifest.rb --check` requires all
   32 original offline copies and is not required to build a fresh clone.

## Public read policy

The bucket's CORS policy includes this rule. Preserve any other existing rules:

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["Range"],
    "ExposeHeaders": ["Content-Length", "Content-Range", "Accept-Ranges", "ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Godot's WASM fetch and iso-engine's Web Audio fetch require CORS. If changing
CORS on cached objects, purge their media-host URLs so the new headers reach
browsers. Keep `application/wasm` for streaming compilation. Do not proxy around
a CORS failure; inspect the browser error and the public response headers.

## Verify the original inventory

From the repo root in PowerShell (use `curl.exe`, not PowerShell's curl alias):

```powershell
$mediaObjects = Import-Csv -LiteralPath scripts/media-manifest.txt -Delimiter "`t"
foreach ($object in $mediaObjects) {
    curl.exe -sSI -H 'Accept-Encoding: identity' `
        -H 'Origin: https://www.allknivesnobagel.com' $object.url
    if ($LASTEXITCODE -ne 0) { throw "HEAD failed: $($object.path)" }
}
```

Require 200, the manifest Content-Length and Content-Type,
`Cache-Control: public, max-age=31536000, immutable`, and
`Access-Control-Allow-Origin: *`. Check seeking with a range request; expect
206 and `Content-Range: bytes 0-1023/TOTAL`:

```powershell
curl.exe -sS -D - -o NUL -H 'Origin: https://www.allknivesnobagel.com' `
    -H 'Range: bytes=0-1023' $mediaObjects[0].url
```

To verify hashes, download to a disposable directory outside published output,
then use `Get-FileHash -Algorithm SHA256` and compare to each manifest row.

## Compatibility and rollback

Old direct site-origin `/assets/...` URLs leave Pages with this activation.
Optional Cloudflare redirects for the exact manifest paths can preserve shared
links, with query strings retained; no redirect rules are changed by this PR.
To undo activation, restore the manifest files from the pre-activation Git commit,
reset `media_base` to empty and remove the media exclusions from `_config.yml`.
Run both pre-build scripts and verify the local-media build before deployment.

References: [Wrangler R2 object commands](https://developers.cloudflare.com/workers/wrangler/commands/r2/),
[R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/).
