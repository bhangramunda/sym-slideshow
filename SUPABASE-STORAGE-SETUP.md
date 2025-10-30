# Supabase Storage Setup for Slideshow Images

## Step 1: Create Storage Bucket

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/fyiwpqnbiutuzuxjdeot
2. Click on **Storage** in the left sidebar
3. Click **New bucket**
4. Fill in the details:
   - **Name**: `slideshow-images`
   - **Public bucket**: ✅ **Enable** (so images can be accessed without authentication)
   - **File size limit**: 50 MB (or adjust as needed)
   - **Allowed MIME types**: Leave empty or add `image/*`
5. Click **Create bucket**

## Step 2: Set Storage Policies (Public Access)

By default, public buckets still need policies for uploads. Set these policies:

1. Click on the `slideshow-images` bucket
2. Go to the **Policies** tab
3. Click **New Policy**
4. Select **For full customization**
5. Create the following policies:

### Policy 1: Allow Public Uploads
```sql
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'slideshow-images');
```

### Policy 2: Allow Public Reads
```sql
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'slideshow-images');
```

### Policy 3: Allow Public Updates (Optional)
```sql
CREATE POLICY "Allow public updates"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'slideshow-images');
```

### Policy 4: Allow Public Deletes (Optional)
```sql
CREATE POLICY "Allow public deletes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'slideshow-images');
```

## Step 3: Verify Setup

1. In the Editor, try uploading an image
2. Check that the image appears in the preview
3. Check the Storage bucket to see the uploaded file under `slides/`
4. Verify the slideshow viewer shows the image correctly

## How It Works

- When you upload an image in the Editor:
  1. File is uploaded to `slideshow-images/slides/{timestamp}-{random}.{ext}`
  2. A public URL is generated: `https://fyiwpqnbiutuzuxjdeot.supabase.co/storage/v1/object/public/slideshow-images/slides/{filename}`
  3. This URL is saved in the slide data (instead of base64 data URLs)
  4. The slideshow viewer loads images from the public URL

## Benefits

- ✅ Smaller database entries (URLs instead of base64 data)
- ✅ Faster loading (images cached by CDN)
- ✅ Better performance
- ✅ Images persist across deployments
- ✅ Easy to manage/delete images in Supabase dashboard

## File Organization

Images are stored in the following structure:
```
slideshow-images/
  slides/
    1234567890-abc123.jpg
    1234567891-def456.png
    1234567892-ghi789.webp
```

## Cleanup

To clean up old/unused images, you can:
1. Go to Storage > slideshow-images > slides
2. Select and delete unused files
3. Or use the Supabase API to automate cleanup
