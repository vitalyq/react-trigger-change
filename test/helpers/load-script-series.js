(function () {
  'use strict';

  function loadScript(url, callback) {
    var done = false;
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = url;
    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState === 'loaded' ||
        this.readyState === 'complete')) {
        done = true;

        // Handle memory leak in IE.
        script.onload = script.onreadystatechange = null;
        head.removeChild(script);

        callback();
      }
    };

    head.appendChild(script);
  }

  function loadScriptSeries(urls, callback) {
    var i = 0;
    function onLoad() {
      i += 1;
      if (i !== urls.length) {
        loadScript(urls[i], onLoad);
      } else {
        callback();
      }
    }

    loadScript(urls[0], onLoad);
  }

  // Exports
  window.loadScriptSeries = loadScriptSeries;
}());
