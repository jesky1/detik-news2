import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const eventType = searchParams.get('eventType');
        const articleId = searchParams.get('articleId');
        const days = parseInt(searchParams.get('days') || '7');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Calculate date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Build filter conditions
        const where: any = {
            createdAt: {
                gte: startDate,
            },
        };

        if (eventType) {
            where.eventType = eventType;
        }

        if (articleId) {
            where.articleId = articleId;
        }

        // Get total count
        const total = await prisma.analyticsEvent.count({ where });

        // Get paginated results
        const events = await prisma.analyticsEvent.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        });

        // Get summary statistics
        const eventCounts = await prisma.analyticsEvent.groupBy({
            by: ['eventType'],
            where: {
                createdAt: { gte: startDate },
            },
            _count: true,
        });

        const stats = {
            totalEvents: total,
            eventBreakdown: Object.fromEntries(
                eventCounts.map((e) => [e.eventType, e._count])
            ),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };

        return NextResponse.json({
            success: true,
            stats,
            events,
        });
    } catch (error) {
        console.error('Analytics retrieval error:', error);
        return NextResponse.json(
            { error: 'Failed to retrieve analytics' },
            { status: 500 }
        );
    }
}
