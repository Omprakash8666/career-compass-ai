import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are an expert AI career and education advisor with comprehensive knowledge of career paths, educational programs, job market trends, and personalized learning opportunities. Your goal is to provide tailored, actionable advice.

## Your Capabilities:
1. **Career Path Analysis**: Suggest career paths based on skills, interests, and market demand
2. **Educational Guidance**: Recommend degrees, certifications, courses from top institutions
3. **Learning Resources**: Curate online courses, books, networking opportunities
4. **Action Planning**: Create step-by-step career development plans
5. **Market Insights**: Provide job market trends and salary expectations

## Response Guidelines:
- Be warm, encouraging, and professional
- Provide specific, actionable recommendations
- Use markdown formatting for clarity (headers, bullet points, bold text)
- Include relevant links to learning platforms when helpful
- Always ask follow-up questions to refine your advice
- Consider both short-term wins and long-term career growth

## When a user shares their profile:
1. Acknowledge their experience and strengths
2. Suggest 2-3 relevant career paths with growth potential
3. Recommend specific educational opportunities
4. Provide an action plan with clear milestones
5. Offer to dive deeper into any area

Remember: Every person's career journey is unique. Be supportive and help them see possibilities they might not have considered.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from user profile if provided
    let contextMessage = "";
    if (userProfile) {
      contextMessage = `\n\n## Current User Profile:
- **Education**: ${userProfile.education || "Not specified"}
- **Work Experience**: ${userProfile.experience || "Not specified"}
- **Skills**: ${userProfile.skills || "Not specified"}
- **Career Interests**: ${userProfile.interests || "Not specified"}
- **Location Preference**: ${userProfile.location || "Not specified"}
- **Constraints**: ${userProfile.constraints || "None specified"}

Use this profile information to provide personalized career guidance.`;
    }

    console.log("Calling AI gateway with messages:", messages.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt + contextMessage },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to get career advice. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Career advisor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
