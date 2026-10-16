// Supabase Edge Function: trip-planner
// Generates realistic day-by-day travel budget itineraries

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      destination,
      origin,
      durationDays,
      travellers,
      travelStyle,
      accommodation,
      totalBudget,
      interests,
      currencySymbol
    } = await req.json();

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured', demoMode: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const prompt = `Generate a realistic day-by-day trip itinerary for ${destination} for ${durationDays} days for ${travellers} travellers.
Return ONLY a valid JSON object with this exact structure:
{
  "title": "${destination} ${durationDays}-Day Itinerary",
  "destination": "${destination}",
  "origin": "${origin || ''}",
  "days": [
    {
      "day": 1,
      "title": "Day Theme",
      "activities": [
        { "time": "Morning (09:00)", "description": "Activity details" },
        { "time": "Afternoon (13:30)", "description": "Activity details" },
        { "time": "Evening (18:00)", "description": "Activity details" }
      ],
      "estimatedFood": 600,
      "estimatedTransit": 300
    }
  ],
  "estimatedCosts": {
    "transport": 2000,
    "accommodation": 4000,
    "food": 3000,
    "activities": 1500,
    "total": 10500
  }
}
Use realistic costs in ${currencySymbol || '₹'}.
Travel style: ${travelStyle}. Accommodation: ${accommodation}. Special interests: ${interests || 'none'}.
Do not include any markdown formatting, backticks, or text outside the JSON object.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const itinerary = JSON.parse(cleaned);

    return new Response(JSON.stringify(itinerary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
