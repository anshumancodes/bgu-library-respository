const API_BASE = "http://localhost:8080/server/api";


export async function getRecentSubmissions() {
  const res = await fetch(`${API_BASE}/discover/search/objects?query=`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch submissions");

  const data = await res.json();
  return data._embedded?.searchResult?._embedded?.objects || [];
}
// Total items
export async function getTotalItems() {
  const res = await fetch(`${API_BASE}/core/items`);
  const data = await res.json();
  return data.page?.totalElements || 0;
}

// Total collections (departments)
export async function getTotalCollections() {
  const res = await fetch(`${API_BASE}/core/collections`);
  const data = await res.json();
  return data.page?.totalElements || 0;
}

// Total authors (faceted search)
export async function getTotalAuthors() {
  const res = await fetch(`${API_BASE}/discover/facets/author`);
  const data = await res.json();
  return data?.values?.length || 0;
}

// Total downloads (placeholder — depends on stats config)
export async function getTotalDownloads() {
  return 2000000; // TODO: replace with stats API if enabled
}

// Search publications
export async function searchPublications(query = "") {
  const res = await fetch(
    `${API_BASE}/discover/search/objects?query=${encodeURIComponent(query)}`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Search failed");

  const data = await res.json();
  return data._embedded?.searchResult?._embedded?.objects || [];
}

// Get items created this year
export async function getItemsThisYear() {
  const year = new Date().getFullYear();
  const res = await fetch(
    `${API_BASE}/discover/search/objects?f.dateIssued=${year},equals`
  );
  const data = await res.json();
  return data.page?.totalElements || 0;
}
// Get all communities
export async function getCommunities() {
  const res = await fetch(`${API_BASE}/core/communities`);
  if (!res.ok) throw new Error("Failed to fetch communities");
  const data = await res.json();
  return data._embedded?.communities || [];
}

// Get collections under a community
export async function getCollections(communityId) {
  const res = await fetch(`${API_BASE}/core/communities/${communityId}/collections`);
  if (!res.ok) throw new Error("Failed to fetch collections");
  const data = await res.json();
  return data._embedded?.collections || [];
}

async function getCsrfToken() {
  const res = await fetch(`${API_BASE}/authn/status`, {
    credentials: "include", // to store cookies
  });
  if (!res.ok) throw new Error("Failed to get CSRF token");

  const token = res.headers.get("DSPACE-XSRF-TOKEN");
  if (!token) throw new Error("CSRF token not found in headers");
  return token;
}

// Login function
export async function login(email, password) {
  const csrfToken = await getCsrfToken();

  const res = await fetch(`${API_BASE}/authn/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "DSPACE-XSRF-TOKEN": csrfToken, // send CSRF token
    },
    credentials: "include", // keeps session cookie
    body: new URLSearchParams({
      user: email,      // note: DSpace expects 'user' not 'email'
      password: password,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Login failed: ${errorData.message}`);
  }

  return true;
}

export async function logout() {
  await fetch(`${API_BASE}/authn/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/eperson/metadata`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return await res.json();
}