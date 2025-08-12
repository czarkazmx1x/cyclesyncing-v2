export default {
  async fetch(request, env) {
    // The rest of your worker code goes here
    const url = new URL(request.url);
    
    try {
      // Add any custom worker logic here if needed
      // For most Next.js apps, you can use the default handler
      
      // If you need to handle specific routes differently, you can do so here
      // For example:
      // if (url.pathname.startsWith('/api/')) {
      //   // Handle API routes
      // }
      
      // Return the response from the asset
      return env.ASSETS.fetch(request);
    } catch (e) {
      return new Response(`Error: ${e.message}`, { status: 500 });
    }
  }
};