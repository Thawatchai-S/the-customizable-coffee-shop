import { request } from 'undici';

export async function httpJson(url, options = {}) {
  const { body: response, statusCode } = await request(url, {
    ...options,
    headers: { 'content-type': 'application/json', ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (statusCode >= 400) {
    const error = new Error(`Request to ${url} failed with ${statusCode}`);
    error.statusCode = statusCode;
    error.data = data;
    throw error;
  }

  return data;
}
