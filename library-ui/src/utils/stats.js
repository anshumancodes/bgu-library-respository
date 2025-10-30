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


export async function getTotalsubjects() {
  const data = await fetchJSON(`${BASE_URL}/discover/facets/subject`);
  return data?._embedded?.values?.length ?? 0;
}
