export async function fetchGitHubAPI(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })

  if (!response.ok) {
    if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
      throw new Error('GitHub API rate limit exceeded. Please try again later.')
    }
    throw new Error(`GitHub API returned ${response.status}`)
  }

  return response
}

export function parseLinkHeader(header: string | null) {
  if (!header) return {}
  
  const links: Record<string, number> = {}
  const parts = header.split(",")

  parts.forEach((part) => {
    const match = part.match(/<.*[?&]page=(\d+).*>; rel="(.*)"/);
    if (match) {
      const [, page, rel] = match
      links[rel] = parseInt(page, 10)
    }
  })

  return links
}

export function compareVersions(v1: string, v2: string) {
  const normalize = (v: string) => v.replace(/^v/, '').split('.').map(Number);
  const n1 = normalize(v1);
  const n2 = normalize(v2);

  for (let i = 0; i < Math.max(n1.length, n2.length); i++) {
    const a = n1[i] || 0;
    const b = n2[i] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}