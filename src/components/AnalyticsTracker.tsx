'use client';

import { useEffect } from 'react';
import { useAnalytics, debounce } from '@/hooks/use-analytics';

export function AnalyticsTracker() {
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        // Track page view
        trackEvent({
            eventType: 'article_view',
            metadata: {
                page: 'home',
                url: window.location.pathname,
            },
        });

        // Track scroll depth
        let maxScroll = 0;
        const handleScroll = debounce(() => {
            const currentScroll = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                // Track when user scrolls to 25%, 50%, 75%, 100%
                if (maxScroll >= 25 && maxScroll < 50) {
                    trackEvent({
                        eventType: 'scroll',
                        metadata: { scrollDepth: 25 },
                    });
                } else if (maxScroll >= 50 && maxScroll < 75) {
                    trackEvent({
                        eventType: 'scroll',
                        metadata: { scrollDepth: 50 },
                    });
                } else if (maxScroll >= 75 && maxScroll < 100) {
                    trackEvent({
                        eventType: 'scroll',
                        metadata: { scrollDepth: 75 },
                    });
                } else if (maxScroll >= 100) {
                    trackEvent({
                        eventType: 'scroll',
                        metadata: { scrollDepth: 100 },
                    });
                }
            }
        }, 500);

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [trackEvent]);

    return null;
}
