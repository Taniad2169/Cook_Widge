/**
 * Cookie Consent Widget - FULL VERSION
 * Includes: Accept/Decline, Cookie Settings Modal, Do Not Sell My Information
 */

(function() {
  'use strict';

  // Check if widget already loaded
  if (window.cookieWidgetLoaded) return;
  window.cookieWidgetLoaded = true;

  // IMPORTANT: Set up public API IMMEDIATELY
  window.getCookieConsent = function() {
    return {
      status: localStorage.getItem('cookieConsent') || null,
      date: localStorage.getItem('cookieConsentDate') || null,
      necessary: localStorage.getItem('cookieNecessary') === 'true',
      analytics: localStorage.getItem('cookieAnalytics') === 'true',
      marketing: localStorage.getItem('cookieMarketing') === 'true',
      doNotSell: localStorage.getItem('doNotSell') === 'true'
    };
  };

  window.resetCookieConsent = function() {
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    localStorage.removeItem('cookieNecessary');
    localStorage.removeItem('cookieAnalytics');
    localStorage.removeItem('cookieMarketing');
    localStorage.removeItem('doNotSell');
    console.log('Cookie consent has been reset');
    location.reload();
  };

  // Check if user already accepted/declined cookies
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (cookieConsent) {
    console.log('Cookie consent already recorded:', cookieConsent);
    return;
  }

  // Create and inject styles
  const style = document.createElement('style');
  style.textContent = `
    #cookie-consent-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #14395d 0%, #1e5a7d 100%);
      color: #fff;
      padding: 20px;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
      z-index: 999999;
      font-family: 'Segoe UI', Arial, sans-serif;
      animation: slideUp 0.4s ease-out;
    }
    
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    #cookie-consent-banner.hiding {
      animation: slideDown 0.3s ease-out forwards;
    }
    
    @keyframes slideDown {
      to {
        transform: translateY(100%);
        opacity: 0;
      }
    }
    
    .cookie-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .cookie-text {
      flex: 1;
      min-width: 250px;
      font-size: 15px;
      line-height: 1.6;
    }
    
    .cookie-text strong {
      color: #a0e2eb;
      font-weight: 600;
    }
    
    .cookie-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .cookie-btn {
      padding: 12px 28px;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    
    .cookie-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    .cookie-btn:active {
      transform: translateY(0);
    }
    
    .cookie-btn-accept {
      background: linear-gradient(90deg, #15b375 0%, #20c997 100%);
      color: white;
    }
    
    .cookie-btn-accept:hover {
      background: linear-gradient(90deg, #12a066 0%, #1cb386 100%);
    }
    
    .cookie-btn-decline {
      background: rgba(255, 255, 255, 0.15);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .cookie-btn-decline:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    
    .cookie-btn-settings {
      background: transparent;
      color: #a0e2eb;
      border: 1px solid #a0e2eb;
      padding: 10px 20px;
      font-size: 14px;
    }
    
    .cookie-btn-settings:hover {
      background: rgba(160, 226, 235, 0.1);
    }

    /* Cookie Settings Modal */
    #cookie-settings-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .settings-modal-content {
      background: white;
      color: #333;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      animation: slideInUp 0.3s ease-out;
    }

    @keyframes slideInUp {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .settings-header {
      background: linear-gradient(135deg, #14395d 0%, #1e5a7d 100%);
      color: white;
      padding: 24px;
      border-radius: 12px 12px 0 0;
    }

    .settings-header h2 {
      margin: 0;
      font-size: 24px;
    }

    .settings-body {
      padding: 24px;
    }

    .cookie-option {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .cookie-option:last-child {
      border-bottom: none;
    }

    .cookie-option-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .cookie-option-title {
      font-weight: bold;
      font-size: 16px;
      color: #14395d;
    }

    .cookie-option-desc {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }

    /* Toggle Switch */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 26px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 26px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    .toggle-switch input:checked + .toggle-slider {
      background-color: #15b375;
    }

    .toggle-switch input:checked + .toggle-slider:before {
      transform: translateX(24px);
    }

    .toggle-switch input:disabled + .toggle-slider {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .settings-footer {
      padding: 20px 24px;
      background: #f5f5f5;
      border-radius: 0 0 12px 12px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .settings-footer button {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-save {
      background: linear-gradient(90deg, #15b375 0%, #20c997 100%);
      color: white;
    }

    .btn-save:hover {
      background: linear-gradient(90deg, #12a066 0%, #1cb386 100%);
      transform: translateY(-2px);
    }

    .btn-cancel {
      background: #e0e0e0;
      color: #333;
    }

    .btn-cancel:hover {
      background: #d0d0d0;
    }

    @media (max-width: 768px) {
      #cookie-consent-banner {
        padding: 16px;
      }
      
      .cookie-content {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }
      
      .cookie-text {
        text-align: center;
        font-size: 14px;
      }
      
      .cookie-buttons {
        justify-content: center;
        width: 100%;
        flex-direction: column;
      }
      
      .cookie-btn {
        width: 100%;
      }

      .settings-modal-content {
        width: 95%;
        max-height: 95vh;
      }

      .settings-header {
        padding: 20px;
      }

      .settings-body {
        padding: 20px;
      }

      .settings-footer {
        flex-direction: column;
      }

      .settings-footer button {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);

  // Create banner HTML
  const banner = document.createElement('div');
  banner.id = 'cookie-consent-banner';
  banner.innerHTML = `
    <div class="cookie-content">
      <div class="cookie-text">
        🍪 <strong>We use cookies</strong> to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
      </div>
      <div class="cookie-buttons">
        <button class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept All</button>
        <button class="cookie-btn cookie-btn-decline" id="cookie-decline">Decline</button>
        <button class="cookie-btn cookie-btn-settings" id="cookie-settings">Cookie Settings</button>
      </div>
    </div>
  `;

  function closeBanner() {
    banner.classList.add('hiding');
    setTimeout(function() {
      if (banner.parentNode) {
        banner.remove();
      }
    }, 300);
  }

  function handleAccept() {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    localStorage.setItem('cookieNecessary', 'true');
    localStorage.setItem('cookieAnalytics', 'true');
    localStorage.setItem('cookieMarketing', 'true');
    localStorage.setItem('doNotSell', 'false');
    console.log('✅ All cookies accepted');
    closeBanner();
    
    window.dispatchEvent(new CustomEvent('cookieConsentAccepted', {
      detail: { date: new Date().toISOString(), all: true }
    }));
  }

  function handleDecline() {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    localStorage.setItem('cookieNecessary', 'true');
    localStorage.setItem('cookieAnalytics', 'false');
    localStorage.setItem('cookieMarketing', 'false');
    localStorage.setItem('doNotSell', 'true');
    console.log('❌ Cookies declined');
    closeBanner();
    
    window.dispatchEvent(new CustomEvent('cookieConsentDeclined', {
      detail: { date: new Date().toISOString() }
    }));
  }

  function showSettingsModal() {
    // Get current settings or defaults
    const currentSettings = {
      necessary: true, // Always true, can't be disabled
      analytics: localStorage.getItem('cookieAnalytics') !== 'false',
      marketing: localStorage.getItem('cookieMarketing') !== 'false',
      doNotSell: localStorage.getItem('doNotSell') === 'true'
    };

    const modal = document.createElement('div');
    modal.id = 'cookie-settings-modal';
    modal.innerHTML = `
      <div class="settings-modal-content">
        <div class="settings-header">
          <h2>🍪 Cookie Settings</h2>
        </div>
        <div class="settings-body">
          <div class="cookie-option">
            <div class="cookie-option-header">
              <span class="cookie-option-title">Necessary Cookies</span>
              <label class="toggle-switch">
                <input type="checkbox" id="toggle-necessary" checked disabled>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <p class="cookie-option-desc">
              These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas.
            </p>
          </div>

          <div class="cookie-option">
            <div class="cookie-option-header">
              <span class="cookie-option-title">Analytics Cookies</span>
              <label class="toggle-switch">
                <input type="checkbox" id="toggle-analytics" ${currentSettings.analytics ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <p class="cookie-option-desc">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
          </div>

          <div class="cookie-option">
            <div class="cookie-option-header">
              <span class="cookie-option-title">Marketing Cookies</span>
              <label class="toggle-switch">
                <input type="checkbox" id="toggle-marketing" ${currentSettings.marketing ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <p class="cookie-option-desc">
              These cookies are used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.
            </p>
          </div>

          <div class="cookie-option">
            <div class="cookie-option-header">
              <span class="cookie-option-title">Do Not Sell My Information</span>
              <label class="toggle-switch">
                <input type="checkbox" id="toggle-donotsell" ${currentSettings.doNotSell ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <p class="cookie-option-desc">
              Enable this option to opt-out of the sale or sharing of your personal information to third parties.
            </p>
          </div>
        </div>
        <div class="settings-footer">
          <button class="btn-cancel" id="settings-cancel">Cancel</button>
          <button class="btn-save" id="settings-save">Save Preferences</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle Save button
    document.getElementById('settings-save').addEventListener('click', function() {
      const analytics = document.getElementById('toggle-analytics').checked;
      const marketing = document.getElementById('toggle-marketing').checked;
      const doNotSell = document.getElementById('toggle-donotsell').checked;

      localStorage.setItem('cookieConsent', 'custom');
      localStorage.setItem('cookieConsentDate', new Date().toISOString());
      localStorage.setItem('cookieNecessary', 'true');
      localStorage.setItem('cookieAnalytics', analytics.toString());
      localStorage.setItem('cookieMarketing', marketing.toString());
      localStorage.setItem('doNotSell', doNotSell.toString());

      console.log('⚙️ Custom cookie preferences saved:', {
        analytics: analytics,
        marketing: marketing,
        doNotSell: doNotSell
      });

      modal.remove();
      closeBanner();

      window.dispatchEvent(new CustomEvent('cookieConsentCustom', {
        detail: {
          date: new Date().toISOString(),
          analytics: analytics,
          marketing: marketing,
          doNotSell: doNotSell
        }
      }));
    });

    // Handle Cancel button
    document.getElementById('settings-cancel').addEventListener('click', function() {
      modal.remove();
    });

    // Close modal on outside click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Initialize when DOM is ready
  function init() {
    document.body.appendChild(banner);

    // Handle Accept button
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    const settingsBtn = document.getElementById('cookie-settings');
    
    if (acceptBtn) {
      acceptBtn.addEventListener('click', handleAccept);
    }
    
    if (declineBtn) {
      declineBtn.addEventListener('click', handleDecline);
    }

    if (settingsBtn) {
      settingsBtn.addEventListener('click', showSettingsModal);
    }

    console.log('🍪 Cookie consent banner loaded with full settings');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
