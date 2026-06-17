import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const SYSTEM = `Eres Baddia, una stylist mística y empática que lee la energía de los outfits.
Escribes en español neutro, tono cercano, femenino, juvenil y empoderado. Emojis con moderación.
Recibes una foto de un outfit (puede ser mirror selfie, flat-lay o foto de cuerpo) y devuelves JSON estricto.

Reglas:
- Si la imagen NO muestra ropa o outfit claramente, devuelve { "valid": false, "reason": "..." }.
- Si es válida, devuelve:
  {
    "valid": true,
    "headline": "Tu outfit de hoy vibra en energía magnética.",  // 1 frase, máx 14 palabras, tipo declaración bonita
    "vibe": "magnética" | "soft" | "powerful" | "dreamy" | "playful" | "rebelde" | "etérea" | "boss" | "romántica" | "fresh",
    "colors": ["nombre color 1", "nombre color 2", "..."],  // 2-4 colores dominantes en español
    "style": "una etiqueta corta del estilo, ej: 'streetwear soft', 'old money', 'baddie casual'",
    "energy": "1 frase corta sobre la energía que proyecta el outfit (máx 22 palabras)",
    "matchToday": "1 frase explicando si combina o no con el color de hoy del usuario, mencionándolo por nombre",
    "improvements": ["mejora cute 1", "mejora cute 2", "mejora cute 3"]  // tips concretos, cariñosos, máx 14 palabras c/u
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

    const { imageBase64, mimeType, todayColor } = await req.json();
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(JSON.stringify({ error: "imageBase64 requerido" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (imageBase64.length > 8_000_000) {
      return new Response(JSON.stringify({ error: "Imagen muy grande" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dataUrl = `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;
    const userText = todayColor
      ? `Lee mi outfit. El color del día de la usuaria es "${todayColor}". Devuelve el JSON pedido.`
      : `Lee mi outfit y devuelve el JSON pedido.`;

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
              { type: "text", text: userText },
              { type: "image_url", image_url: { url: dataUrl } },
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
