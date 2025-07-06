# Contentful ISR Demo

This project demonstrates **Incremental Static Regeneration (ISR)** with **Contentful CMS** and **Next.js 15**. It shows how to cache content at build time and invalidate it via webhooks when content is updated.

## 🚀 Features

- **ISR with Contentful**: Pages are statically generated and cached
- **Webhook Invalidation**: Automatic cache invalidation when content is published
- **Manual Cache Control**: Demo button to manually invalidate cache
- **Real-time Status**: Visual indicators showing cache status and timestamps
- **Comprehensive Logging**: Detailed webhook and cache invalidation logs

## 🛠️ Setup

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
# Contentful Configuration
CONTENTFUL_SPACE_ID=your-space-id
CONTENTFUL_ACCESS_TOKEN=your-access-token
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_ENTRY_ID=your-entry-id

# Optional: Webhook Security
WEBHOOK_SECRET=your-webhook-secret
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/contentful` to see the demo.

## 📝 How It Works

### ISR Caching

1. **Static Generation**: The page is generated at build time with `fetch()` and cached
2. **Cache Tags**: Uses `next: { tags: ["posts"] }` to tag cached data
3. **Revalidation**: Cache is invalidated using `revalidateTag("posts")`

### Webhook Flow

1. **Content Update**: Editor updates content in Contentful
2. **Webhook Trigger**: Contentful sends POST request to `/api/webhook/publish`
3. **Cache Invalidation**: Webhook handler calls `revalidateTag("posts")`
4. **Fresh Content**: Next page request generates new static page

## 🎯 Demo Instructions

### Testing the ISR Behavior

1. **Initial State**: Visit `/contentful` and note the "Page Generated At" timestamp
2. **Edit Content**: Go to Contentful and update your entry
3. **Publish**: Publish the changes in Contentful
4. **Verify Cache**: Refresh the page - timestamp should remain the same (cached)
5. **Trigger Webhook**: Either:
   - Wait for Contentful webhook to fire automatically
   - Use the "Invalidate Cache" button for manual testing
6. **Fresh Content**: Refresh again - you'll see a new timestamp and updated content

### Understanding the UI

- **🟢 Green Dot**: Cache is fresh (content matches page generation)
- **🔴 Red Dot**: Cache is stale (content newer than page generation)
- **Generated Time**: Shows how long ago the page was built
- **Revision Number**: Contentful entry revision for tracking changes

## 🔧 Configuration

### Contentful Webhook Setup

1. Go to **Settings > Webhooks** in your Contentful space
2. Create a new webhook with:
   - **Name**: ISR Cache Invalidation
   - **URL**: `https://your-domain.com/api/webhook/publish`
   - **Method**: POST
   - **Triggers**: Entry publish, Entry unpublish
   - **Content Type**: Select your specific content type (optional)

### Optional: Webhook Security

To secure your webhook:

1. Set `WEBHOOK_SECRET` in your environment variables
2. Configure the same secret in Contentful webhook settings
3. Uncomment the signature verification code in the webhook handler

## 📊 Monitoring

### Webhook Logs

The webhook endpoint provides detailed logging:

```
🔔 Contentful webhook received
📝 Webhook Details:
- Entry ID: abc123
- Content Type: blogPost
- Revision: 5
- Updated At: 2024-01-15T10:30:00Z
- Webhook Type: Entry
🚀 Invalidating cache for tag: posts
✅ Cache successfully invalidated
```

### Testing Webhook Endpoint

You can test the webhook endpoint directly:

```bash
# Test webhook is active
curl https://your-domain.com/api/webhook/publish

# Test webhook with sample payload
curl -X POST https://your-domain.com/api/webhook/publish \
  -H "Content-Type: application/json" \
  -d '{"sys":{"id":"test","type":"Entry","contentType":{"sys":{"id":"test"}},"revision":1,"updatedAt":"2024-01-15T10:30:00Z"}}'
```

## 🏗️ Project Structure

```
app/
├── contentful/
│   └── page.tsx              # Main ISR demo page
├── components/
│   └── cache-status-indicator.tsx  # Cache status UI component
└── api/
    └── webhook/
        └── publish/
            └── route.ts       # Webhook handler
```

## 🔍 Technical Details

### ISR Cache Strategy

- **Cache Tags**: Uses Next.js 15 cache tags for granular invalidation
- **Fetch API**: Leverages native fetch with cache options
- **Server Components**: Fully server-side rendered for better performance

### Webhook Payload

Contentful sends webhook payloads with this structure:

```json
{
  "sys": {
    "id": "entry-id",
    "type": "Entry",
    "contentType": {
      "sys": {
        "id": "content-type-id"
      }
    },
    "revision": 5,
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "fields": {
    // Content fields
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy
5. Update Contentful webhook URL to your Vercel domain

### Other Platforms

Ensure your hosting platform supports:
- Next.js 15 App Router
- Server-side API routes
- Environment variables
- ISR functionality

## 🔧 Troubleshooting

### Common Issues

1. **Webhook not triggering**:
   - Check webhook URL is correct
   - Verify webhook is active in Contentful
   - Check deployment logs

2. **Cache not invalidating**:
   - Verify `revalidateTag` is called
   - Check cache tags match between fetch and revalidate
   - Ensure webhook endpoint is reachable

3. **Environment variables**:
   - Verify all required variables are set
   - Check variable names match exactly
   - Restart development server after changes

### Debug Tips

- Enable verbose logging in webhook handler
- Use browser DevTools to inspect network requests
- Check Contentful webhook logs for delivery status
- Monitor application logs for cache operations

## 📚 Learn More

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Contentful Webhooks Guide](https://www.contentful.com/developers/docs/webhooks/)
- [Next.js Cache Tag Revalidation](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve this demo!

---

**Happy coding! 🎉**
