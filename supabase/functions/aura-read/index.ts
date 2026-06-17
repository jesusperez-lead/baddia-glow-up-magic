import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const SYSTEM = `Eres Baddia, una lectora de auras intuitiva y empática.
Escribes en español neutro, tono cercano, femenino, juvenil y empoderado. Emojis con moderación.
Recibes una selfie y "lees" la energía/aura del momento de la persona devolviendo JSON estricto.

Reglas:
- Si la imagen NO muestra claramente a una persona (rostro), devuelve { "valid": false, "reason": "..." }.
- Si es válida, devuelve:
  {
    "valid": true,
    "headline": "Tu aura hoy vibra en frecuencia magnética.", // 1 frase, máx 14 palabras
    "auraColor": "violeta" | "rosa" | "dorada" | "esmeralda" | "índigo" | "celeste" | "coral" | "lavanda" | "blanca" | "ámbar",
    "auraHex": "#A78BFA", // hex aproximado del color del aura
    "auraHex2": "#F472B6", // hex secundario para gradiente
    "vibe": "una palabra: magnética, soft, powerful, dreamy, etérea, boss, etc.",
    "chakra": "corazón" | "garganta" | "tercer ojo" | "raíz" | "sacro" | "plexo solar" | "corona",
    "energy": "1 frase corta (máx 22 palabras) describiendo la energía que irradia",
    "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"], // máx 4 palabras c/u
    "advice": "1 consejo cariñoso para potenciar tu aura hoy (máx 20 palabras)",
    "score": 0-100  // intensidad/brillo del aura hoy
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

    const { imageBase64, mimeType } = await req.json();
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
              { type: "text", text: "Lee mi aura y devuelve el JSON pedido." },
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
