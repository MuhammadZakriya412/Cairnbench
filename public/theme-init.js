(function () {
  var THEME_KEY = 'cairnbench:appearance';
  var VALID_DUSK = 'cairn-dusk';
  var VALID_DAYLIGHT = 'cairn-daylight';
  var win = globalThis;

  function resolveSystemTheme() {
    try {
      if (win.matchMedia && win.matchMedia('(prefers-color-scheme: light)').matches) {
        return VALID_DAYLIGHT;
      }
    } catch {
      // Ignore matchMedia errors in restricted environments
    }
    return VALID_DUSK;
  }

  var resolved = null;
  try {
    var raw = win.localStorage.getItem(THEME_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (parsed.theme === VALID_DUSK || parsed.theme === VALID_DAYLIGHT) {
          resolved = parsed.theme;
        }
      }
    }
  } catch {
    // Ignore storage/parse errors and fall back to OS preference
  }

  if (!resolved) {
    resolved = resolveSystemTheme();
  }

  win.document.documentElement.setAttribute('data-theme', resolved);
})();
