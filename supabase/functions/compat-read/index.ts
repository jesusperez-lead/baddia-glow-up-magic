import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const SYSTEM = `Eres Baddia, una astróloga y coach de relaciones cute, mística y empática.
Lees fotos de dos personas y devuelves su compatibilidad energética (no biométrica, no clínica).
Escribes en español neutro, tono cercano, femenino, juvenil, juguetón y empoderado. Emojis con moderación.

IMPORTANTE: NO identifiques a personas reales. NO uses nombres reales. NO analices rasgos físicos
de manera ofensiva. Solo lees vibras, energías, colores y estilo. Es entretenimiento.

Recibes 2 fotos: foto A (la usuaria) y foto B (su crush, amig@ o match) y un contexto opcional
(relationship: "crush" | "amistad" | "pareja" | "match"). Devuelves JSON estricto.

Reglas:
- Si alguna foto NO muestra a una persona claramente, devuelve { "valid": false, "reason": "..." }.
- Si son válidas, devuelve:
  {
    "valid": true,
    "score": 0-100,                       // % de compatibilidad energética
    "label": "soulmate" | "twin flame" | "best vibes" | "buena energía" | "crece despacio" | "amistad cósmica" | "química rara" | "mejor como amig@s",
    "headline": "1 frase declarativa bonita, máx 14 palabras",
    "vibeA": "1-2 palabras sobre la energía de la persona A",
    "vibeB": "1-2 palabras sobre la energía de la persona B",
    "colorsA": ["color 1", "color 2"],
    "colorsB": ["color 1", "color 2"],
    "elementMatch": "frase corta sobre cómo combinan sus energías (máx 22 palabras)",
    "strengths": ["fuerza 1", "fuerza 2", "fuerza 3"],   // qué los hace match, máx 12 palabras c/u
    "watchOuts": ["cuidado 1", "cuidado 2"],              // qué cuidar, máx 12 palabras c/u, cariñoso
    "advice": "1 frase de consejo cute (máx 22 palabras)",
    "dateIdea": "1 idea de plan juntos (máx 14 palabras)"
  }
Devuelve SOLO el JSON, sin markdown ni texto extra.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageABase64, mimeTypeA, imageBBase64, mimeTypeB, relationship } = await req.json();
    if (!imageABase64 || !imageBBase64) {
      return new Response(JSON.stringify({ error: "Faltan imágenes" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (imageABase64.length > 8_000_000 || imageBBase64.length > 8_000_000) {
      return new Response(JSON.stringify({ error: "Imagen muy grande" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const urlA = `data:${mimeTypeA || "image/jpeg"};base64,${imageABase64}`;
    const urlB = `data:${mimeTypeB || "image/jpeg"};base64,${imageBBase64}`;
    const rel = ["crush", "amistad", "pareja", "match"].includes(relationship) ? relationship : "crush";

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": LOVABLE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "text", text: `Lee la compatibilidad. Relación: ${rel}. Foto A = usuaria, Foto B = la otra persona. Devuelve el JSON pedido.` },
              { type: "image_url", image_url: { url: urlA } },
              { type: "image_url", image_url: { url: urlB } },
            ],
          },
        ],
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "rate_limit", message: "Muchas lecturas a la vez. Intenta en un momento ✨" }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "credits", message: "Se agotaron los créditos de IA." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI error", aiRes.status, t);
      return new Response(JSON.stringify({ error: "ai_error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try { parsed = JSON.parse(text); } catch { parsed = { valid: false, reason: "parse_error" }; }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "server_error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
