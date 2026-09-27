export function getAllowedFrontendOrigins(origins = process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? 'http://localhost:5173') {
  return origins
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
}
