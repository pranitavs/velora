// Supabase Edge Function: ai-assistant
// Receives user message and user_id, queries aggregated finances, and prompts Gemini AI

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, summary } = await req.json();

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({
          error: 'GEMINI_API_KEY is not configured in Supabase Secrets',
          demoMode: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const systemPrompt = `You are VELORA's financial assistant.
Answer questions about this user's finances clearly and honestly.
If you cannot answer from the data provided, say so. Do not invent figures.
Keep responses under 150 words unless calculation is required.
Use the user's currency symbol: ${summary?.currencySymbol || '₹'}.
User Context:
- Currency: ${summary?.currencySymbol || '₹'}
- 30-day Inflow: ${summary?.income || 0}
- 30-day Outflow: ${summary?.expenses || 0}
- Net Balance: ${summary?.balance || 0}
- Top 5 Categories: ${JSON.stringify(summary?.topCategories || [])}
- Active Goals: ${JSON.stringify(summary?.activeGoals || [])}`;

    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemPrompt },
                { text: `User Question: ${message}` }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I was unable to analyze your query. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
