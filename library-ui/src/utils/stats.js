// src/utils/dspace.js
const BASE_URL = "http://10.120.4.59:8080/server/api";

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}


export async function getTotalItems() {
  const data = await fetchJSON(`${BASE_URL}/core/communities?page=0&size=1`);
  return data.page?.totalElements ?? 0;
}


export async function getTotalAuthors() {
  const data = await fetchJSON(`${BASE_URL}/discover/facets/author`);
  
  return data?._embedded?.values?.length ?? 0;
}


export async function getTotalCollections() {
  const data = await fetchJSON(`${BASE_URL}/core/collections?page=0&size=1`);
  return data.page?.totalElements ?? 0;
}


export async function getAllSubjects(maxPages = 20) {
  let allSubjects = [];

  for (let page = 0; page <= maxPages; page++) {
    try {
      const data = await fetchJSON(`${BASE_URL}/discover/facets/subject?page=${page}`);
      const values = data?._embedded?.values || [];

      if (values.length === 0) break; // stop if no more data
      allSubjects = [...allSubjects, ...values];
    } catch (err) {
      console.error(`Error fetching page ${page}:`, err);
      break;
    }
  }

  return allSubjects;
}

/**
 * Optionally get the total count
 */
export async function getTotalsubjects(maxPages = 20) {
  const subjects = await getAllSubjects(maxPages);
  return subjects.length;
}

