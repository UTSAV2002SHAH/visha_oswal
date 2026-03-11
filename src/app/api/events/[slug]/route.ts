import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event.model';

// Helper: compute status from dates
function computeStatus(startDate: Date, endDate: Date): 'upcoming' | 'ongoing' | 'past' {
    const now = new Date();
    if (now < new Date(startDate)) return 'upcoming';
    if (now > new Date(endDate)) return 'past';
    return 'ongoing';
}

// GET /api/events/[slug] — Returns a single event by slug
export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await connectDB();

        const event = await Event.findOne({
            slug: params.slug,
            isActive: true,
        }).lean();

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const eventWithStatus = {
            ...event,
            _id: undefined,
            status: computeStatus(event.startDate, event.endDate),
        };

        return NextResponse.json(eventWithStatus);
    } catch (error) {
        console.error('Get Event by Slug Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
