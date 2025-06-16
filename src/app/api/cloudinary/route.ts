import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'eventos',
        });

        return NextResponse.json({ url: uploadResponse.secure_url });
    } catch (err) {
        console.log(err )
        return NextResponse.json({ error: 'Upload failed', details: err }, { status: 500 });
    }
}
