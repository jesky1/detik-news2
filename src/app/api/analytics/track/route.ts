import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            eventType,
            articleId,
            searchQuery,
            category,
            metadata,
        } = body;

        // Get user agent and referrer from headers
        const userAgent = request.headers.get('user-agent') || '';
        const referrer = request.headers.get('referer') || '';

        // Get client IP (works with proxies like Vercel)
        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Validate event type
        const validEventTypes = [
            'article_view',
            'article_click',
            'search',
            'scroll',
            'interaction',
        ];

        if (!validEventTypes.includes(eventType)) {
            return NextResponse.json(
                { error: 'Invalid event type' },
                { status: 400 }
            );
        }

        const event = await prisma.analyticsEvent.create({
            data: {
                eventType,
                articleId: articleId || null,
                searchQuery: searchQuery || null,
                category: category || null,
                url: request.headers.get('referer') || '',
                userAgent,
                referrer,
                ipAddress: ip,
                metadata: metadata ? JSON.stringify(metadata) : null,
            },
        });

        return NextResponse.json(
            { success: true, eventId: event.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json(
            { error: 'Failed to track event' },
            { status: 500 }
        );
    }
}
