// DualPilot Runtime Injector
// This script fetches and applies AI-optimized metadata to your site in real-time.
// Place this script tag just before the closing </head> tag on all pages.

(function() {
  'use strict';

  function injectMeta() {
    // NOTE: In a production environment, you would replace 'https://app.dualpilot.ai'
    // with your actual service domain. This endpoint must be publicly accessible and
    // CORS-enabled for the domains of your customers.
    const apiUrl = `https://app.dualpilot.ai/api/outputs?url=${encodeURIComponent(window.location.href)}`;
    
    // For demonstration, we'll log what would happen. A real implementation would fetch.
    console.log(`DualPilot: Would fetch metadata from: ${apiUrl}`);

    /*
    // Example of a real fetch implementation:
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`DualPilot API responded with status ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (!data) return;

        // Update Title
        if (data.metaTitle) {
          document.title = data.metaTitle;
        }

        // Update Meta Description
        if (data.metaDescription) {
          let descTag = document.querySelector('meta[name="description"]');
          if (!descTag) {
            descTag = document.createElement('meta');
            descTag.setAttribute('name', 'description');
            document.head.appendChild(descTag);
          }
          descTag.setAttribute('content', data.metaDescription);
        }

        // Update Canonical URL
        if (data.canonicalUrl) {
          let canonicalTag = document.querySelector('link[rel="canonical"]');
          if (!canonicalTag) {
            canonicalTag = document.createElement('link');
            canonicalTag.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalTag);
          }
          canonicalTag.setAttribute('href', data.canonicalUrl);
        }
        
        // Update or inject JSON-LD Schema
        if (data.jsonLd) {
          let schemaTag = document.querySelector('script[type="application/ld+json"]');
          if (!schemaTag) {
            schemaTag = document.createElement('script');
            schemaTag.setAttribute('type', 'application/ld+json');
            document.head.appendChild(schemaTag);
          }
          schemaTag.textContent = JSON.stringify(data.jsonLd);
        }
      })
      .catch(error => {
        console.error('DualPilot: Error fetching or applying metadata:', error);
      });
    */
  }

  // Use requestIdleCallback to run our script without affecting page load performance.
  // Fallback to a simple timeout if the browser doesn't support it.
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(injectMeta);
  } else {
    setTimeout(injectMeta, 250);
  }

})();
