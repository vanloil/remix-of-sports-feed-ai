import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Real sports RSS feeds organized by category
const RSS_FEEDS: Record<string, string[]> = {
  football: [
    'https://feeds.bbci.co.uk/sport/football/rss.xml',
    'https://www.espn.com/espn/rss/soccer/news',
  ],
  basketball: [
    'https://www.espn.com/espn/rss/nba/news',
    'https://feeds.bbci.co.uk/sport/basketball/rss.xml',
  ],
  tennis: [
    'https://feeds.bbci.co.uk/sport/tennis/rss.xml',
    'https://www.espn.com/espn/rss/tennis/news',
  ],
  cycling: [
    'https://feeds.bbci.co.uk/sport/cycling/rss.xml',
  ],
  motorsport: [
    'https://feeds.bbci.co.uk/sport/formula1/rss.xml',
    'https://www.espn.com/espn/rss/rpm/news',
  ],
  golf: [
    'https://feeds.bbci.co.uk/sport/golf/rss.xml',
    'https://www.espn.com/espn/rss/golf/news',
  ],
  athletics: [
    'https://feeds.bbci.co.uk/sport/athletics/rss.xml',
  ],
  boxing: [
    'https://feeds.bbci.co.uk/sport/boxing/rss.xml',
    'https://www.espn.com/espn/rss/boxing/news',
  ],
  rugby: [
    'https://feeds.bbci.co.uk/sport/rugby-union/rss.xml',
  ],
  cricket: [
    'https://feeds.bbci.co.uk/sport/cricket/rss.xml',
  ],
  hockey: [
    'https://www.espn.com/espn/rss/nhl/news',
  ],
  swimming: [
    'https://feeds.bbci.co.uk/sport/swimming/rss.xml',
  ],
  general: [
    'https://feeds.bbci.co.uk/sport/rss.xml',
    'https://www.espn.com/espn/rss/news',
  ],
};

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl?: string;
  category: string;
  source: string;
}

async function fetchRSSFeed(url: string, category: string): Promise<RSSItem[]> {
  try {
    console.log(`Fetching RSS from: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SportScroll/1.0)',
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return [];
    }
    
    const text = await response.text();
    const items: RSSItem[] = [];
    
    // Parse XML manually (Deno doesn't have DOMParser in edge functions)
    const itemMatches = text.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
    
    for (const itemXml of itemMatches.slice(0, 10)) { // Limit to 10 items per feed
      const title = extractTag(itemXml, 'title');
      const description = extractTag(itemXml, 'description') || extractTag(itemXml, 'content:encoded');
      const link = extractTag(itemXml, 'link') || extractTag(itemXml, 'guid');
      const pubDate = extractTag(itemXml, 'pubDate') || extractTag(itemXml, 'dc:date');
      
      // Try to extract image from various sources
      let imageUrl = extractMediaContent(itemXml) || 
                     extractEnclosure(itemXml) || 
                     extractImageFromDescription(description || '');
      
      // Determine source from URL
      let source = 'Unknown';
      if (url.includes('bbc')) source = 'BBC Sport';
      else if (url.includes('espn')) source = 'ESPN';
      else if (url.includes('skysports')) source = 'Sky Sports';
      
      if (title && link) {
        items.push({
          title: cleanHtml(title),
          description: cleanHtml(description || ''),
          link,
          pubDate: pubDate || new Date().toISOString(),
          imageUrl: imageUrl || undefined,
          category,
          source,
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return [];
  }
}

function extractTag(xml: string, tag: string): string | null {
  // Handle CDATA
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();
  
  // Regular tag
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function extractMediaContent(xml: string): string | null {
  const mediaMatch = xml.match(/<media:content[^>]*url="([^"]+)"/i) ||
                     xml.match(/<media:thumbnail[^>]*url="([^"]+)"/i);
  return mediaMatch ? mediaMatch[1] : null;
}

function extractEnclosure(xml: string): string | null {
  const enclosureMatch = xml.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image/i);
  return enclosureMatch ? enclosureMatch[1] : null;
}

function extractImageFromDescription(description: string): string | null {
  const imgMatch = description.match(/<img[^>]*src="([^"]+)"/i);
  return imgMatch ? imgMatch[1] : null;
}

function cleanHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { categories, limit = 20 } = await req.json();
    
    console.log('Fetching RSS feeds for categories:', categories);
    
    // Determine which feeds to fetch
    let feedsToFetch: { url: string; category: string }[] = [];
    
    if (!categories || categories.length === 0) {
      // Fetch from general and a mix of categories
      feedsToFetch = [
        ...RSS_FEEDS.general.map(url => ({ url, category: 'general' })),
        ...RSS_FEEDS.football.slice(0, 1).map(url => ({ url, category: 'football' })),
        ...RSS_FEEDS.basketball.slice(0, 1).map(url => ({ url, category: 'basketball' })),
        ...RSS_FEEDS.tennis.slice(0, 1).map(url => ({ url, category: 'tennis' })),
      ];
    } else {
      for (const category of categories) {
        const feeds = RSS_FEEDS[category] || RSS_FEEDS.general;
        feedsToFetch.push(...feeds.map(url => ({ url, category })));
      }
    }
    
    // Fetch all feeds in parallel
    const fetchPromises = feedsToFetch.map(({ url, category }) => 
      fetchRSSFeed(url, category)
    );
    
    const results = await Promise.all(fetchPromises);
    const allItems = results.flat();
    
    // Sort by date and limit
    allItems.sort((a, b) => 
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
    
    const limitedItems = allItems.slice(0, limit);
    
    console.log(`Returning ${limitedItems.length} items`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      items: limitedItems,
      count: limitedItems.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('RSS feed error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
