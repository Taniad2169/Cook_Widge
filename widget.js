// Cookie Banner Widget Logic
(function () {
  // Helpers
  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
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

  // Elements
  const banner = document.getElementById("wsCookieBanner");
  const modal = document.getElementById("wsCookieModal");
  const dnsModal = document.getElementById("wsDnsModal");
  const dnsPersistentBtn = document.getElementById("wsDnsPersistentButton");

  // Main banner actions
  document.getElementById("wsCookieAccept").onclick = function () {
    setCookie("wsCookieConsent", "accepted", 365);
    banner.style.display = "none";
    dnsPersistentBtn.style.display = ""; // Show persistent DNS button
  };
  document.getElementById("wsCookieReject").onclick = function () {
    setCookie("wsCookieConsent", "rejected", 365);
    banner.style.display = "none";
    dnsPersistentBtn.style.display = ""; // Show persistent DNS button
  };
  document.getElementById("wsCookieSettings").onclick = function () {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  // Cookie Settings modal
  document.getElementById("wsCookieModalClose").onclick = function () {
    modal.style.display = "none";
    document.body.style.overflow = "";
  };
  document.getElementById("wsCookieModalSave").onclick = function () {
    setCookie("wsCookieConsent", "custom", 365);
    modal.style.display = "none";
    banner.style.display = "none";
    dnsPersistentBtn.style.display = "";
    document.body.style.overflow = "";
  };
  document.getElementById("wsCookieModalReject").onclick = function () {
    setCookie("wsCookieConsent", "rejected", 365);
    modal.style.display = "none";
    banner.style.display = "none";
    dnsPersistentBtn.style.display = "";
    document.body.style.overflow = "";
  };

  // Do Not Sell My Info
  document.getElementById("wsDoNotSell").onclick = function (e) {
    e.preventDefault();
    dnsModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };
  // Modal close
  document.getElementById("wsDnsModalClose").onclick = function () {
    dnsModal.style.display = "none";
    document.body.style.overflow = "";
  };
  document.getElementById("wsDnsCancel").onclick = function () {
    dnsModal.style.display = "none";
    document.body.style.overflow = "";
  };
  // Save Do Not Sell preference
  document.getElementById("wsDnsSave").onclick = function () {
    var isOptedOut = document.getElementById("wsDoNotSellToggle").checked;
    setCookie("wsDoNotSell", isOptedOut ? "opted_out" : "", 365);

    // Show a status message for feedback
    var legalStatus = document.getElementById("wsLegalStatus");
    var statusText = document.getElementById("wsStatusText");
    var statusIndicator = document.getElementById("wsStatusIndicator");
    legalStatus.style.display = "block";
    statusText.textContent = isOptedOut
      ? "You have opted out of sale/sharing. Preference saved!"
      : "You have not opted out.";
    statusIndicator.style.background =
      isOptedOut ? "#34c759" : "#ccc";

    setTimeout(function () {
      legalStatus.style.display = "none";
      dnsModal.style.display = "none";
      document.body.style.overflow = "";
    }, 1800);
  };

  // Persistent DNS (Do Not Sell) button always visible after interaction
  dnsPersistentBtn.onclick = function () {
    dnsModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  // Initialization: Hide banner if previously accepted/rejected
  var consentStatus = getCookie("wsCookieConsent");
  if (consentStatus === "accepted" || consentStatus === "rejected" || consentStatus === "custom") {
    banner.style.display = "none";
    dnsPersistentBtn.style.display = "";
  } else {
    banner.style.display = "";
    dnsPersistentBtn.style.display = "none";
  }

  // Keyboard accessibility for modals (Escape closes)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      modal.style.display = "none";
      dnsModal.style.display = "none";
      document.body.style.overflow = "";
    }
  });
})();
