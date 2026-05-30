(function() {
  "use strict";
  var FRAUD_CHECK_EXCLUDED_SITE_IDS = [ "1f1286c3-7fd5-67d8-974c-f6bb31651605" ];
  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  }
  function getOrCreateSessionKey(tracker) {
    const tokenKey = "sessionKey";
    const expiryKey = "sessionKeyExpiry";
    const existingToken = localStorage.getItem(tokenKey);
    const expiryDate = localStorage.getItem(expiryKey);
    if (existingToken && expiryDate && /* @__PURE__ */ new Date < new Date(expiryDate)) return existingToken;
    const newToken = crypto.randomUUID();
    const expiry = /* @__PURE__ */ new Date;
    expiry.setDate(expiry.getDate() + 90);
    localStorage.setItem(tokenKey, newToken);
    localStorage.setItem(expiryKey, expiry.toISOString());
    if (tracker) {
      var data = tracker.collectBrowserData();
      data.event = "SessionKeyCreated";
      data.timestamp = Date.now();
      tracker.sendDataWithBeacon(data);
    }
    return newToken;
  }
  function createTrackingObject(initialQueue, base_url) {
    return {
      siteIdentifier: initialQueue?.siteIdentifier || initialQueue?.[0]?.siteIdentifier || null,
      eventConfigs: initialQueue?.eventConfigs || initialQueue?.[0]?.eventConfigs || [],
      isFullyLoaded: true,
      isShopify: "object" === typeof window.Shopify,
      sessionKey: null,
      init: function() {
        this.sessionKey = getOrCreateSessionKey(this);
        this.processCommand();
        this.initEventTracking();
      },
      processCommand: function() {
        this.trackPageLoad();
      },
      initEventTracking: function() {
        this.initTrackPageView();
        this.trackClicks([ "button", "a" ]);
        this.initScrollTracking();
        this.trackFormSubmissions("form");
        this.trackTabSwitches();
        this.trackPageUnload();
      },
      trackPageView: function(url) {
        var data = this.collectBrowserData();
        data.event = "PageView";
        data.url = url;
        data.timestamp = Date.now();
        this.sendDataWithBeacon(data);
      },
      trackClicks: function(selectors) {
        selectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(element => {
            element.addEventListener("click", () => {
              var data = this.collectBrowserData();
              data.event = "Click";
              data.selector = selector;
              data.timestamp = Date.now();
              this.sendDataWithBeacon(data);
            });
          });
        });
      },
      initTrackPageView: function() {
        setTimeout(() => {
          this.trackPageView(window.location.href);
        }, 1e3);
        window.addEventListener("popstate", event => {
          event.preventDefault();
          setTimeout(() => {
            this.trackPageView(window.location.href);
          }, 1e3);
        });
        window.addEventListener("hashchange", event => {
          event.preventDefault();
          setTimeout(() => {
            this.trackPageView(window.location.href);
          }, 1e3);
        });
        let timeOnPage = 0;
        const timeThresholds = [ {
          seconds: 2,
          eventName: "2_Seconds_Active",
          triggered: false
        }, {
          seconds: 5,
          eventName: "5_Seconds_Active",
          triggered: false
        }, {
          seconds: 10,
          eventName: "10_Seconds_Active",
          triggered: false
        } ];
        const startTimeTracking = () => {
          const startTime = Date.now();
          const interval = setInterval(() => {
            timeOnPage = Math.floor((Date.now() - startTime) / 1e3);
            timeThresholds.forEach(threshold => {
              if (timeOnPage >= threshold.seconds && !threshold.triggered) {
                var data = this.collectBrowserData();
                data.event = threshold.eventName;
                data.url = window.location.href;
                data.time_spent = threshold.seconds;
                data.timestamp = Date.now();
                this.sendDataWithBeacon(data);
                threshold.triggered = true;
              }
            });
            if (timeOnPage >= 10) clearInterval(interval);
          }, 1e3);
        };
        startTimeTracking();
      },
      initScrollTracking: function() {
        const self = this;
        const BUFFER_SIZE = 20;
        const SAMPLE_INTERVAL = 100;
        const BURST_GAP = 1e3;
        const MIN_SCROLL_THRESHOLD = 5;
        let history = [];
        let lastTime = performance.now();
        let lastY = window.scrollY;
        let hasSentScrollStart = false;
        let cachedDocHeight = 0;
        let cachedWinHeight = 0;
        let scrollMetrics = {
          totalDist: 0,
          burstTime: 0,
          maxVel: 0,
          maxScrollDepth: 0,
          dirChanges: 0,
          lastDir: 0,
          burstCount: 0
        };
        function updateDimensions() {
          const doc = document.documentElement;
          cachedDocHeight = doc.scrollHeight;
          cachedWinHeight = doc.clientHeight;
        }
        function getScrollDepth() {
          const scrollableDist = cachedDocHeight - cachedWinHeight;
          if (scrollableDist <= 0) return 100;
          const pct = window.scrollY / scrollableDist * 100;
          return Math.min(100, Math.max(0, pct));
        }
        function onScroll() {
          const now = performance.now();
          const dt = now - lastTime;
          if (dt < SAMPLE_INTERVAL) return;
          if (!hasSentScrollStart) {
            var data = self.collectBrowserData();
            data.event = "ScrollStart";
            data.timestamp = Date.now();
            self.sendDataWithBeacon(data);
            hasSentScrollStart = true;
            scrollMetrics.burstCount = 1;
          }
          if (dt > BURST_GAP) {
            if (scrollMetrics.totalDist > 0) scrollMetrics.burstCount++;
            lastTime = now;
            lastY = window.scrollY;
            return;
          }
          const y = window.scrollY;
          const dy = y - lastY;
          const absDy = Math.abs(dy);
          if (absDy < MIN_SCROLL_THRESHOLD) {
            lastTime = now;
            return;
          }
          const dir = dy > 0 ? 1 : -1;
          const vel = absDy / dt;
          const currentDepth = getScrollDepth();
          scrollMetrics.totalDist += absDy;
          scrollMetrics.burstTime += dt;
          if (vel > scrollMetrics.maxVel) scrollMetrics.maxVel = vel;
          if (currentDepth > scrollMetrics.maxScrollDepth) scrollMetrics.maxScrollDepth = currentDepth;
          if (0 !== scrollMetrics.lastDir && dir !== scrollMetrics.lastDir) scrollMetrics.dirChanges++;
          scrollMetrics.lastDir = dir;
          history.push({
            dt: Math.round(dt),
            dy: Math.round(dy),
            dir: dir,
            vel: parseFloat(vel.toFixed(4)),
            depth: parseFloat(currentDepth.toFixed(2))
          });
          lastTime = now;
          lastY = y;
          if (history.length >= BUFFER_SIZE) sendScrollEvents();
        }
        function sendScrollEvents() {
          if (0 === history.length) return;
          var data = self.collectBrowserData();
          data.event = "Scroll";
          data.eventMeta = {
            scrollPoints: history
          };
          data.timestamp = Date.now();
          self.sendDataWithBeacon(data);
          history = [];
        }
        function sendScrollSummary() {
          if (0 === scrollMetrics.totalDist) return;
          const avgVel = scrollMetrics.burstTime > 0 ? scrollMetrics.totalDist / scrollMetrics.burstTime : 0;
          var data = self.collectBrowserData();
          data.event = "ScrollSummary";
          data.eventMeta = {
            scrollPoints: history,
            summary: {
              totalDist: scrollMetrics.totalDist,
              burstTime: Math.round(scrollMetrics.burstTime),
              maxVel: parseFloat(scrollMetrics.maxVel.toFixed(4)),
              avgVel: parseFloat(avgVel.toFixed(4)),
              dirChanges: scrollMetrics.dirChanges,
              maxScrollDepth: parseFloat(scrollMetrics.maxScrollDepth.toFixed(2)),
              burstCount: scrollMetrics.burstCount
            }
          };
          data.timestamp = Date.now();
          self.sendDataWithBeacon(data);
          history = [];
        }
        updateDimensions();
        window.addEventListener("resize", updateDimensions, {
          passive: true
        });
        window.addEventListener("scroll", onScroll, {
          passive: true
        });
        document.addEventListener("visibilitychange", function() {
          if ("hidden" === document.visibilityState) sendScrollSummary(); else if ("visible" === document.visibilityState) {
            lastTime = performance.now();
            lastY = window.scrollY;
          }
        });
      },
      trackTabSwitches: function() {
        document.addEventListener("visibilitychange", () => {
          var data = this.collectBrowserData();
          data.event = "TabSwitch";
          data.visibilityState = document.visibilityState;
          data.timestamp = Date.now();
          this.sendDataWithBeacon(data);
        });
      },
      trackFormSubmissions: function(selector) {
        document.querySelectorAll(selector).forEach(form => {
          form.addEventListener("submit", event => {
            try {
              var formData = new FormData(event.target);
              var data = this.collectBrowserData();
              data.event = "FormSubmission";
              data.formId = form.id || "unnamed-form";
              data.timestamp = Date.now();
              this.sendDataWithBeacon(data);
            } catch (error) {}
          });
        });
      },
      trackPageUnload: function() {
        window.addEventListener("beforeunload", () => {
          var data = this.collectBrowserData();
          data.event = "PageUnload";
          data.timestamp = Date.now();
          this.sendDataWithBeacon(data);
        });
      },
      trackPageLoad: function() {
        var data = this.collectBrowserData();
        data.event = "PageLoad";
        data.timestamp = Date.now();
        this.sendDataWithBeacon(data);
        this.processFirstVisit();
        this.processSessionStart();
        this.fireFraudCheck();
      },
      processFirstVisit: function() {
        if (!localStorage.getItem("blokIDFirstVisit")) {
          localStorage.setItem("blokIDFirstVisit", /* @__PURE__ */ (new Date).toISOString());
          var data = this.collectBrowserData();
          data.event = "firstVisit";
          data.timestamp = Date.now();
          this.sendDataWithBeacon(data);
        }
      },
      processSessionStart: function() {
        let lastSessionTimestamp = localStorage.getItem("lastSessionTimestamp");
        let currentTimestamp = Date.now();
        if (!lastSessionTimestamp || currentTimestamp - lastSessionTimestamp > 30 * 60 * 1e3) {
          var data = this.collectBrowserData();
          data.event = "sessionStart";
          data.timestamp = currentTimestamp;
          this.sendDataWithBeacon(data);
        }
        lastSessionTimestamp = currentTimestamp;
      },
      fireFraudCheck: function() {
        if (FRAUD_CHECK_EXCLUDED_SITE_IDS.indexOf(this.siteIdentifier) !== -1) return;
        var self = this;
        var maxAttempts = 20;
        var attempt = 0;
        function isFbqReady() {
          try {
            return "undefined" !== typeof fbq && "function" === typeof fbq && fbq.getState && fbq.getState().pixels && fbq.getState().pixels.length > 0;
          } catch (e) {
            return false;
          }
        }
        function tryFireFraudCheck() {
          if (isFbqReady()) {
            fbq("trackCustom", "FraudCheck", {
              external_id: self.sessionKey
            });
            return;
          }
          attempt++;
          if (attempt < maxAttempts) setTimeout(tryFireFraudCheck, 500);
        }
        tryFireFraudCheck();
      },
      collectBrowserData: function() {
        var data = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          screenWidth: screen.width,
          screenHeight: screen.height,
          colorDepth: screen.colorDepth,
          pixelDepth: screen.pixelDepth,
          timezoneOffset: /* @__PURE__ */ (new Date).getTimezoneOffset(),
          sessionStorage: !!window.sessionStorage,
          localStorage: !!window.localStorage,
          cookiesEnabled: navigator.cookieEnabled,
          plugins: Array.prototype.slice.call(navigator.plugins).map(function(plugin) {
            return plugin.name;
          }),
          currentUrl: window.location.href,
          previousUrl: document.referrer,
          mimeTypes: Array.prototype.slice.call(navigator.mimeTypes).map(function(mimeType) {
            return mimeType.type;
          }),
          touchSupport: "ontouchstart" in window || navigator.maxTouchPoints || navigator.msMaxTouchPoints ? true : false,
          hardwareConcurrency: navigator.hardwareConcurrency,
          deviceMemory: navigator.deviceMemory || null,
          siteIdentifier: this.siteIdentifier,
          timestamp: /* @__PURE__ */ (new Date).toISOString(),
          sessionKey: this.sessionKey,
          fbp: getCookie("_fbp"),
          fbc: getCookie("_fbc"),
          ttp: getCookie("_ttp"),
          selector: null
        };
        try {
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          ctx.textBaseline = "top";
          ctx.font = "14px 'Arial'";
          ctx.fillStyle = "#f60";
          ctx.fillRect(125, 1, 62, 20);
          ctx.fillStyle = "#069";
          ctx.fillText("Hello world", 2, 15);
          ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
          ctx.fillText("Hello world", 4, 17);
          data.canvasFingerprint = canvas.toDataURL();
        } catch (e) {
          data.canvasFingerprint = "not supported";
        }
        return data;
      },
      sendDataWithBacon: function(data) {
        try {
          var jsonData = JSON.stringify(data);
          var url = `${base_url}/track`;
          navigator.sendBeacon(url, jsonData);
        } catch (error) {}
      },
      sendData: function(data) {
        try {
          var xhr = new XMLHttpRequest;
          xhr.withCredentials = true;
          xhr.open("POST", `${base_url}/track`, true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(JSON.stringify(data));
        } catch (error) {}
      },
      sendDataWithBeacon: function(data) {
        try {
          var jsonData = JSON.stringify(data);
          var url = `${base_url}/track`;
          navigator.sendBeacon(url, jsonData);
        } catch (error) {}
      }
    };
  }
  (function() {
    var initialVaticaiQueue = window.vaticaiTracker || {};
    var initialBlokidQueue = window.blokidTracker || {};
    var initialVauditQueue = window.vauditTracker || {};
    let base_url = "https://pixel.tracking.vaudit.com";
    window.vaticaiTracker = createTrackingObject(initialVaticaiQueue, base_url);
    window.blokidTracker = createTrackingObject(initialBlokidQueue, base_url);
    window.vauditTracker = createTrackingObject(initialVauditQueue, base_url);
    setTimeout(() => {
      if (window.vaticaiTracker.siteIdentifier) window.vaticaiTracker.init(); else if (window.blokidTracker.siteIdentifier) window.blokidTracker.init(); else if (window.vauditTracker.siteIdentifier) window.vauditTracker.init();
    }, 1e3);
  })();
})();
