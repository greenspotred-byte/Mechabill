/**
 * Cloudflare Pages Function — POST /api/scan
 * Body: { image: base64, mime: "image/png" }
 * Secret: GEMINI_API_KEY  (wrangler pages secret put GEMINI_API_KEY)
 */

const MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-2.5-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
];

const CATALOG = `
Air Filter
Engine Oil
Spark Plug
Brakepad Replacement
Clutch Replacement
Suspension Parts
Tyre Replacement
Repair Kit
Full Service
Cosmetic Parts
Extras Kit
Lighting Controller
Respray Kit
Stancer Kit
Tyre Smoke Kit
Vehicle Wheels Set
Offroad Tyres
Semi Slick Tyres
Slick Tyres
ชุดแต่งเครื่องยนต์ Stock Plus Lv.0
ชุดแต่งเครื่องยนต์ Street Lv.1
ชุดแต่งเครื่องยนต์ Sport Lv.2
ชุดแต่งเครื่องยนต์ Race Lv.3
ชุดเบรก Street Lv.1
ชุดเบรก Race Lv.2
ชุดช่วงล่าง Sport
ชุดเกียร์ Street Lv.1
ชุดเกียร์ Race Lv.2
ชุดเทอร์โบ
ชุดเกราะ 20%
ชุดเกราะ 40%
ชุดเกราะ 60%
ชุดเกราะ 100%
EV Battery
EV Coolant
EV Motor
`.trim();

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function onRequestPost(context) {
  const apiKey = context.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json({ error: 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY บน server' }, 500);
  }

  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }

  const b64 = body.image || body.data;
  const mime = body.mime || body.mimeType || 'image/png';
  if (!b64 || typeof b64 !== 'string') {
    return json({ error: 'missing image base64' }, 400);
  }

  const prompt = `You are reading a screenshot from a car mechanic game UI (Thai + English).
Extract ONLY the install/repair parts listed (rows in the job list).
Ignore UI chrome: ON DUTY, buttons ติดตั้ง, ปล่อยงาน, ยกเลิกงาน, plate numbers, player names.

Return STRICT JSON only (no markdown):
{"items":[{"name":"...","qty":1}]}

Rules:
- Each list row = qty 1 of that part type. If the same part appears on multiple rows, sum the qty.
- Map names to this catalog EXACTLY when possible:
${CATALOG}
- Thai-only cosmetic rows (livery, กันชนหน้า, กันชนหลัง, สเกิร์ตข้าง, ฝากระโปรง, แก้มข้าง, สปอยเลอร์, ท่อไอเสีย, โครงสร้าง, หลังคา, etc.) → "Cosmetic Parts"
- สี* / Respray → "Respray Kit"
- ปรับทรง / Stancer → "Stancer Kit"
- extra1/extra2/plate + Extras → "Extras Kit"
- xenon/neon → "Lighting Controller"
- เทอร์โบ / ชุดเทอร์โบ → "ชุดเทอร์โบ"
- ช่วงล่าง Sport → "ชุดช่วงล่าง Sport"
- เกียร์ Race Lv.2 → "ชุดเกียร์ Race Lv.2"
- เบรก Race Lv.2 → "ชุดเบรก Race Lv.2"
- เครื่องยนต์ Race Lv.3 → "ชุดแต่งเครื่องยนต์ Race Lv.3"
- If unsure, still include the closest catalog name.`;

  const payload = {
    contents: [{
      role: 'user',
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mime, data: b64 } },
      ],
    }],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  let lastStatus = 0;
  let lastText = '';
  let usedModel = '';
  let data = null;

  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    lastStatus = res.status;
    lastText = await res.text();
    if (res.ok) {
      usedModel = model;
      try {
        data = JSON.parse(lastText);
      } catch {
        return json({ error: 'bad response from Gemini', raw: lastText.slice(0, 500) }, 502);
      }
      break;
    }
    if (res.status === 403 || res.status === 429 || res.status === 400) break;
  }

  if (!data) {
    return json({
      error: 'Gemini request failed',
      status: lastStatus,
      detail: lastText.slice(0, 400),
    }, lastStatus >= 400 && lastStatus < 600 ? lastStatus : 502);
  }

  const raw = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const m = raw.match(/\{[\s\S]*\}/);
    if (m) {
      try { parsed = JSON.parse(m[0]); } catch { /* ignore */ }
    }
  }

  const items = parsed?.items || parsed?.parts || (Array.isArray(parsed) ? parsed : []);
  return json({ items, model: usedModel });
}
