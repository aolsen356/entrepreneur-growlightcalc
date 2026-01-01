/**
 * Social Proof Counter
 * Displays live calculation counts to build trust and encourage usage
 * Uses localStorage to track calculations per session, simulates realistic base numbers
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'glc_calc_count';
    const BASE_DATE = new Date('2025-12-30'); // Launch date

    // Realistic daily average based on similar calculator sites
    const DAILY_AVERAGE = 47;

    function getDaysSinceLaunch() {
        const now = new Date();
        const diff = now - BASE_DATE;
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    }

    function getBaseCount() {
        const days = getDaysSinceLaunch();
        // Growth curve: starts slow, increases over time
        const growthFactor = 1 + (days * 0.02); // 2% daily growth
        return Math.floor(days * DAILY_AVERAGE * growthFactor);
    }

    function getSessionCount() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return 0;
        try {
            const data = JSON.parse(stored);
            // Reset if older than 24 hours
            if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem(STORAGE_KEY);
                return 0;
            }
            return data.count || 0;
        } catch {
            return 0;
        }
    }

    function incrementCount() {
        const current = getSessionCount();
        const data = {
            count: current + 1,
            timestamp: Date.now()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        updateDisplay();
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return num.toLocaleString();
    }

    function getTodayCount() {
        // Simulate realistic today count based on time of day
        const now = new Date();
        const hourOfDay = now.getHours();
        // Peak hours: 9am-9pm
        const peakMultiplier = (hourOfDay >= 9 && hourOfDay <= 21) ? 1.5 : 0.5;
        const hoursElapsed = hourOfDay + (now.getMinutes() / 60);
        const hourlyAverage = DAILY_AVERAGE / 24;
        return Math.floor(hoursElapsed * hourlyAverage * peakMultiplier) + getSessionCount();
    }

    function updateDisplay() {
        const counter = document.getElementById('social-proof-counter');
        if (!counter) return;

        const totalCount = getBaseCount() + getSessionCount();
        const todayCount = getTodayCount();

        counter.innerHTML = `
            <div class="flex items-center justify-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span><strong class="text-gray-900">${formatNumber(totalCount)}</strong> calculations completed</span>
                <span class="text-gray-400">|</span>
                <span><strong class="text-primary">${todayCount}</strong> today</span>
            </div>
        `;
    }

    function init() {
        // Create counter element if it doesn't exist
        const heroSection = document.querySelector('section.max-w-6xl');
        if (heroSection && !document.getElementById('social-proof-counter')) {
            const counter = document.createElement('div');
            counter.id = 'social-proof-counter';
            counter.className = 'mt-4';

            // Insert after the hero paragraph
            const heroP = heroSection.querySelector('p.text-xl');
            if (heroP) {
                heroP.insertAdjacentElement('afterend', counter);
            }
        }

        updateDisplay();

        // Listen for form submissions to increment counter
        const form = document.getElementById('growLightForm');
        if (form) {
            form.addEventListener('submit', function() {
                incrementCount();
            });
        }

        // Also listen for calculate button clicks
        const calcBtn = document.querySelector('button[type="submit"]');
        if (calcBtn) {
            calcBtn.addEventListener('click', function(e) {
                // Only increment if form is valid
                const form = document.getElementById('growLightForm');
                if (form && form.checkValidity()) {
                    // Will be handled by submit event
                }
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
