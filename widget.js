(function() {
    // Prevent double-load
    if (document.getElementById('ws-cookie-banner-widget-loaded')) return;

    // Mark as loaded
    var marker = document.createElement('div');
    marker.id = 'ws-cookie-banner-widget-loaded';
    marker.style.display = 'none';
    document.body.appendChild(marker);

    // Inject cookie banner CSS
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://taniad2169.github.io/Cook_Widge/style.css';
    document.head.appendChild(link);

    // Inject cookie banner HTML
    fetch('https://taniad2169.github.io/Cook_Widge/widget.html')
        .then(function(response) { return response.text(); })
        .then(function(html) {
            var container = document.createElement('div');
            container.innerHTML = html;
            document.body.appendChild(container);

            // Inject cookie banner JS logic
            var script = document.createElement('script');
            script.src = 'https://taniad2169.github.io/Cook_Widge/script.js';
            script.defer = true;
            document.body.appendChild(script);
        });
})();
