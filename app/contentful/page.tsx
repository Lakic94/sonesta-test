import { revalidateTag } from "next/cache";
import CacheStatusIndicator from "../components/cache-status-indicator";
import CacheInvalidateButton from "../components/cache-invalidate-button";

// Environment variables for Contentful (add these to your .env.local file)
const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID || "gflqy7a70p1a";
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || "R49aYTEML8Kh-tMJa5YVEfPtMk_s9qIdmNBEhTudu0g";
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";
const CONTENTFUL_ENTRY_ID = process.env.CONTENTFUL_ENTRY_ID || "zFNWqjZUZlV6NVi7HmoQx";

interface ContentfulEntry {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
    revision: number;
  };
  fields: {
    [key: string]: any;
  };
}

async function fetchContentfulEntry(): Promise<ContentfulEntry> {
  const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}/entries/${CONTENTFUL_ENTRY_ID}?access_token=${CONTENTFUL_ACCESS_TOKEN}`;
  
  const response = await fetch(url, {
    next: { tags: ["posts"] },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  
  return response.json();
}

// Manual cache invalidation now handled by API endpoint

export default async function ContentfulDemo() {
  const entry = await fetchContentfulEntry();
  const currentTime = new Date().toISOString();
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Contentful ISR Demo
        </h1>
        <p className="text-gray-600">
          This page demonstrates Next.js ISR (Incremental Static Regeneration) with Contentful CMS
        </p>
      </div>

      {/* Cache Status Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-4">Cache Status</h2>
        <div className="mb-4">
          <CacheStatusIndicator
            pageGeneratedAt={currentTime}
            contentUpdatedAt={entry.sys.updatedAt}
            entryRevision={entry.sys.revision}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-700 font-medium">Page Generated At</p>
            <p className="text-lg font-mono text-blue-900">{currentTime}</p>
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Content Last Updated</p>
            <p className="text-lg font-mono text-blue-900">
              {new Date(entry.sys.updatedAt).toISOString()}
            </p>
          </div>
        </div>
      </div>

      {/* Content Data Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Contentful Entry Data</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Entry ID</p>
            <p className="text-lg font-mono text-gray-900">{entry.sys.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Revision</p>
            <p className="text-lg font-mono text-gray-900">{entry.sys.revision}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Created At</p>
            <p className="text-lg font-mono text-gray-900">
              {new Date(entry.sys.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Updated At</p>
            <p className="text-lg font-mono text-gray-900">
              {new Date(entry.sys.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Fields Data Card */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-900 mb-4">Content Fields</h2>
        <div className="bg-white rounded-lg p-4 border">
          <pre className="text-sm text-gray-800 overflow-x-auto">
            {JSON.stringify(entry.fields, null, 2)}
          </pre>
        </div>
      </div>

      {/* Demo Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-yellow-900 mb-4">How to Test ISR</h2>
        <div className="space-y-3 text-yellow-800">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 font-bold">1.</span>
            <p>Note the "Page Generated At" timestamp above - this shows when the page was last built</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 font-bold">2.</span>
            <p>Go to Contentful, edit your entry, and publish it</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 font-bold">3.</span>
            <p>Refresh this page - you'll see the same "Page Generated At" timestamp (cached)</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 font-bold">4.</span>
            <p>Use the webhook or manual trigger below to invalidate the cache</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 font-bold">5.</span>
            <p>Refresh again - you'll see a new "Page Generated At" timestamp</p>
          </div>
        </div>
      </div>

      {/* Manual Cache Invalidation */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-900 mb-4">Manual Cache Invalidation</h2>
        <p className="text-red-700 mb-4">
          Use this button to manually invalidate the cache for demo purposes:
        </p>
        <CacheInvalidateButton />
      </div>
    </div>
  );
}
