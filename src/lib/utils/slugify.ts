import User from '../models/User.model';

/**
 * Generates a unique, URL-safe username based on a seed string (like name or email prefix)
 * @param seed The string to base the username on
 * @returns A unique username string
 */
export async function generateUniqueUsername(seed: string): Promise<string> {
    // 1. Sanitize: lowercase, keep only alphanumeric, replace spaces with underscores
    let base = seed
        .split('@')[0] // handle email addresses
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_{2,}/g, '_') // collapse multiple underscores
        .replace(/^_|_$/g, ''); // trim underscores from ends

    if (!base) base = 'user';

    let username = base;
    let counter = 1;

    // 2. Check for collisions and append suffix until unique
    while (true) {
        const existing = await User.findOne({ username });
        if (!existing) {
            return username;
        }
        username = `${base}_${counter}`;
        counter++;
    }
}
