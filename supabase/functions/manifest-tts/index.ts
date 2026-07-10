import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const INSTRUCTIONS =
  "Habla en español latino, con voz cálida, suave y cercana, como una amiga que abraza. Ritmo pausado, tono íntimo y místico. Pausas cortas entre frases. No exageres, sé genuina.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const text = typeof body?.text === "string" ? body.text.trim() : "";
    if (!text) {
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (text.length > 800) {
      return new Response(JSON.stringify({ error: "text too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const voice = typeof body?.voice === "string" ? body.voice : "shimmer";

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini-tts",
        input: text,
        voice,
        instructions: INSTRUCTIONS,
        response_format: "mp3",
        speed: 0.95,
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => "");
      console.error(`manifest-tts upstream ${upstream.status}: ${errText}`);
      return new Response(
        JSON.stringify({ error: "TTS failed", status: upstream.status, details: errText }),
        { status: upstream.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("manifest-tts error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
