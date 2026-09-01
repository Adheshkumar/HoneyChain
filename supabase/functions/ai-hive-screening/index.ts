import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ScreeningResult {
  overall_risk: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  confidence: number;
  observations: string[];
  possible_risks: string[];
  recommendation: string;
  requires_manual_inspection: boolean;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { image_url, hive_id } = await req.json();

    if (!image_url) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      // No API key — return a mock screening with clear labeling
      const mockResult: ScreeningResult = {
        overall_risk: "MEDIUM",
        confidence: 72,
        observations: [
          "Unusual clustering pattern detected near hive entrance",
          "Activity level appears lower than expected for this time of day",
          "Some debris visible around the entrance area",
        ],
        possible_risks: [
          "Potential colony stress indicator",
          "Possible reduced foraging activity",
        ],
        recommendation: "Manual inspection recommended to assess colony health and check for pests or disease indicators.",
        requires_manual_inspection: true,
      };

      return new Response(
        JSON.stringify({
          ...mockResult,
          _mock: true,
          _note: "AI API key not configured. This is a simulated screening result for prototype demonstration.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Call OpenAI Vision API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant performing honey bee hive visual risk screening. Analyze the image for visible indicators of hive health. You must NOT claim to definitively diagnose diseases. Return ONLY valid JSON with this exact structure: {\"overall_risk\": \"LOW|MEDIUM|HIGH|UNKNOWN\", \"confidence\": 0-100, \"observations\": [string], \"possible_risks\": [string], \"recommendation\": string, \"requires_manual_inspection\": boolean}. Use cautious language like 'possible risk indicator' and 'manual inspection recommended'. If image quality is poor, return overall_risk as UNKNOWN.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Perform AI-assisted honey bee hive visual risk screening for this hive image. Look for: unusual bee clustering, abnormal hive entrance activity, visible pests, visible mites if clearly identifiable, damaged hive structure, unusual debris, signs that may warrant manual inspection, and general hive condition. Return structured JSON only." },
              { type: "image_url", image_url: { url: image_url } },
            ],
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return new Response(
        JSON.stringify({
          overall_risk: "UNKNOWN",
          confidence: 0,
          observations: ["AI analysis failed due to API error."],
          possible_risks: [],
          recommendation: "Image insufficient for reliable visual screening. Manual inspection recommended.",
          requires_manual_inspection: true,
          _error: "AI analysis service unavailable",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let result: ScreeningResult;
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      result = {
        overall_risk: "UNKNOWN",
        confidence: 0,
        observations: ["Unable to parse AI response."],
        possible_risks: [],
        recommendation: "Image insufficient for reliable visual screening. Manual inspection recommended.",
        requires_manual_inspection: true,
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({
        overall_risk: "UNKNOWN",
        confidence: 0,
        observations: ["An unexpected error occurred during analysis."],
        possible_risks: [],
        recommendation: "Image insufficient for reliable visual screening. Manual inspection recommended.",
        requires_manual_inspection: true,
        _error: err.message,
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
