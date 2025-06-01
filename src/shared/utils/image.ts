
export async function uploadImageToCloudinary(base64Image: string): Promise<string> {
    const response = await fetch('/api/cloudinary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
}