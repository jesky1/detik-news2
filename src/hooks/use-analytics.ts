import { useCallback } from 'react';

export type AnalyticsEventType =
    | 'article_view'
    | 'article_click'
    | 'search'
    | 'scroll'
    | 'interaction';

export interface TrackEventParams {
    eventType: AnalyticsEventType;
    articleId?: string;
    searchQuery?: string;
    category?: string;
    metadata?: Record<string, any>;
}

export const useAnalytics = () => {
    const trackEvent = useCallback(async (params: TrackEventParams) => {
        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
        } catch (error) {
            console.error('Failed to track analytics event:', error);
            // Silently fail - don't disrupt user experience
        }
    }, []);

    return { trackEvent };
};

// Debounce helper for scroll/interaction events
export const debounce = (
    func: (...args: any[]) => void,
    delay: number
): ((...args: any[]) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};
