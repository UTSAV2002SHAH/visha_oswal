export const getImageUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
    if (!cdnUrl) return path;

    // Clean up double slashes if any
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${cdnUrl}/${cleanPath}`;
};
