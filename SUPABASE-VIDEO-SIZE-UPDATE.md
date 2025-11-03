# Supabase Video Upload Size Update

## Frontend Changes ✅ (COMPLETED)
The video upload limit has been increased from 100MB to 500MB in the Editor component.

## Supabase Configuration Required ⚠️

You MUST update your Supabase storage bucket settings to allow 500MB uploads:

### Steps:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Left sidebar → Storage
   - Click on the `slideshow-videos` bucket

3. **Update Bucket Policies**
   - Click "Policies" tab
   - Check if there's a file size limit in the upload policy
   - Update the policy to allow files up to 500MB

4. **Check Storage Quota**
   - Make sure you have enough storage space
   - Free tier: 1GB total
   - Pro tier: 100GB total
   - Each 500MB video will consume significant storage

### Alternative: Update via SQL

You can also run this SQL in the Supabase SQL Editor:

```sql
-- Check current policies
SELECT * FROM storage.buckets WHERE name = 'slideshow-videos';

-- Update bucket with larger file size limit (if using bucket policies)
-- Note: This may vary based on your specific policy setup
-- Check your existing policies first before running updates
```

## Potential Issues to Monitor

### 1. Upload Timeouts
- **Symptom**: Upload fails after several minutes
- **Cause**: Browser or network timeout
- **Solution**:
  - Compress videos before uploading
  - Use faster internet connection
  - Consider reducing video quality/bitrate

### 2. Network Interruptions
- **Symptom**: Upload fails partway through
- **Cause**: Internet connection drops
- **Solution**:
  - Restart upload
  - For critical large files, consider uploading when connection is stable
  - Future enhancement: Add resumable uploads

### 3. Storage Quota Exceeded
- **Symptom**: Upload fails with "quota exceeded" error
- **Cause**: Supabase storage limit reached
- **Solution**:
  - Delete old/unused videos
  - Upgrade Supabase plan
  - Monitor storage usage in dashboard

### 4. Browser Memory Issues
- **Symptom**: Browser becomes slow/unresponsive during upload
- **Cause**: Large file in memory
- **Solution**: This is less common with modern browsers, but if it happens:
  - Close other browser tabs
  - Use Chrome/Firefox (better memory management)
  - Restart browser before large uploads

## Best Practices

1. **Video Compression**: Use tools like HandBrake to compress videos before upload
   - Target bitrate: 5-10 Mbps for HD videos
   - Codec: H.264 (widely compatible)
   - Container: MP4

2. **Test Upload**: Test with a large file first to ensure everything works

3. **Monitor Storage**: Regularly check Supabase dashboard for storage usage

4. **Network**: Upload large files on stable, fast internet connection

## Current Implementation Notes

- Max file size: 500MB (frontend validation)
- Progress logging: Console message for files >50MB
- User feedback: "Large files may take several minutes" message
- No resumable uploads (yet)
- No progress bar (yet)

## Future Enhancements (If Needed)

If you frequently upload large files and experience issues, consider:

1. **Progress Bar**: Show upload percentage
2. **Resumable Uploads**: Allow uploads to resume if interrupted
3. **Client-side Compression**: Automatically compress videos before upload
4. **Chunk Uploads**: Break large files into smaller chunks

For now, the 500MB limit should work fine for occasional large uploads on a decent internet connection.
