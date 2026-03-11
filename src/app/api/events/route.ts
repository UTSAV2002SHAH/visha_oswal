import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event.model';

// Helper: compute status from dates
function computeStatus(startDate: Date, endDate: Date): 'upcoming' | 'ongoing' | 'past' {
    const now = new Date();
    if (now < new Date(startDate)) return 'upcoming';
    if (now > new Date(endDate)) return 'past';
    return 'ongoing';
}

// GET /api/events — Returns all active events
export async function GET() {
    try {
        await connectDB();

        const events = await Event.find({ isActive: true })
            .sort({ startDate: 1 })
            .lean();

        // Attach computed status to each event
        const eventsWithStatus = events.map((event) => ({
            ...event,
            _id: undefined, // Don't expose MongoDB ID
            status: computeStatus(event.startDate, event.endDate),
        }));

        return NextResponse.json(eventsWithStatus);
    } catch (error) {
        console.error('Get Events Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
