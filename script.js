(function() {
    'use strict';

    // Cookie utility functions
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // Check if user has already made a choice
    function checkCookieConsent() {
        var consent = getCookie('ws_cookie_consent');
        var banner = document.getElementById('wsCookieBanner');
        var persistentBtn = document.getElementById('wsDnsPersistentButton');

        if (consent) {
            if (banner) banner.style.display = 'none';
            if (persistentBtn) persistentBtn.style.display = 'block';
        } else {
            if (banner) banner.style.display = 'block';
            if (persistentBtn) persistentBtn.style.display = 'none';
        }
    }

    // Save cookie preferences
    function savePreferences(accepted) {
        var preferences = {
            necessary: true,
            performance: accepted ? document.getElementById('wsPerformanceCookies')?.checked : false,
            functional: accepted ? document.getElementById('wsFunctionalCookies')?.checked : false,
            targeting: accepted ? document.getElementById('wsTargetingCookies')?.checked : false,
            timestamp: new Date().toISOString()
        };

        setCookie('ws_cookie_consent', JSON.stringify(preferences), 365);
        
        var banner = document.getElementById('wsCookieBanner');
        var persistentBtn = document.getElementById('wsDnsPersistentButton');
        
        if (banner) banner.style.display = 'none';
        if (persistentBtn) persistentBtn.style.display = 'block';

        console.log('Cookie preferences saved:', preferences);
    }

    // Accept all cookies
    function acceptAllCookies() {
        // Set all checkboxes to checked
        var performanceCheckbox = document.getElementById('wsPerformanceCookies');
        var functionalCheckbox = document.getElementById('wsFunctionalCookies');
        var targetingCheckbox = document.getElementById('wsTargetingCookies');

        if (performanceCheckbox) performanceCheckbox.checked = true;
        if (functionalCheckbox) functionalCheckbox.checked = true;
        if (targetingCheckbox) targetingCheckbox.checked = true;

        savePreferences(true);
    }

    // Reject all cookies (except necessary)
    function rejectAllCookies() {
        var performanceCheckbox = document.getElementById('wsPerformanceCookies');
        var functionalCheckbox = document.getElementById('wsFunctionalCookies');
        var targetingCheckbox = document.getElementById('wsTargetingCookies');

        if (performanceCheckbox) performanceCheckbox.checked = false;
        if (functionalCheckbox) functionalCheckbox.checked = false;
        if (targetingCheckbox) targetingCheckbox.checked = false;

        savePreferences(false);
    }

    // Show cookie settings modal
    function showCookieSettings() {
        var modal = document.getElementById('wsCookieModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide cookie settings modal
    function hideCookieSettings() {
        var modal = document.getElementById('wsCookieModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Show Do Not Sell modal
    function showDnsModal() {
        var modal = document.getElementById('wsDnsModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Load current preference
            var dnsPreference = getCookie('ws_do_not_sell');
            var toggle = document.getElementById('wsDoNotSellToggle');
            if (toggle) {
                toggle.checked = dnsPreference === 'true';
            }
        }
    }

    // Hide Do Not Sell modal
    function hideDnsModal() {
        var modal = document.getElementById('wsDnsModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Save Do Not Sell preference
    function saveDnsPreference() {
        var toggle = document.getElementById('wsDoNotSellToggle');
        var statusDiv = document.getElementById('wsLegalStatus');
        var statusIndicator = document.getElementById('wsStatusIndicator');
        var statusText = document.getElementById('wsStatusText');

        if (toggle && statusDiv && statusIndicator && statusText) {
            // Show processing status
            statusDiv.style.display = 'flex';
            statusIndicator.className = 'ws-status-indicator ws-status-processing';
            statusText.textContent = 'Processing your request...';

            // Simulate processing delay
            setTimeout(function() {
                var optedOut = toggle.checked;
                setCookie('ws_do_not_sell', optedOut.toString(), 365);

                // Show success status
                statusIndicator.className = 'ws-status-indicator ws-status-success';
                statusText.textContent = optedOut 
                    ? 'Your opt-out preference has been registered successfully.' 
                    : 'Your preference has been updated.';

                // Hide modal after delay
                setTimeout(function() {
                    hideDnsModal();
                    statusDiv.style.display = 'none';
                }, 2000);

                console.log('Do Not Sell preference saved:', optedOut);
            }, 1000);
        }
    }

    // Initialize all event listeners
    function initEventListeners() {
        // Main banner buttons
        var acceptBtn = document.getElementById('wsCookieAccept');
        var rejectBtn = document.getElementById('wsCookieReject');
        var settingsBtn = document.getElementById('wsCookieSettings');
        var doNotSellLink = document.getElementById('wsDoNotSell');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Accept button clicked');
                acceptAllCookies();
            });
        } else {
            console.error('Accept button not found');
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Reject button clicked');
                rejectAllCookies();
            });
        } else {
            console.error('Reject button not found');
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Settings button clicked');
                showCookieSettings();
            });
            settingsBtn.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showCookieSettings();
                }
            });
        } else {
            console.error('Settings button not found');
        }

        if (doNotSellLink) {
            doNotSellLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Do Not Sell link clicked');
                showDnsModal();
            });
            doNotSellLink.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showDnsModal();
                }
            });
        } else {
            console.error('Do Not Sell link not found');
        }

        // Cookie settings modal buttons
        var modalClose = document.getElementById('wsCookieModalClose');
        var modalReject = document.getElementById('wsCookieModalReject');
        var modalSave = document.getElementById('wsCookieModalSave');
        var modal = document.getElementById('wsCookieModal');

        if (modalClose) {
            modalClose.addEventListener('click', hideCookieSettings);
        }

        if (modalReject) {
            modalReject.addEventListener('click', function() {
                rejectAllCookies();
                hideCookieSettings();
            });
        }

        if (modalSave) {
            modalSave.addEventListener('click', function() {
                savePreferences(true);
                hideCookieSettings();
            });
        }

        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    hideCookieSettings();
                }
            });
        }

        // Do Not Sell modal buttons
        var dnsClose = document.getElementById('wsDnsModalClose');
        var dnsCancel = document.getElementById('wsDnsCancel');
        var dnsSave = document.getElementById('wsDnsSave');
        var dnsModal = document.getElementById('wsDnsModal');
        var dnsPersistentBtn = document.getElementById('wsDnsPersistentButton');

        if (dnsClose) {
            dnsClose.addEventListener('click', hideDnsModal);
        }

        if (dnsCancel) {
            dnsCancel.addEventListener('click', hideDnsModal);
        }

        if (dnsSave) {
            dnsSave.addEventListener('click', saveDnsPreference);
        }

        if (dnsModal) {
            dnsModal.addEventListener('click', function(e) {
                if (e.target === dnsModal) {
                    hideDnsModal();
                }
            });
        }

        if (dnsPersistentBtn) {
            dnsPersistentBtn.addEventListener('click', showDnsModal);
        }

        // Keyboard accessibility
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideCookieSettings();
                hideDnsModal();
            }
        });
    }

    // Initialize on load
    function init() {
        checkCookieConsent();
        initEventListeners();
        console.log('Cookie banner initialized');
    }

    // Wait a bit to ensure DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded, wait a moment for widget HTML to be parsed
        setTimeout(init, 100);
    }

})();
