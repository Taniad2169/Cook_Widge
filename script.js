// ============================================
// COOKIE BANNER WIDGET - SCRIPT
// script.js - Cookie Consent JavaScript Logic
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('wsCookieBanner');
    const cookieModal = document.getElementById('wsCookieModal');
    const dnsModal = document.getElementById('wsDnsModal');
    const cookieAccept = document.getElementById('wsCookieAccept');
    const cookieReject = document.getElementById('wsCookieReject');
    const cookieSettings = document.getElementById('wsCookieSettings');
    const cookieModalClose = document.getElementById('wsCookieModalClose');
    const cookieModalSave = document.getElementById('wsCookieModalSave');
    const cookieModalReject = document.getElementById('wsCookieModalReject');
    const doNotSellLink = document.getElementById('wsDoNotSell');
    const dnsModalClose = document.getElementById('wsDnsModalClose');
    const dnsCancel = document.getElementById('wsDnsCancel');
    const dnsSave = document.getElementById('wsDnsSave');
    const legalStatus = document.getElementById('wsLegalStatus');
    const statusIndicator = document.getElementById('wsStatusIndicator');
    const statusText = document.getElementById('wsStatusText');
    const dnsPersistentButton = document.getElementById('wsDnsPersistentButton');

    // Cookie consent check
    if (!wsGetCookie('wsCookieConsent')) {
        cookieBanner.style.display = 'block';
    } else {
        cookieBanner.style.display = 'none';
    }

    // Accept all cookies
    cookieAccept.addEventListener('click', function() {
        wsSetCookie('wsCookieConsent', 'all', 365);
        wsSetCookie('wsPerformanceCookies', 'true', 365);
        wsSetCookie('wsFunctionalCookies', 'true', 365);
        wsSetCookie('wsTargetingCookies', 'true', 365);
        cookieBanner.style.display = 'none';
    });

    // Reject all cookies (only necessary)
    cookieReject.addEventListener('click', function() {
        wsSetCookie('wsCookieConsent', 'necessary', 365);
        wsSetCookie('wsPerformanceCookies', 'false', 365);
        wsSetCookie('wsFunctionalCookies', 'false', 365);
        wsSetCookie('wsTargetingCookies', 'false', 365);
        cookieBanner.style.display = 'none';
    });

    // Open cookie settings modal
    cookieSettings.addEventListener('click', function() {
        cookieModal.classList.add('active');
    });

    // Close cookie settings modal
    cookieModalClose.addEventListener('click', function() {
        cookieModal.classList.remove('active');
    });

    // Reject all in modal
    cookieModalReject.addEventListener('click', function() {
        document.getElementById('wsPerformanceCookies').checked = false;
        document.getElementById('wsFunctionalCookies').checked = false;
        document.getElementById('wsTargetingCookies').checked = false;

        wsSetCookie('wsCookieConsent', 'necessary', 365);
        wsSetCookie('wsPerformanceCookies', 'false', 365);
        wsSetCookie('wsFunctionalCookies', 'false', 365);
        wsSetCookie('wsTargetingCookies', 'false', 365);

        cookieModal.classList.remove('active');
        cookieBanner.style.display = 'none';
    });

    // Save preferences from modal
    cookieModalSave.addEventListener('click', function() {
        const performance = document.getElementById('wsPerformanceCookies').checked;
        const functional = document.getElementById('wsFunctionalCookies').checked;
        const targeting = document.getElementById('wsTargetingCookies').checked;

        if (performance && functional && targeting) {
            wsSetCookie('wsCookieConsent', 'all', 365);
        } else if (!performance && !functional && !targeting) {
            wsSetCookie('wsCookieConsent', 'necessary', 365);
        } else {
            wsSetCookie('wsCookieConsent', 'custom', 365);
        }

        wsSetCookie('wsPerformanceCookies', performance.toString(), 365);
        wsSetCookie('wsFunctionalCookies', functional.toString(), 365);
        wsSetCookie('wsTargetingCookies', targeting.toString(), 365);

        cookieModal.classList.remove('active');
        cookieBanner.style.display = 'none';
    });

    // Open Do Not Sell modal
    doNotSellLink.addEventListener('click', function(e) {
        e.preventDefault();
        dnsModal.classList.add('active');
        const currentPref = wsGetCookie('wsDoNotSell');
        document.getElementById('wsDoNotSellToggle').checked = currentPref === 'true';
        legalStatus.style.display = 'none';
    });

    // Persistent Do Not Sell Button - Show DNS modal
    dnsPersistentButton.addEventListener('click', function() {
        dnsModal.classList.add('active');
        const currentPref = wsGetCookie('wsDoNotSell');
        document.getElementById('wsDoNotSellToggle').checked = currentPref === 'true';
        legalStatus.style.display = 'none';
    });

    // Close DNS modal
    dnsModalClose.addEventListener('click', function() {
        dnsModal.classList.remove('active');
    });

    // Cancel DNS modal
    dnsCancel.addEventListener('click', function() {
        dnsModal.classList.remove('active');
    });

    // Save DNS preference
    dnsSave.addEventListener('click', function() {
        const doNotSell = document.getElementById('wsDoNotSellToggle').checked;

        legalStatus.style.display = 'flex';
        statusIndicator.className = 'ws-status-indicator pending';
        statusText.textContent = 'Processing your request...';

        wsRegisterLegalPreference(doNotSell)
            .then(function(success) {
                if (success) {
                    statusIndicator.className = 'ws-status-indicator';
                    statusText.textContent = 'Preference legally registered and saved';
                    wsSetCookie('wsDoNotSell', doNotSell.toString(), 365);

                    setTimeout(function() {
                        dnsModal.classList.remove('active');
                        if (doNotSell) {
                            wsImplementDoNotSell();
                        }
                    }, 1500);
                } else {
                    statusIndicator.className = 'ws-status-indicator error';
                    statusText.textContent = 'Registration failed. Please try again.';
                }
            })
            .catch(function(error) {
                statusIndicator.className = 'ws-status-indicator error';
                statusText.textContent = 'Registration failed. Please try again.';
            });
    });

    // Load saved preferences for modal toggles
    const performancePref = wsGetCookie('wsPerformanceCookies');
    const functionalPref = wsGetCookie('wsFunctionalCookies');
    const targetingPref = wsGetCookie('wsTargetingCookies');

    if (performancePref !== null) {
        document.getElementById('wsPerformanceCookies').checked = performancePref === 'true';
    }
    if (functionalPref !== null) {
        document.getElementById('wsFunctionalCookies').checked = functionalPref === 'true';
    }
    if (targetingPref !== null) {
        document.getElementById('wsTargetingCookies').checked = targetingPref === 'true';
    }

    // Cookie utility
    function wsSetCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    function wsGetCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Implement Do Not Sell functionality
    function wsImplementDoNotSell() {
        if (navigator.globalPrivacyControl !== undefined) {
            navigator.globalPrivacyControl = true;
        }
        console.log('Do Not Sell preference implemented');
    }

    // Simulate legal preference registration
    function wsRegisterLegalPreference(doNotSell) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                const success = Math.random() > 0.1;
                if (success) {
                    resolve(true);
                } else {
                    reject(new Error('Legal registration service unavailable'));
                }
            }, 2000);
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cookieModal) {
            cookieModal.classList.remove('active');
        }
        if (event.target === dnsModal) {
            dnsModal.classList.remove('active');
        }
    });
});
