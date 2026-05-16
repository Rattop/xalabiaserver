/**
 * XalabiaServer — counter.js
 * Live uptime counter. Syncs both the status bar and terminal output.
 * Base: 42 days, 13:37:00 at page load — increments in real-time.
 */

'use strict';

(function initUptime() {

    // Base uptime at time of page load (adjust as needed)
    const BASE_DAYS    = 42;
    const BASE_HOURS   = 13;
    const BASE_MINUTES = 37;
    const BASE_SECONDS = 0;

    // Convert base to total seconds
    let totalSeconds =
        (BASE_DAYS * 86400) +
        (BASE_HOURS * 3600) +
        (BASE_MINUTES * 60) +
        BASE_SECONDS;

    // DOM targets
    const displayEl  = document.getElementById('uptime-display');
    const terminalEl = document.getElementById('terminal-uptime');

    if (!displayEl && !terminalEl) return;

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function formatUptime(secs) {
        const d = Math.floor(secs / 86400);
        const h = Math.floor((secs % 86400) / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return {
            full:     `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`,
            friendly: `${d} dias, ${pad(h)}:${pad(m)}:${pad(s)}`
        };
    }

    function tick() {
        totalSeconds++;
        const { full, friendly } = formatUptime(totalSeconds);

        if (displayEl)  displayEl.textContent  = full;
        if (terminalEl) terminalEl.textContent  = friendly;
    }

    // Initial render
    const { full, friendly } = formatUptime(totalSeconds);
    if (displayEl)  displayEl.textContent  = full;
    if (terminalEl) terminalEl.textContent  = friendly;

    // Tick every second, aligned to the clock
    const now = Date.now();
    const msToNextSecond = 1000 - (now % 1000);

    setTimeout(() => {
        tick();
        setInterval(tick, 1000);
    }, msToNextSecond);

    console.log('%c[XalabiaServer] counter.js carregado ✓', 'color:#2EF08A;');

})();
