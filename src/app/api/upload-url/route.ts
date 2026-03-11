import { NextRequest, NextResponse } from 'next/server';
import { S3Service } from '@/lib/s3-service';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        // 1. Verify Authentication
        const user = verifyAuth(req);
        const userId = user.id;

        // 2. Get file info from query params
        const { searchParams } = new URL(req.url);
        const fileType = searchParams.get('fileType');
        const uploadType = searchParams.get('uploadType') || 'post';

        if (!fileType) {
            return NextResponse.json({ error: 'File type is required' }, { status: 400 });
        }

        // 3. Generate Unique Key based on type
        // Folder structure: 
        // - posts/{userId}/{timestamp}-{random}.ext
        // - banners/{userId}/{timestamp}-{random}.ext
        // - profiles/{userId}/{timestamp}-{random}.ext

        let folder = 'posts';
        if (uploadType === 'banner') folder = 'banners';
        else if (uploadType === 'profile') folder = 'profiles';
        else folder = 'posts';

        const extension = fileType.split('/')[1] || 'jpg';
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const key = `${folder}/${userId}/${timestamp}-${random}.${extension}`;

        // 4. Generate URL
        const uploadUrl = await S3Service.generateUploadUrl(key, fileType);

        return NextResponse.json({ uploadUrl, key });
    } catch (error: any) {
        if (error.message === 'No token, authorization denied' || error.message === 'Token is not valid') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.error('Upload URL Error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
