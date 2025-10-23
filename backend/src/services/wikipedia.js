import fetch from "node-fetch";

/**
 * searchWikipediaNearby(lat, lon, radiusMeters, limit)
 * Uses MediaWiki geosearch to find nearby pages.
 * Returns array of {pageid, title, lat, lon, dist}
 */
export async function searchWikipediaNearby(
  lat,
  lon,
  radius = 5000,
  limit = 30
) {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    list: "geosearch",
    gscoord: `${lat}|${lon}`,
    gsradius: radius.toString(),
    gslimit: limit.toString(),
    format: "json",
  });

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "Nearby-Explorer/1.0 (+https://example.local)" },
  });
  if (!res.ok) throw new Error("Wikipedia geosearch failed");
  const json = await res.json();
  const pages = (json.query && json.query.geosearch) || [];
  // Map to required shape
  return pages.map((p) => ({
    pageid: p.pageid,
    title: p.title,
    lat: p.lat,
    lon: p.lon,
    dist: p.dist,
  }));
}

/**
 * fetchWikiExtractsAndImages(pageIdsArray)
 * Uses one query to get extracts (intro) and thumbnail images for multiple pages
 * Returns a map: { [pageid]: { extract, thumbnail, wikipediaUrl } }
 */
export async function fetchWikiExtractsAndImages(pageIds = []) {
  if (!pageIds || pageIds.length === 0) return {};

  // Max pages per request is fairly large but keep it safe (50)
  const chunkSize = 50;
  const chunks = [];
  for (let i = 0; i < pageIds.length; i += chunkSize) {
    chunks.push(pageIds.slice(i, i + chunkSize));
  }

  const results = {};

  for (const chunk of chunks) {
    const url = new URL("https://en.wikipedia.org/w/api.php");
    url.search = new URLSearchParams({
      action: "query",
      pageids: chunk.join("|"),
      prop: "extracts|pageimages",
      exintro: "1",
      explaintext: "1",
      pilicense: "any",
      piprop: "thumbnail",
      pithumbsize: "300",
      format: "json",
    });

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "Nearby-Explorer/1.0 (+https://example.local)" },
    });
    if (!res.ok) {
      // skip this chunk but continue
      console.warn("Warning: wikipedia chunk failed", res.status);
      continue;
    }
    const json = await res.json();
    const pages = json.query && json.query.pages ? json.query.pages : {};
    for (const pid of Object.keys(pages)) {
      const p = pages[pid];
      results[pid] = {
        extract: p.extract || "",
        thumbnail: p.thumbnail ? p.thumbnail.source : null,
        wikipediaUrl: p.fullurl || `https://en.wikipedia.org/?curid=${pid}`,
      };
    }
  }

  return results;
}
