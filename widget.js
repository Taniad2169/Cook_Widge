(function() {
    'use strict';

    // Prevent double-load
    if (document.getElementById('ws-cookie-banner-widget-loaded')) {
        console.warn('Cookie banner widget already loaded');
        return;
    }
    
    // Mark as loaded
    var marker = document.createElement('div');
    marker.id = 'ws-cookie-banner-widget-loaded';
    marker.style.display = 'none';
    document.body.appendChild(marker);
    
    console.log('Loading cookie banner widget...');
    
    // Base URL for your GitHub pages
    var BASE_URL = 'https://taniad2169.github.io/Cook_Widge/';
    
    // Inject cookie banner CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = BASE_URL + 'style.css';
    link.onerror = function() {
        console.error('Failed to load cookie banner CSS');
    };
    document.head.appendChild(link);
    
    // Inject cookie banner HTML
    fetch(BASE_URL + 'widget.html')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            return response.text();
        })
        .then(function(html) {
            console.log('Cookie banner HTML loaded');
            
            // Create container and inject HTML
            var container = document.createElement('div');
            container.innerHTML = html;
            document.body.appendChild(container);
            
            // Wait for DOM to be fully parsed before loading script
            return new Promise(function(resolve) {
                setTimeout(function() {
                    console.log('DOM ready, loading script...');
                    resolve();
                }, 150);
            });
        })
        .then(function() {
            // Inject cookie banner JS logic after HTML is ready
            var script = document.createElement('script');
            script.src = BASE_URL + 'script.js';
            script.type = 'text/javascript';
            
            // Add load event listener to verify script loaded
            script.onload = function() {
                console.log('Cookie banner script loaded successfully');
            };
            
            script.onerror = function() {
                console.error('Failed to load cookie banner script from: ' + BASE_URL + 'script.js');
            };
            
            document.body.appendChild(script);
        })
        .catch(function(error) {
            console.error('Cookie banner widget error:', error);
            console.error('Failed to load from:', BASE_URL);
        });
})();
