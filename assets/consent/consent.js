/* Consent banner for Matomo (cookieless, self-hosted).
   Without a readable "granted" decision, nothing is sent to Matomo and
   matomo.js is not loaded. Storage: localStorage "analytics-consent"
   ("granted" | "denied") plus "analytics-consent-timestamp" (ISO 8601, UTC);
   a decision older than 12 months counts as missing.
   Matomo URL and site ID come from the theme settings (data attributes on
   the banner); if either is missing or invalid, nothing runs. */
(function () {
    'use strict';

    var KEY = 'analytics-consent';
    var KEY_TIMESTAMP = 'analytics-consent-timestamp';
    var VALID_MONTHS = 12;

    var banner = document.getElementById('consent-banner');
    if (!banner) {
        return;
    }

    var MATOMO_URL = (banner.getAttribute('data-matomo-url') || '').trim();
    var MATOMO_SITE_ID = (banner.getAttribute('data-matomo-site-id') || '').trim();
    if (!/^https:\/\/[^\s"'<>]+$/.test(MATOMO_URL) || !/^\d+$/.test(MATOMO_SITE_ID)) {
        return;
    }
    if (MATOMO_URL.slice(-1) !== '/') {
        MATOMO_URL += '/';
    }

    var tracked = false;
    var lastOpener = null;

    function readConsent() {
        try {
            var value = window.localStorage.getItem(KEY);
            var time = Date.parse(window.localStorage.getItem(KEY_TIMESTAMP) || '');
            if ((value !== 'granted' && value !== 'denied') || isNaN(time)) {
                return null;
            }
            var expires = new Date(time);
            expires.setUTCMonth(expires.getUTCMonth() + VALID_MONTHS);
            return Date.now() < expires.getTime() ? value : null;
        } catch (e) {
            return null;
        }
    }

    function saveConsent(value) {
        try {
            window.localStorage.setItem(KEY, value);
            window.localStorage.setItem(KEY_TIMESTAMP, new Date().toISOString());
        } catch (e) {
            // Storage blocked: the decision only applies to this page view.
        }
    }

    // Runs at most once per page: configures the tracker, tracks the page
    // view and loads matomo.js.
    function startTracking() {
        var _paq = window._paq = window._paq || [];
        if (tracked) {
            _paq.push(['setConsentGiven', false]);
            return;
        }
        tracked = true;
        _paq.push(['requireConsent']);
        _paq.push(['disableCookies']);
        _paq.push(['enableLinkTracking']);
        _paq.push(['setTrackerUrl', MATOMO_URL + 'matomo.php']);
        _paq.push(['setSiteId', MATOMO_SITE_ID]);
        _paq.push(['setConsentGiven', false]);
        _paq.push(['trackPageView']);

        var script = document.createElement('script');
        script.async = true;
        script.src = MATOMO_URL + 'matomo.js';
        document.head.appendChild(script);
    }

    function updateOffset() {
        if (!banner || banner.hidden) {
            return;
        }
        document.documentElement.style.setProperty('--consent-banner-height', banner.offsetHeight + 'px');
    }

    function showBanner(opener) {
        if (!banner) {
            return;
        }
        banner.hidden = false;
        document.documentElement.classList.add('has-consent-banner');
        updateOffset();
        if (opener) {
            lastOpener = opener;
            banner.focus();
        }
    }

    function hideBanner() {
        if (!banner) {
            return;
        }
        var hadFocus = banner.contains(document.activeElement);
        banner.hidden = true;
        document.documentElement.classList.remove('has-consent-banner');
        if (hadFocus && lastOpener && document.contains(lastOpener)) {
            lastOpener.focus();
        }
        lastOpener = null;
    }

    function accept() {
        saveConsent('granted');
        startTracking();
        hideBanner();
    }

    function deny() {
        saveConsent('denied');
        if (tracked) {
            window._paq.push(['forgetConsentGiven']);
        }
        hideBanner();
    }

    document.addEventListener('click', function (event) {
        var target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        if (target.closest('[data-consent-accept]')) {
            accept();
        } else if (target.closest('[data-consent-deny]')) {
            deny();
        } else if (target.closest('[data-consent-open]')) {
            event.preventDefault();
            showBanner(target.closest('[data-consent-open]'));
        }
    });

    // Footer button is hidden without JavaScript.
    var footerButton = document.querySelector('.consent-footer-button');
    if (footerButton) {
        footerButton.hidden = false;
    }

    if (window.ResizeObserver && banner) {
        new ResizeObserver(updateOffset).observe(banner);
    } else {
        window.addEventListener('resize', updateOffset);
    }

    document.addEventListener('keydown', function (event) {
        // Only a reopened banner closes; a first-visit banner waits for a decision.
        if (event.key === 'Escape' && !banner.hidden && readConsent() !== null) {
            hideBanner();
        }
    });

    var consent = readConsent();
    if (consent === 'granted') {
        startTracking();
    } else if (consent === null) {
        showBanner();
    }
})();
