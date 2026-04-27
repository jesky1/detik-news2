'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AnalyticsStats {
    totalEvents: number;
    eventBreakdown: Record<string, number>;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    events: Array<{
        id: string;
        eventType: string;
        articleId?: string;
        searchQuery?: string;
        category?: string;
        metadata?: string;
        createdAt: string;
    }>;
}

export default function AnalyticsDashboard() {
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/analytics/stats?days=7&limit=10');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
        // Refresh every 30 seconds
        const interval = setInterval(fetchAnalytics, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Skeleton className="h-8 w-40 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <p className="text-red-500">Failed to load analytics</p>
            </div>
        );
    }

    const eventColors: Record<string, string> = {
        article_view: 'bg-blue-100 text-blue-800',
        article_click: 'bg-green-100 text-green-800',
        search: 'bg-purple-100 text-purple-800',
        scroll: 'bg-orange-100 text-orange-800',
        interaction: 'bg-pink-100 text-pink-800',
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600 mb-8">Last 7 days - Auto-updating every 30 seconds</p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEvents}</div>
                    </CardContent>
                </Card>

                {Object.entries(stats.eventBreakdown).map(([eventType, count]) => (
                    <Card key={eventType}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium capitalize">
                                {eventType.replace('_', ' ')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{count}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Events */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Events</CardTitle>
                    <CardDescription>Latest analytics events</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-4">Time</th>
                                    <th className="text-left py-2 px-4">Event Type</th>
                                    <th className="text-left py-2 px-4">Category</th>
                                    <th className="text-left py-2 px-4">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.events.map((event) => {
                                    const metadata = event.metadata ? JSON.parse(event.metadata) : {};
                                    return (
                                        <tr key={event.id} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-4 text-xs text-gray-500">
                                                {new Date(event.createdAt).toLocaleString('id-ID')}
                                            </td>
                                            <td className="py-2 px-4">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${eventColors[event.eventType] || 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {event.eventType.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 text-sm">{event.category || '-'}</td>
                                            <td className="py-2 px-4 text-sm text-gray-600">
                                                {event.searchQuery && `Search: "${event.searchQuery}"`}
                                                {event.articleId && `Article: ${event.articleId.slice(0, 8)}...`}
                                                {metadata.scrollDepth && `Scroll: ${metadata.scrollDepth}%`}
                                                {!event.searchQuery && !event.articleId && !metadata.scrollDepth && '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
