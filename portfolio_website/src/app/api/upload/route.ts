import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { getSession } from '@/lib/session';

async function makeBlurDataURL(buffer: Buffer): Promise<string | undefined> {
  try {
    const thumb = await sharp(buffer)
      .resize(24, 24, { fit: 'inside' })
      .jpeg({ quality: 40 })
      .toBuffer();
    return `data:image/jpeg;base64,${thumb.toString('base64')}`;
  } catch {
    // Not a raster image sharp can decode (e.g. a PDF upload) — skip the placeholder.
    return undefined;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename') ?? 'upload';

  if (!request.body) {
    return NextResponse.json({ error: 'No file body' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await request.arrayBuffer());

    // Pass storeId explicitly so OIDC auth works (required when using VERCEL_OIDC_TOKEN)
    const storeId = process.env.BLOB_STORE_ID;
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: true,   // prevent "blob already exists" collisions
      ...(storeId ? { storeId } : {}),
    });
    const blurDataURL = await makeBlurDataURL(buffer);
    return NextResponse.json({ url: blob.url, blurDataURL });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    // Common cause: Vercel Blob store not connected to this project.
    // Go to vercel.com → your project → Storage → connect portfolio-images store.
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
