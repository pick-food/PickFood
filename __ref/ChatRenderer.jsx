// ChatRenderer â rich response cards used by both the floating widget and the dedicated screen.
// All renderers receive (data, ctx) where ctx = { compact, onProduct, d, user }.
// Designed so the same intent ('allergy_scan', 'meal_plan', etc.) renders consistently everywhere.

window.PF_CHAT = (() => {

  // ---------- core glyph ----------
  const Avatar = ({ size = 32 }) => (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: 'linear-gradient(135deg, #0F1E12 0%, #1F4D2C 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      boxShadow: 'inset 0 0 0 1.5px rgba(168,224,99,0.4)'
    }}>
      <Icon.Sparkle size={Math.round(size * 0.5)} stroke="#A8E063"/>
    </div>
  );

  // ---------- intent classifier ----------
  function classify(text) {
    const t = text.toLowerCase();
    if (t.includes('ìë ë¥´ê¸°') || t.includes('ìì°') || t.includes('ëì½©') || t.includes('íì¸') || t.includes('ìì íê°')) return 'allergy_scan';
    if (t.includes('ìë¨') || t.includes('ì¼ì£¼ì¼') || t.includes('ì£¼ê°') || t.includes('ê°ì¡±') || t.includes('ì¼ì£¼') || t.includes('5ì¼')) return 'meal_plan';
    if (t.includes('ë¹êµ') || t.includes('ì°¨ì´')) return 'compare';
    if (t.includes('ëì²´') || t.includes('ëì ') || t.includes('ë¹¼ê³ ') || t.includes('ë¹ ì§')) return 'substitute';
    if (t.includes('ë¹ë¨') || t.includes('íë¹') || t.includes('ë¹ë¥') || t.includes('ì ë¹')) return 'diabetes';
    if (t.includes('ê³ íì') || t.includes('ëí¸ë¥¨') || t.includes('ì ì¼') || t.includes('ì ëí¸ë¥¨')) return 'lowsodium';
    if (t.includes('ë¨ë°±') || t.includes('ì´ë') || t.includes('ê·¼') || t.includes('30g')) return 'protein';
    if (t.includes('ë ìí¼') || t.includes('ìë¦¬')) return 'recipe';
    if (t.includes('ìì') || t.includes('ì¹¼ë¡ë¦¬')) return 'nutrition_summary';
    if (t.includes('ì¤ìº') || t.includes('ì¬ì§') || t.includes('ì°ì')) return 'photo_scan';
    return 'general';
  }

  // ---------- streaming helper ----------
  // Returns characters at intervals; caller calls onTick(currentText, done).
  function stream(fullText, onTick, msPerChar = 14) {
    let i = 0;
    const id = setInterval(() => {
      i = Math.min(fullText.length, i + Math.max(1, Math.round(fullText.length / 30)));
      onTick(fullText.slice(0, i), i >= fullText.length);
      if (i >= fullText.length) clearInterval(id);
    }, msPerChar * 4);
    return () => clearInterval(id);
  }

  // ---------- response builders ----------
  // Build a structured response: { intent, summary, cards: [...], followUps: [...], sources: [...] }
  function build(intent, userText, d) {
    const safe = d.products.filter(p => !p.allergens.includes('ìì°') && !p.allergens.includes('ê²'));
    const lowSugar = [...d.products].filter(p => p.nutrition.sugar <= 5).sort((a,b)=>a.nutrition.sugar-b.nutrition.sugar);
    const hiProtein = [...d.products].sort((a,b)=>b.nutrition.protein-a.nutrition.protein);
    const lowSodium = [...d.products].sort((a,b)=>a.nutrition.sodium-b.nutrition.sodium);

    if (intent === 'allergy_scan') {
      const risky = d.products.filter(p => p.allergens.some(a => ['ìì°','ê²'].includes(a)));
      return {
        intent,
        summary: `ë°í¬ìë íë¡í ê¸°ì¤ì¼ë¡ ê²ì ê²°ê³¼ **ìì  ìí ${safe.length}ê°**, **ì£¼ì ìí ${risky.length}ê°**ë¥¼ ì°¾ìì´ì. ìëë ìì  ìí ì¤ ë¨ë°±ì§ì´ íë¶í í½ 3ê°ìëë¤.`,
        cards: [
          { kind: 'allergy_breakdown', data: {
            unsafe: ['ìì°','ê²'],
            safe: ['ì°ì ','ëë','ë°'],
            unknown: [],
            stats: { scanned: d.products.length, safe: safe.length, risky: risky.length }
          }},
          { kind: 'product_picks', data: { items: safe.filter(p => p.nutrition.protein >= 10).slice(0, 3) } }
        ],
        followUps: ['ì£¼ì ìíë ë³´ì¬ì¤', 'ë§ì¶¤ ëìë½ ì¶ì²', 'ë¹ê±´ ìµìë§'],
        sources: [
          { label: 'ìì½ì² ìë ë¥´ê¸° íì ëì 15ì¢', tag: 'FDA' },
          { label: 'ë°í¬ìë ìë ë¥´ê¸° ê·¸ë£¹ v3', tag: 'profile' }
        ]
      };
    }

    if (intent === 'meal_plan') {
      const pool = safe.filter(p => p.nutrition.sugar <= 8);
      const week = ['ì','í','ì','ëª©','ê¸'].map((day, i) => ({
        day,
        date: `5/${12 + i}`,
        breakfast: pool[(i * 3) % pool.length],
        lunch:     pool[(i * 3 + 1) % pool.length],
        dinner:    pool[(i * 3 + 2) % pool.length],
        kcal: 1620 + (i % 3) * 80
      }));
      return {
        intent,
        summary: `ë°í¬ìë ìë ë¥´ê¸°Â·ë¹ë¨ íë¡íì ë°ìí **5ì¼ì¹ ê°ì¡± ìë¨**ìëë¤. ì´ ${week.length * 3}ë¼ / íê·  íë£¨ 1,750kcal / ë¹ë¥ ì¼íê·  22g.`,
        cards: [
          { kind: 'meal_plan', data: { week } }
        ],
        followUps: ['ì¥ë³´ê¸° ë¦¬ì¤í¸ë¡ ë³í', 'ì£¼ë§ í¬í¨ 7ì¼ë¡ ëë ¤ì¤', 'ìì´ì©ì¼ë¡ ë¤ì ì§ì¤'],
        sources: [
          { label: 'ëíë¹ë¨ë³íí ìì´ ê°ì´ë 2024', tag: 'guideline' },
          { label: 'ë°í¬ìë ìì ëª©í', tag: 'profile' }
        ]
      };
    }

    if (intent === 'compare') {
      const a = safe[0], b = safe[2] || safe[1];
      return {
        intent,
        summary: `**${a.name}**ì **${b.name}**ì ììÂ·ìì  ë¹êµ ê²°ê³¼ìëë¤. ë¨ë°±ì§ì ${a.nutrition.protein > b.nutrition.protein ? 'ì ì' : 'íì'}ê°, ë¹ë¥ë ${a.nutrition.sugar < b.nutrition.sugar ? 'ì ì' : 'íì'}ê° ë ì°ìí´ì.`,
        cards: [
          { kind: 'compare', data: { a, b } }
        ],
        followUps: ['ë ë§ì ìíê³¼ ë¹êµ', 'ë¨ë°±ì§ 30g+ ìíë§', 'ë¹ì·í ê°ê²©ëë¡'],
        sources: [{ label: 'ì ì¡°ì¬ ììì±ë¶í (KFDA)', tag: 'KFDA' }]
      };
    }

    if (intent === 'substitute') {
      return {
        intent,
        summary: `ìì° ì¼ì± ë³¶ìë°¥ìì **ìì°**ë¥¼ ë¹¼ê³  ë¤ìê³¼ ê°ì´ ëì²´í  ì ìì´ì. ë¨ë°±ì§ì ì ì§íë©´ì ìì° ìë ë¥´ê¸°ë¥¼ íí¼í©ëë¤.`,
        cards: [
          { kind: 'substitute', data: {
            from: { name: 'ìì° (100g)', kcal: 99, protein: 24, allergy: 'ìì° (ê°ê°ë¥)' },
            options: [
              { name: 'ë­ê°ì´ì´ 100g', kcal: 110, protein: 23, note: 'ë¨ë°±ì§ ë¹ì·, ìê° ì°¨ì´ ìì', safe: true },
              { name: 'ëë¶ ë¨ë¨í 150g', kcal: 117, protein: 12, note: 'ëë ë¨ë°±ì§ 100% ìë¬¼ì±', safe: true },
              { name: 'ë³ìë¦¬ì½© 100g', kcal: 164, protein: 9, note: 'ìì´ì¬ì  ì¶ê° í¨ê³¼', safe: true }
            ]
          }}
        ],
        followUps: ['ëì²´í ë ìí¼ ë§ë¤ì´ì¤', 'ë­ê°ì´ì´ ìí ì¶ì²', 'ëë¶ ì¢ë¥ë³ ë¹êµ'],
        sources: [{ label: 'ìíììê°í (ëì´ì§í¥ì²­)', tag: 'guideline' }]
      };
    }

    if (intent === 'diabetes') {
      return {
        intent,
        summary: `ë¹ë¨ ê´ë¦¬ ìíì ê³¨ëì´ì. ëª¨ë **GI 55 ì´í** + **ë¹ë¥ 5g ì´í**ìëë¤. ë°í¬ìë íë¡í ê¸°ì¤ ìì í ìíë§ íì ì¤.`,
        cards: [
          { kind: 'nutrient_target', data: {
            items: [
              { label: 'ë¹ë¥',     target: 'â¤ 25g/ì¼',     status: 'low' },
              { label: 'íìíë¬¼', target: '130â230g/ì¼', status: 'mid' },
              { label: 'ìì´ì¬ì ', target: 'â¥ 25g/ì¼',     status: 'good' },
              { label: 'GI',       target: 'ì GI (â¤55)',   status: 'good' }
            ]
          }},
          { kind: 'product_picks', data: { items: lowSugar.filter(p=>!p.allergens.includes('ìì°')&&!p.allergens.includes('ê²')).slice(0, 3) } }
        ],
        followUps: ['ë¹ë¥ ê°ì¥ ë®ì ê°ì', 'ì GI ë¹µ', 'ì£¼ê° ìë¨ì¼ë¡ ë§ë¤ì´ì¤'],
        sources: [{ label: 'ëíë¹ë¨ë³íí ê¶ê³ ì', tag: 'guideline' }, { label: 'ìì½ì² ë¹ë¥ ì­ì·¨ ê¸°ì¤', tag: 'KFDA' }]
      };
    }

    if (intent === 'lowsodium') {
      return {
        intent,
        summary: `ëí¸ë¥¨ì´ ë®ì ìí TOP 3ìëë¤. íë£¨ ê¶ì¥ë 2,000mg ê¸°ì¤ 1ë¼ 500mg ì´íë¡ ê³¨ëì´ì.`,
        cards: [
          { kind: 'product_picks', data: { items: lowSodium.filter(p=>!p.allergens.includes('ìì°')&&!p.allergens.includes('ê²')).slice(0, 3) } }
        ],
        followUps: ['ì ì¼ ë°ì°¬ ìë¨', 'ì ì¼ ë¼ë©´ ìì´?', 'ëí¸ë¥¨ ë¹êµí´ì¤'],
        sources: [{ label: 'ìì½ì² ëí¸ë¥¨ ì­ì·¨ ê°ì´ë', tag: 'KFDA' }]
      };
    }

    if (intent === 'protein') {
      return {
        intent,
        summary: `ë¨ë°±ì§ í¨ë **TOP 3** ìíìëë¤. ì´ë í íë³µì©ì¼ë¡ í ë¼ 30g ì´ì ì­ì·¨ê° ëª©íë¼ë©´ ìë ì¡°í©ì¼ë¡ ì¶©ë¶í´ì.`,
        cards: [
          { kind: 'product_picks', data: { items: hiProtein.filter(p=>!p.allergens.includes('ìì°')&&!p.allergens.includes('ê²')).slice(0, 3) } }
        ],
        followUps: ['íë£¨ ë¨ë°±ì§ ìë¨', 'ê³ ë¨ë°± ê°ì', 'ë¹ê±´ ë¨ë°±ì§ ìµì'],
        sources: [{ label: 'íêµ­ ììì­ì·¨ê¸°ì¤ 2020', tag: 'guideline' }]
      };
    }

    if (intent === 'recipe') {
      return {
        intent,
        summary: `ë°í¬ìë íë¡í(ìì°Â·ê²Â·ë¹ë¨)ì ìì í **5ë¶ ëë¶ ì¤í¬ë¨ë¸** ë ìí¼ìëë¤. 1ì¸ë¶ ê¸°ì¤ ë¨ë°±ì§ 22g Â· ë¹ë¥ 3g.`,
        cards: [
          { kind: 'recipe', data: {
            title: '5ë¶ ëë¶ ì¤í¬ë¨ë¸',
            time: '5ë¶', kcal: 220, servings: 1,
            ingredients: [
              { name: 'êµ­ë´ì° ì ê¸°ë ëë¶ 300g', amount: 'Â½í©', pid: 'p1', safe: true },
              { name: 'ìê¸ì¹ 200g',           amount: 'í ì¤', pid: 'p14', safe: true },
              { name: 'ê³ë 30êµ¬ ì¤',           amount: '1ì', pid: 'p13', safe: true, note: 'ëì²´ ê°ë¥' },
              { name: 'ì¬ë¦¬ë¸ì ',              amount: '1í°ì ', pid: null, safe: true },
              { name: 'ê°í©Â·íì¶',             amount: 'ì½ê°', pid: null, safe: true }
            ],
            steps: [
              'ëë¶ë¥¼ ìì¼ë¡ ì¼ê¹¨ì´ í¤ì¹íì¬ë¡ ë¬¼ê¸°ë¥¼ ì´ì§ ì ê±°í©ëë¤.',
              'í¬ì ì¬ë¦¬ë¸ì ë¥¼ ëë¥´ê³  ìê¸ì¹ë¥¼ 30ì´ ë³¶ì í¥ì ëëë¤.',
              'ëë¶ë¥¼ ë£ê³  ê°í©Â·íì¶ë¡ ê°ì í ë¤ 3ë¶ê° íì ì¼ë©° ë³¶ìµëë¤.',
              'ê³ëì íì´ ë¶ì´ 1ë¶ê° ë ìµíë©´ ìì±.'
            ],
            allergens: ['ëë','ë¬ê±']
          }}
        ],
        followUps: ['ê³ë ë¹¼ê³  ë§ëë ë²', 'ì ëì©ì¼ë¡ ì ëë ¤ì¤', 'ë¹ì·í ë ìí¼ ë'],
        sources: [{ label: 'pickfood ë ìí¼ íë ì´í°', tag: 'curated' }]
      };
    }

    if (intent === 'photo_scan') {
      return {
        intent,
        summary: `ì¬ì§ì ë¶ìíì´ì. **ìë¦¬ì¼ 1ì¢**ì¼ë¡ ì¶ì ëë©°, ë°í¬ìë íë¡í ê¸°ì¤ ë¤ìê³¼ ê°ì´ íê°ë©ëë¤.`,
        cards: [
          { kind: 'photo_scan', data: {
            label: 'ì¤í¸ ê·¸ëëë¼ (ì¶ì )',
            confidence: 0.88,
            warnings: [
              { kind: 'unsafe', text: 'ê²¬ê³¼ë¥ í¬í¨ ê°ë¥ì± â ë¼ë²¨ íì¸ íì' }
            ],
            ok: [
              { text: 'ê¸ë£¨í íê¸° ìì' },
              { text: 'ë¹ë¥ 5g/30g (ì ë¹ ê¸°ì¤ ì¶©ì¡±)' }
            ]
          }},
          { kind: 'product_picks', data: { items: safe.filter(p => p.cat === 'snack').slice(0, 2) } }
        ],
        followUps: ['ì´ ì íì ììì ë³´ ìë ¤ì¤', 'ë¹ì·í ìì  ìµì', 'ë¦¬ë·° ìì½í´ì¤'],
        sources: [{ label: 'pickfood Vision (Î²)', tag: 'AI' }]
      };
    }

    if (intent === 'nutrition_summary') {
      return {
        intent,
        summary: `ì´ë² ì£¼ ë°í¬ìë ì¥ë°êµ¬ëì íê·  ìì íë¡íìëë¤. ë¨ë°±ì§Â·ìì´ì¬ì ë ê¶ì¥ëì ì¶©ì¡±íê³ , ë¹ë¥ì ëí¸ë¥¨ì ê¶ì¥ ë²ì ë´ìëë¤.`,
        cards: [
          { kind: 'nutrition_summary', data: {
            metrics: [
              { label: 'ë¨ë°±ì§',   value: 78, target: 65, unit: 'g', good: true },
              { label: 'ìì´ì¬ì ', value: 28, target: 25, unit: 'g', good: true },
              { label: 'ë¹ë¥',     value: 22, target: 25, unit: 'g', good: true },
              { label: 'ëí¸ë¥¨',   value: 1820, target: 2000, unit: 'mg', good: true },
              { label: 'ì§ë°©',     value: 58, target: 65, unit: 'g', good: true },
              { label: 'íìíë¬¼', value: 198, target: 250, unit: 'g', good: true }
            ]
          }}
        ],
        followUps: ['ë¤ì ì£¼ ìë¨ë ì§ì¤', 'ë¨ë°±ì§ ë ëë¦¬ë ¤ë©´', 'ëí¸ë¥¨ ì¤ì´ë í'],
        sources: [{ label: 'ë°í¬ìë ìì ëª©í v2', tag: 'profile' }]
      };
    }

    // general
    return {
      intent: 'general',
      summary: `ë¤, ë¬´ìì ëìëë¦´ê¹ì? ë°í¬ìë íë¡í(**ìì°Â·ê² ìë ë¥´ê¸°**, **ë¹ë¨**)ì ì ì©í´ ëµë³ëë¦´ ì ìì´ì. ìë ì¤ íëë¥¼ ê³¨ë¼ë³´ì¸ì.`,
      cards: [],
      followUps: ['ìì° ìë ëìë½ ì¶ì²', 'ì ë¹ ê°ì TOP 5', 'ì´ë² ì£¼ ê°ì¡± ìë¨', 'ë¨ë°±ì§ 30g+ ìí'],
      sources: []
    };
  }

  return { Avatar, classify, build, stream };
})();

