import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

/**
 * The DEBUG flag will do two things:
 * 1. We will skip caching on the edge, making it easier to debug
 * 2. We will return more detailed error messages to the client
 */
const DEBUG = false;

addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  let options = {};
  
  try {
    if (DEBUG) {
      options.cacheControl = {
        bypassCache: true,
      };
    }
    
    const url = new URL(event.request.url);
    
    // If the request is for a static asset, serve it directly
    if (url.pathname.startsWith('/static/') || 
        url.pathname.startsWith('/_next/') ||
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf)$/)) {
      return await getAssetFromKV(event, options);
    }
    
    // For API routes, proxy to the origin server
    if (url.pathname.startsWith('/api/')) {
      // Handle API requests (optional - if you need server-side functionality)
      return new Response('API not available in static export', { status: 404 });
    }
    
    // Default to index.html for everything else (SPA routing)
    // Modify the URL to point to the correct HTML file based on the route
    const pathname = url.pathname;
    if (pathname === '/') {
      options.mapRequestToAsset = (req) => new Request(`${new URL(req.url).origin}/index.html`, req);
    } else {
      // Try to serve the specific HTML file, fall back to index.html for client-side routing
      try {
        return await getAssetFromKV(event, options);
      } catch (e) {
        // If the HTML file doesn't exist, serve the index.html
        options.mapRequestToAsset = (req) => new Request(`${new URL(req.url).origin}/index.html`, req);
      }
    }
    
    return await getAssetFromKV(event, options);
  } catch (e) {
    // If an error is thrown, return a simple error page
    if (DEBUG) {
      return new Response(e.message || e.toString(), { status: 500 });
    }
    
    // In production, serve a generic error page
    return new Response('An error occurred', { status: 500 });
  }
}