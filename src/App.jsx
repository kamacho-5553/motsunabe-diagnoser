import React, { useMemo, useState } from "react";

const FLAVORS = [
  { id: "shoyu", name: "博多醤油", description: "迷ったらコレ。牛もつの旨みと醤油ダレのキレ。", url: "https://example.com/wakasugi/shoyu" },
  { id: "miso", name: "濃旨みそ", description: "コク深い味噌とニンニクの相性抜群。", url: "https://example.com/wakasugi/miso" },
  { id: "shio_tonkotsu", name: "塩とんこつ", description: "後を引くまろやかさ。", url: "https://example.com/wakasugi/shio-tonkotsu" },
  { id: "umakara", name: "旨辛（辛味）", description: "辛党に。唐辛子のキレと牛もつの甘み。", url: "https://example.com/wakasugi/umakara" },
  { id: "agodashi", name: "あごだし醤油", description: "だし感の余韻。上品な後味。", url: "https://example.com/wakasugi/agodashi" },
];

const QUESTIONS = [
  { id: "q1", text: "好みのベースは？", options: [
    { label: "醤油のキレ", weights: { shoyu: 2, agodashi: 1 } },
    { label: "味噌のコク", weights: { miso: 2 } },
    { label: "塩とんこつのまろやか", weights: { shio_tonkotsu: 2 } },
    { label: "だし感しっかり", weights: { agodashi: 2 } },
  ]},
  { id: "q2", text: "辛さは？", options: [
    { label: "不要。辛くないのが好き", weights: { shoyu: 1, agodashi: 1 } },
    { label: "ピリ辛ならOK", weights: { umakara: 1, miso: 1 } },
    { label: "結構辛いのが好き", weights: { umakara: 2 } },
  ]},
  { id: "q3", text: "こってり度の希望は？", options: [
    { label: "あっさり寄り", weights: { agodashi: 2, shoyu: 1 } },
    { label: "ほどよい", weights: { shoyu: 2 } },
    { label: "濃厚こってり", weights: { shio_tonkotsu: 2, miso: 1 } },
  ]},
  { id: "q4", text: "にんにく感は？", options: [
    { label: "控えめ", weights: { agodashi: 1, shoyu: 1 } },
    { label: "ほどほど", weights: { shoyu: 1, shio_tonkotsu: 1 } },
    { label: "ガツンと欲しい", weights: { miso: 2, umakara: 1 } },
  ]},
  { id: "q5", text: "後味のタイプは？", options: [
    { label: "スッと消える上品さ", weights: { agodashi: 2 } },
    { label: "満足感が残る", weights: { miso: 1, shio_tonkotsu: 1 } },
    { label: "余韻しっかり", weights: { shoyu: 1, miso: 1, shio_tonkotsu: 1 } },
  ]},
  { id: "q6", text: "〆まで考えるなら？", options: [
    { label: "ちゃんぽん麺で優勝", weights: { shio_tonkotsu: 2, shoyu: 1 } },
    { label: "雑炊でしみしみ", weights: { miso: 1, agodashi: 1 } },
    { label: "辛旨スープで追い飯", weights: { umakara: 2 } },
  ]},
  { id: "q7", text: "野菜の甘みを活かすなら？", options: [
    { label: "だし感で引き立てたい", weights: { agodashi: 2 } },
    { label: "濃厚スープで包みたい", weights: { miso: 1, shio_tonkotsu: 1 } },
    { label: "醤油でシャキッと", weights: { shoyu: 2 } },
  ]},
  { id: "q8", text: "今の気分に近いのは？", options: [
    { label: "落ち着いてじっくり", weights: { agodashi: 1, shoyu: 1 } },
    { label: "元気出したい！", weights: { miso: 1, shio_tonkotsu: 1 } },
    { label: "アゲていこう↑", weights: { umakara: 1 } },
  ]},
  { id: "q9", text: "一緒に飲むなら？", options: [
    { label: "ビール", weights: { shio_tonkotsu: 1, umakara: 1 } },
    { label: "焼酎/ハイボール", weights: { shoyu: 1, agodashi: 1 } },
    { label: "日本酒/ワイン", weights: { agodashi: 1, miso: 1 } },
    { label: "ノンアル", weights: { shoyu: 1 } },
  ]},
  { id: "q10", text: "寒さレベルは？", options: [
    { label: "常温。平気", weights: { shoyu: 1, agodashi: 1 } },
    { label: "ちょい寒い", weights: { miso: 1 } },
    { label: "凍える！🔥", weights: { shio_tonkotsu: 1, umakara: 1 } },
  ]},
];

const initialAnswers = () => QUESTIONS.map(() => null);

