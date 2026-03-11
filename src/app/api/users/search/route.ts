import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/lib/models/User.model";
import MemberProfile from "@/lib/models/MemberProfile.model";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";
        const originCity = searchParams.get("originCity");
        const currentCity = searchParams.get("currentCity");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        /**
         * 1. Filter Logic: The "AND" (Intersection) Strategy
         * We start with an empty match object. Each filter provided by the user 
         * is added as a mandatory condition. If Name, Origin City, and Current City 
         * are all provided, a result MUST match all three to be returned.
         */
        const matchStage: any = {};

        /**
         * 2. Handling Long Names & Word-Splitting Match
         * This logic splits the search string into individual words.
         * It ensures that EVERY word typed by the user exists in either the 
         * User's name OR the Profile's fullName. This allows "Utsav Shah" to match 
         * "Utsav Alpeshkumar Shah" effectively.
         */
        if (query.trim()) {
            const words = query.trim().split(/\s+/);

            // Each word must be present in either User.name or MemberProfile.fullName
            matchStage.$and = words.map(word => ({
                $or: [
                    { "userData.name": { $regex: word, $options: "i" } },
                    { "personal.fullName": { $regex: word, $options: "i" } }
                ]
            }));
        }

        // Apply exact/partial city filters if provided
        if (originCity) {
            matchStage["personal.cityOfOrigin"] = { $regex: originCity, $options: "i" };
        }
        if (currentCity) {
            matchStage["personal.currentCity"] = { $regex: currentCity, $options: "i" };
        }

        // 3. Identity & Data Logic: Join and Project
        const aggregatePipeline: any[] = [
            // Join with User collection to get name, username, and profile image
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            // Flatten the userData array from lookup
            { $unwind: "$userData" },
            // Apply the "AND" filters we built
            { $match: matchStage },
            // Security: Project only the public data requested by the user
            {
                $project: {
                    _id: 0,
                    userId: 1,
                    name: "$userData.name",
                    username: "$userData.username",
                    profilePictureUrl: "$userData.profilePictureUrl",
                    personal: 1 // Keep personal info for displaying location/details in card if needed
                }
            },
            // Pagination Logic
            { $skip: skip },
            { $limit: limit }
        ];

        const results = await MemberProfile.aggregate(aggregatePipeline);

        return NextResponse.json({
            success: true,
            data: results,
            pagination: {
                page,
                limit,
                count: results.length
            }
        });

    } catch (error: any) {
        console.error("Search API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch search results" },
            { status: 500 }
        );
    }
}
