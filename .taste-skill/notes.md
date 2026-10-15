# tato.pe — notes

## Brief (read)
Subject: Tato (Carlos Quispe), "Tato Studio". AI filmmaker in Peru, niche: social media video (TikTok @contactocontato, IG @studiotato). Bio: "Cine con IA hecho en Perú. Videos zombie personalizados, taller y prompts. Pedidos por WhatsApp."
Audience: Peruvian TikTok followers who ask "¿cómo lo haces?" and people who want a custom video (parejas, familia, cumpleaños); secondarily brands (→ Agentia).
One thing: tap "Quiero aprender" (primary). Second: "Quiero mi video".
Stack: Astro 7 + Tailwind 4. Blog + shop/cart foundation (e-learning).
Brand: Google colours (blue #4285F4, red #EA4335, yellow #FBBC05, green #34A853), canvas grey #E9EEF6, ink #1F1F1F, white. Gemini violet listed but violates house rule; left out (one accent only).
Imagery that exists: 11 real clips (own work). Real footage of Tato (gym reel). Seedance clip of Tato turning into an armored hero. No photos of Tato otherwise. No image tool.
Language: Spanish (Peru). Currency: soles (S/).

## Inventory (belongs to Tato and no competitor)
1. The name: Tato. Short, two syllables, sets huge.
2. "Cine con IA hecho en Perú" — his own line.
3. Three cities: Huaraz (Cordillera Blanca), Ica (desert, Huacachina), Lima.
4. The cuy in a chullo — his recurring character (Cuy de Valdelomar), a Peruvian icon.
5. "Zombie Love Story" — the name of his workshop and prompt pack. Zombies + telenovela romance.
6. His ritual on TikTok: "Escribe prompt y te lo comparto" — he gives away the prompt in comments.
7. The prompt is his artefact: the printed thing of his world. Pack de prompts S/29. Prompt de la semana.
8. Prices in soles: pack S/29, taller preventa S/49, custom videos by resolution 480p/720p/1080p.
9. Payment: Yape, Plin, tarjeta. Orders by WhatsApp +51 961 662 512.
10. His transformation clip: real Carlos in a Huaraz gym ("No se trata de fuerza") → armored hero. Him, before and after the prompt.
11. Tools he names: Higgsfield (affiliate), Seedance 2.0, Sora.
12. The 9:16 phone frame — everything he makes lives in it.

## Argument (claims → proof)
1. Tato makes the AI videos you've seen on TikTok, from Peru.         → his face turning into the hero, large; the name huge
2. The videos are real and they get watched.                          → 9 clips, with their views, vertical, in a strip; link to TikTok
3. He gives the prompt away (it's what he does in comments).          → prompt de la semana, for a WhatsApp/email
4. You can learn it: pack S/29, taller en vivo S/49, curso pronto.    → the three offers with prices and dates, buy buttons
5. Or do it yourself with the same app he uses.                       → Higgsfield link, marked affiliate
6. Or he makes yours: three plans by resolution, attempts, delivery.  → the plans; the live thing: write your video, see the price, send to WhatsApp
7. For brands: videos and team workshops, through Agentia.            → short, one button
8. He's a normal guy from Huaraz working between three cities.        → gym footage, short story, follow
9. People have done it (opiniones).                                   → SAMPLE ONLY, flagged, replace before launch
10. Answers to what everyone asks.                                    → FAQ, six real questions
11. Close: WhatsApp, redes, terms, affiliate notice.                  → footer, name returns

## Idea
On this page, **the prompt — the text Tato gives away in his comments — becomes the device**: every clip is shown with the line that made it, the gift is a prompt, the products are prompts, and the visitor orders their own video by writing it as a prompt (the live thing) which the page turns into the WhatsApp message and a price.
Competitor test: Frank Houbre sells training and films too, but does not give away prompts in comments, charge in soles, pay by Yape, or have a cuy in a chullo. Passes.

## Live thing
"Escribe tu video": pick occasion (pareja / familia / cumpleaños / otro), style (zombie / Pixar / cine / tu idea), plan (480p / 720p / 1080p), tick image permission → sees the price, the attempts, the delivery days, and a "Pedir por WhatsApp" that opens wa.me with the composed message. Fallback without JS: plain wa.me links per plan.

## Video handling (per structure doc)
- Own/client work (hosted loops): Valdelomar ×3, Pisco, Seedance transformation, gym reel, Pompinchú tribute.
- TV/streamer parodies (AFHS ×3, Curwen): poster + link to TikTok, not hosted ("mejor como enlace a tu TikTok").

## Direction dealt
pinned-poster · seed 17251068 · hero "Name split to corners" (TATO / STUDIO) · type Unbounded 800 + Onest · palette kept from brand.
Redraws: section:showcase → showcase-frame-run-one-lifted (the dealt "one frame, three distances" shows one photograph at three zooms; the content is nine different clips).
Adjustments (house rules over blueprint): corners in solid ink/red instead of difference blend; on the phone the corners are static on the first screen (pinned words collided with the sentence and action); Sobre mí title in ink on its own paper ground (a sticky layer is always a stacking context, so a blend can never reach the page), static on the phone.

## Critique
ROUND 1 (desktop 1440, tablet 768, phone 390)
Seen in one second: TATO, and a dark figure holding something glowing.
Idea: the prompt Tato gives away in his comments is the page's device: a free weekly prompt, prompts sold on tickets, "Escribe · Genera · Publica", and the visitor writes their own video to order it.
Live thing: "Escribe tu video": pick who, style and plan; the ticket rewrites itself, prices in soles, the WhatsApp message is composed; permission box gates the order.
Layout words: hero=pinned-corners / second=split / videos=strip / prompt=full-bleed / aprende=ticket-strip / hazlo=pinned-verbs / tu-video=split+ticket / marcas=card-on-photo / sobre-mi=pinned-title / opiniones=pinned-quotes / preguntas=columns / footer=split.
Scores: design 7.5 · usability 7 · creativity 8 · content 7.5 → overall 7.4
Caps applied: none after fixes (0 FAIL).
Top three problems:
1. Phone: "OPINIONES" at 16vw runs past the right edge (tail-m-op1). → 12vw.
2. Phone: the pinned "SOBRE MÍ" layer slides over the portrait captions (tail-m-about2). → static title on the phone.
3. Tablet: "Aprende a hacerlo" and "Te lo hago yo" heads sit at the bottom of a tall lead paragraph (tablet-page-01). → align the head row to the top below 1024px.
Also noted, left as is: STUDIO and the verbs pass over pictures by direction; the frame run leaves the right edge by blueprint; white on Google blue (3.6:1) on the primary button is the brand's own button.

ROUND 2
Fixed: phone OPINIONES at 12vw; SOBRE MÍ static on the phone with the gap on the section; tablet heads aligned to the top; redundant TikTok link removed from the hero's second screen.
Inspector: 0 FAIL, 4 WARN (brand-blue button contrast 3.6:1; 15 sizes, all from blueprints; frame run leaves the right edge by blueprint; STUDIO/ESCRIBE/GENERA pinned over pictures by direction).
Scores: design 7.5 · usability 7.5 · creativity 8 · content 7.5 → overall 7.6. Still short: the gym clip's own title cards flash through the second screen; the Opiniones section carries sample quotes until real ones exist.
