(function() {
    // Prevent duplicate load
    if (document.getElementById('ws-cookie-banner-widget-loaded')) return;

    // Mark as loaded
    var marker = document.createElement('div');
    marker.id = 'ws-cookie-banner-widget-loaded';
    marker.style.display = 'none';
    document.body.appendChild(marker);

    // Inject CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://Taniad2169.github.io/WS-Cookie-banner/style.css';
    document.head.appendChild(link);

    // Inject HTML
    fetch('https://Taniad2169.github.io/WS-Cookie-banner/widget.html')
        .then(function(response) { return response.text(); })
        .then(function(html) {
            var container = document.createElement('div');
            container.innerHTML = html;
            document.body.appendChild(container);

            // Inject Script for logic (ensures modal/buttons work)
            var script = document.createElement('script');
            script.src = 'https://Taniad2169.github.io/WS-Cookie-banner/script.js';
            script.defer = true;
            document.body.appendChild(script);
        });
})();
