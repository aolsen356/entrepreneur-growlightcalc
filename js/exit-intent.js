/**
 * Exit-Intent Popup
 * Captures visitors about to leave with a valuable offer
 * Recovers 2-4% of abandoning visitors
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'glc_exit_shown';
    const COOLDOWN_HOURS = 24;

    // Check if popup was recently shown
    function wasRecentlyShown() {
        const lastShown = localStorage.getItem(STORAGE_KEY);
        if (!lastShown) return false;
        const hoursSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
        return hoursSince < COOLDOWN_HOURS;
    }

    function markAsShown() {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }

    function createPopup() {
        const overlay = document.createElement('div');
        overlay.id = 'exit-intent-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 480px;
            width: 90%;
            text-align: center;
            transform: translateY(20px);
            transition: transform 0.3s ease;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        `;

        popup.innerHTML = `
            <button id="exit-popup-close" style="
                position: absolute;
                top: 12px;
                right: 12px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #9CA3AF;
                padding: 4px;
            ">&times;</button>
            <div style="
                width: 64px;
                height: 64px;
                background: linear-gradient(135deg, #16A34A 0%, #22C55E 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
            ">
                <svg width="32" height="32" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/>
                </svg>
            </div>
            <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 12px; color: #111827;">
                Before You Go...
            </h3>
            <p style="color: #6B7280; margin-bottom: 24px; line-height: 1.6;">
                Bookmark this page so you can quickly calculate your grow light needs anytime!
            </p>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <a href="/blog/" style="
                    display: block;
                    background: #16A34A;
                    color: white;
                    padding: 14px 24px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#15803D'" onmouseout="this.style.background='#16A34A'">
                    Read Our Growing Guides
                </a>
                <button id="exit-popup-bookmark" style="
                    background: #F3F4F6;
                    color: #374151;
                    padding: 14px 24px;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#E5E7EB'" onmouseout="this.style.background='#F3F4F6'">
                    Press ${navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+D to Bookmark
                </button>
            </div>
            <p style="font-size: 12px; color: #9CA3AF; margin-top: 16px;">
                No spam, just helpful grow light tips
            </p>
        `;

        const container = document.createElement('div');
        container.style.position = 'relative';
        container.appendChild(popup);
        overlay.appendChild(container);

        return overlay;
    }

    function showPopup() {
        if (wasRecentlyShown()) return;
        if (document.getElementById('exit-intent-overlay')) return;

        const overlay = createPopup();
        document.body.appendChild(overlay);

        // Trigger animation
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.querySelector('div > div').style.transform = 'translateY(0)';
        });

        markAsShown();

        // Close handlers
        const closePopup = () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.querySelector('#exit-popup-close').addEventListener('click', closePopup);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });

        document.addEventListener('keydown', function handler(e) {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', handler);
            }
        });
    }

    function init() {
        // Only on desktop (mobile exit intent is unreliable)
        if (window.innerWidth < 768) return;

        let triggered = false;

        // Exit intent: mouse leaves viewport at top
        document.addEventListener('mouseout', (e) => {
            if (triggered) return;
            if (e.clientY < 0 && e.relatedTarget === null) {
                triggered = true;
                showPopup();
            }
        });

        // Backup: rapid scroll up (mobile/alternative)
        let lastScrollTop = 0;
        let rapidScrollCount = 0;

        window.addEventListener('scroll', () => {
            const st = window.pageYOffset;
            if (st < lastScrollTop && lastScrollTop - st > 100) {
                rapidScrollCount++;
                if (rapidScrollCount > 2 && !triggered) {
                    triggered = true;
                    showPopup();
                }
            } else {
                rapidScrollCount = 0;
            }
            lastScrollTop = st;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
