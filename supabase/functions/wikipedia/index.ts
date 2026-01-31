import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WikipediaResponse {
  query?: {
    pages?: {
      [key: string]: {
        pageid?: number;
        title?: string;
        extract?: string;
        thumbnail?: {
          source?: string;
        };
      };
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { query, language = 'nl', type = 'person' } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching Wikipedia info for: ${query} (${type}) in ${language}`);

    // Fetch from Wikipedia API
    const wikiUrl = `https://${language}.wikipedia.org/w/api.php?` + new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: query,
      prop: 'extracts|pageimages',
      exintro: 'true',
      explaintext: 'true',
      exsectionformat: 'plain',
      piprop: 'thumbnail',
      pithumbsize: '300',
      redirects: '1',
    });

    const wikiResponse = await fetch(wikiUrl);
    const wikiData: WikipediaResponse = await wikiResponse.json();

    if (!wikiData.query?.pages) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'No results found',
          data: null 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pages = wikiData.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    // Check if page exists (pageid -1 means not found)
    if (pageId === '-1' || !page.extract) {
      // Try English Wikipedia as fallback
      if (language !== 'en') {
        const enWikiUrl = `https://en.wikipedia.org/w/api.php?` + new URLSearchParams({
          action: 'query',
          format: 'json',
          titles: query,
          prop: 'extracts|pageimages',
          exintro: 'true',
          explaintext: 'true',
          exsectionformat: 'plain',
          piprop: 'thumbnail',
          pithumbsize: '300',
          redirects: '1',
        });

        const enResponse = await fetch(enWikiUrl);
        const enData: WikipediaResponse = await enResponse.json();

        if (enData.query?.pages) {
          const enPageId = Object.keys(enData.query.pages)[0];
          const enPage = enData.query.pages[enPageId];

          if (enPageId !== '-1' && enPage.extract) {
            return new Response(
              JSON.stringify({
                success: true,
                data: {
                  title: enPage.title,
                  extract: enPage.extract,
                  thumbnail: enPage.thumbnail?.source || null,
                  source: 'Wikipedia (English)',
                  sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(enPage.title || query)}`,
                },
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      }

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Article not found',
          data: null 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          title: page.title,
          extract: page.extract,
          thumbnail: page.thumbnail?.source || null,
          source: language === 'nl' ? 'Wikipedia (Nederlands)' : 'Wikipedia (English)',
          sourceUrl: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(page.title || query)}`,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching Wikipedia data:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch data',
        data: null 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
