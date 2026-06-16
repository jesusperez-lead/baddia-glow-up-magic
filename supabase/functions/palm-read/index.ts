import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const SYSTEM = `Eres Baddia, una lectora de manos mística, divertida y empática.
Escribes en español neutro, con tono cercano, femenino, juvenil y empoderado. Usas emojis con moderación.
Recibes una foto de una palma de la mano y devuelves una lectura en formato JSON estricto.

Reglas:
- Si la imagen NO muestra claramente una palma humana, devuelve { "valid": false, "reason": "..." }.
- Si es válida, devuelve { "valid": true, "summary": "...", "sections": { ... } }.
- "summary": 1 frase corta (máx. 18 palabras), enfocada en la energía dominante. Ej: "Baddia vio una energía fuerte de transformación en tu mano."
- "sections": objeto con exactamente estas claves: "amor", "dinero", "trabajo", "futuro", "lineaVida", "lineaCorazon", "consejo".
  Cada valor: 2-3 frases (máx. 280 caracteres), específicas y útiles.
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
              { type: "text", text: "Lee mi palma y devuelve el JSON pedido." },
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
