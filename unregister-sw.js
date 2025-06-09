// Unregister Service Worker Script
// Run this in browser console to remove any existing service worker

async function unregisterServiceWorker() {
  console.log('🧹 Unregistering service worker...');
  
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`Found ${registrations.length} service worker registrations`);
      
      for (let registration of registrations) {
        console.log('Unregistering:', registration.scope);
        await registration.unregister();
      }
      
      console.log('✅ All service workers unregistered');
    } else {
      console.log('Service Worker not supported');
    }
    
    // Clear all caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      console.log(`Found ${cacheNames.length} caches`);
      
      for (let cacheName of cacheNames) {
        console.log('Deleting cache:', cacheName);
        await caches.delete(cacheName);
      }
      
      console.log('✅ All caches cleared');
    }
    
    console.log('🎉 Service worker cleanup complete!');
    console.log('Please refresh the page.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Auto-run
unregisterServiceWorker();