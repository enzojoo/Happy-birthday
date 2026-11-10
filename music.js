// 오케스트라 편곡 "Happy Birthday to You" (곡 자체는 퍼블릭 도메인)
// 악기 샘플: FluidR3 GM soundfont (Frank Wen, CC BY 3.0) — gleitz/midi-js-soundfonts 에서 필요한 음만 sounds/ 에 담음
(function (root) {
  const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const M = n => {
    const m = /^([A-G])(#|b)?(-?\d)$/.exec(n);
    return 12 * (+m[3] + 1) + PC[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  };
  const NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const noteName = m => NAMES[m % 12] + (Math.floor(m / 12) - 1);

  // 구간별 템포: [[시작 박, BPM], ...] → 박을 초로 바꾸는 함수
  const TEMPO = [[0, 84], [11, 90], [36, 84], [38, 80], [57, 68], [60, 54]];
  function sec(b) {
    let t = 0;
    for (let i = 0; i < TEMPO.length; i++) {
      const [b0, bpm] = TEMPO[i], b1 = i + 1 < TEMPO.length ? TEMPO[i + 1][0] : Infinity;
      if (b <= b0) break;
      t += (Math.min(b, b1) - b0) * 60 / bpm;
    }
    return t;
  }
  const END_BEAT = 65;

  const MEL = [["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
               ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
               ["G4", .75], ["G4", .25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 1],
               ["F5", .75], ["F5", .25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3]];

  // C장조 기준 화음: 베이스 + 중간 음역 보이싱
  const CH = {
    C:   { bass: "C2", v: ["E3", "G3", "C4"] },
    G7:  { bass: "G2", v: ["F3", "B3", "D4"] },
    C7:  { bass: "C2", v: ["E3", "Bb3", "C4"] },
    F:   { bass: "F2", v: ["F3", "A3", "C4"] },
    Fm:  { bass: "F2", v: ["F3", "Ab3", "C4"] },
    C64: { bass: "G2", v: ["E3", "G3", "C4"] },
  };
  // 마디마다 박별 화음
  const BARS1 = [["C", "C", "C"], ["G7", "G7", "G7"], ["G7", "G7", "G7"], ["C", "C", "C"],
                 ["C", "C", "C7"], ["F", "F", "F"], ["C64", "C64", "G7"], ["C", "C", "C"]];
  const BARS2 = BARS1.map((b, i) => i === 5 ? ["F", "F", "Fm"] : b);
  const MAJOR = [0, 2, 4, 5, 7, 9, 11];

  function buildScore() {
    const ev = [], fx = [];
    const add = (inst, note, b, d, v) => ev.push({ inst, m: typeof note === "number" ? note : M(note), b, d, v });
    const gliss = (rootMidi, from, to, b, d, v) => { // 장음계 하프 글리산도
      const notes = [];
      for (let m = from; m <= to; m++) if (MAJOR.includes(((m - rootMidi) % 12 + 12) % 12)) notes.push(m);
      notes.forEach((m, i) => add("orchestral_harp", m, b + d * i / notes.length, 1.5, v));
    };

    // ---------- 인트로 (0~11박): 팀파니 롤 → 팡파르 ----------
    for (let b = 0; b < 6; b += 1 / 6) add("timpani", "G2", b, .3, .12 + .6 * b / 6);
    fx.push({ type: "swell", b: 1.5, e: 6, v: .35 });
    fx.push({ type: "crash", b: 6, v: .45 });
    add("timpani", "C2", 6, 2, 1);
    add("contrabass", "C2", 6, 3, .8); add("cello", "C3", 6, 3, .6); add("trombone", "C3", 6, 3, .6);
    ["C4", "E4", "G4"].forEach(n => add("brass_section", n, 6, 3, .7));
    ["E3", "G3", "C4"].forEach(n => add("french_horn", n, 6, 3, .5));
    ["C4", "E4", "G4", "C5"].forEach(n => add("string_ensemble_1", n, 6, 3, .5));
    [["G4", 6, .33], ["C5", 6.33, .33], ["E5", 6.66, .34], ["G5", 7, 2]].forEach(([n, b, d]) => add("trumpet", n, b, d, .8));
    add("contrabass", "G2", 9, 2, .7); add("timpani", "G2", 9, 1, .7);
    ["F3", "B3", "D4"].forEach(n => add("brass_section", n, 9, 2, .55));
    ["G3", "B3", "D4", "F4"].forEach(n => add("string_ensemble_1", n, 9, 2, .45));
    gliss(M("C4"), M("G3"), M("G5"), 9.5, 1.2, .35);

    // ---------- 1절·2절 ----------
    function verse(P, tr, BARS, full) {
      let b = P;
      MEL.forEach(([n, d], i) => {
        const dd = i === MEL.length - 1 && full ? 5 : d, m = M(n) + tr;
        if (full) {
          add("trumpet", m, b, dd, .75);
          add("string_ensemble_1", m, b, dd, .55);
          add("string_ensemble_1", m + 12, b, dd, .4);
          if (d >= 1) add("glockenspiel", m + 12, b, 1, .35);
        } else {
          add("string_ensemble_1", m, b, dd, .7);
          add("french_horn", m - 12, b, dd, .4);
        }
        b += d;
      });

      BARS.forEach((bar, i) => {
        const s = P + 1 + i * 3, last = i === BARS.length - 1;
        const at = k => {
          const ch = CH[bar[k]];
          return { bass: M(ch.bass) + tr, vo: ch.v.map(n => M(n) + tr) };
        };
        // 같은 화음이 이어지는 박은 하나로 묶어서 길게
        const segs = [];
        bar.forEach((c, k) => { if (k && bar[k - 1] === c) segs[segs.length - 1].len++; else segs.push({ k, len: 1 }); });
        if (last && full) segs[segs.length - 1].len += 2;

        segs.forEach(({ k, len }) => {
          const { bass, vo } = at(k), t = s + k;
          const newBass = k === 0 || CH[bar[k - 1]].bass !== CH[bar[k]].bass;
          if (newBass) {
            add("contrabass", bass, t, len, full ? .85 : .65);
            add("cello", bass + 12, t, len, full ? .55 : .45);
            if (full) add("trombone", bass + 12, t, last ? len : 1, .5);
          }
          vo.forEach(n => add("choir_aahs", n + 12, t, len, full ? .4 : .2));
          if (full) {
            if (last) vo.forEach(n => add("brass_section", n, t, len, .6));
            else for (let j = 0; j < len; j++) vo.forEach(n => add("brass_section", n, t + j, j === 0 && k === 0 ? 1 : .7, j === 0 && k === 0 ? .55 : .4));
          }
        });

        // 하프: 8분음표 아르페지오
        if (!(last && full)) {
          for (let j = 0; j < 6; j++) {
            const { bass, vo } = at(Math.floor(j / 2));
            const pool = [bass + 12, ...vo.map(n => n + 12)];
            add("orchestral_harp", pool[[0, 1, 2, 3, 2, 1][j]], s + j * .5, 1, full ? .3 : .38);
          }
        }

        // 팀파니
        const root = at(0).bass;
        if (full && !last) {
          add("timpani", root, s, 1, .75);
          if (i % 2 === 0) add("timpani", root + 7 > M("A2") ? root - 5 : root + 7, s + 2, 1, .4);
        } else if (!full && (i === 0 || i === 4 || last)) add("timpani", root, s, 1, .5);

        if (last && full) { // 마지막 화음: 팀파니 롤 + 크래시 + 하프 글리산도
          for (let r = 0; r < 4.5; r += 1 / 6) add("timpani", root, s + r, .3, .25 + .55 * r / 4.5);
          add("timpani", root, s + 4.5, 2, 1);
          fx.push({ type: "crash", b: s, v: .55 });
          fx.push({ type: "crash", b: s + 4.5, v: .4 });
          gliss(M("C3") + tr, M("C3") + tr, M("C6") + tr, s, 1.5, .35);
        }
      });
    }

    verse(11, 0, BARS1, false); // 1절 C장조 (11박 못갖춘마디 → 12박부터 8마디)

    // ---------- 전조 (36~38박): A7 로 끌어올려 D장조로 ----------
    for (let b = 36; b < 39; b += 1 / 6) add("timpani", "A2", b, .3, .2 + .55 * (b - 36) / 3);
    ["G3", "Db4", "E4", "A4"].forEach(n => add("brass_section", n, 36, 2, .55));
    ["A3", "Db4", "E4", "G4"].forEach(n => add("string_ensemble_1", n, 36, 2, .5));
    add("contrabass", "A2", 36, 2, .75);
    fx.push({ type: "swell", b: 36, e: 39, v: .4 });
    fx.push({ type: "crash", b: 39, v: .5 });

    verse(38, 2, BARS2, true); // 2절 D장조 풀 오케스트라

    // 전조부터는 한층 크게: 1절보다 확실히 웅장하게 들리도록 세기를 올림
    ev.forEach(e => { if (e.b >= 36) e.v = Math.min(1, e.v * 1.45); });
    fx.forEach(f => { if (f.b >= 36) f.v *= 1.3; });

    return { ev, fx };
  }

  // ---------------- 재생 엔진 ----------------
  const VOL = { string_ensemble_1: .55, trumpet: .5, french_horn: .55, brass_section: .45, trombone: .5, timpani: .9,
                contrabass: .75, cello: .5, choir_aahs: .4, orchestral_harp: .5, glockenspiel: .3 };
  const SUSTAIN = new Set(["string_ensemble_1", "choir_aahs", "brass_section", "french_horn", "trumpet", "trombone", "cello", "contrabass"]);

  function createPlayer(base) {
    const score = buildScore();
    const LOOP = sec(END_BEAT) + 4;
    let ac, bus, buffers = new Map(), ready = null, started = false, on = false, nextStart = 0, watcher = null, noise;

    function init() {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      const master = ac.createGain(); master.gain.value = .85;
      bus = ac.createGain();
      const verb = ac.createConvolver(), wet = ac.createGain();
      verb.buffer = impulse(2.8); wet.gain.value = .32;
      bus.connect(comp); bus.connect(verb).connect(wet).connect(comp);
      comp.connect(master).connect(ac.destination);
      noise = ac.createBuffer(1, ac.sampleRate * 3, ac.sampleRate);
      const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    function impulse(len) { // 콘서트홀 잔향
      const n = ac.sampleRate * len, buf = ac.createBuffer(2, n, ac.sampleRate);
      for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3; }
      return buf;
    }
    function preload() {
      if (ready) return ready;
      if (!ac) init();
      const keys = [...new Set(score.ev.map(e => e.inst + "/" + noteName(e.m)))];
      ready = Promise.all(keys.map(k => fetch(base + k + ".mp3")
        .then(r => r.arrayBuffer())
        .then(a => new Promise((res, rej) => ac.decodeAudioData(a, res, rej)))
        .then(buf => buffers.set(k, buf))
        .catch(() => {})));
      return ready;
    }
    function note(e, when, dur) {
      const buf = buffers.get(e.inst + "/" + noteName(e.m)); if (!buf) return;
      const src = ac.createBufferSource(), g = ac.createGain();
      src.buffer = buf;
      const peak = e.v * VOL[e.inst], sus = SUSTAIN.has(e.inst), att = sus ? .05 : .005;
      g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(peak, when + att);
      let end = when + buf.duration;
      if (sus) {
        if (dur > buf.duration - .6) { src.loop = true; src.loopStart = .9; src.loopEnd = buf.duration - .5; }
        g.gain.setValueAtTime(peak, when + Math.max(att, dur));
        g.gain.linearRampToValueAtTime(0, when + dur + .4);
        end = when + dur + .4;
      }
      src.connect(g).connect(bus); src.start(when); src.stop(end + .05);
    }
    function cymbal(f, t0) {
      const src = ac.createBufferSource(), hp = ac.createBiquadFilter(), g = ac.createGain();
      src.buffer = noise; hp.type = "highpass"; hp.frequency.value = 3500;
      if (f.type === "crash") {
        g.gain.setValueAtTime(f.v, t0 + sec(f.b));
        g.gain.exponentialRampToValueAtTime(.001, t0 + sec(f.b) + 2.8);
        src.start(t0 + sec(f.b)); src.stop(t0 + sec(f.b) + 2.9);
      } else {
        g.gain.setValueAtTime(.001, t0 + sec(f.b));
        g.gain.exponentialRampToValueAtTime(f.v, t0 + sec(f.e));
        src.loop = true; src.start(t0 + sec(f.b)); src.stop(t0 + sec(f.e));
      }
      src.connect(hp).connect(g).connect(bus);
    }
    function schedule(t0) {
      score.ev.forEach(e => note(e, t0 + sec(e.b), sec(e.b + e.d) - sec(e.b)));
      score.fx.forEach(f => cymbal(f, t0));
    }
    return {
      preload,
      start() {
        if (!ac) init();
        ac.resume(); on = true;
        if (started) return;
        started = true;
        preload().then(() => {
          nextStart = ac.currentTime + .1;
          schedule(nextStart); nextStart += LOOP;
          watcher = setInterval(() => { // 끝나면 처음부터 다시 연주
            if (ac.currentTime > nextStart - 2) { schedule(nextStart); nextStart += LOOP; }
          }, 500);
        });
      },
      stop() { on = false; if (ac) ac.suspend(); },
      get on() { return on; },
    };
  }

  if (typeof module !== "undefined") module.exports = { buildScore, noteName, sec, END_BEAT };
  else root.createOrchestra = createPlayer;
})(this);
