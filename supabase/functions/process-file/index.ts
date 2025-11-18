import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// @ts-ignore - Deno is a global in Deno runtime
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileContent, fileName, query } = await req.json();
    console.log('Processing file:', fileName, 'with query:', query);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Prepare system prompt for AI to analyze file data
    const systemPrompt = `You are an AI data analyst assistant. Analyze the provided file content and answer user questions about the data. 
    When appropriate, structure your response to include chart data in JSON format.
    For chart data, return it in this format:
    {
      "type": "bar" | "line" | "pie",
      "labels": [...],
      "datasets": [{
        "label": "...",
        "data": [...]
      }]
    }
    
    Always provide clear, concise answers and suggest relevant visualizations when the data allows for it.`;

    const userPrompt = `File: ${fileName}
    
Content:
${fileContent}

User Question: ${query}

Please analyze this data and answer the question. If the data can be visualized, provide chart data in the specified JSON format.`;

    // Call Lovable AI Gateway
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices[0].message.content;
    console.log('AI Response:', responseText);

    // Try to extract chart data if present
    let chartData = null;
    const jsonMatch = responseText.match(/\{[\s\S]*"type"[\s\S]*"labels"[\s\S]*"datasets"[\s\S]*\}/);
    if (jsonMatch) {
      try {
        chartData = JSON.parse(jsonMatch[0]);
        console.log('Extracted chart data:', chartData);
      } catch (e) {
        console.log('Could not parse chart data from response');
      }
    }

    return new Response(
      JSON.stringify({ 
        response: responseText,
        chartData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in process-file function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});