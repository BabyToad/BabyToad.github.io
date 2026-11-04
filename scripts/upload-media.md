# R2 handoff for Jonas

This PR is preparation only. All 32 media files remain tracked and served locally;
`media_base: ""` in `_config.yml` keeps current URLs working. Nothing has been
uploaded and no account configuration or credentials have been read.

The existing `https://media.allknivesnobagel.com/` already serves the Adverse
Selection videos. Reuse its R2 bucket and custom domain. The bucket name and the
earlier upload method are unknown; find the bucket in Cloudflare R2 → Settings →
Custom Domains. Do not create a second bucket or change the site's Pages origin.

## 1. Check the inventory

From this repository's root in PowerShell, with Ruby and Wrangler 4 installed:

```powershell
ruby scripts/media_manifest.rb --check
if ($LASTEXITCODE -ne 0) { throw 'Manifest check failed' }
$mediaBucket = 'REPLACE_WITH_EXISTING_BUCKET_NAME'
if ($mediaBucket -eq 'REPLACE_WITH_EXISTING_BUCKET_NAME') { throw 'Set the existing bucket name first' }
$mediaObjects = Import-Csv -LiteralPath scripts/media-manifest.txt -Delimiter "`t"
foreach ($object in $mediaObjects) {
    $file = Get-Item -LiteralPath $object.path
    $sha = (Get-FileHash -LiteralPath $object.path -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($file.Length -ne [long]$object.bytes -or $sha -ne $object.sha256) {
        throw "Local media differs from manifest: $($object.path)"
    }
}
```

`media-manifest.txt` is TSV: path (also the exact R2 object key), byte count,
SHA-256, encoded target URL and Content-Type. It covers 137,641,848 bytes
(131.27 MiB): two Godot payloads, Mondnacht ZIP, four thought videos, 25 MP3s.
Image originals, loaders, scripts, worklets and icons stay in Git.

## 2. Upload to the existing remote bucket

Authenticate yourself with `wrangler login` if needed, then run this exact loop
in the same shell. It expands one `wrangler r2 object put` command per manifest
row, including filenames containing spaces, apostrophes and `!`.

```powershell
foreach ($object in $mediaObjects) {
    wrangler r2 object put "$mediaBucket/$($object.path)" --remote `
        --file $object.path --content-type $object.content_type `
        --cache-control 'public, max-age=31536000, immutable'
    if ($LASTEXITCODE -ne 0) { throw "Upload failed: $($object.path)" }
}
```

Headers: WASM `application/wasm`; PCK `application/octet-stream`; ZIP
`application/zip`; MP4 `video/mp4`; MP3 `audio/mpeg`. Every object gets
`Cache-Control: public, max-age=31536000, immutable`. Do not set Content-Encoding
on these uncompressed files. Keep these keys immutable: later revisions should
use a new filename and manifest URL rather than overwrite year-cached bytes.

## 3. Permit browser reads

In the same bucket's Settings → CORS Policy, merge a public read rule with any
existing rules (do not discard an existing upload policy). Dashboard JSON:

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

These are public, credential-free assets. Godot's WASM fetch and the iso-engine's
Web Audio fetch require CORS. If adding CORS to already cached objects, purge
their media-host URLs so cached responses receive the new headers. Keep the
WASM MIME type above: streaming compilation depends on it.

## 4. Verify all public bytes and headers before switching

Download every target and compare its SHA-256 and size (not R2's ETag, which is
not SHA-256). This writes disposable files only under the ignored `_site`:

```powershell
$verifyDirectory = New-Item -ItemType Directory -Force -Path _site/media-verification
foreach ($object in $mediaObjects) {
    $download = Join-Path $verifyDirectory.FullName $object.sha256
    $response = Invoke-WebRequest -Uri $object.url -OutFile $download -PassThru `
        -Headers @{ Origin = 'https://www.allknivesnobagel.com' }
    if ((Get-Item -LiteralPath $download).Length -ne [long]$object.bytes -or `
        (Get-FileHash -LiteralPath $download -Algorithm SHA256).Hash.ToLowerInvariant() -ne $object.sha256) {
        throw "Remote media differs: $($object.url)"
    }
    $response.Headers | Format-List
}
```

Check `Content-Type`, `Cache-Control` and `Access-Control-Allow-Origin` on those
responses. Check seeking with a range request; expect `206` and `Content-Range`:

```powershell
curl.exe -sS -D - -o NUL -H 'Origin: https://www.allknivesnobagel.com' `
    -H 'Range: bytes=0-1023' $mediaObjects[0].url
```

Then test a temporary local config override with `media_base` set to
`https://media.allknivesnobagel.com` (no trailing slash), running both pre-build
scripts before building. Check Schneekugel starts and plays with audio, the
iso-engine's background/interaction sounds, thought videos and video seeking,
and the ZIP URL. Loader JS, worklets and icons must still request the site origin.

## 5. Trigger the second PR

Tell Sol/Fable that all manifest objects and browser checks passed. Only then
prepare a second PR setting `media_base: "https://media.allknivesnobagel.com"`
and `git rm --cached` for exactly the manifest paths. The ignore rules are already
prepared; local copies can remain for offline work. Add the same paths to Jekyll
`exclude` in that PR so those ignored local copies cannot enter an R2 build.
Git history is deliberately retained: no purge and no force push. A fresh clone
will still download historical media. Merging this preparation PR alone saves no
Git or deployment bytes.

Before removal, old direct `/assets/...` URLs may have been shared. Cloudflare
redirect rules for those exact paths to the matching media-host URLs can keep
them working after removal; evaluate this in the second PR, with query strings
preserved. To undo activation, first restore local media from Git history, then
reset `media_base` to empty. No rollback or removal is needed for this PR.

References: [Wrangler R2 object commands](https://developers.cloudflare.com/workers/wrangler/commands/r2/),
[R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/).
