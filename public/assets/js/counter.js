'use strict';

(function initUptime() {
    const BASE_DAYS    = 42;
    const BASE_HOURS   = 13;
    const BASE_MINUTES = 37;
    const BASE_SECONDS = 0;

    let totalSeconds = (BASE_DAYS * 86400) + (BASE_HOURS * 3600) + (BASE_MINUTES * 60) + BASE_SECONDS;

    const displayEl  = document.getElementById('uptime-display');
    const terminalEl = document.getElementById('terminal-uptime');

    function pad(n) { return String(n).padStart(2, '0'); }

    function formatUptime(secs) {
        const d = Math.floor(secs / 86400);
        const h = Math.floor((secs % 86400) / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return {
            full: `${d}d ${pad(h)}h ${pad(m)}m`,
            term: `${d} dias, ${pad(h)}:${pad(m)}:${pad(s)}`
        };
    }

    function tick() {
        totalSeconds++;
        const { full, term } = formatUptime(totalSeconds);
        if (displayEl)  displayEl.textContent = full;
        if (terminalEl) terminalEl.textContent = term;
    }

    // Inicializa
    tick();
    setInterval(tick, 1000);
})();
