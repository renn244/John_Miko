export const MAIN_VIRTUAL_TOUR_ID = 'main';

export const VIRTUAL_TOUR_TILE_COLUMNS = 8;
export const VIRTUAL_TOUR_TILE_ROWS = 4;
export const VIRTUAL_TOUR_MAX_PANORAMA_WIDTH = 8192;
export const VIRTUAL_TOUR_PREVIEW_WIDTH = 1600;
export const VIRTUAL_TOUR_PREVIEW_QUALITY = 70;
// Viewer tiles are the detailed guest-facing image, so preserve fine texture
// and colour detail from the panorama master. The lower-resolution preview
// remains separate and fast to load.
export const VIRTUAL_TOUR_TILE_QUALITY = 95;

export const VIRTUAL_TOUR_MAX_FILE_BYTES = 60 * 1024 * 1024;

export const VIRTUAL_TOUR_CLOUDINARY_PREFIX = 'public/virtual-tour/scenes';
export const VIRTUAL_TOUR_UPLOAD_CONCURRENCY = 6;