export default function App() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState(initialAnswers());
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);

  const result = useMemo(() => {
    if (!finished) return null;
    const scores = {};
    FLAVORS.forEach(f => scores[f.id] = 0);
    answers.forEach((idx, qi) => {
      if (idx == null) return;
      const opt = QUESTIONS[qi].options[idx];
      Object.entries(opt.weights).forEach(([id, w]) => { scores[id] = (scores[id] ?? 0) + w; });
    });
    const max = Math.max(...Object.values(scores));
    const tops = Object.entries(scores).filter(([,v]) => v===max).map(([k]) => k);
    const pickedId = tops[Math.floor(Math.random()*tops.length)];
    const picked = FLAVORS.find(f => f.id === pickedId);
    const leaderboard = Object.entries(scores)
      .sort((a,b)=>b[1]-a[1])
      .map(([id, v]) => ({ flavor: FLAVORS.find(f=>f.id===id), score: v }));
    return { picked, leaderboard };
  }, [finished, answers]);

  const reset = () => {
    setStarted(false); setFinished(false); setCurrent(0); setAnswers(initialAnswers());
  };

  // ★ 選択した瞬間に次へ進む（最終設問なら結果表示）
  const handleChoose = (optionIndex) => {
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);

    const isLast = current === QUESTIONS.length - 1;
    // ちょっとだけ触感が出るように100ms後に進む
    setTimeout(() => {
      if (isLast) setFinished(true);
      else setCurrent(c => c + 1);
    }, 100);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f7f7f7",
      padding: 16
    }}>
      <div style={{
        width: "100%",
        maxWidth: 720,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        padding: 20
      }}>
        {!started && !finished && (
          <>
            <h1 style={{ margin: 0, fontSize: 28 }}>AIもつ鍋診断</h1>
            <p style={{ color: "#555", marginTop: 6 }}>10の質問で、あなたに合う味をおすすめします。</p>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                onClick={()=>setStarted(true)}
                style={{
                  padding: "12px 20px",
                  fontSize: 16,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#111",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                スタート
              </button>
            </div>
          </>
        )}

        {started && !finished && (
          <>
            <div style={{display:"flex", justifyContent:"space-between", marginTop: 4}}>
              <div style={{fontWeight: 600}}>
                {current+1} / {QUESTIONS.length}
              </div>
              <div style={{fontSize:12, color:"#666"}}>クリックで次へ進みます</div>
            </div>
            <h2 style={{marginTop: 8, fontSize: 20}}>{QUESTIONS[current].text}</h2>
            <div style={{display: "grid", gap: 8, marginTop: 8}}>
              {QUESTIONS[current].options.map((o, idx)=>(
                <button key={idx} onClick={() => handleChoose(idx)} style={{
                  textAlign:"left",
                  padding:12,
                  border:"1px solid #e5e5e5",
                  borderRadius: 10,
                  background:"#fff",
                  cursor: "pointer"
                }}>
                  {o.label}
                </button>
              ))}
            </div>

            {/* 戻るだけ残す（任意） */}
            <div style={{display: "flex", gap: 8, marginTop: 12}}>
              <button onClick={()=>setCurrent(c=>Math.max(0,c-1))}
                disabled={current===0}
                style={{padding:"10px 16px", border:"1px solid #ddd", background:"#fff",
                        borderRadius:8, cursor: current===0 ? "not-allowed":"pointer"}}>
                戻る
              </button>
            </div>
          </>
        )}

        {finished && result && (
          <>
            <div style={{textAlign:"center", marginTop: 4}}>
              <div style={{fontSize: 14, color:"#16a34a", fontWeight:700}}>診断完了！</div>
              <h2 style={{fontSize: 26, margin: "6px 0 0"}}>オススメはこれでした！🍲</h2>
            </div>

            <div style={{border:"1px solid #eee", borderRadius:12, padding:16, marginTop:12}}>
              <div style={{fontSize: 20, fontWeight: 800, lineHeight:1.3}}>
                『{result.picked.name}』
              </div>
              <div style={{color:"#555", marginTop: 6}}>
                {result.picked.description}
              </div>
              <a href={result.picked.url} target="_blank" rel="noreferrer"
                 style={{display:"inline-block", marginTop:12, color:"#2563eb", fontWeight:600}}>
                商品ページを開く
              </a>
            </div>

            <h3 style={{marginTop: 16}}>他の候補（参考スコア）</h3>
            <ul style={{paddingLeft: 18, margin: 0}}>
              {result.leaderboard.slice(0,3).map(({flavor,score},i)=>(
                <li key={flavor.id} style={{marginTop: 4}}>{i+1}. {flavor.name}（{score}）</li>
              ))}
            </ul>

            <div style={{display:"flex", gap:8, marginTop: 14}}>
              <button onClick={reset}
                style={{padding:"10px 16px", border:"1px solid #ddd", background:"#fff", borderRadius:8, cursor:"pointer"}}>
                もう一度
              </button>
            </div>
          </>
        )}

        <div style={{marginTop: 16, fontSize: 12, color:"#666", textAlign:"center"}}>© Hakata Wakasugi / Demo</div>
      </div>
    </div>
  );
}
