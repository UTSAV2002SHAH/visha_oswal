import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Event from '@/lib/models/Event.model';

// POST /api/admin/events — Create a new event
// Note: Admin auth will be integrated later when admin module is ready.
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { title, description, imageUrl, startDate, endDate, location, tags, link } = body;

        // Basic validation
        if (!title || !description || !imageUrl || !startDate || !endDate || !location) {
            return NextResponse.json(
                { error: 'Missing required fields: title, description, imageUrl, startDate, endDate, location' },
                { status: 400 }
            );
        }

        if (new Date(endDate) < new Date(startDate)) {
            return NextResponse.json(
                { error: 'endDate must be after startDate' },
                { status: 400 }
            );
        }

        const newEvent = new Event({
            title,
            description,
            imageUrl,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            location,
            tags: tags || [],
            link: link || '',
            isActive: true,
        });

        await newEvent.save();

        return NextResponse.json(
            { message: 'Event created', slug: newEvent.slug },
            { status: 201 }
        );
    } catch (error: any) {
        // Handle duplicate slug
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'An event with a similar title already exists' },
                { status: 409 }
            );
        }
        console.error('Create Event Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
