# Precut records

Offline preparation moves the expensive lathe calculation out of visitors' browsers. It does not turn service streams into accessible audio. These files are generated from the ten official Polygondwanaland digital-master MP3s, with the artist's source/permission URL retained in the manifest.

Each complete song has its own independent 48 kHz stereo pressing. Playback uses one song, while replacement temporarily retains the old and new pressing; it is not a claim that the whole 44-minute album fits on one simulated side. The source is not truncated. A modest simulated pressing warp (0.15 mm) and eccentricity (0.08 mm) are added to the groove/disc geometry, alongside the clean-condition noise and echo settings. The original MP3 files are unchanged.

## Format and loader

AKNB-GROOVE-1 is a gzip stream: little-endian uint32 JSON-header length, UTF-8 header, then wallIn Float32, wallOut Float32, radius table Float64 and visualization Uint8 bytes. Every wall sample is preserved bit-for-bit; there is no new quantization. Object keys include the compressed SHA-256 prefix. Serve as application/gzip with **no Content-Encoding** because the loader explicitly decompresses the body.

loadPrecut(entry, {baseURL, maxDecodedBytes, signal, onProgress}) returns {rec, vis, header}. rec is ready for the existing one-time AudioWorklet transfer; vis feeds the renderer. The reader allocates final typed arrays once and streams decompressed chunks into them, validating counts, sizes, version, completeness and provenance. It does not keep a second uncompressed payload copy. onProgress reports cumulative decompressed bytes; UI callers should throttle it.

Use a decoded-memory gate before download (96 MiB for phones and 384 MiB for desktop in this integration), and retain the full native recording fallback. These are conservative limits, not real-device memory guarantees. Replace one track at a time; avoid retaining old walls on the main thread. During replacement the old worklet pressing and new decoded track coexist: peak can approach twice the per-track gate, plus buffers. These gates do not promise a peak-memory ceiling. The selector stays hidden unless records_precuts_published is true in site configuration; enable only after public-host asset verification. Some songs exceed the phone gate even though they are fully precut. That must be stated instead of loading them anyway or silently truncating.

Lossless groove floats compress poorly. Precutting trades CPU/cut latency for a much larger download than the MP3 original. Show download size before fetching. Files remain outside Git and are not published until explicit approval covers these additional assets. The earlier approval covered the ten MP3s, not these much larger derivatives.

## Reproduce and verify

Run existing ffmpeg plus node scripts/precut-records.mjs SOURCE_MANIFEST OUTPUT_DIRECTORY TRACK_NUMBER for each track, with a fresh process per track to bound offline working memory. No dependencies or Jekyll build steps are added. The source manifest contains sourceFile, SHA-256, title and number; it is local because it holds machine paths. Public entries omit local paths.

The builder verifies original hashes, rejects any cut truncation, compares source decoded frames with cut duration, round-trips all typed-array bytes exactly, and runs 12 seconds through the real engine with finite nonzero output. node scripts/test-records-precut.mjs tests malformed-size/array guards, incomplete bodies, trailing data and abort behavior.
