// Basic Cookie Banner Loader – shows banner, but limited button logic
// (Make sure this is in your Cook_Widge/script.js file)

window.addEventListener('DOMContentLoaded', function () {
  var banner = document.getElementById('wsCookieBanner');
  if (banner) banner.style.display = '';

  // If you want to temporarily hide the modals on page load, make sure:
  var modal = document.getElementById('wsCookieModal');
  if (modal) modal.style.display = 'none';

  var dnsModal = document.getElementById('wsDnsModal');
  if (dnsModal) dnsModal.style.display = 'none';

  var dnsPersistentBtn = document.getElementById('wsDnsPersistentButton');
  if (dnsPersistentBtn) dnsPersistentBtn.style.display = 'none';
});
