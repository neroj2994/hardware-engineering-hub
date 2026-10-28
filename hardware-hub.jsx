import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import {
  Cpu, Send, ImagePlus, X, Zap, Activity, Ruler, CircuitBoard,
  Waves, Timer, Lightbulb, Sigma, Gauge, Layers, Calculator, Trash2, Cable, FileText, Sun, Moon, Search, Star, Copy, Check, RotateCcw, Maximize2, Info, Network
} from "lucide-react";

const APP_VERSION = "1.0.0";

/* ============================================================
   HARDWARE ENGINEERING HUB
   - AI Chat: hardware-only expert (text + image queries)
   - Calculators: SI, power, PCB design toolset
   Design: PCB soldermask green + copper trace accent
   ============================================================ */

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
.hw-display { font-family: 'Space Grotesk', sans-serif; }
.hw-mono { font-family: 'IBM Plex Mono', monospace; }
.hw-scroll::-webkit-scrollbar { width: 6px; }
.hw-scroll::-webkit-scrollbar-thumb { background: var(--bd); border-radius: 3px; }
.hw-scroll::-webkit-scrollbar-track { background: transparent; }
@keyframes pulse-dot { 0%,100% { opacity: .3 } 50% { opacity: 1 } }
.typing-dot { animation: pulse-dot 1.2s infinite; }
:root,[data-theme='dark']{--bg:#05070e;--bg2:#0a0e18;--card:rgba(22,28,43,0.62);--card2:rgba(28,35,53,0.55);--card-solid:#141a28;--panel:rgba(14,19,32,0.66);--chip:rgba(33,42,64,0.6);--icontile:rgba(40,50,78,0.55);--btnsoft:rgba(38,48,74,0.5);--bd7:#222c42;--bd:#33405e;--bd2:#283350;--bd3:#222c42;--bd4:#283350;--bd5:#2c3852;--inputbd:#33405e;--bd6:#222c42;--divider:#26314a;--fg:#f2f5fd;--fg2:#b9c3d8;--ok:#34d399;--fg3:#a3aec6;--muted:#8d9bb5;--muted2:#8593ad;--label:#7886a2;--muted3:#828fa9;--muted4:#828fa9;--muted5:#76839f;--muted6:#657290;--muted7:#5a6783;--fg4:#ccd5e6;--fg5:#dee5f1;--fg6:#a3aec6;--accent:#8b95ff;--accent2:#6d72f5;--accent3:#2dd9ee;--onaccent:#06080f;--warn:#fbbf24;--danger:#fb7185;--info:#38bdf8;--dln:#566587;}[data-theme='light']{--bg:#eef2f9;--bg2:#ffffff;--card:rgba(255,255,255,0.72);--card2:rgba(248,250,253,0.7);--card-solid:#ffffff;--panel:rgba(252,253,255,0.75);--chip:rgba(232,238,250,0.8);--icontile:rgba(233,237,254,0.85);--btnsoft:rgba(233,237,254,0.7);--bd7:#dfe6f1;--bd:#cfd9e9;--bd2:#dbe3f0;--bd3:#e1e9f4;--bd4:#dfe6f1;--bd5:#e4ebf5;--inputbd:#cfd9e9;--bd6:#e1e9f4;--divider:#e1e9f4;--fg:#0c1322;--fg2:#3d475f;--ok:#047857;--fg3:#505b75;--muted:#5f6f8c;--muted2:#627290;--muted3:#6a7894;--muted4:#6a7894;--muted5:#7886a2;--muted6:#8b98b3;--muted7:#a0acc4;--fg4:#2b3850;--fg5:#1e2c45;--fg6:#505b75;--accent:#4338ca;--accent2:#5b54e8;--accent3:#0e7490;--onaccent:#ffffff;--warn:#c2680a;--danger:#dc2626;--info:#0369a1;--dln:#8b98b3;}[data-theme='dark']{--header-bg:rgba(8,11,20,0.72);--diag-plane:#3a4663;--diag-diel:rgba(129,140,248,0.07);--diag-dielbd:#222b3d;--tab-active:linear-gradient(180deg, rgba(129,140,248,0.06) 0%, rgba(129,140,248,0.16) 100%);--formula-bg:#0b0f1a;--formula-bd:#222b3d;--formula-fg:#c4cde0;}[data-theme='light']{--header-bg:rgba(255,255,255,0.72);--diag-plane:#c5d2e8;--diag-diel:rgba(79,70,229,0.06);--diag-dielbd:#dbe3f0;--tab-active:linear-gradient(180deg, rgba(79,70,229,0.04) 0%, rgba(79,70,229,0.10) 100%);--formula-bg:#f7f9fd;--formula-bd:#e3e8f1;--formula-fg:#33405c;}
/* ---- instrument-glass depth, glow & motion ---- */
[data-theme='dark'] {
  --shadow: 0 1px 0 rgba(255,255,255,.05) inset, 0 2px 8px rgba(0,0,0,.4), 0 8px 28px rgba(0,0,0,.38);
  --shadow-hi: 0 1px 0 rgba(255,255,255,.08) inset, 0 20px 56px rgba(0,0,0,.55), 0 0 0 1px rgba(139,149,255,.18);
  --glow: 0 0 0 1px rgba(139,149,255,.3), 0 8px 32px rgba(109,114,245,.28);
  --glass-blur: blur(20px) saturate(1.6);
  --edge: linear-gradient(180deg, rgba(255,255,255,.1), rgba(255,255,255,0) 40%);
}
[data-theme='light'] {
  --shadow: 0 1px 0 rgba(255,255,255,.7) inset, 0 1px 2px rgba(15,30,60,.05), 0 6px 22px rgba(15,30,60,.07);
  --shadow-hi: 0 1px 0 rgba(255,255,255,.9) inset, 0 14px 40px rgba(15,30,60,.14), 0 0 0 1px rgba(67,56,202,.12);
  --glow: 0 0 0 1px rgba(67,56,202,.16), 0 10px 30px rgba(67,56,202,.14);
  --glass-blur: blur(20px) saturate(1.3);
  --edge: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,0) 45%);
}
/* every card is glass: translucent, blurred, with a light-catching top edge */
.card3d {
  position: relative;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  box-shadow: var(--shadow);
  transition: transform .25s cubic-bezier(.2,.7,.3,1), box-shadow .25s ease, border-color .25s ease;
  will-change: transform;
}
.card3d::before {
  content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background: var(--edge); opacity:.6; mix-blend-mode: screen;
}
[data-theme='light'] .card3d::before { mix-blend-mode: normal; }
.card3d:hover { transform: translateY(-4px); box-shadow: var(--shadow-hi); border-color: var(--accent) !important; }
.accent-grad { background: linear-gradient(135deg, var(--accent3) 0%, var(--accent) 45%, var(--accent2) 100%); }
.accent-text { background: linear-gradient(120deg, var(--accent3), var(--accent)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.glow-accent { box-shadow: var(--glow); }
.glass { backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur); }
[data-theme='dark'] { --glass-bg: rgba(12,16,26,0.6); --note-bg: rgba(139,149,255,0.08); --note-bd: rgba(139,149,255,0.18); --note-fg: #b9c3d8; --note-pop: rgba(14,19,32,0.92); }
[data-theme='light'] { --glass-bg: rgba(255,255,255,0.62); --note-bg: rgba(67,56,202,0.05); --note-bd: rgba(67,56,202,0.14); --note-fg: #505b75; --note-pop: rgba(255,255,255,0.96); }
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.8s linear infinite; }
.sheen { position: relative; overflow: hidden; }
.sheen::after { content:''; position:absolute; inset:0; background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,.12) 50%, transparent 70%); transform: translateX(-120%); transition: transform .6s ease; pointer-events:none; }
.sheen:hover::after { transform: translateX(120%); }
.btn-primary { background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%); color:#fff; box-shadow: 0 4px 14px rgba(109,114,245,.4); }
.btn-primary:hover { box-shadow: 0 6px 22px rgba(109,114,245,.55); transform: translateY(-1px); }
.tab-ind { transition: color .2s ease, background .2s ease; }
@keyframes fadeUp { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:none; } }
.fade-up { animation: fadeUp .4s cubic-bezier(.2,.7,.3,1) both; }
@media (prefers-reduced-motion: reduce) { .fade-up, .animate-spin, .sheen::after { animation: none !important; transition: none !important; } }
.ring-focus:focus-within { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 28%, transparent); border-color: var(--accent) !important; }
`;

/* ---- Learn / notes system: notes are optional. Default = hover to read.
   A header toggle switches to "always show" for users who want to learn. ---- */
const LearnContext = createContext({ mode: "hover", setMode: () => {} });

function InfoNote({ text, className = "" }) {
  const { mode } = useContext(LearnContext);
  const [open, setOpen] = useState(false);
  if (!text) return null;
  if (mode === "always") {
    return (
      <div className={"mt-3 rounded-lg px-3 py-2 fade-up " + className}
        style={{ background: "var(--note-bg)", border: "1px solid var(--note-bd)" }}>
        <div className="flex items-start gap-2">
          <Info size={12} style={{ color: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--note-fg)" }}>{text}</p>
        </div>
      </div>
    );
  }
  // hover/click mode: small "learn" affordance that reveals the note
  return (
    <div className={"mt-3 relative " + className}>
      <button onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="hw-mono text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded-md transition-all sheen"
        style={{ background: "var(--note-bg)", border: "1px solid var(--note-bd)", color: "var(--accent)" }}>
        <Info size={11} /> learn
      </button>
      {open && (
        <div className="absolute z-20 left-0 right-0 mt-1.5 rounded-lg px-3 py-2 fade-up glass"
          style={{ background: "var(--note-pop)", border: "1px solid var(--note-bd)", boxShadow: "var(--shadow-hi)" }}
          onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--note-fg)" }}>{text}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- PCB trace header motif (signature element) ---------- */
const TraceMotif = () => (
  <svg viewBox="0 0 600 60" className="w-full h-10 opacity-70" preserveAspectRatio="none">
    <g stroke="var(--accent2)" strokeWidth="1.5" fill="none">
      <path d="M0 30 H120 L150 12 H260 L290 30 H600" />
      <path d="M0 45 H90 L120 52 H340 L370 38 H600" />
      <path d="M0 14 H200 L230 22 H430 L460 8 H600" />
    </g>
    <g fill={DGC.node} stroke="var(--accent)" strokeWidth="1.5">
      <circle cx="120" cy="30" r="4" /><circle cx="290" cy="30" r="4" />
      <circle cx="340" cy="52" r="4" /><circle cx="230" cy="22" r="4" />
      <circle cx="460" cy="8" r="4" /><circle cx="90" cy="45" r="4" />
    </g>
  </svg>
);

/* ============================================================
   CALCULATOR ENGINE
   ============================================================ */
const num = (v) => { const n = parseFloat(v); return isNaN(n) ? null : n; };
const fmt = (v, d = 3) => {
  if (v === null || !isFinite(v)) return "—";
  if (Math.abs(v) >= 1e6 || (Math.abs(v) < 1e-3 && v !== 0)) return v.toExponential(3);
  return parseFloat(v.toFixed(d)).toString();
};

const FORMULAS = {"microstrip": "Z₀ = 87/√(εr+1.41) · ln(5.98h / (0.8w+t))   ·   tpd = 85·√(0.475εr+0.67) ps/in", "stripline": "Z₀ = 60/√εr · ln(1.9b / (0.8w+t))   ·   tpd = 85·√εr ps/in", "diffpair": "Z_diff = 2·Z₀·(1 − 0.48·e^(−0.96·s/h))",
"diffpairstrip": "Z₀ = 60/√εr · ln(1.9b/(0.8w+t))   ·   Z_diff = 2·Z₀·(1 − 0.347·e^(−2.9·s/b))", "tracewidth": "A = (I / (k·ΔT^0.44))^(1/0.725)   ;   w = A / (1.378·t_oz)   ·   k = 0.048 ext / 0.024 int", "viacurrent": "A = π·(d+p)·p   ;   I = 0.024·ΔT^0.44·A^0.725", "traceres": "R = ρ·L / (w·t)   ·   ρ(T) = 1.68e−8·(1+0.00393·(T−20))   ;   V = I·R ,  P = I²·R", "lengthmatch": "L_crit = tr / (2·tpd)   ;   delay = length · tpd   (terminate if length > L_crit)", "rcfilter": "τ = R·C   ;   fc = 1 / (2π·R·C)   ;   t_rise(10–90%) = 2.2·R·C", "capreact": "Xc = 1/(2π·f·C)   ·   XL = 2π·f·ESL   ·   SRF = 1/(2π·√(ESL·C))", "divider": "Vout = Vin · R2/(R1+R2)   ·   R_th = R1·R2/(R1+R2)", "ledres": "R = (Vs − Vf) / I   ·   P = (Vs − Vf)·I", "ohms": "V = I·R   ·   P = V·I = I²·R = V²/R", "wavelength": "λ = c / (f·√εr)   ·   c = 299.79 mm/ns   (max stub ≈ λ/20)", "pullup": "R_min = (Vcc−VOL)/IOL   ·   R_max = tr / (0.8473·Cb)", "logicpullup": "R_max = (Vcc−VIH)/I_leak   ·   V_node = Vcc − I_leak·R   ·   tr = 2.2·R·C", "trbw": "BW = 0.35 / tr   ·   f_knee = 0.5 / tr   ·   tr_meas = √(tr_sig² + tr_scope²)", "edgedeg": "tr_RC = 2.2·R·C   ·   tr_total = √(tr_drv² + tr_RC²)   ·   BW = 0.35/tr_total", "seriesterm": "Rs = Z₀ − R_driver   (place within ~200 mil of driver)", "crosstalk": "k_b = 0.25 / (1 + (D/H)²)   ·   D = s+w   ·   L_sat = tr·v/2   ·   noise = k·V_agg", "ztarget": "Z_target = (Vrail·ripple%) / (Imax·step%)   ·   f_knee = 0.35 / t_rise", "capcount": "Z_cap = √(ESR² + (2π·f·ESL − 1/(2π·f·C))²)   ·   N = ⌈Z_cap / Z_target⌉", "noisecap": "C = 1 / ((2π·f)²·ESL)   →  cap whose SRF lands on the noise frequency", "bulkcap": "C_bulk = ΔI·t_response / ΔV   ·   ESR_max = ΔV / ΔI", "buckl": "D = Vout/Vin   ·   L = (Vin−Vout)·D / (fsw·ΔI)   ·   I_pk = Iout + ΔI/2   ·   I_rms = √(Iout² + ΔI²/12)", "cuarea": "θ ≈ 70/√A °C/W   →   A = (70·k·P / ΔT)²   (1 oz, still air)", "ldo": "Pd = (Vin−Vout)·I   ·   Tj = Ta + Pd·θja   ·   η = Vout/Vin", "lcfilter": "fc = 1/(2π·√(L·C))   ·   Z₀ = √(L/C)   ·   atten = 40·log(fsw/fc) dB", "serpar": "Series: R = ΣRn   ·   Parallel: 1/R = Σ(1/Rn)", "idivider": "I1 = It · R2/(R1+R2)   ·   I2 = It · R1/(R1+R2)", "capenergy": "Q = C·V   ·   E = ½·C·V²", "captime": "t = −R·C·ln(1 − Vt/Vs)   ·   5τ ≈ 99 %", "inductor": "XL = 2π·f·L   ·   E = ½·L·I²   ·   V_spike = L·di/dt", "opamp": "Non-inv: G = 1 + Rf/Rin   ·   Inv: G = −Rf/Rin   ·   usable BW ≈ GBW/G", "timer555": "f = 1.44 / ((R1+2R2)·C)   ·   duty = (R1+R2)/(R1+2R2)", "zener": "Rs = (Vin−Vz)/(IL+Iz)   ·   Pz(max) = Vz·(IL+Iz)  [load removed]", "dbconv": "dB(V) = 20·log₁₀(ratio)   ·   dB(P) = 10·log₁₀(ratio)", "freqperiod": "T = 1/f   ·   λ = c/f   ·   λ_PCB = λ_air/√εr", "battery": "runtime = (capacity · usable%) / I_avg", "awg": "d(mm) = 0.127·92^((36−AWG)/39)   ·   R = ρ·L/A   ·   I_max ≈ 3–7 A/mm²", "unitconv": "1 mil = 25.4 µm = 0.0254 mm   ·   1 oz Cu = 35 µm = 1.378 mil", "skindepth": "δ = √(ρ/(π·f·µ))   ·   R_ac ≈ ρ/(perimeter·δ)   ·   rises with √f", "reflection": "Γ = (Z_L − Z₀)/(Z_L + Z₀)   ·   VSWR = (1+|Γ|)/(1−|Γ|)   ·   RL = −20·log₁₀|Γ|", "tjunction": "L_stub,max = (k·tr)/tpd   ·   tpd = 85·√(0.475εr+0.67) ps/in", "planecap": "C = ε₀·εr·A/d   ·   ε₀ = 8.854 pF/m", "thermalvia": "θ_via = h/(k_cu·π·d·t_plating)   ·   θ_array = θ_via / N", "rmscurrent": "square: I·√D   ·   triangle: I·√(D/3)   ·   trap: √(D·(I_avg²+ΔI²/12))", "ibisslew": "f_knee = 0.5/tr   ·   BW = 0.35/tr   ·   Nyquist = datarate/2", "powerloss": "R = ρ(T)·L/(w·t)   ·   V = I·R   ·   P = I²·R", "antipad": "Z ≈ 60/√εr · ln(antipad/via)   ·   C_via = 2π·ε₀·εr·h/ln(antipad/via)", "cdcmtbf": "MTBF = e^(t_met/τ) / (W · f_clk · f_data)   →   each sync FF adds one period to t_met", "timingslack": "setup = T − Tco − Tpd − Tsu + skew   ·   hold = Tco + Tpd(min) − Th − skew   ·   Fmax = 1/(Tco+Tpd+Tsu)", "pllsolve": "f_out = f_in · M / (N · D)   with   VCO = f_in·M/N inside [VCOmin, VCOmax]", "fpgapower": "P = α · C · V² · f   ·   E_toggle = C·V²", "configtime": "t = bits / (f_cfg · width)   ·   flash ≥ bits/8, next 2ⁿ MB", "lvds": "I = Vod / R_term   ·   V± = Vcm ± Vod/2   ·   P_term = Vod²/R", "packetrate": "pps = rate / ((frame + 8 + 12) · 8)   ·   64B @ 10G = 14.88 Mpps", "oversub": "ratio = Σ(down ports · speed) / Σ(up ports · speed)   ·   capacity = 2·Σports (duplex)", "poe": "af: 15.4/12.95 W · at: 30/25.5 W · bt: 60/51, 90/71.3 W (PSE/PD)", "optical": "margin = (Ptx_min − Rx_sens) − (km·dB/km + 0.5·conn + 0.1·splice)   ·   keep ≥ 3 dB", "swlatency": "t_ser = bytes·8/rate   ·   S&F = t_ser + t_fabric   ·   cut-through ≈ t_hdr + t_fabric", "bertime": "N_bits = −ln(1−CL)/BER ≈ 3/BER @95%   ·   t = N/rate", "airflow": "CFM ≈ 1.76 · P(W) / ΔT(°C)   ·   1 CFM = 1.699 m³/h"};

/* ============================================================
   DYNAMIC DIAGRAMS — one live SVG per calculator
   Receives the current parsed inputs, so geometry, labels and
   curves update as the user types.
   ============================================================ */
const DGC = { ln: "var(--dln)", cu: "var(--accent)", dim: "var(--fg2)", mut: "var(--muted3)", hot: "var(--warn)", ok: "var(--ok)", bg: "var(--bg2)", plane: "var(--diag-plane)", diel: "var(--diag-diel)", dielbd: "var(--diag-dielbd)", node: "var(--card2)" };
const sv = (x, d) => (x === null || x === undefined || isNaN(x) || x <= 0 ? d : x);
const DSvg = ({ children, h = 110 }) => (
  <svg viewBox={`0 0 300 ${h}`} className="w-full h-auto block">{children}</svg>
);
const DTxt = ({ x, y, c = DGC.dim, s = 8, a = "middle", children }) => (
  <text x={x} y={y} fontSize={s} fill={c} textAnchor={a} fontFamily="'IBM Plex Mono',monospace">{children}</text>
);
/* schematic primitives */
const Res = ({ x, y, w = 34, label, vert = false }) => vert ? (
  <g><rect x={x - 7} y={y} width={14} height={w} rx={3} fill="none" stroke={DGC.cu} strokeWidth="1.5" />
    {label && <DTxt x={x + 22} y={y + w / 2 + 3} a="start" c={DGC.cu}>{label}</DTxt>}</g>
) : (
  <g><rect x={x} y={y - 7} width={w} height={14} rx={3} fill="none" stroke={DGC.cu} strokeWidth="1.5" />
    {label && <DTxt x={x + w / 2} y={y - 12} c={DGC.cu}>{label}</DTxt>}</g>
);
const Cap = ({ x, y, label, vert = true }) => vert ? (
  <g><line x1={x - 9} y1={y} x2={x + 9} y2={y} stroke={DGC.cu} strokeWidth="2" />
    <line x1={x - 9} y1={y + 6} x2={x + 9} y2={y + 6} stroke={DGC.cu} strokeWidth="2" />
    {label && <DTxt x={x + 14} y={y + 6} a="start" c={DGC.cu}>{label}</DTxt>}</g>
) : null;
const Gnd = ({ x, y }) => (
  <g stroke={DGC.ln} strokeWidth="1.5">
    <line x1={x} y1={y} x2={x} y2={y + 6} /><line x1={x - 8} y1={y + 6} x2={x + 8} y2={y + 6} />
    <line x1={x - 5} y1={y + 10} x2={x + 5} y2={y + 10} /><line x1={x - 2} y1={y + 14} x2={x + 2} y2={y + 14} />
  </g>
);
const W = ({ d }) => <path d={d} fill="none" stroke={DGC.ln} strokeWidth="1.5" />;
const Dot = ({ x, y }) => <circle cx={x} cy={y} r={2.5} fill={DGC.ln} />;
const Ind = ({ x, y, label }) => (
  <g><path d={`M${x} ${y} a6 6 0 0 1 12 0 a6 6 0 0 1 12 0 a6 6 0 0 1 12 0`} fill="none" stroke={DGC.cu} strokeWidth="1.8" />
    {label && <DTxt x={x + 18} y={y - 10} c={DGC.cu}>{label}</DTxt>}</g>
);

/* --- microstrip / stripline / diff cross-sections --- */
const xsec = (v, mode) => {
  const w = Math.min(70, Math.max(14, sv(v.w, 5) * 7));
  const h = Math.min(34, Math.max(8, sv(v.h ?? v.b, 4) * 5));
  const s = Math.min(60, Math.max(8, sv(v.s, 7) * 5));
  const yTr = mode === "strip" ? 55 : 78 - h;
  return (
    <DSvg>
      {mode !== "strip" && <DTxt x={150} y={14} c={DGC.mut}>cross-section (live: w, h scale with inputs)</DTxt>}
      {mode === "strip" && <rect x={30} y={26} width={240} height={6} fill={DGC.plane} rx={1} />}
      <rect x={30} y={84} width={240} height={6} fill={DGC.plane} rx={1} />
      <rect x={30} y={mode === "strip" ? 32 : 84 - h - 6} width={240} height={mode === "strip" ? 52 : h + 6} fill={DGC.diel} stroke={DGC.dielbd} strokeWidth="1" />
      {mode === "diff" ? (
        <g>
          <rect x={150 - s / 2 - w} y={yTr} width={w} height={6} fill={DGC.cu} />
          <rect x={150 + s / 2} y={yTr} width={w} height={6} fill={DGC.cu} />
          <W d={`M${150 - s / 2} ${yTr - 8} L${150 + s / 2} ${yTr - 8}`} />
          <DTxt x={150} y={yTr - 12}>s = {fmt(sv(v.s, 7), 1)} mil</DTxt>
        </g>
      ) : (
        <g>
          <rect x={150 - w / 2} y={yTr} width={w} height={6} fill={DGC.cu} />
          <DTxt x={150} y={yTr - 6} c={DGC.cu}>w = {fmt(sv(v.w, 5), 1)} mil</DTxt>
        </g>
      )}
      <W d={`M278 ${yTr + 6} L278 84`} />
      <DTxt x={283} y={(yTr + 90) / 2 + 3} a="start">h={fmt(sv(v.h ?? v.b, 4), 1)}</DTxt>
      <DTxt x={150} y={102} c={DGC.mut}>εr = {fmt(sv(v.er, 4.2), 2)}{mode === "strip" ? " · stripline (plane–trace–plane)" : " · reference plane below"}</DTxt>
    </DSvg>
  );
};

/* stripline differential pair cross-section: two traces centered between two planes */
const xsecDiffStrip = (v) => {
  const w = Math.min(60, Math.max(12, sv(v.w, 4) * 7));
  const b = Math.min(46, Math.max(16, sv(v.b, 12) * 3));
  const s = Math.min(50, Math.max(8, sv(v.s, 6) * 5));
  const midY = 55;
  return (
    <DSvg>
      <DTxt x={150} y={13} c={DGC.mut}>stripline diff pair (live: w, b, s scale)</DTxt>
      {/* top + bottom reference planes */}
      <rect x={30} y={midY - b / 2 - 4} width={240} height={4} fill={DGC.plane} rx={1} />
      <rect x={30} y={midY + b / 2} width={240} height={4} fill={DGC.plane} rx={1} />
      {/* dielectric fill */}
      <rect x={30} y={midY - b / 2} width={240} height={b} fill={DGC.diel} stroke={DGC.dielbd} strokeWidth="1" />
      {/* the two traces, centered */}
      <rect x={150 - s / 2 - w} y={midY - 3} width={w} height={6} fill={DGC.cu} />
      <rect x={150 + s / 2} y={midY - 3} width={w} height={6} fill={DGC.cu} />
      {/* spacing dim */}
      <W d={`M${150 - s / 2} ${midY - 14} L${150 + s / 2} ${midY - 14}`} />
      <DTxt x={150} y={midY - 18}>s = {fmt(sv(v.s, 6), 1)} mil</DTxt>
      {/* width label */}
      <DTxt x={150 - s / 2 - w / 2} y={midY + 16} c={DGC.cu} s={7}>w={fmt(sv(v.w, 4), 1)}</DTxt>
      {/* plane-to-plane dim */}
      <W d={`M278 ${midY - b / 2} L278 ${midY + b / 2}`} />
      <DTxt x={283} y={midY + 3} a="start">b={fmt(sv(v.b, 12), 0)}</DTxt>
      <DTxt x={70} y={midY - b / 2 - 8} c={DGC.dim} s={7}>GND plane</DTxt>
      <DTxt x={70} y={midY + b / 2 + 14} c={DGC.dim} s={7}>GND plane</DTxt>
      <DTxt x={150} y={102} c={DGC.mut}>εr = {fmt(sv(v.er, 4.2), 2)} · shielded between planes (low EMI)</DTxt>
    </DSvg>
  );
};

const DIAGRAMS = {
  microstrip: (v) => xsec(v, "micro"),
  stripline: (v) => xsec(v, "strip"),
  diffpair: (v) => xsec(v, "diff"),
  diffpairstrip: (v) => xsecDiffStrip(v),

  tracewidth: (v) => {
    const w = Math.min(46, Math.max(8, sv(v.i, 2) * 8));
    return (<DSvg>
      <rect x={30} y={55 - w / 2} width={220} height={w} rx={3} fill={DGC.cu} opacity="0.85" />
      <path d="M60 55 H210" stroke="var(--onaccent)" strokeWidth="2" markerEnd="url(#arr)" />
      <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="var(--onaccent)" /></marker></defs>
      <DTxt x={140} y={59} c="var(--onaccent)" s={9}>I = {fmt(sv(v.i, 2), 1)} A</DTxt>
      <DTxt x={140} y={30} c={DGC.dim}>width grows with current · ΔT = {fmt(sv(v.dt, 10), 0)} °C</DTxt>
      <DTxt x={140} y={100} c={DGC.mut}>{sv(v.layer, 1) >= 1 ? "external layer (better cooling)" : "internal layer (needs ~2× width)"}</DTxt>
    </DSvg>);
  },

  viacurrent: (v) => {
    const d = Math.min(40, Math.max(10, sv(v.d, 8) * 3));
    return (<DSvg>
      <rect x={40} y={30} width={220} height={8} fill="var(--bd)" /><rect x={40} y={82} width={220} height={8} fill="var(--bd)" />
      <rect x={150 - d / 2 - 5} y={30} width={5} height={60} fill={DGC.cu} />
      <rect x={150 + d / 2} y={30} width={5} height={60} fill={DGC.cu} />
      <rect x={150 - d / 2} y={30} width={d} height={60} fill="var(--bd7)22" />
      <path d={`M150 38 V80`} stroke={DGC.hot} strokeWidth="2" strokeDasharray="4 3" />
      <DTxt x={150} y={20}>hole Ø {fmt(sv(v.d, 8), 0)} mil · plating {fmt(sv(v.p, 1), 1)} mil</DTxt>
      <DTxt x={150} y={104} c={DGC.mut}>current flows through the plated barrel wall only</DTxt>
    </DSvg>);
  },

  traceres: (v) => (<DSvg>
    <rect x={30} y={48} width={240} height={12} rx={2} fill={DGC.cu} opacity="0.85" />
    <DTxt x={150} y={40}>L = {fmt(sv(v.l, 100), 0)} mm · w = {fmt(sv(v.w, 10), 0)} mil · {fmt(sv(v.t, 1), 1)} oz</DTxt>
    <W d="M30 76 L30 70 M270 76 L270 70" />
    <path d="M30 76 H270" stroke={DGC.hot} strokeWidth="1.5" strokeDasharray="3 3" />
    <DTxt x={150} y={90} c={DGC.hot}>V drop = I × R → heat (I = {fmt(sv(v.i, 1), 1)} A)</DTxt>
  </DSvg>),

  lengthmatch: (v) => {
    const lc = Math.min(200, Math.max(20, (sv(v.tr, 100) / sv(v.len, 50)) * 60));
    return (<DSvg>
      <rect x={20} y={44} width={26} height={22} rx={3} fill="none" stroke={DGC.ln} strokeWidth="1.5" /><DTxt x={33} y={58} s={7}>DRV</DTxt>
      <rect x={254} y={44} width={26} height={22} rx={3} fill="none" stroke={DGC.ln} strokeWidth="1.5" /><DTxt x={267} y={58} s={7}>RCV</DTxt>
      <line x1={46} y1={55} x2={254} y2={55} stroke={DGC.cu} strokeWidth="3" />
      <line x1={46} y1={72} x2={46 + lc} y2={72} stroke={DGC.ok} strokeWidth="2" />
      <DTxt x={46 + lc / 2} y={84} c={DGC.ok}>critical length (no termination needed)</DTxt>
      <DTxt x={150} y={32}>tr = {fmt(sv(v.tr, 100), 0)} ps — beyond green: transmission line</DTxt>
    </DSvg>);
  },

  rcfilter: (v) => {
    const fc = 1 / (2 * Math.PI * sv(v.r, 1000) * sv(v.c, 100) * 1e-9);
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const f = Math.pow(10, 1 + (i / 60) * 6);
      const g = 1 / Math.sqrt(1 + (f / fc) ** 2);
      pts.push(`${i ? "L" : "M"}${120 + i * 2.8},${30 + (1 - g) * 55}`);
    }
    return (<DSvg>
      <W d="M8 40 H30" /><Res x={30} y={40} w={30} label="R" /><W d="M60 40 H86" /><Dot x={86} y={40} />
      <W d="M86 40 V58" /><Cap x={86} y={60} label="C" /><W d="M86 66 V76" /><Gnd x={86} y={76} />
      <W d="M86 40 H106" /><DTxt x={10} y={32} a="start">in</DTxt><DTxt x={104} y={32} a="end">out</DTxt>
      <path d={pts.join("")} fill="none" stroke={DGC.cu} strokeWidth="2" />
      <line x1={120 + (Math.log10(fc) - 1) / 6 * 168} y1={26} x2={120 + (Math.log10(fc) - 1) / 6 * 168} y2={92} stroke={DGC.ok} strokeDasharray="3 3" />
      <DTxt x={205} y={104} c={DGC.ok}>fc = {fmt(fc / 1000, 1)} kHz (−3 dB)</DTxt>
    </DSvg>);
  },

  capreact: (v) => {
    const C = sv(v.c, 100) * 1e-9, L = sv(v.esl, 0.5) * 1e-9;
    const fsr = 1 / (2 * Math.PI * Math.sqrt(L * C));
    const pts = [];
    for (let i = 0; i <= 70; i++) {
      const f = Math.pow(10, 4 + (i / 70) * 6);
      const z = Math.abs(2 * Math.PI * f * L - 1 / (2 * Math.PI * f * C)) + 0.005;
      const y = 95 - Math.min(75, Math.max(2, (Math.log10(z) + 2.3) * 20));
      pts.push(`${i ? "L" : "M"}${30 + i * 3.4},${y}`);
    }
    const xr = 30 + ((Math.log10(fsr) - 4) / 6) * 238;
    return (<DSvg>
      <path d={pts.join("")} fill="none" stroke={DGC.cu} strokeWidth="2" />
      <line x1={xr} y1={20} x2={xr} y2={98} stroke={DGC.ok} strokeDasharray="3 3" />
      <DTxt x={xr} y={14} c={DGC.ok}>SRF ≈ {fmt(fsr / 1e6, 1)} MHz</DTxt>
      <DTxt x={70} y={40}>capacitive ↓</DTxt><DTxt x={245} y={40}>inductive ↑ (ESL)</DTxt>
      <DTxt x={150} y={108} c={DGC.mut}>|Z| vs frequency — lowest exactly at self-resonance</DTxt>
    </DSvg>);
  },

  divider: (v) => {
    const vout = sv(v.vin, 3.3) * sv(v.r2, 10) / (sv(v.r1, 10) + sv(v.r2, 10));
    return (<DSvg h={120}>
      <DTxt x={60} y={16} c={DGC.cu}>Vin = {fmt(sv(v.vin, 3.3), 2)} V</DTxt>
      <W d="M60 20 V28" /><Res x={60} y={28} w={30} vert label={`R1 ${fmt(sv(v.r1, 10), 1)}k`} />
      <W d="M60 58 V66" /><Dot x={60} y={62} /><W d="M60 62 H160" />
      <Res x={60} y={66} w={30} vert label={`R2 ${fmt(sv(v.r2, 10), 1)}k`} />
      <W d="M60 96 V102" /><Gnd x={60} y={102} />
      <DTxt x={166} y={66} a="start" c={DGC.ok} s={10}>Vout = {fmt(vout, 3)} V</DTxt>
      <DTxt x={166} y={80} a="start" c={DGC.mut}>= Vin · R2/(R1+R2)</DTxt>
    </DSvg>);
  },

  ledres: (v) => (<DSvg>
    <DTxt x={30} y={40} c={DGC.cu}>{fmt(sv(v.vs, 3.3), 1)} V</DTxt>
    <W d="M30 46 H56" /><Res x={56} y={46} w={36} label={`R = ${fmt((sv(v.vs, 3.3) - sv(v.vf, 2)) / (sv(v.i, 5) / 1000), 0)} Ω`} />
    <W d="M92 46 H140" />
    <g transform="translate(140,46)"><path d="M0 -9 L16 0 L0 9 Z" fill="none" stroke={DGC.cu} strokeWidth="1.5" /><line x1={16} y1={-9} x2={16} y2={9} stroke={DGC.cu} strokeWidth="1.5" />
      <path d="M6 -12 l6 -7 M12 -10 l6 -7" stroke={DGC.ok} strokeWidth="1.2" /></g>
    <W d="M156 46 H190 V60" /><Gnd x={190} y={60} />
    <DTxt x={150} y={92} c={DGC.mut}>I = {fmt(sv(v.i, 5), 1)} mA · drops Vs − Vf = {fmt(sv(v.vs, 3.3) - sv(v.vf, 2), 2)} V across R</DTxt>
  </DSvg>),

  ohms: () => (<DSvg>
    <path d="M150 16 L96 88 H204 Z" fill="none" stroke={DGC.ln} strokeWidth="1.5" />
    <line x1={114} y1={64} x2={186} y2={64} stroke={DGC.ln} strokeWidth="1" />
    <line x1={150} y1={64} x2={150} y2={88} stroke={DGC.ln} strokeWidth="1" />
    <DTxt x={150} y={50} c={DGC.cu} s={13}>V</DTxt>
    <DTxt x={128} y={80} c={DGC.cu} s={12}>I</DTxt><DTxt x={172} y={80} c={DGC.cu} s={12}>R</DTxt>
    <DTxt x={150} y={104} c={DGC.mut}>cover the one you want · P = V × I</DTxt>
  </DSvg>),

  wavelength: (v) => {
    const lam = 299.792 / sv(v.f, 100) / Math.sqrt(sv(v.er, 4.2));
    const pts = [];
    for (let i = 0; i <= 100; i++) pts.push(`${i ? "L" : "M"}${30 + i * 2.4},${52 - Math.sin((i / 100) * Math.PI * 4) * 26}`);
    return (<DSvg>
      <path d={pts.join("")} fill="none" stroke={DGC.cu} strokeWidth="2" />
      <W d="M30 90 L150 90" /><DTxt x={90} y={102}>λ = {fmt(lam * 1000, 0)} mm in εr {fmt(sv(v.er, 4.2), 1)}</DTxt>
      <line x1={30} y1={86} x2={30} y2={94} stroke={DGC.ln} /><line x1={150} y1={86} x2={150} y2={94} stroke={DGC.ln} />
    </DSvg>);
  },

  pullup: (v) => (<DSvg h={120}>
    <DTxt x={70} y={14} c={DGC.cu}>Vcc {fmt(sv(v.vcc, 3.3), 1)} V</DTxt>
    <W d="M70 18 V26" /><Res x={70} y={26} w={28} vert label="Rpu" />
    <W d="M70 54 V66" /><Dot x={70} y={60} /><W d="M70 60 H180" /><DTxt x={186} y={63} a="start">SDA/SCL bus</DTxt>
    <rect x={56} y={66} width={28} height={24} rx={3} fill="none" stroke={DGC.ln} strokeWidth="1.5" />
    <DTxt x={70} y={81} s={7}>open</DTxt><DTxt x={70} y={89} s={7}>drain</DTxt>
    <W d="M70 90 V98" /><Gnd x={70} y={98} />
    <Cap x={150} y={74} label={`Cb ${fmt(sv(v.cb, 200), 0)} pF`} /><W d="M150 60 V74 M150 80 V90" /><Gnd x={150} y={90} />
    <DTxt x={150} y={116} c={DGC.mut}>rise = R charging Cb · fall = transistor pulling low</DTxt>
  </DSvg>),

  logicpullup: (v) => (<DSvg h={116}>
    <DTxt x={70} y={14} c={DGC.cu}>Vcc {fmt(sv(v.vcc, 3.3), 1)} V</DTxt>
    <W d="M70 18 V26" /><Res x={70} y={26} w={28} vert label={`${fmt(sv(v.r, 10), 0)} kΩ`} />
    <W d="M70 54 V60 H170" /><Dot x={70} y={58} />
    <path d="M170 52 L186 60 L170 68 Z" fill="none" stroke={DGC.ln} strokeWidth="1.5" />
    <DTxt x={196} y={63} a="start">input pin</DTxt>
    <path d="M120 60 V78" stroke={DGC.hot} strokeWidth="1.5" strokeDasharray="3 2" />
    <DTxt x={120} y={92} c={DGC.hot}>leakage {fmt(sv(v.ileak, 5), 0)} µA pulls node down</DTxt>
  </DSvg>),

  trbw: (v) => {
    const tr = sv(v.tr, 1);
    return (<DSvg>
      <path d="M30 80 H110 L150 28 H270" fill="none" stroke={DGC.cu} strokeWidth="2" />
      <W d="M110 90 L150 90" /><DTxt x={130} y={102}>tr = {fmt(tr, 2)} ns (10–90%)</DTxt>
      <line x1={110} y1={86} x2={110} y2={94} stroke={DGC.ln} /><line x1={150} y1={86} x2={150} y2={94} stroke={DGC.ln} />
      <DTxt x={210} y={50} c={DGC.ok}>BW ≈ 0.35/tr = {fmt(350 / tr, 0)} MHz</DTxt>
    </DSvg>);
  },

  edgedeg: (v) => (<DSvg>
    <rect x={20} y={40} width={26} height={22} rx={3} fill="none" stroke={DGC.ln} strokeWidth="1.5" /><DTxt x={33} y={54} s={7}>DRV</DTxt>
    <W d="M46 51 H70" /><Res x={70} y={51} w={32} label={`${fmt(sv(v.r, 33), 0)} Ω`} /><W d="M102 51 H150" /><Dot x={150} y={51} />
    <W d="M150 51 V64" /><Cap x={150} y={66} label={`${fmt(sv(v.c, 15), 0)} pF`} /><W d="M150 72 V80" /><Gnd x={150} y={80} />
    <W d="M150 51 H230" />
    <path d="M236 60 L236 42 L252 42" fill="none" stroke={DGC.cu} strokeWidth="1.5" />
    <path d="M256 60 Q262 60 264 51 Q266 42 276 42" fill="none" stroke={DGC.hot} strokeWidth="1.5" />
    <DTxt x={256} y={74} c={DGC.hot} s={7}>slowed edge</DTxt>
  </DSvg>),

  seriesterm: (v) => (<DSvg>
    <rect x={16} y={40} width={30} height={22} rx={3} fill="none" stroke={DGC.ln} strokeWidth="1.5" />
    <DTxt x={31} y={50} s={7}>DRV</DTxt><DTxt x={31} y={58} s={6}>{fmt(sv(v.rdrv, 22), 0)}Ω</DTxt>
    <W d="M46 51 H64" /><Res x={64} y={51} w={36} label={`Rs = ${fmt(Math.max(0, sv(v.z0, 50) - sv(v.rdrv, 22)), 0)} Ω`} />
    <line x1={100} y1={51} x2={250} y2={51} stroke={DGC.cu} strokeWidth="3" />
    <DTxt x={175} y={42} c={DGC.cu}>Z₀ = {fmt(sv(v.z0, 50), 0)} Ω</DTxt>
    <rect x={250} y={40} width={28} height={22} rx={3} fill="none" stroke={DGC.ln} strokeWidth="1.5" /><DTxt x={264} y={54} s={7}>RCV</DTxt>
    <DTxt x={150} y={92} c={DGC.mut}>Rdrv + Rs = Z₀ → reflection absorbed at the source</DTxt>
  </DSvg>),

  crosstalk: (v) => {
    const s = Math.min(46, Math.max(8, sv(v.s, 10) * 3));
    return (<DSvg>
      <rect x={40} y={40 - 4} width={220} height={8} rx={2} fill={DGC.hot} opacity="0.9" />
      <rect x={40} y={40 + s} width={220} height={8} rx={2} fill={DGC.cu} opacity="0.9" />
      <DTxt x={150} y={30} c={DGC.hot}>aggressor</DTxt>
      <DTxt x={150} y={40 + s + 20} c={DGC.cu}>victim</DTxt>
      {[80, 130, 180, 230].map((x) => <path key={x} d={`M${x} 46 Q${x + 4} ${44 + s / 2} ${x} ${40 + s}`} fill="none" stroke={DGC.mut} strokeWidth="1" strokeDasharray="2 2" />)}
      <W d={`M276 44 L276 ${40 + s}`} /><DTxt x={282} y={44 + s / 2} a="start">s={fmt(sv(v.s, 10), 0)}</DTxt>
      <DTxt x={150} y={102} c={DGC.mut}>coupling falls as 1/(1+(D/H)²) — spacing live above</DTxt>
    </DSvg>);
  },

  ztarget: (v) => (<DSvg>
    <rect x={30} y={34} width={70} height={40} rx={6} fill="none" stroke={DGC.ln} strokeWidth="1.5" /><DTxt x={65} y={50} s={8}>VRM +</DTxt><DTxt x={65} y={62} s={8}>PDN</DTxt>
    <W d="M100 44 H200" /><W d="M100 64 H200" />
    <rect x={200} y={34} width={70} height={40} rx={6} fill="none" stroke={DGC.cu} strokeWidth="1.5" /><DTxt x={235} y={50} s={8} c={DGC.cu}>ASIC</DTxt><DTxt x={235} y={62} s={7} c={DGC.cu}>ΔI = {fmt(sv(v.imax, 20) * sv(v.step, 50) / 100, 1)} A</DTxt>
    <DTxt x={150} y={28} c={DGC.ok}>allowed ΔV = {fmt(sv(v.vrail, 0.8) * sv(v.ripple, 3) * 10, 0)} mV</DTxt>
    <DTxt x={150} y={94} c={DGC.mut}>Ztarget = ΔV / ΔI — the PDN must look this stiff to the die</DTxt>
  </DSvg>),

  capcount: (v) => (<DSvg>
    <W d="M30 36 H270" /><W d="M30 84 H270" />
    {[70, 120, 170, 220].map((x, i) => (
      <g key={x}><W d={`M${x} 36 V52`} /><Cap x={x} y={54} /><W d={`M${x} 60 V84`} />
        {i === 3 && <DTxt x={x + 16} y={60} a="start" c={DGC.cu}>×N</DTxt>}</g>
    ))}
    <DTxt x={150} y={22} c={DGC.dim}>N parallel caps: Z, ESR and ESL all divide by N</DTxt>
    <DTxt x={150} y={102} c={DGC.mut}>floor = ESR/N — and mounting L still dominates above SRF</DTxt>
  </DSvg>),

  noisecap: (v) => {
    const L = sv(v.l, 1.2) * 1e-9;
    const fn = sv(v.f, 50) * 1e6;
    const C = 1 / ((2 * Math.PI * fn) ** 2 * L);
    const pts = [];
    for (let i = 0; i <= 70; i++) {
      const f = Math.pow(10, 6 + (i / 70) * 3);
      const z = Math.abs(2 * Math.PI * f * L - 1 / (2 * Math.PI * f * C)) + 0.004;
      pts.push(`${i ? "L" : "M"}${30 + i * 3.4},${92 - Math.min(70, Math.max(2, (Math.log10(z) + 2.4) * 22))}`);
    }
    const xn = 30 + ((Math.log10(fn) - 6) / 3) * 238;
    return (<DSvg>
      <path d={pts.join("")} fill="none" stroke={DGC.cu} strokeWidth="2" />
      <line x1={xn} y1={18} x2={xn} y2={96} stroke={DGC.hot} strokeDasharray="3 3" />
      <DTxt x={xn} y={12} c={DGC.hot}>noise @ {fmt(sv(v.f, 50), 0)} MHz</DTxt>
      <DTxt x={150} y={108} c={DGC.mut}>cap chosen so its impedance dip lands exactly on the noise</DTxt>
    </DSvg>);
  },

  bulkcap: (v) => (<DSvg>
    <path d="M30 40 H120 L126 70 H200 Q230 70 230 46 H270" fill="none" stroke={DGC.cu} strokeWidth="2" />
    <line x1={30} y1={40} x2={270} y2={40} stroke={DGC.ln} strokeDasharray="3 4" strokeWidth="1" />
    <line x1={30} y1={40 + 26} x2={270} y2={66} stroke={DGC.hot} strokeDasharray="2 3" strokeWidth="1" />
    <DTxt x={64} y={32}>rail</DTxt><DTxt x={236} y={36} c={DGC.ok}>VRM recovers</DTxt>
    <DTxt x={163} y={84} c={DGC.hot}>droop ≤ {fmt(sv(v.dv, 30), 0)} mV for {fmt(sv(v.t, 10), 0)} µs</DTxt>
    <DTxt x={150} y={104} c={DGC.mut}>bulk C carries the load step until the loop responds</DTxt>
  </DSvg>),

  buckl: (v) => (<DSvg h={120}>
    <DTxt x={26} y={36} c={DGC.cu}>Vin</DTxt><W d="M26 40 H52" />
    <rect x={52} y={30} width={24} height={20} rx={3} fill="none" stroke={DGC.ln} strokeWidth="1.5" /><DTxt x={64} y={43} s={7}>SW</DTxt>
    <W d="M76 40 H96" /><Dot x={96} y={40} />
    <path d="M96 40 V58" stroke={DGC.ln} strokeWidth="1.5" /><path d="M90 58 L102 58 M96 58 L90 66 M96 58 L102 66" stroke={DGC.ln} strokeWidth="1.2" fill="none" />
    <Ind x={104} y={40} label={`L`} /><W d="M140 40 H170" /><Dot x={170} y={40} />
    <W d="M170 40 V58" /><Cap x={170} y={60} /><W d="M170 66 V76" /><Gnd x={170} y={76} />
    <W d="M170 40 H210" /><Res x={210} y={40} w={30} label="load" /><W d="M240 40 H258" />
    <DTxt x={262} y={43} a="start" c={DGC.ok}>Vout {fmt(sv(v.vout, 1), 1)} V</DTxt>
    <path d="M60 96 L90 88 L120 96 L150 88 L180 96" fill="none" stroke={DGC.cu} strokeWidth="1.5" />
    <DTxt x={216} y={95} a="start" c={DGC.mut}>ΔI ripple in L</DTxt>
  </DSvg>),

  cuarea: (v) => {
    const a = Math.min(90, Math.max(24, Math.sqrt(sv(v.p, 1) / sv(v.trise, 40)) * 230));
    return (<DSvg>
      <rect x={150 - a / 2} y={56 - a / 3} width={a} height={a / 1.5} rx={4} fill={DGC.cu} opacity="0.75" />
      <rect x={140} y={48} width={20} height={16} rx={2} fill="var(--onaccent)" stroke={DGC.hot} strokeWidth="1.5" />
      {[0, 1, 2].map((i) => <path key={i} d={`M${134 + i * 16} ${36 - i * 0} q3 -6 0 -10`} fill="none" stroke={DGC.hot} strokeWidth="1.2" opacity="0.8" />)}
      <DTxt x={150} y={100} c={DGC.mut}>pour area scales live with P / ΔT — vias to inner planes halve it</DTxt>
    </DSvg>);
  },

  ldo: (v) => (<DSvg>
    <DTxt x={30} y={44} c={DGC.cu}>Vin {fmt(sv(v.vin, 5), 1)}</DTxt><W d="M30 50 H86" />
    <rect x={86} y={32} width={70} height={36} rx={6} fill="none" stroke={DGC.ln} strokeWidth="1.5" /><DTxt x={121} y={54} s={9}>LDO</DTxt>
    <W d="M156 50 H210" /><DTxt x={216} y={53} a="start" c={DGC.ok}>Vout {fmt(sv(v.vout, 3.3), 1)}</DTxt>
    {[0, 1, 2].map((i) => <path key={i} d={`M${106 + i * 14} 26 q3 -6 0 -10`} fill="none" stroke={DGC.hot} strokeWidth="1.2" />)}
    <DTxt x={121} y={88} c={DGC.hot}>Pd = (Vin−Vout)·I = {fmt((sv(v.vin, 5) - sv(v.vout, 3.3)) * sv(v.i, 500) / 1000 * 1000, 0)} mW as heat</DTxt>
  </DSvg>),

  lcfilter: (v) => {
    const fc = 1 / (2 * Math.PI * Math.sqrt(sv(v.l, 1) * 1e-6 * sv(v.c, 22) * 1e-6)) / 1e3;
    return (<DSvg>
      <W d="M14 44 H40" /><Ind x={40} y={44} label="L" /><W d="M76 44 H110" /><Dot x={110} y={44} />
      <W d="M110 44 V58" /><Cap x={110} y={60} label="C" /><W d="M110 66 V76" /><Gnd x={110} y={76} />
      <W d="M110 44 H136" /><DTxt x={16} y={36} a="start">noisy</DTxt><DTxt x={134} y={36} a="end" c={DGC.ok}>clean</DTxt>
      <path d="M170 36 H226 Q244 36 250 56 Q256 78 268 84" fill="none" stroke={DGC.cu} strokeWidth="2" />
      <DTxt x={222} y={100} c={DGC.ok}>fc = {fmt(fc, 1)} kHz · −40 dB/dec</DTxt>
    </DSvg>);
  },

  serpar: () => (<DSvg>
    <W d="M20 36 H44" /><Res x={44} y={36} w={28} label="R1" /><W d="M72 36 H88" /><Res x={88} y={36} w={28} label="R2" /><W d="M116 36 H140" />
    <DTxt x={80} y={60} c={DGC.mut} s={7}>series: add</DTxt>
    <W d="M180 26 H200" /><Dot x={200} y={26} />
    <W d="M200 26 V20 H216" /><Res x={216} y={20} w={26} /><W d="M242 20 H258 V26" />
    <W d="M200 26 V34 H216" /><Res x={216} y={34} w={26} /><W d="M242 34 H258 V26" />
    <Dot x={258} y={26} /><W d="M258 26 H278" />
    <DTxt x={229} y={60} c={DGC.mut} s={7}>parallel: reciprocal</DTxt>
  </DSvg>),

  idivider: (v) => {
    const i1 = sv(v.it, 100) * sv(v.r2, 470) / (sv(v.r1, 100) + sv(v.r2, 470));
    return (<DSvg>
      <W d="M20 54 H70" /><Dot x={70} y={54} />
      <W d="M70 54 V34 H100" /><Res x={100} y={34} w={36} label="R1" /><W d="M136 34 H180 V54" />
      <W d="M70 54 V74 H100" /><Res x={100} y={74} w={36} label="R2" /><W d="M136 74 H180 V54" />
      <Dot x={180} y={54} /><W d="M180 54 H236" />
      <DTxt x={40} y={46} c={DGC.cu}>{fmt(sv(v.it, 100), 0)} mA</DTxt>
      <DTxt x={208} y={30} a="start" c={DGC.ok}>I₁ = {fmt(i1, 1)} mA</DTxt>
      <DTxt x={208} y={84} a="start" c={DGC.ok}>I₂ = {fmt(sv(v.it, 100) - i1, 1)} mA</DTxt>
    </DSvg>);
  },

  capenergy: (v) => (<DSvg>
    <W d="M60 30 V48" /><line x1={42} y1={50} x2={78} y2={50} stroke={DGC.cu} strokeWidth="3" />
    <line x1={42} y1={60} x2={78} y2={60} stroke={DGC.cu} strokeWidth="3" /><W d="M60 62 V80" />
    <DTxt x={96} y={50} a="start" c={DGC.cu}>{fmt(sv(v.c, 470), 0)} µF @ {fmt(sv(v.v, 48), 0)} V</DTxt>
    <DTxt x={96} y={66} a="start" c={DGC.hot}>E = ½CV² = {fmt(0.5 * sv(v.c, 470) * 1e-6 * sv(v.v, 48) ** 2 * 1000, 1)} mJ</DTxt>
    <DTxt x={150} y={100} c={DGC.mut}>energy grows with the SQUARE of voltage — 48 V hurts</DTxt>
  </DSvg>),

  captime: (v) => {
    const vs = sv(v.vs, 3.3), vt = Math.min(sv(v.vt, 2), vs * 0.99);
    const tau = sv(v.r, 10) * 1000 * sv(v.c, 1) * 1e-6;
    const tEnd = 5 * tau;
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * tEnd;
      pts.push(`${i ? "L" : "M"}${30 + i * 3},${90 - (1 - Math.exp(-t / tau)) * 62}`);
    }
    const tT = -tau * Math.log(1 - vt / vs);
    const xT = 30 + (tT / tEnd) * 240, yT = 90 - (vt / vs) * 62;
    return (<DSvg>
      <path d={pts.join("")} fill="none" stroke={DGC.cu} strokeWidth="2" />
      <line x1={30} y1={yT} x2={xT} y2={yT} stroke={DGC.ok} strokeDasharray="3 3" />
      <line x1={xT} y1={yT} x2={xT} y2={94} stroke={DGC.ok} strokeDasharray="3 3" />
      <Dot x={xT} y={yT} />
      <DTxt x={xT} y={106} c={DGC.ok}>t = {fmt(tT * 1000, 2)} ms to {fmt(vt, 2)} V</DTxt>
      <DTxt x={258} y={26} c={DGC.dim}>→ {fmt(vs, 2)} V</DTxt>
    </DSvg>);
  },

  inductor: (v) => (<DSvg>
    <W d="M30 50 H60" /><Ind x={60} y={50} label={`${fmt(sv(v.l, 10), 1)} µH`} /><W d="M96 50 H130" />
    <path d="M150 86 L150 30 L156 86" fill="none" stroke={DGC.hot} strokeWidth="2" />
    <DTxt x={196} y={40} a="start" c={DGC.hot}>V = L·di/dt spike</DTxt>
    <DTxt x={196} y={54} a="start" c={DGC.mut}>when current is cut</DTxt>
    <DTxt x={150} y={106} c={DGC.mut}>always clamp inductive loads (flyback diode)</DTxt>
  </DSvg>),

  opamp: (v) => (<DSvg h={118}>
    <path d="M110 30 L110 78 L170 54 Z" fill="none" stroke={DGC.ln} strokeWidth="1.5" />
    <DTxt x={120} y={46} s={9}>−</DTxt><DTxt x={120} y={68} s={9}>+</DTxt>
    <W d="M70 42 H110" /><W d="M82 66 H110" /><W d="M170 54 H210" />
    <Res x={118} y={16} w={40} label={`Rf ${fmt(sv(v.rf, 100), 0)}k`} />
    <W d="M96 42 V16 H118 M158 16 H186 V54" /><Dot x={96} y={42} /><Dot x={186} y={54} />
    <Res x={36} y={42} w={30} label={`Rin`} /><W d="M30 42 H36 M66 42 H70" />
    <DTxt x={216} y={50} a="start" c={DGC.ok}>gain = −Rf/Rin</DTxt>
    <DTxt x={216} y={64} a="start" c={DGC.mut}>= −{fmt(sv(v.rf, 100) / sv(v.rin, 10), 1)}×</DTxt>
  </DSvg>),

  timer555: (v) => {
    const r1 = sv(v.r1, 10), r2 = sv(v.r2, 47);
    const duty = (r1 + r2) / (r1 + 2 * r2);
    const hi = 70 * duty, lo = 70 * (1 - duty);
    let d = "M30 78", x = 30;
    for (let k = 0; k < 3; k++) { d += ` L${x} 40 L${x + hi} 40 L${x + hi} 78 L${x + hi + lo} 78`; x += hi + lo; }
    return (<DSvg>
      <rect x={20} y={28} width={56} height={56} rx={6} fill="none" stroke={DGC.ln} strokeWidth="1.5" />
      <DTxt x={48} y={60} s={11}>555</DTxt>
      <path d={d} fill="none" stroke={DGC.cu} strokeWidth="2" transform="translate(70,0)" />
      <DTxt x={185} y={98} c={DGC.ok}>duty = {fmt(duty * 100, 0)}% (live with R1/R2)</DTxt>
    </DSvg>);
  },

  zener: (v) => (<DSvg>
    <DTxt x={28} y={40} c={DGC.cu}>{fmt(sv(v.vin, 12), 0)} V</DTxt>
    <W d="M28 46 H52" /><Res x={52} y={46} w={36} label="Rs" /><W d="M88 46 H130" /><Dot x={130} y={46} />
    <g transform="translate(130,46)"><W d="M0 0 V14" /><path d="M-8 14 L8 14 L0 28 Z" fill="none" stroke={DGC.cu} strokeWidth="1.5" /><path d="M-8 28 H8 M-8 28 l-4 4 M8 28 l4 -4" stroke={DGC.cu} strokeWidth="1.5" fill="none" /><W d="M0 32 V40" /></g>
    <Gnd x={130} y={86} />
    <W d="M130 46 H210" /><Res x={210} y={46} w={30} label="load" /><W d="M240 46 H256 V80" /><Gnd x={256} y={80} />
    <DTxt x={172} y={30} c={DGC.ok}>Vz = {fmt(sv(v.vz, 5.1), 1)} V held by shunt</DTxt>
  </DSvg>),

  dbconv: (v) => {
    const r = sv(v.ratio, 2);
    const db = 20 * Math.log10(r);
    const x = 150 + Math.max(-120, Math.min(120, db * 4));
    return (<DSvg>
      <line x1={30} y1={56} x2={270} y2={56} stroke={DGC.ln} strokeWidth="1.5" />
      {[-20, -10, 0, 10, 20].map((d) => (
        <g key={d}><line x1={150 + d * 4} y1={50} x2={150 + d * 4} y2={62} stroke={DGC.ln} />
          <DTxt x={150 + d * 4} y={76}>{d > 0 ? "+" + d : d}</DTxt></g>
      ))}
      <circle cx={x} cy={56} r={5} fill={DGC.cu} />
      <DTxt x={x} y={40} c={DGC.cu}>{fmt(r, 2)}× = {fmt(db, 1)} dB(V)</DTxt>
      <DTxt x={150} y={100} c={DGC.mut}>voltage: 20·log — power: 10·log</DTxt>
    </DSvg>);
  },

  freqperiod: (v) => {
    const pts = [];
    for (let i = 0; i <= 100; i++) pts.push(`${i ? "L" : "M"}${30 + i * 2.4},${54 - Math.sin((i / 100) * Math.PI * 6) * 26}`);
    return (<DSvg>
      <path d={pts.join("")} fill="none" stroke={DGC.cu} strokeWidth="2" />
      <W d="M30 92 L110 92" /><DTxt x={70} y={104}>T = {fmt(1 / sv(v.f, 100) * 1000, 2)} ns</DTxt>
    </DSvg>);
  },

  battery: (v) => {
    const pct = Math.min(1, sv(v.derate, 80) / 100);
    return (<DSvg>
      <rect x={60} y={36} width={170} height={40} rx={6} fill="none" stroke={DGC.ln} strokeWidth="1.5" />
      <rect x={230} y={48} width={8} height={16} rx={2} fill={DGC.ln} />
      <rect x={64} y={40} width={162 * pct} height={32} rx={4} fill={DGC.ok} opacity="0.55" />
      <DTxt x={145} y={60} s={9}>{fmt(sv(v.cap, 2000) * pct, 0)} mAh usable</DTxt>
      <DTxt x={150} y={98} c={DGC.mut}>runtime = usable capacity ÷ {fmt(sv(v.i, 50), 0)} mA average</DTxt>
    </DSvg>);
  },

  awg: (v) => {
    const dMm = 0.127 * Math.pow(92, (36 - sv(v.awg, 24)) / 39);
    const r = Math.min(38, Math.max(5, dMm * 36));
    return (<DSvg>
      <circle cx={90} cy={56} r={r} fill={DGC.cu} opacity="0.85" />
      <circle cx={90} cy={56} r={r + 6} fill="none" stroke={DGC.ln} strokeWidth="2" />
      <DTxt x={170} y={48} a="start" c={DGC.cu}>AWG {fmt(sv(v.awg, 24), 0)} → Ø {fmt(dMm, 2)} mm</DTxt>
      <DTxt x={170} y={64} a="start" c={DGC.mut}>circle scales with gauge</DTxt>
    </DSvg>);
  },

  unitconv: () => (<DSvg>
    <line x1={30} y1={56} x2={270} y2={56} stroke={DGC.ln} strokeWidth="2" />
    {Array.from({ length: 13 }, (_, i) => 30 + i * 20).map((x, i) => (
      <line key={x} x1={x} y1={56} x2={x} y2={i % 5 === 0 ? 40 : 48} stroke={DGC.ln} strokeWidth="1.2" />
    ))}
    <DTxt x={150} y={80} c={DGC.cu}>1 mil = 25.4 µm · 1 oz = 35 µm · 0.1 mm ≈ 4 mil</DTxt>
  </DSvg>),
};

const CALCULATORS = [
  {
    id: "microstrip", icon: Layers, group: "Signal Integrity",
    name: "Microstrip Impedance",
    desc: "Z₀ of a surface trace over a reference plane (IPC-2141)",
    inputs: [
      { key: "w", label: "Trace width", unit: "mil", def: "5" },
      { key: "t", label: "Trace thickness", unit: "mil", def: "1.4" },
      { key: "h", label: "Dielectric height", unit: "mil", def: "3.5" },
      { key: "er", label: "Dielectric εr", unit: "", def: "4.2" },
    ],
    compute: (v) => {
      const z0 = (87 / Math.sqrt(v.er + 1.41)) * Math.log((5.98 * v.h) / (0.8 * v.w + v.t));
      const tpd = 85 * Math.sqrt(0.475 * v.er + 0.67);
      return [
        { label: "Z₀ (single-ended)", value: fmt(z0, 2), unit: "Ω" },
        { label: "Prop delay", value: fmt(tpd, 1), unit: "ps/in" },
      ];
    },
    note: "Valid for 0.1 < w/h < 2.0 and εr < 15. For DDR4 target 40–50 Ω; verify in your field solver before tape-out.",
  },
  {
    id: "stripline", icon: Layers, group: "Signal Integrity",
    name: "Stripline Impedance",
    desc: "Z₀ of an inner-layer trace between two planes",
    inputs: [
      { key: "w", label: "Trace width", unit: "mil", def: "4" },
      { key: "t", label: "Trace thickness", unit: "mil", def: "0.65" },
      { key: "b", label: "Plane-to-plane height", unit: "mil", def: "12" },
      { key: "er", label: "Dielectric εr", unit: "", def: "4.2" },
    ],
    compute: (v) => {
      const z0 = (60 / Math.sqrt(v.er)) * Math.log((1.9 * v.b) / (0.8 * v.w + v.t));
      const tpd = 85 * Math.sqrt(v.er);
      return [
        { label: "Z₀ (single-ended)", value: fmt(z0, 2), unit: "Ω" },
        { label: "Prop delay", value: fmt(tpd, 1), unit: "ps/in" },
      ];
    },
    note: "Symmetric stripline approximation, valid for w/b < 0.35 and t/b < 0.25.",
  },
  {
    id: "diffpair", icon: Waves, group: "Signal Integrity",
    name: "Differential Pair (Microstrip)",
    desc: "Edge-coupled differential impedance for PCIe / SerDes / USB",
    inputs: [
      { key: "w", label: "Trace width", unit: "mil", def: "5" },
      { key: "t", label: "Trace thickness", unit: "mil", def: "1.4" },
      { key: "h", label: "Dielectric height", unit: "mil", def: "3.5" },
      { key: "s", label: "Edge-to-edge spacing", unit: "mil", def: "7" },
      { key: "er", label: "Dielectric εr", unit: "", def: "4.2" },
    ],
    compute: (v) => {
      const z0 = (87 / Math.sqrt(v.er + 1.41)) * Math.log((5.98 * v.h) / (0.8 * v.w + v.t));
      const zdiff = 2 * z0 * (1 - 0.48 * Math.exp(-0.96 * (v.s / v.h)));
      return [
        { label: "Z₀ single-ended", value: fmt(z0, 2), unit: "Ω" },
        { label: "Z_diff", value: fmt(zdiff, 2), unit: "Ω" },
      ];
    },
    note: "Targets: PCIe / SATA / USB3 = 85–90 Ω diff, Ethernet/10G SerDes = 100 Ω diff. Keep intra-pair skew < 5 mil.",
  },
  {
    id: "diffpairstrip", icon: Waves, group: "Signal Integrity",
    name: "Differential Pair (Stripline)",
    desc: "Edge-coupled differential impedance on an inner layer (shielded)",
    inputs: [
      { key: "w", label: "Trace width", unit: "mil", def: "4" },
      { key: "t", label: "Trace thickness", unit: "mil", def: "0.65" },
      { key: "b", label: "Plane-to-plane height", unit: "mil", def: "12" },
      { key: "s", label: "Edge-to-edge spacing", unit: "mil", def: "6" },
      { key: "er", label: "Dielectric εr", unit: "", def: "4.2" },
    ],
    compute: (v) => {
      const z0 = (60 / Math.sqrt(v.er)) * Math.log((1.9 * v.b) / (0.8 * v.w + v.t));
      const zdiff = 2 * z0 * (1 - 0.347 * Math.exp(-2.9 * (v.s / v.b)));
      const tpd = 85 * Math.sqrt(v.er);
      return [
        { label: "Z₀ single-ended", value: fmt(z0, 2), unit: "Ω" },
        { label: "Z_diff", value: fmt(zdiff, 2), unit: "Ω" },
        { label: "Prop delay", value: fmt(tpd, 1), unit: "ps/in" },
      ];
    },
    note: "Symmetric (centered) stripline. Inner layers give tighter coupling and EMI shielding — preferred for PCIe Gen4+, 25G+ SerDes and DDR. Same diff targets (85–90 Ω / 100 Ω). For asymmetric/offset stripline the value shifts a few Ω; confirm in a field solver.",
  },
  {
    id: "tracewidth", icon: Zap, group: "Power",
    name: "Trace Width for Current",
    desc: "Minimum width per IPC-2221 for a given current and temp rise",
    inputs: [
      { key: "i", label: "Current", unit: "A", def: "2" },
      { key: "dt", label: "Allowed temp rise", unit: "°C", def: "10" },
      { key: "t", label: "Copper thickness", unit: "oz", def: "1" },
      { key: "layer", label: "Layer (1=ext, 0=int)", unit: "", def: "1" },
    ],
    compute: (v) => {
      const k = v.layer >= 1 ? 0.048 : 0.024;
      const area = Math.pow(v.i / (k * Math.pow(v.dt, 0.44)), 1 / 0.725); // mil²
      const thMil = v.t * 1.378;
      const w = area / thMil;
      return [
        { label: "Cross-section area", value: fmt(area, 1), unit: "mil²" },
        { label: "Min trace width", value: fmt(w, 2), unit: "mil" },
        { label: "Min trace width", value: fmt(w * 0.0254, 3), unit: "mm" },
      ];
    },
    note: "Internal layers need ~2× the width of external for the same rise. For >5 A prefer copper pours with via stitching.",
  },
  {
    id: "viacurrent", icon: CircuitBoard, group: "Power",
    name: "Via Current Capacity",
    desc: "Current rating of a plated via barrel (IPC-2221, internal)",
    inputs: [
      { key: "d", label: "Finished hole dia", unit: "mil", def: "8" },
      { key: "p", label: "Plating thickness", unit: "mil", def: "1" },
      { key: "dt", label: "Allowed temp rise", unit: "°C", def: "10" },
    ],
    compute: (v) => {
      const area = Math.PI * (v.d + v.p) * v.p; // barrel cross-section mil²
      const i = 0.024 * Math.pow(v.dt, 0.44) * Math.pow(area, 0.725);
      return [
        { label: "Barrel cross-section", value: fmt(area, 1), unit: "mil²" },
        { label: "Max current / via", value: fmt(i, 2), unit: "A" },
      ];
    },
    note: "For power nets, stitch ≥4 vias per island and derate ~25% for thermal margin near BGAs.",
  },
  {
    id: "traceres", icon: Activity, group: "Power",
    name: "Trace Resistance & V-Drop",
    desc: "DC resistance, voltage drop and power loss of a copper trace",
    inputs: [
      { key: "l", label: "Trace length", unit: "mm", def: "100" },
      { key: "w", label: "Trace width", unit: "mil", def: "10" },
      { key: "t", label: "Copper thickness", unit: "oz", def: "1" },
      { key: "i", label: "Current", unit: "A", def: "1" },
      { key: "temp", label: "Temperature", unit: "°C", def: "25" },
    ],
    compute: (v) => {
      const rho = 1.68e-8 * (1 + 0.00393 * (v.temp - 20)); // Ω·m
      const wM = v.w * 25.4e-6, tM = v.t * 1.378 * 25.4e-6, lM = v.l * 1e-3;
      const r = (rho * lM) / (wM * tM);
      return [
        { label: "Resistance", value: fmt(r * 1000, 3), unit: "mΩ" },
        { label: "Voltage drop", value: fmt(r * v.i * 1000, 3), unit: "mV" },
        { label: "Power loss", value: fmt(r * v.i * v.i * 1000, 3), unit: "mW" },
      ];
    },
    note: "Check IR drop on core rails (e.g. 0.8 V ASIC cores) — budget < 2% of rail voltage end-to-end.",
  },
  {
    id: "lengthmatch", icon: Ruler, group: "Signal Integrity",
    name: "Critical Length & Delay",
    desc: "When a trace needs termination, from rise time and εr",
    inputs: [
      { key: "tr", label: "Signal rise time", unit: "ps", def: "100" },
      { key: "er", label: "Effective εr", unit: "", def: "4.2" },
      { key: "len", label: "Trace length", unit: "mm", def: "50" },
      { key: "strip", label: "Stripline? (1/0)", unit: "", def: "0" },
    ],
    compute: (v) => {
      const tpd = v.strip >= 1 ? 85 * Math.sqrt(v.er) : 85 * Math.sqrt(0.475 * v.er + 0.67); // ps/in
      const tpdMm = tpd / 25.4;
      const lc = v.tr / (2 * tpdMm);
      const delay = v.len * tpdMm;
      return [
        { label: "Prop delay", value: fmt(tpdMm, 2), unit: "ps/mm" },
        { label: "Critical length", value: fmt(lc, 1), unit: "mm" },
        { label: "Trace delay", value: fmt(delay, 1), unit: "ps" },
        { label: "Needs termination?", value: v.len > lc ? "YES" : "No", unit: "" },
      ];
    },
    note: "Rule of thumb: treat as a transmission line when length > rise time ÷ (2 × tpd). 1 ps ≈ 0.147 mm in FR-4 microstrip.",
  },
  {
    id: "rcfilter", icon: Timer, group: "Analog",
    name: "RC Filter / Time Constant",
    desc: "Cutoff frequency and τ for an RC low-pass",
    inputs: [
      { key: "r", label: "Resistance", unit: "Ω", def: "1000" },
      { key: "c", label: "Capacitance", unit: "nF", def: "100" },
    ],
    compute: (v) => {
      const cF = v.c * 1e-9;
      const tau = v.r * cF;
      const fc = 1 / (2 * Math.PI * v.r * cF);
      return [
        { label: "Time constant τ", value: fmt(tau * 1e6, 3), unit: "µs" },
        { label: "Cutoff f (−3 dB)", value: fmt(fc / 1000, 3), unit: "kHz" },
        { label: "10–90% rise time", value: fmt(2.2 * tau * 1e6, 3), unit: "µs" },
      ];
    },
    note: "Common for reset RC delays, ADC anti-aliasing, and debounce networks.",
  },
  {
    id: "capreact", icon: Gauge, group: "Analog",
    name: "Capacitor Reactance",
    desc: "Impedance of a decoupling cap at frequency",
    inputs: [
      { key: "c", label: "Capacitance", unit: "nF", def: "100" },
      { key: "f", label: "Frequency", unit: "MHz", def: "10" },
      { key: "esl", label: "ESL (parasitic)", unit: "nH", def: "0.5" },
    ],
    compute: (v) => {
      const cF = v.c * 1e-9, fHz = v.f * 1e6, lH = v.esl * 1e-9;
      const xc = 1 / (2 * Math.PI * fHz * cF);
      const xl = 2 * Math.PI * fHz * lH;
      const fsr = 1 / (2 * Math.PI * Math.sqrt(lH * cF));
      return [
        { label: "Xc", value: fmt(xc, 3), unit: "Ω" },
        { label: "XL (ESL)", value: fmt(xl, 3), unit: "Ω" },
        { label: "Self-resonance", value: fmt(fsr / 1e6, 2), unit: "MHz" },
      ];
    },
    note: "Above self-resonance a cap looks inductive — mix values (100 nF + 1 µF + 10 µF) for broadband PDN decoupling.",
  },
  {
    id: "divider", icon: Sigma, group: "Analog",
    name: "Resistor Divider",
    desc: "Output voltage, loading and power of R1/R2 divider",
    inputs: [
      { key: "vin", label: "Vin", unit: "V", def: "3.3" },
      { key: "r1", label: "R1 (top)", unit: "kΩ", def: "10" },
      { key: "r2", label: "R2 (bottom)", unit: "kΩ", def: "10" },
    ],
    compute: (v) => {
      const vout = (v.vin * v.r2) / (v.r1 + v.r2);
      const iMa = v.vin / (v.r1 + v.r2); // mA since kΩ
      const p = v.vin * iMa;
      return [
        { label: "Vout", value: fmt(vout, 4), unit: "V" },
        { label: "Divider current", value: fmt(iMa * 1000, 2), unit: "µA" },
        { label: "Total power", value: fmt(p, 3), unit: "mW" },
        { label: "Thévenin R", value: fmt((v.r1 * v.r2) / (v.r1 + v.r2), 2), unit: "kΩ" },
      ];
    },
    note: "For ADC inputs keep Thévenin R below the ADC's max source impedance, or buffer with an op-amp.",
  },
  {
    id: "ledres", icon: Lightbulb, group: "Analog",
    name: "LED Series Resistor",
    desc: "Resistor value and power for a status LED",
    inputs: [
      { key: "vs", label: "Supply voltage", unit: "V", def: "3.3" },
      { key: "vf", label: "LED Vf", unit: "V", def: "2.0" },
      { key: "i", label: "LED current", unit: "mA", def: "5" },
    ],
    compute: (v) => {
      const r = (v.vs - v.vf) / (v.i / 1000);
      const p = (v.vs - v.vf) * (v.i / 1000);
      return [
        { label: "Resistor", value: fmt(r, 1), unit: "Ω" },
        { label: "Resistor power", value: fmt(p * 1000, 2), unit: "mW" },
        { label: "Nearest E24", value: fmt(nearestE24(r), 0), unit: "Ω" },
      ];
    },
    note: "Modern green/blue LEDs are bright at 2–5 mA; don't default to 20 mA on dense boards.",
  },
  {
    id: "ohms", icon: Zap, group: "Analog",
    name: "Ohm's Law & Power",
    desc: "Solve V, I, R, P — enter any two",
    inputs: [
      { key: "v", label: "Voltage", unit: "V", def: "5" },
      { key: "i", label: "Current", unit: "A", def: "0.5" },
      { key: "r", label: "Resistance (optional)", unit: "Ω", def: "" },
    ],
    compute: (v) => {
      let V = v.v, I = v.i, R = v.r;
      if (V != null && I != null) R = V / I;
      else if (V != null && R != null) I = V / R;
      else if (I != null && R != null) V = I * R;
      if (V == null || I == null) return [{ label: "Enter any two values", value: "—", unit: "" }];
      return [
        { label: "Voltage", value: fmt(V, 3), unit: "V" },
        { label: "Current", value: fmt(I, 4), unit: "A" },
        { label: "Resistance", value: fmt(R, 3), unit: "Ω" },
        { label: "Power", value: fmt(V * I, 3), unit: "W" },
      ];
    },
    note: "",
  },
  {
    id: "wavelength", icon: Waves, group: "Signal Integrity",
    name: "Wavelength & λ/20 Rule",
    desc: "Electrical wavelength in PCB dielectric for EMI / stub checks",
    inputs: [
      { key: "f", label: "Frequency", unit: "MHz", def: "1000" },
      { key: "er", label: "Effective εr", unit: "", def: "4.2" },
    ],
    compute: (v) => {
      const c = 299.792458; // mm·GHz... using mm/ns: c = 299.79 mm/ns
      const lam = (c / (v.f / 1000)) / Math.sqrt(v.er); // mm
      return [
        { label: "λ in dielectric", value: fmt(lam, 2), unit: "mm" },
        { label: "λ/4 (stub resonance)", value: fmt(lam / 4, 2), unit: "mm" },
        { label: "λ/20 (max stub)", value: fmt(lam / 20, 2), unit: "mm" },
      ];
    },
    note: "Via stubs approaching λ/4 of the data rate's Nyquist cause deep notches — back-drill on 10G+ SerDes.",
  },
  {
    id: "pullup", icon: Zap, group: "Signal Integrity",
    name: "Pull-Up Resistor (Open-Drain / I2C)",
    desc: "Valid R range from sink current and required rise time",
    inputs: [
      { key: "vcc", label: "Vcc", unit: "V", def: "3.3" },
      { key: "cb", label: "Bus capacitance", unit: "pF", def: "200" },
      { key: "tr", label: "Max rise time", unit: "ns", def: "300" },
      { key: "iol", label: "Driver sink current IOL", unit: "mA", def: "3" },
      { key: "vol", label: "VOL (max)", unit: "V", def: "0.4" },
    ],
    compute: (v) => {
      const rmin = (v.vcc - v.vol) / (v.iol / 1000);
      const rmax = (v.tr * 1e-9) / (0.8473 * v.cb * 1e-12);
      if (rmax < rmin) return [
        { label: "R min (sink limit)", value: fmt(rmin, 0), unit: "Ω" },
        { label: "R max (rise time)", value: fmt(rmax, 0), unit: "Ω" },
        { label: "No valid R!", value: "reduce Cb or slow down", unit: "" },
      ];
      const suggest = nearestE24(Math.sqrt(rmin * rmax));
      return [
        { label: "R min (sink limit)", value: fmt(rmin, 0), unit: "Ω" },
        { label: "R max (rise time)", value: fmt(rmax, 0), unit: "Ω" },
        { label: "Suggested (E24)", value: fmt(suggest, 0), unit: "Ω" },
        { label: "Power when low", value: fmt((v.vcc * v.vcc / suggest) * 1000, 2), unit: "mW" },
      ];
    },
    note: "I2C rise is 30→70%, so tr = 0.8473·R·Cb. Defaults match Fast-mode (400 kHz, 300 ns, 3 mA). Lower R = faster edges + more power; pick low end for noisy boards, high end for battery designs.",
  },
  {
    id: "logicpullup", icon: Activity, group: "Signal Integrity",
    name: "Pull-Up to Drive a Logic Level",
    desc: "Will this R hold a CMOS input at valid VIH, and how fast?",
    inputs: [
      { key: "vcc", label: "Vcc", unit: "V", def: "3.3" },
      { key: "vih", label: "VIH required", unit: "V", def: "2.0" },
      { key: "ileak", label: "Total leakage into node", unit: "µA", def: "5" },
      { key: "r", label: "Chosen pull-up R", unit: "kΩ", def: "10" },
      { key: "c", label: "Node capacitance", unit: "pF", def: "15" },
    ],
    compute: (v) => {
      const rmaxK = ((v.vcc - v.vih) / (v.ileak * 1e-6)) / 1000;
      const vnode = v.vcc - (v.ileak * 1e-6) * (v.r * 1000);
      const trise = 2.2 * v.r * 1000 * v.c * 1e-12 * 1e9; // ns
      return [
        { label: "R max for valid high", value: fmt(rmaxK, 1), unit: "kΩ" },
        { label: "Actual node voltage", value: fmt(vnode, 3), unit: "V" },
        { label: "Rise time (10–90%)", value: fmt(trise, 1), unit: "ns" },
        { label: "Verdict", value: vnode >= v.vih ? "VALID HIGH" : "TOO LOW", unit: "" },
      ];
    },
    note: "Covers reset lines, strap pins, interrupts, unused inputs. Leakage = sum of all pins on the node (check worst-case over temperature — leakage roughly doubles every 10 °C). For straps sampled at power-up, also check against any internal pull of the opposite polarity.",
  },
  {
    id: "trbw", icon: Timer, group: "Signal Integrity",
    name: "Rise Time ↔ Bandwidth",
    desc: "Signal bandwidth from edge rate, and scope needed to measure it",
    inputs: [
      { key: "tr", label: "Rise time (10–90%)", unit: "ns", def: "1" },
    ],
    compute: (v) => {
      const bw = 0.35 / v.tr; // GHz
      return [
        { label: "Signal BW (0.35/tr)", value: fmt(bw * 1000, 1), unit: "MHz" },
        { label: "Knee frequency (0.5/tr)", value: fmt((0.5 / v.tr) * 1000, 1), unit: "MHz" },
        { label: "Scope BW needed (≥3×)", value: fmt(bw * 3 * 1000, 0), unit: "MHz" },
        { label: "Probe-limited tr if scope = BW", value: fmt(Math.sqrt(2) * v.tr, 2), unit: "ns" },
      ];
    },
    note: "The edge, not the clock rate, sets the spectrum — a 1 ns edge has ~350 MHz of content even on a 1 MHz signal. Measured tr = √(tr_signal² + tr_scope²), so an equal-BW scope inflates your reading by ~41%.",
  },
  {
    id: "edgedeg", icon: Waves, group: "Signal Integrity",
    name: "Edge Degradation (RC Loading)",
    desc: "Rise/fall time at the receiver after driver R and load C",
    inputs: [
      { key: "trd", label: "Driver rise time", unit: "ns", def: "0.5" },
      { key: "r", label: "Driver + series R", unit: "Ω", def: "33" },
      { key: "c", label: "Load capacitance", unit: "pF", def: "15" },
    ],
    compute: (v) => {
      const trc = 2.2 * v.r * v.c * 1e-12 * 1e9; // ns
      const ttot = Math.sqrt(v.trd * v.trd + trc * trc);
      return [
        { label: "RC contribution (2.2RC)", value: fmt(trc, 2), unit: "ns" },
        { label: "Rise time at load", value: fmt(ttot, 2), unit: "ns" },
        { label: "Degradation", value: fmt(((ttot / v.trd) - 1) * 100, 0), unit: "%" },
        { label: "New signal BW", value: fmt((0.35 / ttot) * 1000, 0), unit: "MHz" },
      ];
    },
    note: "Edges add root-sum-square. Useful both ways: check a clock still meets the receiver's slew spec, or deliberately slow an edge (bigger series R) to tame EMI and crosstalk without breaking timing.",
  },
  {
    id: "seriesterm", icon: Ruler, group: "Signal Integrity",
    name: "Series Termination Resistor",
    desc: "Source-termination value to match driver to the trace",
    inputs: [
      { key: "z0", label: "Trace Z₀", unit: "Ω", def: "50" },
      { key: "rdrv", label: "Driver output impedance", unit: "Ω", def: "22" },
    ],
    compute: (v) => {
      const rs = v.z0 - v.rdrv;
      if (rs <= 0) return [{ label: "Driver Z ≥ Z₀", value: "no resistor needed", unit: "" }];
      return [
        { label: "Series R", value: fmt(rs, 1), unit: "Ω" },
        { label: "Nearest E24", value: fmt(nearestE24(rs), 0), unit: "Ω" },
      ];
    },
    note: "Place within ~200 mil of the driver pin. Works for point-to-point only (clock, SPI CLK, RGMII) — the far end sees a full swing, the source absorbs the reflection. Driver Z is in the IBIS model or datasheet (often 15–35 Ω).",
  },
  {
    id: "crosstalk", icon: Waves, group: "Signal Integrity",
    name: "Crosstalk Estimator (NEXT)",
    desc: "Near-end coupling between parallel traces from spacing and height",
    inputs: [
      { key: "w", label: "Trace width", unit: "mil", def: "5" },
      { key: "s", label: "Edge-to-edge spacing", unit: "mil", def: "10" },
      { key: "h", label: "Height above plane", unit: "mil", def: "3.5" },
      { key: "len", label: "Parallel run length", unit: "mm", def: "50" },
      { key: "tr", label: "Aggressor rise time", unit: "ns", def: "0.5" },
      { key: "vagg", label: "Aggressor swing", unit: "V", def: "1.8" },
    ],
    compute: (v) => {
      const d = v.s + v.w;                       // center-to-center, mil
      const ratio = d / v.h;
      const kSat = 0.25 / (1 + ratio * ratio);   // saturated backward coupling
      const tpdMm = (85 * Math.sqrt(0.475 * 4.2 + 0.67)) / 25.4; // ps/mm, FR-4 microstrip
      const lsatMm = (v.tr * 1000) / (2 * tpdMm);
      const scale = Math.min(1, v.len / lsatMm);
      const k = kSat * scale;
      return [
        { label: "D/H ratio", value: fmt(ratio, 2), unit: "" },
        { label: "Saturated NEXT", value: fmt(kSat * 100, 2), unit: "%" },
        { label: "Saturation length", value: fmt(lsatMm, 1), unit: "mm" },
        { label: "Actual NEXT", value: fmt(k * 100, 2), unit: "%" },
        { label: "Victim noise", value: fmt(k * v.vagg * 1000, 1), unit: "mV" },
        { label: "Verdict", value: k * 100 > 5 ? "TOO HIGH" : k * 100 > 2.5 ? "Marginal" : "OK", unit: "" },
      ];
    },
    note: "Coupling falls as 1/(1+(D/H)²) — the 3W rule (s = 2×w) typically lands near 1–2%. Tighter layers (smaller h) reduce crosstalk faster than wider spacing. Stripline halves it and kills most FEXT; microstrip FEXT grows with length, so watch long top-layer parallel runs.",
  },
  {
    id: "unitconv", icon: Ruler, group: "Basics", allowPartial: true,
    name: "PCB Unit Converter",
    desc: "mil ↔ mm ↔ µm and copper oz ↔ thickness",
    inputs: [
      { key: "mil", label: "Length", unit: "mil", def: "10" },
      { key: "mm", label: "Length", unit: "mm", def: "" },
      { key: "oz", label: "Copper weight", unit: "oz", def: "1" },
    ],
    compute: (v) => {
      const out = [];
      if (v.mil !== null) out.push(
        { label: `${fmt(v.mil, 3)} mil =`, value: `${fmt(v.mil * 0.0254, 4)} mm · ${fmt(v.mil * 25.4, 1)} µm`, unit: "" });
      if (v.mm !== null) out.push(
        { label: `${fmt(v.mm, 3)} mm =`, value: `${fmt(v.mm / 0.0254, 2)} mil · ${fmt(v.mm * 1000, 0)} µm`, unit: "" });
      if (v.oz !== null) out.push(
        { label: `${fmt(v.oz, 2)} oz copper =`, value: `${fmt(v.oz * 35, 1)} µm · ${fmt(v.oz * 1.378, 2)} mil`, unit: "" });
      return out.length ? out : [{ label: "Enter any value", value: "—", unit: "" }];
    },
    note: "Anchors worth memorizing: 1 mil = 25.4 µm, 1 oz = 35 µm ≈ 1.4 mil, 0.1 mm ≈ 4 mil. Fab houses in Asia quote mm; most US constraint decks are in mil — this is where unit mix-ups in fab notes come from.",
  },

  /* ---------------- Basics ---------------- */
  {
    id: "serpar", icon: Sigma, group: "Basics", allowPartial: true,
    name: "Series & Parallel Resistors",
    desc: "Combine up to four resistors (leave unused fields blank)",
    inputs: [
      { key: "r1", label: "R1", unit: "Ω", def: "100" },
      { key: "r2", label: "R2", unit: "Ω", def: "220" },
      { key: "r3", label: "R3", unit: "Ω", def: "" },
      { key: "r4", label: "R4", unit: "Ω", def: "" },
    ],
    compute: (v) => {
      const rs = [v.r1, v.r2, v.r3, v.r4].filter((x) => x !== null && x > 0);
      if (rs.length < 2) return [{ label: "Enter at least two resistors", value: "—", unit: "" }];
      const series = rs.reduce((a, b) => a + b, 0);
      const par = 1 / rs.reduce((a, b) => a + 1 / b, 0);
      return [
        { label: `Series (${rs.length} pcs)`, value: fmt(series, 2), unit: "Ω" },
        { label: "Parallel", value: fmt(par, 3), unit: "Ω" },
        { label: "Parallel — nearest E24", value: fmt(nearestE24(par), 1), unit: "Ω" },
      ];
    },
    note: "Same math works for inductors. For capacitors it's the opposite: parallel adds, series uses the reciprocal formula.",
  },
  {
    id: "idivider", icon: Activity, group: "Basics",
    name: "Current Divider",
    desc: "How current splits between two parallel branches",
    inputs: [
      { key: "it", label: "Total current", unit: "mA", def: "100" },
      { key: "r1", label: "R1", unit: "Ω", def: "100" },
      { key: "r2", label: "R2", unit: "Ω", def: "470" },
    ],
    compute: (v) => {
      const i1 = v.it * v.r2 / (v.r1 + v.r2);
      const i2 = v.it * v.r1 / (v.r1 + v.r2);
      return [
        { label: "I through R1", value: fmt(i1, 2), unit: "mA" },
        { label: "I through R2", value: fmt(i2, 2), unit: "mA" },
        { label: "P in R1", value: fmt(i1 * i1 * v.r1 / 1000, 2), unit: "mW" },
        { label: "P in R2", value: fmt(i2 * i2 * v.r2 / 1000, 2), unit: "mW" },
      ];
    },
    note: "Current takes the path of least resistance — proportionally, not exclusively. Used for sense-resistor shunting and LED current sharing.",
  },
  {
    id: "capenergy", icon: Zap, group: "Basics",
    name: "Capacitor Charge & Energy",
    desc: "Stored charge, energy and discharge hazard check",
    inputs: [
      { key: "c", label: "Capacitance", unit: "µF", def: "470" },
      { key: "v", label: "Voltage", unit: "V", def: "48" },
    ],
    compute: (v) => {
      const cF = v.c * 1e-6;
      const e = 0.5 * cF * v.v * v.v;
      const q = cF * v.v;
      return [
        { label: "Charge Q", value: fmt(q * 1000, 3), unit: "mC" },
        { label: "Energy E", value: fmt(e * 1000, 2), unit: "mJ" },
        { label: "Hazard", value: e > 10 ? "⚠ >10 J-class: discharge before rework" : v.v > 50 ? "⚠ >50 V: treat as live" : "Low", unit: "" },
      ];
    },
    note: "Bulk caps on PoE (48–57 V) and offline supplies hold dangerous energy long after power-off — bleed resistors exist for a reason. Always verify discharge with a meter before touching.",
  },
  {
    id: "captime", icon: Timer, group: "Basics",
    name: "Capacitor Charge / Discharge Time",
    desc: "Time to reach a target voltage through a resistor",
    inputs: [
      { key: "vs", label: "Supply voltage", unit: "V", def: "3.3" },
      { key: "vt", label: "Target voltage", unit: "V", def: "2.0" },
      { key: "r", label: "Resistance", unit: "kΩ", def: "10" },
      { key: "c", label: "Capacitance", unit: "µF", def: "1" },
    ],
    compute: (v) => {
      if (v.vt >= v.vs) return [{ label: "Target must be below supply", value: "—", unit: "" }];
      const tau = v.r * 1000 * v.c * 1e-6;
      const t = -tau * Math.log(1 - v.vt / v.vs);
      return [
        { label: "Time constant τ", value: fmt(tau * 1000, 3), unit: "ms" },
        { label: "Time to target", value: fmt(t * 1000, 3), unit: "ms" },
        { label: "Time to 99% (5τ)", value: fmt(5 * tau * 1000, 3), unit: "ms" },
      ];
    },
    note: "t = −RC·ln(1 − Vt/Vs). This is your reset-delay and power-sequencing calculator — check the target against the supervisor's threshold, not 63%.",
  },
  {
    id: "inductor", icon: Waves, group: "Basics",
    name: "Inductor Reactance & Energy",
    desc: "XL at frequency and stored energy at current",
    inputs: [
      { key: "l", label: "Inductance", unit: "µH", def: "10" },
      { key: "f", label: "Frequency", unit: "kHz", def: "100" },
      { key: "i", label: "Current", unit: "A", def: "1" },
    ],
    compute: (v) => {
      const xl = 2 * Math.PI * v.f * 1e3 * v.l * 1e-6;
      const e = 0.5 * v.l * 1e-6 * v.i * v.i;
      return [
        { label: "Reactance XL", value: fmt(xl, 3), unit: "Ω" },
        { label: "Stored energy", value: fmt(e * 1e6, 2), unit: "µJ" },
        { label: "V if opened in 1 µs", value: fmt(v.l * 1e-6 * v.i / 1e-6, 1), unit: "V" },
      ];
    },
    note: "The last line is why relay coils need flyback diodes — V = L·di/dt spikes when current is interrupted. Never open an inductive path without a clamp.",
  },
  {
    id: "opamp", icon: Gauge, group: "Basics",
    name: "Op-Amp Gain",
    desc: "Inverting and non-inverting gain from Rf and Rin",
    inputs: [
      { key: "rf", label: "Rf (feedback)", unit: "kΩ", def: "100" },
      { key: "rin", label: "Rin / Rg", unit: "kΩ", def: "10" },
      { key: "vin", label: "Vin", unit: "mV", def: "100" },
    ],
    compute: (v) => {
      const gNon = 1 + v.rf / v.rin;
      const gInv = -v.rf / v.rin;
      return [
        { label: "Non-inverting gain", value: `${fmt(gNon, 3)}× (${fmt(20 * Math.log10(gNon), 1)} dB)`, unit: "" },
        { label: "Inverting gain", value: `${fmt(gInv, 3)}× (${fmt(20 * Math.log10(Math.abs(gInv)), 1)} dB)`, unit: "" },
        { label: "Vout (non-inv)", value: fmt(gNon * v.vin, 1), unit: "mV" },
        { label: "Vout (inv)", value: fmt(gInv * v.vin, 1), unit: "mV" },
      ];
    },
    note: "Check gain-bandwidth: usable BW ≈ GBW/gain. A 1 MHz op-amp at 100× gain is only flat to ~10 kHz. Keep Rf below ~1 MΩ or input bias current and noise start to bite.",
  },
  {
    id: "timer555", icon: Timer, group: "Basics",
    name: "555 Astable Timer",
    desc: "Frequency and duty cycle of the classic oscillator",
    inputs: [
      { key: "r1", label: "R1 (Vcc→DIS)", unit: "kΩ", def: "10" },
      { key: "r2", label: "R2 (DIS→THR)", unit: "kΩ", def: "47" },
      { key: "c", label: "C (timing)", unit: "nF", def: "100" },
    ],
    compute: (v) => {
      const cF = v.c * 1e-9, r1 = v.r1 * 1000, r2 = v.r2 * 1000;
      const f = 1.44 / ((r1 + 2 * r2) * cF);
      const duty = (r1 + r2) / (r1 + 2 * r2) * 100;
      return [
        { label: "Frequency", value: fmt(f, 2), unit: "Hz" },
        { label: "Duty cycle (high)", value: fmt(duty, 1), unit: "%" },
        { label: "t high", value: fmt(0.693 * (r1 + r2) * cF * 1000, 3), unit: "ms" },
        { label: "t low", value: fmt(0.693 * r2 * cF * 1000, 3), unit: "ms" },
      ];
    },
    note: "Duty is always >50% in this topology; a diode across R2 gets you near 50%. For anything precise use an MCU timer or a proper oscillator — the 555 drifts with temperature and Vcc.",
  },
  {
    id: "zener", icon: Zap, group: "Basics",
    name: "Zener Regulator Resistor",
    desc: "Series R and power ratings for a simple shunt regulator",
    inputs: [
      { key: "vin", label: "Vin", unit: "V", def: "12" },
      { key: "vz", label: "Zener voltage", unit: "V", def: "5.1" },
      { key: "il", label: "Load current", unit: "mA", def: "10" },
      { key: "iz", label: "Min zener current", unit: "mA", def: "5" },
    ],
    compute: (v) => {
      const r = (v.vin - v.vz) / ((v.il + v.iz) / 1000);
      const pr = (v.vin - v.vz) * (v.il + v.iz) / 1000;
      const pzMax = v.vz * (v.il + v.iz) / 1000; // load removed: all current in zener
      return [
        { label: "Series R", value: fmt(r, 0), unit: "Ω" },
        { label: "Nearest E24", value: fmt(nearestE24(r), 0), unit: "Ω" },
        { label: "R power (use 2×)", value: fmt(pr * 1000, 0), unit: "mW" },
        { label: "Zener P worst-case", value: fmt(pzMax * 1000, 0), unit: "mW" },
      ];
    },
    note: "Worst-case zener dissipation is with the load disconnected — rate the part for that, not nominal. Fine for bias rails and clamps; for anything real use an LDO.",
  },
  {
    id: "dbconv", icon: Sigma, group: "Basics", allowPartial: true,
    name: "dB ↔ Ratio Converter",
    desc: "Enter a ratio or a dB value (leave the other blank)",
    inputs: [
      { key: "ratio", label: "Ratio (×)", unit: "", def: "2" },
      { key: "db", label: "dB", unit: "", def: "" },
    ],
    compute: (v) => {
      if (v.ratio !== null && v.ratio > 0) return [
        { label: "Voltage dB (20·log)", value: fmt(20 * Math.log10(v.ratio), 2), unit: "dB" },
        { label: "Power dB (10·log)", value: fmt(10 * Math.log10(v.ratio), 2), unit: "dB" },
      ];
      if (v.db !== null) return [
        { label: "Voltage ratio", value: fmt(Math.pow(10, v.db / 20), 4), unit: "×" },
        { label: "Power ratio", value: fmt(Math.pow(10, v.db / 10), 4), unit: "×" },
      ];
      return [{ label: "Enter ratio or dB", value: "—", unit: "" }];
    },
    note: "Insertion loss, return loss, and gain all live in dB. Handy anchors: −3 dB = 0.707× voltage / half power; −20 dB = 0.1× voltage; 6 dB ≈ 2× voltage.",
  },
  {
    id: "freqperiod", icon: Waves, group: "Basics",
    name: "Frequency · Period · Wavelength",
    desc: "Convert between f, T and λ (air and PCB/coax)",
    inputs: [
      { key: "f", label: "Frequency", unit: "MHz", def: "100" },
    ],
    compute: (v) => {
      const t = 1 / (v.f * 1e6);
      const lamAir = 299.792 / v.f; // m → using MHz: 299.792/f m
      return [
        { label: "Period T", value: fmt(t * 1e9, 3), unit: "ns" },
        { label: "λ in air", value: fmt(lamAir, 3), unit: "m" },
        { label: "λ in FR-4 (εr 4.2)", value: fmt(lamAir / Math.sqrt(4.2) * 1000, 1), unit: "mm" },
        { label: "λ in coax (vf 0.66)", value: fmt(lamAir * 0.66, 3), unit: "m" },
      ];
    },
    note: "Antennas, cable stubs, and EMI all scale with λ. A trace or cable becomes an unintentional antenna around λ/4 — at 100 MHz that's a 50 cm cable.",
  },
  {
    id: "battery", icon: Lightbulb, group: "Basics",
    name: "Battery Life",
    desc: "Runtime from capacity and average current draw",
    inputs: [
      { key: "cap", label: "Capacity", unit: "mAh", def: "2000" },
      { key: "i", label: "Average current", unit: "mA", def: "50" },
      { key: "derate", label: "Usable capacity", unit: "%", def: "80" },
    ],
    compute: (v) => {
      const h = (v.cap * v.derate / 100) / v.i;
      return [
        { label: "Runtime", value: fmt(h, 1), unit: "hours" },
        { label: "Runtime", value: fmt(h / 24, 2), unit: "days" },
      ];
    },
    note: "Derate for temperature, aging, cutoff voltage, and peak-vs-average draw — 80% is optimistic for Li-ion at cold temps. For duty-cycled loads compute the weighted average current first (sleep + active × duty).",
  },
  {
    id: "awg", icon: Ruler, group: "Basics",
    name: "Wire Gauge (AWG)",
    desc: "Diameter, resistance and current guidance for a gauge",
    inputs: [
      { key: "awg", label: "AWG", unit: "#", def: "24" },
      { key: "len", label: "Length", unit: "m", def: "1" },
      { key: "i", label: "Current", unit: "A", def: "1" },
    ],
    compute: (v) => {
      const dMm = 0.127 * Math.pow(92, (36 - v.awg) / 39);
      const aMm2 = Math.PI * (dMm / 2) ** 2;
      const rPerM = 1.68e-8 / (aMm2 * 1e-6);
      const drop = rPerM * v.len * v.i;
      return [
        { label: "Diameter", value: fmt(dMm, 3), unit: "mm" },
        { label: "Area", value: fmt(aMm2, 3), unit: "mm²" },
        { label: "Resistance", value: fmt(rPerM * v.len * 1000, 2), unit: "mΩ" },
        { label: "V-drop (round trip ×2)", value: fmt(drop * 2 * 1000, 1), unit: "mV" },
        { label: "Guideline Imax", value: `${fmt(aMm2 * 3, 1)}–${fmt(aMm2 * 7, 1)}`, unit: "A" },
      ];
    },
    note: "Imax range: ~3 A/mm² bundled/in-harness to ~7 A/mm² free-air short runs — conservative chassis-wiring guidance, not NEC. Remember round-trip resistance for supply + return.",
  },

  /* ---------------- PDN ---------------- */
  {
    id: "ztarget", icon: Gauge, group: "PDN",
    name: "PDN Target Impedance",
    desc: "Max allowed power-rail impedance from ripple spec",
    inputs: [
      { key: "vrail", label: "Rail voltage", unit: "V", def: "0.8" },
      { key: "ripple", label: "Allowed ripple", unit: "%", def: "3" },
      { key: "imax", label: "Max load current", unit: "A", def: "20" },
      { key: "step", label: "Transient step", unit: "% of Imax", def: "50" },
      { key: "tr", label: "Load step rise time", unit: "ns", def: "10" },
    ],
    compute: (v) => {
      const zt = (v.vrail * v.ripple / 100) / (v.imax * v.step / 100);
      const fknee = 0.35 / (v.tr * 1e-9) / 1e6; // MHz
      return [
        { label: "Z target", value: fmt(zt * 1000, 3), unit: "mΩ" },
        { label: "Allowed ΔV", value: fmt(v.vrail * v.ripple * 10, 1), unit: "mV" },
        { label: "Flat up to (knee f)", value: fmt(fknee, 1), unit: "MHz" },
      ];
    },
    note: "Hold Z_PDN ≤ Z_target from DC to the knee frequency. Above ~50–100 MHz the on-package and on-die caps take over from the board.",
  },
  {
    id: "capcount", icon: Sigma, group: "PDN",
    name: "Decoupling Cap Count",
    desc: "How many caps in parallel to hit Z target at a frequency",
    inputs: [
      { key: "zt", label: "Z target", unit: "mΩ", def: "1.2" },
      { key: "f", label: "Frequency", unit: "MHz", def: "50" },
      { key: "c", label: "Cap value", unit: "nF", def: "100" },
      { key: "esl", label: "ESL + mounting L per cap", unit: "nH", def: "1.5" },
      { key: "esr", label: "ESR per cap", unit: "mΩ", def: "10" },
    ],
    compute: (v) => {
      const w = 2 * Math.PI * v.f * 1e6;
      const x = w * v.esl * 1e-9 - 1 / (w * v.c * 1e-9);
      const zcap = Math.sqrt(x * x + (v.esr / 1000) ** 2) * 1000; // mΩ
      const n = Math.ceil(zcap / v.zt);
      return [
        { label: "Z of one cap @ f", value: fmt(zcap, 3), unit: "mΩ" },
        { label: "Caps needed", value: fmt(n, 0), unit: "pcs" },
        { label: "Resulting Z", value: fmt(zcap / n, 3), unit: "mΩ" },
      ];
    },
    note: "Mounting inductance dominates above SRF — short wide traces, via-in-pad or vias at the pad edge cut ESL more than buying better caps. ESR floor: N caps can't go below ESR/N.",
  },
  {
    id: "noisecap", icon: Waves, group: "PDN",
    name: "Cap for a Specific Noise Frequency",
    desc: "Pick C so its self-resonance lands on the noise you want to kill",
    inputs: [
      { key: "f", label: "Noise frequency", unit: "MHz", def: "50" },
      { key: "l", label: "ESL + mounting L", unit: "nH", def: "1.2" },
    ],
    compute: (v) => {
      const w = 2 * Math.PI * v.f * 1e6;
      const c = 1 / (w * w * v.l * 1e-9); // F
      const cNf = c * 1e9;
      const e12 = [1.0,1.2,1.5,1.8,2.2,2.7,3.3,3.9,4.7,5.6,6.8,8.2];
      const dec = Math.pow(10, Math.floor(Math.log10(cNf)));
      let best = e12[0] * dec;
      for (const m of e12.concat([10])) { const cand = m * dec; if (Math.abs(cand - cNf) < Math.abs(best - cNf)) best = cand; }
      const fAct = 1 / (2 * Math.PI * Math.sqrt(v.l * 1e-9 * best * 1e-9)) / 1e6;
      return [
        { label: "Ideal capacitance", value: fmt(cNf, 2), unit: "nF" },
        { label: "Nearest E12 value", value: fmt(best, 1), unit: "nF" },
        { label: "Its actual SRF", value: fmt(fAct, 1), unit: "MHz" },
      ];
    },
    note: "A cap is a near-short only at its SRF — at 1.2 nH mount, 100 nF resonates ~14.5 MHz, 10 nF ~46 MHz. For a known offender (e.g. 25 MHz crystal harmonic, switcher fsw), tune C to it; for broadband use 2–3 decades of values.",
  },
  {
    id: "bulkcap", icon: Timer, group: "PDN",
    name: "Bulk Capacitance for Load Step",
    desc: "Bulk C to hold the rail until the VRM responds",
    inputs: [
      { key: "di", label: "Load step", unit: "A", def: "5" },
      { key: "dv", label: "Allowed droop", unit: "mV", def: "30" },
      { key: "t", label: "VRM response time", unit: "µs", def: "10" },
    ],
    compute: (v) => {
      const c = (v.di * v.t * 1e-6) / (v.dv * 1e-3) * 1e6; // µF
      const esrMax = v.dv / v.di;
      return [
        { label: "Bulk capacitance", value: fmt(c, 0), unit: "µF" },
        { label: "Max total ESR", value: fmt(esrMax, 2), unit: "mΩ" },
      ];
    },
    note: "ESR step (ΔI × ESR) hits instantly, before the cap even starts discharging — both conditions must hold. Polymer caps usually beat electrolytics here.",
  },

  /* ---------------- Power ---------------- */
  {
    id: "buckl", icon: Activity, group: "Power",
    name: "Buck Inductor Selection",
    desc: "L value, ripple and saturation rating for a buck converter",
    inputs: [
      { key: "vin", label: "Vin", unit: "V", def: "12" },
      { key: "vout", label: "Vout", unit: "V", def: "1.0" },
      { key: "iout", label: "Iout", unit: "A", def: "10" },
      { key: "fsw", label: "Switching freq", unit: "kHz", def: "600" },
      { key: "r", label: "Ripple ratio ΔI/Iout", unit: "%", def: "30" },
    ],
    compute: (v) => {
      const d = v.vout / v.vin;
      const di = v.iout * v.r / 100;
      const l = ((v.vin - v.vout) * d) / (v.fsw * 1e3 * di) * 1e6; // µH
      const ipk = v.iout + di / 2;
      const irms = Math.sqrt(v.iout * v.iout + (di * di) / 12);
      return [
        { label: "Inductance", value: fmt(l, 2), unit: "µH" },
        { label: "Ripple current ΔI", value: fmt(di, 2), unit: "A" },
        { label: "Peak current", value: fmt(ipk, 2), unit: "A" },
        { label: "Pick Isat ≥", value: fmt(1.2 * ipk, 1), unit: "A" },
        { label: "Irms (heating)", value: fmt(irms, 2), unit: "A" },
      ];
    },
    note: "Round up to the next standard value. Check both ratings: Isat (hard limit, current at L drop −30%) and Irms (thermal). Low DCR for efficiency; shielded ferrite near sensitive analog.",
  },
  {
    id: "cuarea", icon: Layers, group: "Power",
    name: "Copper Area for Heat Dissipation",
    desc: "Pour area needed to sink a component's power into the board",
    inputs: [
      { key: "p", label: "Power dissipated", unit: "W", def: "1" },
      { key: "trise", label: "Allowed temp rise", unit: "°C", def: "40" },
      { key: "cu", label: "Copper weight", unit: "oz", def: "1" },
    ],
    compute: (v) => {
      const k = v.cu >= 2 ? 0.85 : 1.0;
      const aIn2 = Math.pow((70 * k * v.p) / v.trise, 2);
      return [
        { label: "Copper area (one side)", value: fmt(aIn2, 2), unit: "in²" },
        { label: "Copper area", value: fmt(aIn2 * 645.16, 0), unit: "mm²" },
        { label: "θ achieved", value: fmt(v.trise / v.p, 1), unit: "°C/W" },
      ];
    },
    note: "Rule of thumb (still air, 1 oz): θ ≈ 70/√A °C/W. Thermal vias to an inner/bottom plane roughly halve the needed top-side area; airflow helps more than copper beyond ~4 in².",
  },
  {
    id: "ldo", icon: Zap, group: "Power",
    name: "LDO Power & Junction Temp",
    desc: "Dissipation and Tj check for a linear regulator",
    inputs: [
      { key: "vin", label: "Vin", unit: "V", def: "5" },
      { key: "vout", label: "Vout", unit: "V", def: "3.3" },
      { key: "i", label: "Load current", unit: "mA", def: "500" },
      { key: "theta", label: "θja", unit: "°C/W", def: "60" },
      { key: "ta", label: "Ambient", unit: "°C", def: "40" },
    ],
    compute: (v) => {
      const p = (v.vin - v.vout) * (v.i / 1000);
      const tj = v.ta + p * v.theta;
      return [
        { label: "Power dissipated", value: fmt(p * 1000, 0), unit: "mW" },
        { label: "Junction temp", value: fmt(tj, 1), unit: "°C" },
        { label: "Verdict (Tj,max 125°C)", value: tj > 125 ? "TOO HOT" : tj > 105 ? "Marginal" : "OK", unit: "" },
        { label: "Efficiency", value: fmt((v.vout / v.vin) * 100, 1), unit: "%" },
      ];
    },
    note: "If marginal: bigger thermal pad area, lower Vin (pre-regulate with a buck), or switch to a buck entirely. θja from the datasheet assumes its test board — real boards are usually worse.",
  },
  {
    id: "lcfilter", icon: Gauge, group: "Power",
    name: "LC Input/Output Filter",
    desc: "Cutoff, characteristic impedance and switcher-noise attenuation",
    inputs: [
      { key: "l", label: "Inductance", unit: "µH", def: "1" },
      { key: "c", label: "Capacitance", unit: "µF", def: "22" },
      { key: "fsw", label: "Noise / switching freq", unit: "kHz", def: "600" },
    ],
    compute: (v) => {
      const lH = v.l * 1e-6, cF = v.c * 1e-6;
      const fc = 1 / (2 * Math.PI * Math.sqrt(lH * cF)) / 1e3; // kHz
      const z0 = Math.sqrt(lH / cF);
      const att = 40 * Math.log10(v.fsw / fc); // dB at fsw (2nd order)
      return [
        { label: "Cutoff fc", value: fmt(fc, 2), unit: "kHz" },
        { label: "Characteristic Z₀", value: fmt(z0, 3), unit: "Ω" },
        { label: "Attenuation @ fsw", value: v.fsw > fc ? fmt(att, 1) : "0", unit: "dB" },
      ];
    },
    note: "Set fc ≈ fsw/10 for ~40 dB of ripple attenuation. Undamped LC peaks at fc — damp with a lossy electrolytic or series-RC across the cap, and keep Z₀ well below the converter's negative input impedance to avoid oscillation.",
  },
  {
    id: "skindepth", icon: Waves, group: "Signal Integrity",
    name: "Skin Depth & AC Resistance",
    desc: "Current crowding into the conductor surface vs frequency",
    inputs: [
      { key: "f", label: "Frequency", unit: "MHz", def: "1000" },
      { key: "w", label: "Trace width", unit: "mil", def: "5" },
      { key: "t", label: "Copper thickness", unit: "oz", def: "1" },
    ],
    compute: (v) => {
      const f = v.f * 1e6, rho = 1.68e-8, mu = 4e-7 * Math.PI;
      const skin = Math.sqrt(rho / (Math.PI * f * mu)); // m
      const skinUm = skin * 1e6;
      const wM = v.w * 25.4e-6, tM = v.t * 34.8e-6;
      const rdc = rho / (wM * tM); // ohm/m
      const effArea = Math.min(wM * tM, 2 * (wM + tM) * skin);
      const rac = rho / effArea;
      return [
        { label: "Skin depth δ", value: fmt(skinUm, 2), unit: "µm" },
        { label: "DC resistance", value: fmt(rdc * 0.0254 * 1000, 2), unit: "mΩ/in" },
        { label: "AC resistance", value: fmt(rac * 0.0254 * 1000, 2), unit: "mΩ/in" },
        { label: "AC/DC ratio", value: fmt(rac / rdc, 2), unit: "×" },
      ];
    },
    note: "δ = √(ρ/(π·f·µ)). Above ~50 MHz current flows in a thin surface layer, so AC resistance rises with √f — the root cause of dielectric+conductor loss on long SerDes channels. Smooth copper (low Rz foil) matters here.",
  },
  {
    id: "reflection", icon: Activity, group: "Signal Integrity",
    name: "Reflection / VSWR / Return Loss",
    desc: "Impedance mismatch → reflection coefficient, VSWR, RL",
    inputs: [
      { key: "z0", label: "Line impedance Z₀", unit: "Ω", def: "50" },
      { key: "zl", label: "Load / mismatch Z", unit: "Ω", def: "75" },
    ],
    compute: (v) => {
      const g = (v.zl - v.z0) / (v.zl + v.z0);
      const ga = Math.abs(g);
      const vswr = ga < 1 ? (1 + ga) / (1 - ga) : Infinity;
      const rl = ga > 0 ? -20 * Math.log10(ga) : Infinity;
      const pct = ga * 100;
      return [
        { label: "Reflection Γ", value: fmt(g, 3), unit: "" },
        { label: "Reflected amplitude", value: fmt(pct, 1), unit: "%" },
        { label: "VSWR", value: vswr === Infinity ? "∞" : fmt(vswr, 2), unit: ":1" },
        { label: "Return loss", value: rl === Infinity ? "∞" : fmt(rl, 1), unit: "dB" },
      ];
    },
    note: "Γ = (ZL − Z₀)/(ZL + Z₀). A 10% impedance error (e.g. 55 Ω on a 50 Ω line) gives Γ≈0.05, RL≈26 dB — usually fine. Watch connector/via transitions and stubs where Z swings hardest. Target RL > 15–20 dB for multi-Gbps links.",
  },
  {
    id: "tjunction", icon: Cable, group: "Signal Integrity",
    name: "Max Stub / Branch Length",
    desc: "Longest unterminated stub before it must be treated as a line",
    inputs: [
      { key: "tr", label: "Signal rise time", unit: "ps", def: "100" },
      { key: "er", label: "Dielectric εr", unit: "", def: "4.2" },
      { key: "frac", label: "Stub fraction of tr", unit: "", def: "0.1" },
    ],
    compute: (v) => {
      const tpd = 85 * Math.sqrt(0.475 * v.er + 0.67); // ps/in microstrip
      const tpdStrip = 85 * Math.sqrt(v.er); // ps/in stripline
      const lMicro = (v.frac * v.tr) / tpd; // inch
      const lStrip = (v.frac * v.tr) / tpdStrip;
      return [
        { label: "Max stub (microstrip)", value: fmt(lMicro * 1000, 0), unit: "mil" },
        { label: "Max stub (stripline)", value: fmt(lStrip * 1000, 0), unit: "mil" },
        { label: "Critical length (½tr)", value: fmt((0.5 * v.tr) / tpd * 1000, 0), unit: "mil" },
      ];
    },
    note: "A stub stays invisible while its round-trip delay ≪ rise time. Rule of thumb: keep stubs < tr/10 of a propagation length. Beyond that it rings and must be terminated or removed (back-drill long via stubs on PCIe Gen4+).",
  },
  {
    id: "planecap", icon: Layers, group: "PDN",
    name: "Plane Capacitance",
    desc: "Inter-plane (buried) capacitance of a power/ground pair",
    inputs: [
      { key: "area", label: "Overlap area", unit: "in²", def: "1" },
      { key: "d", label: "Plane separation", unit: "mil", def: "4" },
      { key: "er", label: "Dielectric εr", unit: "", def: "4.2" },
    ],
    compute: (v) => {
      const A = v.area * 0.0254 * 0.0254, d = v.d * 25.4e-6;
      const C = 8.854e-12 * v.er * A / d; // F
      const cpF = C * 1e12;
      const density = cpF / v.area;
      return [
        { label: "Plane capacitance", value: fmt(cpF, 0), unit: "pF" },
        { label: "Density", value: fmt(density, 0), unit: "pF/in²" },
        { label: "Self-resonance hint", value: "very high f", unit: "" },
      ];
    },
    note: "C = ε₀·εr·A/d. Buried capacitance (thin power/GND dielectric) supplies the fastest decoupling — no mounting inductance, effective into the GHz where discrete caps die. A 2-mil core roughly doubles this vs 4-mil. Complements, never replaces, discrete decaps.",
  },
  {
    id: "thermalvia", icon: Gauge, group: "Power",
    name: "Thermal Via Array",
    desc: "Heat-sinking vias under a power IC / thermal pad",
    inputs: [
      { key: "n", label: "Number of vias", unit: "", def: "9" },
      { key: "d", label: "Via drill diameter", unit: "mil", def: "12" },
      { key: "h", label: "Board thickness", unit: "mil", def: "63" },
      { key: "plated", label: "Cu plating (in barrel)", unit: "mil", def: "1" },
    ],
    compute: (v) => {
      const kCu = 385, kFR4 = 0.3;
      const dM = v.d * 25.4e-6, hM = v.h * 25.4e-6, plM = v.plated * 25.4e-6;
      const barrelArea = Math.PI * dM * plM; // annular copper
      const rCuVia = hM / (kCu * barrelArea); // K/W per via (copper barrel)
      const rArray = rCuVia / v.n;
      const fillArea = Math.PI * (dM / 2) ** 2;
      return [
        { label: "θ per via (Cu barrel)", value: fmt(rCuVia, 0), unit: "°C/W" },
        { label: "θ array (parallel)", value: fmt(rArray, 1), unit: "°C/W" },
        { label: "Effective for", value: fmt(v.n, 0) + " vias", unit: "" },
      ];
    },
    note: "Thermal vias act as parallel resistors from the pad to an inner/bottom plane. More vias and thicker plating cut θ. Typical 0.3mm via ≈ 100–200 °C/W alone; a 3×3 array drops that ~9×. Tie to a copper pour with enough area to actually spread the heat.",
  },
  {
    id: "rmscurrent", icon: Sigma, group: "Power",
    name: "RMS Current (waveform)",
    desc: "RMS of common converter waveforms for cap/FET heating",
    inputs: [
      { key: "ipk", label: "Peak current", unit: "A", def: "10" },
      { key: "duty", label: "Duty cycle D", unit: "", def: "0.3" },
      { key: "shape", label: "1=square 2=triangle 3=trap", unit: "", def: "3" },
      { key: "dripple", label: "Ripple ΔI (trap)", unit: "A", def: "3" },
    ],
    compute: (v) => {
      let rms;
      if (v.shape <= 1) rms = v.ipk * Math.sqrt(v.duty);
      else if (v.shape <= 2) rms = v.ipk * Math.sqrt(v.duty / 3);
      else { const iavg = v.ipk - v.dripple / 2; rms = Math.sqrt(v.duty * (iavg * iavg + v.dripple * v.dripple / 12)); }
      const acRms = v.shape >= 3 ? v.dripple / Math.sqrt(12) : rms;
      return [
        { label: "RMS current", value: fmt(rms, 2), unit: "A" },
        { label: "AC RMS (heating in cap)", value: fmt(acRms, 2), unit: "A" },
        { label: "Avg current", value: fmt(v.shape >= 3 ? (v.ipk - v.dripple / 2) * v.duty : v.ipk * v.duty, 2), unit: "A" },
      ];
    },
    note: "FET and capacitor self-heating scale with I²·R using the RMS value, not the average. Input caps in a buck see trapezoidal ripple ~Iout·√(D(1−D)); rate caps for that RMS or they cook.",
  },
  {
    id: "ibisslew", icon: Activity, group: "Signal Integrity",
    name: "Bandwidth & Knee Frequency",
    desc: "Spectral content of an edge — what BW your channel must pass",
    inputs: [
      { key: "tr", label: "Rise time (10–90%)", unit: "ps", def: "100" },
      { key: "datarate", label: "Data rate (optional)", unit: "Gbps", def: "0" },
    ],
    compute: (v) => {
      const trS = v.tr * 1e-12;
      const knee = 0.5 / trS; // Hz
      const bw = 0.35 / trS;
      const nyq = v.datarate > 0 ? v.datarate * 1e9 / 2 : 0;
      return [
        { label: "Knee frequency", value: fmt(knee / 1e9, 2), unit: "GHz" },
        { label: "−3dB bandwidth", value: fmt(bw / 1e9, 2), unit: "GHz" },
        { label: "5th harmonic", value: fmt(5 * knee / 1e9, 1), unit: "GHz" },
        ...(nyq ? [{ label: "Nyquist (data)", value: fmt(nyq / 1e9, 2), unit: "GHz" }] : []),
      ];
    },
    note: "f_knee ≈ 0.5/tr holds most edge energy; your channel must pass to ~the 3rd–5th harmonic to keep the edge clean. Faster edges than the signal needs only buy you EMI and crosstalk — slow drivers deliberately when timing allows.",
  },
  {
    id: "powerloss", icon: Zap, group: "Power",
    name: "Plane / Trace IR Drop & Loss",
    desc: "DC voltage drop and power burned in a copper path",
    inputs: [
      { key: "i", label: "Current", unit: "A", def: "10" },
      { key: "len", label: "Path length", unit: "mm", def: "50" },
      { key: "w", label: "Width", unit: "mm", def: "5" },
      { key: "t", label: "Copper", unit: "oz", def: "1" },
      { key: "temp", label: "Temp", unit: "°C", def: "25" },
    ],
    compute: (v) => {
      const rho = 1.68e-8 * (1 + 0.00393 * (v.temp - 20));
      const tM = v.t * 34.8e-6, wM = v.w * 1e-3, lM = v.len * 1e-3;
      const R = rho * lM / (wM * tM);
      const vdrop = v.i * R, ploss = v.i * v.i * R;
      return [
        { label: "Resistance", value: fmt(R * 1000, 2), unit: "mΩ" },
        { label: "IR drop", value: fmt(vdrop * 1000, 1), unit: "mV" },
        { label: "Power dissipated", value: fmt(ploss, 3), unit: "W" },
      ];
    },
    note: "On low-voltage high-current rails (0.8 V core at tens of amps) even a few mΩ of plane resistance eats your voltage budget. Widen pours, use more copper weight, add via stitching between plane layers, and sense voltage at the load (remote sense) where you can.",
  },
  {
    id: "antipad", icon: Layers, group: "Signal Integrity",
    name: "Via Antipad / Impedance Tuning",
    desc: "Rough via impedance vs barrel, pad and antipad geometry",
    inputs: [
      { key: "d", label: "Via drill", unit: "mil", def: "10" },
      { key: "pad", label: "Pad diameter", unit: "mil", def: "18" },
      { key: "anti", label: "Antipad diameter", unit: "mil", def: "30" },
      { key: "er", label: "εr", unit: "", def: "4.2" },
      { key: "h", label: "Layer span thickness", unit: "mil", def: "40" },
    ],
    compute: (v) => {
      // crude coax-like model: Z ≈ 60/√er · ln(antipad/via)
      const z = (60 / Math.sqrt(v.er)) * Math.log(v.anti / v.d);
      const cVia = 2 * Math.PI * 8.854e-12 * v.er * (v.h * 25.4e-6) / Math.log(v.anti / v.d) * 1e12;
      return [
        { label: "Approx via Z₀", value: fmt(z, 1), unit: "Ω" },
        { label: "Via capacitance", value: fmt(cVia, 2), unit: "pF" },
        { label: "Tune toward", value: "50 / 100 Ω", unit: "" },
      ];
    },
    note: "A via is a short coax: bigger antipad raises its impedance, bigger pad/barrel lowers it. For controlled-impedance transitions enlarge the antipad and minimize stub via back-drilling. This is a first-order estimate — verify transitions in a 3D solver for Gen4+.",
  },

  /* ================= FPGA & Logic ================= */
  {
    id: "cdcmtbf", icon: Cpu, group: "FPGA & Logic",
    name: "CDC Metastability MTBF",
    desc: "Mean time between metastability failures at a clock-domain crossing",
    inputs: [
      { key: "fclk", label: "Capture clock", unit: "MHz", def: "156.25" },
      { key: "fdat", label: "Data toggle rate", unit: "MHz", def: "10" },
      { key: "tmet", label: "Settle time available", unit: "ns", def: "5" },
      { key: "tau", label: "Regeneration τ", unit: "ps", def: "50" },
      { key: "w", label: "Capture window W", unit: "ps", def: "100" },
    ],
    compute: (v) => {
      const mtbfS = Math.exp((v.tmet * 1e-9) / (v.tau * 1e-12)) / ((v.w * 1e-12) * v.fclk * 1e6 * v.fdat * 1e6);
      const yrs = mtbfS / 3.156e7;
      const disp = yrs > 1e9 ? "> 10⁹ (safe)" : yrs > 1 ? fmt(yrs, 1) : fmt(yrs * 365, 1) + " days →";
      return [
        { label: "MTBF", value: yrs > 1e9 ? "≫ universe age" : disp, unit: yrs > 1 && yrs < 1e9 ? "years" : "" },
        { label: "log₁₀(MTBF sec)", value: fmt(Math.log10(mtbfS), 1), unit: "" },
        { label: "Verdict", value: yrs > 1000 ? "SAFE" : yrs > 1 ? "Marginal" : "ADD SYNC STAGE", unit: "" },
      ];
    },
    note: "MTBF = e^(t/τ) / (W·fclk·fdata). Every extra synchronizer flop adds a full clock period to t, multiplying MTBF astronomically — this is why 2-FF (or 3-FF above ~300 MHz) synchronizers are mandatory on every async crossing. τ and W come from the FPGA vendor's characterization.",
  },
  {
    id: "timingslack", icon: Timer, group: "FPGA & Logic",
    name: "Setup / Hold Timing Slack",
    desc: "Register-to-register timing margin at a given clock",
    inputs: [
      { key: "fclk", label: "Clock", unit: "MHz", def: "156.25" },
      { key: "tco", label: "Clock-to-out Tco", unit: "ns", def: "0.6" },
      { key: "tpd", label: "Logic + route delay", unit: "ns", def: "4.2" },
      { key: "tsu", label: "Setup Tsu", unit: "ns", def: "0.5" },
      { key: "th", label: "Hold Th", unit: "ns", def: "0.2" },
      { key: "skew", label: "Clock skew", unit: "ns", def: "0.1" },
    ],
    compute: (v) => {
      const T = 1000 / v.fclk;
      const setup = T - v.tco - v.tpd - v.tsu + v.skew;
      const hold = v.tco + v.tpd - v.th - v.skew;
      const fmax = 1000 / (v.tco + v.tpd + v.tsu - v.skew);
      return [
        { label: "Clock period", value: fmt(T, 3), unit: "ns" },
        { label: "Setup slack", value: fmt(setup, 3), unit: "ns" },
        { label: "Hold slack", value: fmt(hold, 3), unit: "ns" },
        { label: "Fmax (this path)", value: fmt(fmax, 1), unit: "MHz" },
        { label: "Verdict", value: setup < 0 ? "SETUP FAIL" : hold < 0 ? "HOLD FAIL" : "MEETS TIMING", unit: "" },
      ];
    },
    note: "Setup slack = T − Tco − Tpath − Tsu (+ favorable skew); hold slack = Tco + Tpath(min) − Th − skew. Setup fails are fixed by pipelining or a slower clock; hold fails only by adding delay — which is why hold violations after place-and-route are the scarier ones.",
  },
  {
    id: "pllsolve", icon: Gauge, group: "FPGA & Logic",
    name: "PLL / Clock Synthesis",
    desc: "Find M / N / D for a target output from a reference clock",
    inputs: [
      { key: "fin", label: "Reference in", unit: "MHz", def: "25" },
      { key: "fout", label: "Target out", unit: "MHz", def: "156.25" },
      { key: "vlo", label: "VCO min", unit: "MHz", def: "600" },
      { key: "vhi", label: "VCO max", unit: "MHz", def: "1600" },
    ],
    compute: (v) => {
      let best = null;
      for (let n = 1; n <= 16; n++) for (let m = 1; m <= 128; m++) {
        const vco = v.fin * m / n;
        if (vco < v.vlo || vco > v.vhi) continue;
        for (let d = 1; d <= 128; d++) {
          const f = vco / d;
          const err = Math.abs(f - v.fout) / v.fout;
          if (!best || err < best.err) best = { m, n, d, f, vco, err };
        }
      }
      if (!best) return [{ label: "No solution", value: "widen VCO range", unit: "" }];
      return [
        { label: "M / N / D", value: `${best.m} / ${best.n} / ${best.d}`, unit: "" },
        { label: "VCO frequency", value: fmt(best.vco, 2), unit: "MHz" },
        { label: "Actual output", value: fmt(best.f, 4), unit: "MHz" },
        { label: "Error", value: best.err < 1e-9 ? "exact" : fmt(best.err * 1e6, 1), unit: best.err < 1e-9 ? "" : "ppm" },
      ];
    },
    note: "fout = fin·M/(N·D) with the VCO (fin·M/N) held inside its legal range. Exact ratios (e.g. 25→156.25 = ×6.25) come out ppm-perfect; awkward ones show the residual error, which lands in your SerDes reference-clock ppm budget.",
  },
  {
    id: "fpgapower", icon: Zap, group: "FPGA & Logic",
    name: "Dynamic Power (CV²f)",
    desc: "Switching power of a logic node, bus, or clock tree",
    inputs: [
      { key: "c", label: "Switched capacitance", unit: "pF", def: "200" },
      { key: "v", label: "Core voltage", unit: "V", def: "0.85" },
      { key: "f", label: "Clock", unit: "MHz", def: "300" },
      { key: "a", label: "Toggle rate α (0–1)", unit: "", def: "0.15" },
    ],
    compute: (vv) => {
      const p = vv.a * vv.c * 1e-12 * vv.v * vv.v * vv.f * 1e6;
      return [
        { label: "Dynamic power", value: fmt(p * 1000, 2), unit: "mW" },
        { label: "Per MHz", value: fmt(p / vv.f * 1e6, 2), unit: "µW/MHz" },
        { label: "Energy per toggle", value: fmt(vv.c * 1e-12 * vv.v * vv.v * 1e12, 2), unit: "pJ" },
      ];
    },
    note: "P = α·C·V²·f — the reason core voltages keep falling: power drops with V². α is the fraction of nodes toggling per cycle (clock trees ≈ 1, data logic ≈ 0.1–0.2). For whole-chip numbers use the vendor's power estimator; this is for a bus, clock net, or back-of-envelope check.",
  },
  {
    id: "configtime", icon: FileText, group: "FPGA & Logic",
    name: "FPGA Config Time & Flash",
    desc: "Bitstream load time and flash size for a config interface",
    inputs: [
      { key: "bits", label: "Bitstream size", unit: "Mbit", def: "100" },
      { key: "fcfg", label: "Config clock", unit: "MHz", def: "50" },
      { key: "width", label: "Bus width (1/4/8/16/32)", unit: "bits", def: "4" },
    ],
    compute: (v) => {
      const t = v.bits * 1e6 / (v.fcfg * 1e6 * v.width);
      const flashMB = v.bits / 8;
      return [
        { label: "Config time", value: t >= 1 ? fmt(t, 2) : fmt(t * 1000, 0), unit: t >= 1 ? "s" : "ms" },
        { label: "Min flash size", value: fmt(flashMB, 1), unit: "MB" },
        { label: "Suggested flash", value: fmt(Math.pow(2, Math.ceil(Math.log2(flashMB))), 0), unit: "MB (next 2ⁿ)" },
      ];
    },
    note: "t = bits/(fclk·width). QSPI at 50–100 MHz is the usual sweet spot; parallel (x8/x16) or PCIe/SelectMAP when a large FPGA must be up fast (e.g. before a host's PCIe enumeration window ≈ 100–120 ms after PERST#). Size flash to the next power of two and leave room for multiboot/golden images.",
  },
  {
    id: "lvds", icon: Activity, group: "FPGA & Logic",
    name: "LVDS / Differential Signaling",
    desc: "Drive current, swing and termination for LVDS-class links",
    inputs: [
      { key: "vod", label: "Differential swing Vod", unit: "mV", def: "350" },
      { key: "rterm", label: "Termination", unit: "Ω", def: "100" },
      { key: "vcm", label: "Common mode", unit: "V", def: "1.2" },
    ],
    compute: (v) => {
      const idrv = v.vod / v.rterm;
      const vp = v.vcm + v.vod / 2000, vn = v.vcm - v.vod / 2000;
      const pTerm = (v.vod / 1000) ** 2 / v.rterm * 1000;
      return [
        { label: "Driver current", value: fmt(idrv, 2), unit: "mA" },
        { label: "V+ / V− levels", value: `${fmt(vp, 3)} / ${fmt(vn, 3)}`, unit: "V" },
        { label: "Termination power", value: fmt(pTerm, 2), unit: "mW" },
      ];
    },
    note: "Standard LVDS: 350 mV across 100 Ω ≈ 3.5 mA, CM 1.2 V. Sub-LVDS/SLVS run lower swing and CM for less power. Terminate at the receiver, keep the pair tightly coupled, and match intra-pair length — skew converts differential to common-mode noise.",
  },

  /* ================= Networking & Switch ================= */
  {
    id: "packetrate", icon: Network, group: "Networking",
    name: "Packet Rate / Wire Speed",
    desc: "Max frames-per-second a port must forward at line rate",
    inputs: [
      { key: "rate", label: "Line rate", unit: "Gbps", def: "10" },
      { key: "frame", label: "Frame size", unit: "B", def: "64" },
    ],
    compute: (v) => {
      const onWire = v.frame + 8 + 12; // preamble+SFD + IFG
      const pps = v.rate * 1e9 / (onWire * 8);
      const nsPerPkt = 1e9 / pps;
      return [
        { label: "Packet rate", value: fmt(pps / 1e6, 3), unit: "Mpps" },
        { label: "Time per packet", value: fmt(nsPerPkt, 1), unit: "ns" },
        { label: "Overhead", value: fmt((onWire - v.frame) / onWire * 100, 1), unit: "%" },
      ];
    },
    note: "On-wire size = frame + 8 B preamble/SFD + 12 B inter-frame gap. The classic stress number: 64 B at 10G = 14.88 Mpps, one packet every 67.2 ns — the budget your parser, lookup, and buffering pipeline must meet per port for line-rate small-packet forwarding.",
  },
  {
    id: "oversub", icon: Network, group: "Networking",
    name: "Fabric BW & Oversubscription",
    desc: "Downlink vs uplink capacity of a switch design",
    inputs: [
      { key: "ndown", label: "Downlink ports", unit: "", def: "48" },
      { key: "sdown", label: "Downlink speed", unit: "Gbps", def: "25" },
      { key: "nup", label: "Uplink ports", unit: "", def: "8" },
      { key: "sup", label: "Uplink speed", unit: "Gbps", def: "100" },
    ],
    compute: (v) => {
      const down = v.ndown * v.sdown, up = v.nup * v.sup;
      const ratio = down / up;
      const fabric = (down + up); // unidirectional port capacity sum
      return [
        { label: "Downlink capacity", value: fmt(down, 0), unit: "Gbps" },
        { label: "Uplink capacity", value: fmt(up, 0), unit: "Gbps" },
        { label: "Oversubscription", value: fmt(ratio, 2), unit: ": 1" },
        { label: "Switching capacity", value: fmt(fabric * 2 / 1000, 2), unit: "Tbps (full duplex)" },
        { label: "Verdict", value: ratio <= 1 ? "Non-blocking" : ratio <= 3 ? "Typical ToR" : "Heavily oversubscribed", unit: "" },
      ];
    },
    note: "Oversubscription = Σdownlink / Σuplink. 1:1 is non-blocking (spine, storage); 2–3:1 is normal for ToR server access. Marketing \"switching capacity\" doubles the port sum for full duplex — know which number a datasheet is quoting.",
  },
  {
    id: "poe", icon: Zap, group: "Networking",
    name: "PoE Power Budget",
    desc: "802.3 af/at/bt per-port and total PSE budget",
    inputs: [
      { key: "cls", label: "Class (3=af 4=at 6=bt60 8=bt90)", unit: "", def: "4" },
      { key: "n", label: "Powered ports", unit: "", def: "24" },
      { key: "eff", label: "PSE efficiency", unit: "%", def: "90" },
    ],
    compute: (v) => {
      const table = { 3: [15.4, 12.95, "802.3af"], 4: [30, 25.5, "802.3at"], 5: [45, 40, "802.3bt T3"], 6: [60, 51, "802.3bt T3"], 7: [75, 62, "802.3bt T4"], 8: [90, 71.3, "802.3bt T4"] };
      const row = table[Math.round(v.cls)] || table[4];
      const total = row[0] * v.n;
      const supply = total / (v.eff / 100);
      return [
        { label: "Standard", value: row[2], unit: "" },
        { label: "PSE per port", value: fmt(row[0], 1), unit: "W" },
        { label: "PD receives", value: fmt(row[1], 1), unit: "W" },
        { label: "Total PoE budget", value: fmt(total, 0), unit: "W" },
        { label: "PSU sizing (@η)", value: fmt(supply, 0), unit: "W + system power" },
      ];
    },
    note: "PSE allocates per-port power (cable loss explains PSE vs PD delta). A 24-port at-class switch needs 720 W of PoE budget on top of the system's own draw — this drives PSU, thermal, and 54 V rail design. Real deployments rarely max every port; budget by expected class mix.",
  },
  {
    id: "optical", icon: Waves, group: "Networking",
    name: "Optical Link Budget",
    desc: "Fiber link margin from Tx power, Rx sensitivity, and losses",
    inputs: [
      { key: "ptx", label: "Tx power (min)", unit: "dBm", def: "-8.2" },
      { key: "sens", label: "Rx sensitivity", unit: "dBm", def: "-14.4" },
      { key: "km", label: "Fiber length", unit: "km", def: "10" },
      { key: "attn", label: "Fiber loss", unit: "dB/km", def: "0.4" },
      { key: "nconn", label: "Connectors", unit: "", def: "2" },
    ],
    compute: (v) => {
      const budget = v.ptx - v.sens;
      const loss = v.km * v.attn + v.nconn * 0.5;
      const margin = budget - loss;
      return [
        { label: "Power budget", value: fmt(budget, 1), unit: "dB" },
        { label: "Link loss", value: fmt(loss, 1), unit: "dB" },
        { label: "Margin", value: fmt(margin, 1), unit: "dB" },
        { label: "Verdict", value: margin >= 3 ? "OK (≥3 dB)" : margin >= 0 ? "Thin — add margin" : "LINK FAILS", unit: "" },
      ];
    },
    note: "Budget = Tx(min) − Rx sensitivity; subtract fiber (·dB/km), ~0.5 dB per connector, ~0.1 dB per splice. Keep ≥3 dB for aging and temperature. Also check the Rx overload ceiling on short links — too much power fails too (attenuate patch-cord loops in the lab).",
  },
  {
    id: "swlatency", icon: Timer, group: "Networking",
    name: "Switching Latency",
    desc: "Store-and-forward vs cut-through port-to-port latency",
    inputs: [
      { key: "frame", label: "Frame size", unit: "B", def: "1518" },
      { key: "rate", label: "Port rate", unit: "Gbps", def: "10" },
      { key: "fabric", label: "Fabric/pipeline delay", unit: "ns", def: "800" },
    ],
    compute: (v) => {
      const ser = v.frame * 8 / (v.rate * 1e9) * 1e9;
      const sf = ser + v.fabric;
      const ct = 64 * 8 / (v.rate * 1e9) * 1e9 + v.fabric;
      return [
        { label: "Serialization", value: fmt(ser, 0), unit: "ns" },
        { label: "Store-and-forward", value: fmt(sf / 1000, 2), unit: "µs" },
        { label: "Cut-through", value: fmt(ct, 0), unit: "ns" },
        { label: "S&F penalty", value: fmt((sf - ct) / 1000, 2), unit: "µs" },
      ];
    },
    note: "Store-and-forward waits for the whole frame (serialization = bytes·8/rate) before forwarding; cut-through launches after the header. At 10G a 1518 B frame costs 1.2 µs just to receive — why HFT and HPC fabrics run cut-through and small frames.",
  },
  {
    id: "bertime", icon: Sigma, group: "Networking",
    name: "BER Test Duration",
    desc: "How long to run a BERT to prove a target bit-error rate",
    inputs: [
      { key: "ber", label: "Target BER (1e−x)", unit: "x", def: "12" },
      { key: "rate", label: "Lane rate", unit: "Gbps", def: "10.3125" },
      { key: "cl", label: "Confidence", unit: "%", def: "95" },
    ],
    compute: (v) => {
      const ber = Math.pow(10, -v.ber);
      const nBits = -Math.log(1 - v.cl / 100) / ber;
      const t = nBits / (v.rate * 1e9);
      return [
        { label: "Bits required (0 errors)", value: fmt(nBits / 1e12, 2), unit: "Tbit" },
        { label: "Test time", value: t > 3600 ? fmt(t / 3600, 2) : t > 60 ? fmt(t / 60, 1) : fmt(t, 0), unit: t > 3600 ? "hr" : t > 60 ? "min" : "s" },
        { label: "Rule of thumb", value: "3/BER bits @95%", unit: "" },
      ];
    },
    note: "Zero-error proof at confidence CL needs −ln(1−CL)/BER bits ≈ 3/BER at 95%. Proving 1e−12 at 10.3125 G takes ~5 min; 1e−15 takes ~3.4 days per lane — why link training reports margin (eye height/width) instead of brute-force BER at deep targets.",
  },
  {
    id: "airflow", icon: Gauge, group: "Networking",
    name: "System Airflow (CFM)",
    desc: "Fan airflow needed to carry a chassis' heat at a ΔT",
    inputs: [
      { key: "p", label: "Dissipated power", unit: "W", def: "500" },
      { key: "dt", label: "Allowed air ΔT", unit: "°C", def: "15" },
      { key: "alt", label: "Altitude derate", unit: "×", def: "1" },
    ],
    compute: (v) => {
      const cfm = 1.76 * v.p / v.dt * v.alt;
      const m3h = cfm * 1.699;
      return [
        { label: "Required airflow", value: fmt(cfm, 1), unit: "CFM" },
        { label: "Metric", value: fmt(m3h, 0), unit: "m³/h" },
        { label: "Per fan (÷4)", value: fmt(cfm / 4, 1), unit: "CFM" },
      ];
    },
    note: "CFM ≈ 1.76·P/ΔT at sea level (mass-flow heat equation). Real chassis need headroom: fan curves sag against backpressure from heatsinks/filters, altitude thins air (~×1.2 at 1800 m), and N+1 redundancy means meeting the number with a fan failed. Front-to-back at ≤ 55 °C inlet is the usual enterprise spec.",
  },
];

function nearestE24(r) {
  if (!r || r <= 0) return null;
  const e24 = [1.0,1.1,1.2,1.3,1.5,1.6,1.8,2.0,2.2,2.4,2.7,3.0,3.3,3.6,3.9,4.3,4.7,5.1,5.6,6.2,6.8,7.5,8.2,9.1];
  const dec = Math.pow(10, Math.floor(Math.log10(r)));
  let best = e24[0] * dec;
  for (const m of e24.concat([10])) {
    const cand = m * dec;
    if (Math.abs(cand - r) < Math.abs(best - r)) best = cand;
  }
  return best;
}

/* ============================================================
   AI CHAT — hardware-only expert
   ============================================================ */
const SYSTEM_PROMPT = `You are HW-EXPERT, the resident senior hardware engineer of a Hardware Engineering Hub. You have 20+ years of experience in: PCB design and layout (Cadence Allegro, KiCad, Altium), signal integrity (DDR3/4/5, PCIe Gen3/4/5, SerDes, USB, Ethernet), power integrity and PDN design, schematic review, component selection, stackup design, EMI/EMC, thermal design, DFM/DFT, soldering and rework, lab equipment (oscilloscopes, VNAs, TDR), embedded hardware bring-up, networking hardware (switches, routers, PoE), and failure analysis.

BEHAVIOR RULES:
1. ONLY answer hardware/electronics-related questions. This includes: circuits, PCBs, components, schematics, signal/power integrity, test equipment, firmware-hardware interaction, datasheets, manufacturing, repair, and lab practice.
2. If asked about anything NOT related to hardware/electronics (cooking, movies, politics, general coding unrelated to hardware, etc.), politely decline in one sentence and steer back: "I'm focused on hardware engineering — ask me about circuits, PCBs, signal integrity, components, or lab equipment."
3. When the user attaches an IMAGE (schematic, PCB photo, scope capture, component photo, burnt board) or a DOCUMENT (datasheet PDF, errata, app note, BOM, netlist, log file), analyze it like an expert doing a design review or failure analysis: identify what it is, extract the specific parameters or observations relevant to the question (pinout, electrical specs, absolute max ratings, timing, register maps), and give concrete answers grounded in that document. Quote exact values and section/table references from datasheets when possible.
4. Think like a practicing engineer: give concrete numbers, formulas, rules of thumb, standards references (IPC-2221, IPC-2141, JEDEC, PCIe spec), and trade-offs. Ask one clarifying question only when truly needed.
5. Be concise and structured. Use short paragraphs. Use bullet lists only when listing multiple discrete items. Never invent part numbers — if unsure, say so.
6. Safety: warn about mains voltage, charged capacitors, ESD, and lithium battery hazards when relevant. Never help with anything dangerous or illegal (weapons, jamming, meter tampering).`;

const SUGGESTIONS = [
  "Why is my PCIe Gen3 link training failing at 8GT/s?",
  "Review my DDR4 length-matching strategy for an 8-layer board",
  "How many decoupling caps does a BGA with 2A core current need?",
  "When should I back-drill vias on a 25G SerDes channel?",
];

/* ============================================================
   CALCULATOR PANEL
   ============================================================ */
function CalcCard({ calc, fav, onFav }) {
  const [vals, setVals] = useState(Object.fromEntries(calc.inputs.map((i) => [i.key, i.def])));
  const parsed = Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, num(v)]));
  const ready = calc.allowPartial || calc.id === "ohms" || calc.inputs.every((i) => parsed[i.key] !== null);
  let results = [];
  try { results = ready ? calc.compute(parsed) : []; } catch { results = []; }
  const Icon = calc.icon;
  const Diagram = DIAGRAMS[calc.id];
  const [copied, setCopied] = useState(false);
  const resetVals = () => setVals(Object.fromEntries(calc.inputs.map((i) => [i.key, i.def])));
  const copyResults = () => {
    if (!results.length) return;
    const txt = `${calc.name}\n` +
      calc.inputs.map((i) => `  ${i.label}${i.unit ? " (" + i.unit + ")" : ""}: ${vals[i.key]}`).join("\n") +
      `\n→ ` + results.map((r) => `${r.label}: ${r.value}${r.unit ? " " + r.unit : ""}`).join("; ");
    try { navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {}
  };

  return (
    <div className="rounded-2xl p-5 card3d fade-up" style={{ background: "var(--card)", border: "1px solid var(--bd3)" }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 accent-grad">
          <Icon size={15} style={{ color: "#fff" }} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="hw-display font-semibold text-[15px] leading-snug" style={{ color: "var(--fg)" }}>{calc.name}</h3>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted2)" }}>{calc.desc}</p>
        </div>
        {onFav && (
          <button onClick={onFav} title={fav ? "Remove favorite" : "Add to favorites"}
            className="shrink-0 -mt-1 -mr-1 p-1" style={{ color: fav ? "var(--accent)" : "var(--label)" }}>
            <Star size={15} fill={fav ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      {Diagram && (
        <div className="mt-4 rounded-xl overflow-hidden" style={{ background: "var(--bg2)", border: "1px solid var(--bd6)" }}>
          {Diagram(parsed)}
        </div>
      )}

      {FORMULAS[calc.id] && (
        <div className="mt-3 rounded-lg px-3 py-2" style={{ background: "var(--formula-bg)", border: "1px solid var(--formula-bd)" }}>
          <div className="hw-mono text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--accent)" }}>formula</div>
          <div className="hw-mono text-[11px] leading-relaxed" style={{ color: "var(--formula-fg)" }}>{FORMULAS[calc.id]}</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 mt-4">
        {calc.inputs.map((inp) => (
          <label key={inp.key} className="block">
            <span className="hw-mono text-[10px] uppercase tracking-wider block mb-1" style={{ color: "var(--label)" }}>
              {inp.label}{inp.unit ? ` (${inp.unit})` : ""}
            </span>
            <input
              type="text" inputMode="decimal" value={vals[inp.key]}
              onChange={(e) => setVals((p) => ({ ...p, [inp.key]: e.target.value }))}
              className="w-full rounded-lg px-2.5 py-1.5 text-sm hw-mono outline-none"
              style={{ background: "var(--bg2)", border: "1px solid var(--inputbd)", color: "var(--fg)" }}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 pt-3 space-y-1.5" style={{ borderTop: "1px dashed var(--divider)" }}>
        {results.length === 0 && <div className="hw-mono text-xs" style={{ color: "var(--muted6)" }}>enter values…</div>}
        {results.map((r, i) => (
          <div key={i} className="flex items-baseline justify-between gap-3">
            <span className="text-xs" style={{ color: "var(--fg3)" }}>{r.label}</span>
            <span className="hw-mono text-sm font-semibold" style={{ color: ["YES","TOO HIGH","TOO HOT","TOO LOW"].includes(r.value) ? "var(--warn)" : "var(--accent)" }}>
              {r.value}{r.unit ? ` ${r.unit}` : ""}
            </span>
          </div>
        ))}
        {results.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <button onClick={copyResults}
              className="hw-mono text-[10px] flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
              style={{ background: "var(--btnsoft)", border: "1px solid var(--bd)", color: copied ? "var(--ok)" : "var(--accent)" }}>
              {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? "copied" : "copy"}
            </button>
            <button onClick={resetVals}
              className="hw-mono text-[10px] flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
              style={{ color: "var(--label)" }}>
              <RotateCcw size={11} /> reset
            </button>
          </div>
        )}
      </div>

      <InfoNote text={calc.note} />
    </div>
  );
}

function CalcPanel() {
  const [group, setGroup] = useState("All");
  const [q, setQ] = useState("");
  const [favs, setFavs] = useState(() => new Set());
  const GROUP_ORDER = ["Basics", "Analog", "Signal Integrity", "Power", "PDN", "FPGA & Logic", "Networking"];
  const groups = ["All", "★ Favorites", ...GROUP_ORDER.filter((g) => CALCULATORS.some((c) => c.group === g))];

  const toggleFav = (id) => setFavs((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const ql = q.trim().toLowerCase();
  const matches = (c) => (c.name + " " + c.desc + " " + c.group + " " + (FORMULAS[c.id] || "")).toLowerCase().includes(ql);

  // build the visible list
  let list = CALCULATORS;
  if (ql) list = CALCULATORS.filter(matches);
  else if (group === "★ Favorites") list = CALCULATORS.filter((c) => favs.has(c.id));
  else if (group !== "All") list = CALCULATORS.filter((c) => c.group === group);

  // group the visible list into sections (only when not a single-group filter)
  const showHeaders = !ql && (group === "All");
  const sections = showHeaders
    ? GROUP_ORDER.map((g) => ({ g, items: list.filter((c) => c.group === g) })).filter((s) => s.items.length)
    : [{ g: null, items: list }];

  const GroupIcon = ({ g }) => {
    const c = CALCULATORS.find((x) => x.group === g);
    const I = c ? c.icon : Calculator; return <I size={14} style={{ color: "var(--accent)" }} />;
  };

  return (
    <div className="h-full overflow-y-auto hw-scroll px-4 py-5">
      {/* sticky toolbar */}
      <div className="sticky -top-5 z-10 -mx-4 px-4 pt-1 pb-3 mb-1" style={{ background: "linear-gradient(var(--bg), var(--bg) 70%, transparent)" }}>
        <div className="flex items-center gap-2 mb-3 max-w-xl">
          <div className="flex items-center gap-2 flex-1 rounded-2xl px-4 py-2.5 ring-focus"
            style={{ background: "var(--card)", border: "1px solid var(--bd)", boxShadow: "var(--shadow)" }}>
            <Search size={16} style={{ color: "var(--accent)" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${CALCULATORS.length} calculators — name, topic, or formula…`}
              className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--fg)" }} />
            {q && <button onClick={() => setQ("")} style={{ color: "var(--label)" }}><X size={14} /></button>}
          </div>
        </div>
        {!ql && (
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => {
              const active = group === g;
              const count = g === "All" ? CALCULATORS.length : g === "★ Favorites" ? favs.size : CALCULATORS.filter((c) => c.group === g).length;
              return (
                <button key={g} onClick={() => setGroup(g)}
                  className="hw-mono text-[11px] px-3 py-1.5 rounded-full transition-all"
                  style={active
                    ? { color: "#fff", border: "1px solid transparent", fontWeight: 600 }
                    : { border: "1px solid var(--bd3)", color: "var(--label)", background: "var(--card)" }}>
                  <span className={active ? "accent-grad px-3 py-1.5 -mx-3 -my-1.5 rounded-full" : ""} style={active ? { display: "inline-block" } : {}}>{g} <span style={{ opacity: 0.7 }}>{count}</span></span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {ql && <div className="hw-mono text-[11px] mb-4" style={{ color: "var(--label)" }}>{list.length} result{list.length === 1 ? "" : "s"} for "{q}"</div>}

      {list.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--label)" }}>
          <Calculator size={28} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
          <div className="text-sm">{group === "★ Favorites" && !ql ? "No favorites yet — tap the ☆ on any calculator to pin it here." : "No calculators match your search."}</div>
        </div>
      ) : (
        sections.map((sec) => (
          <div key={sec.g || "flat"} className="mb-6">
            {sec.g && (
              <div className="flex items-center gap-2 mb-3">
                <GroupIcon g={sec.g} />
                <h3 className="hw-display font-semibold text-sm" style={{ color: "var(--fg)" }}>{sec.g}</h3>
                <span className="hw-mono text-[10px]" style={{ color: "var(--muted5)" }}>{sec.items.length}</span>
                <div className="flex-1 h-px ml-2" style={{ background: "var(--divider)" }} />
              </div>
            )}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sec.items.map((c) => <CalcCard key={c.id} calc={c} fav={favs.has(c.id)} onFav={() => toggleFav(c.id)} />)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ============================================================
   INTERFACE REACH — max recommended PCB trace lengths
   limit: "loss" rows scale with PCB material; others are fixed
   lengths in mm, typical rules of thumb on standard FR-4
   ============================================================ */
const MATERIALS = [
  { id: "fr4", label: "Standard FR-4", sub: "Df ≈ 0.020", scale: 1.0 },
  { id: "mid", label: "Mid-loss", sub: "Df ≈ 0.012 (e.g. IT-170GRA)", scale: 1.45 },
  { id: "low", label: "Low-loss", sub: "Df ≈ 0.005 (e.g. Megtron-6)", scale: 2.3 },
];

const INTERFACES = [
  /* ---- Low-speed serial: capacitance / timing limited ---- */
  { family: "I2C / SMBus", name: "I2C Standard", speed: "100 kHz", limit: "cap", len: 1000,
    note: "Bus cap ≤ 400 pF total incl. devices (~3 pF/in trace + pin caps). Pull-ups 2.2–10 kΩ." },
  { family: "I2C / SMBus", name: "I2C Fast", speed: "400 kHz", limit: "cap", len: 500,
    note: "Same 400 pF budget but rise time ≤ 300 ns — stronger pull-ups (1–4.7 kΩ)." },
  { family: "I2C / SMBus", name: "I2C Fast-mode+", speed: "1 MHz", limit: "cap", len: 250,
    note: "550 pF allowed with 20 mA drivers, but keep traces short; consider a bus buffer (PCA9515) beyond this." },
  { family: "I2C / SMBus", name: "I2C High-speed", speed: "3.4 MHz", limit: "cap", len: 100,
    note: "Current-source drive; point-to-point on-board only." },
  { family: "I2C / SMBus", name: "SMBus / PMBus", speed: "100–400 kHz", limit: "cap", len: 500,
    note: "Same physics as I2C; mind the weaker SMBus sink current (350 µA low-power class)." },

  { family: "SPI / QSPI", name: "SPI", speed: "≤ 10 MHz", limit: "timing", len: 500,
    note: "Round-trip flight time + slave tco must fit in ½ clock period." },
  { family: "SPI / QSPI", name: "SPI", speed: "25 MHz", limit: "timing", len: 250,
    note: "Series-terminate CLK at the driver (22–33 Ω) to kill reflections." },
  { family: "SPI / QSPI", name: "SPI", speed: "50 MHz", limit: "timing", len: 120,
    note: "Timing budget gets tight: ½T = 10 ns minus tco(~6 ns) and tsu leaves ~2 ns ≈ 30 cm round trip." },
  { family: "SPI / QSPI", name: "QSPI SDR", speed: "100–133 MHz", limit: "timing", len: 70,
    note: "No strobe to train against — keep all 6 signals matched within ±50 mil and short." },
  { family: "SPI / QSPI", name: "QSPI / Octal DDR (with DQS)", speed: "200 MHz DDR", limit: "timing", len: 100,
    note: "DQS data strobe relaxes absolute length; match DQ to DQS within ±25 mil." },
  { family: "SPI / QSPI", name: "eSPI", speed: "66 MHz", limit: "timing", len: 250,
    note: "Intel spec allows ~10 in motherboard routing; single-load topology." },

  { family: "Low-speed misc", name: "UART (logic level)", speed: "≤ 1 Mbps", limit: "cap", len: 500,
    note: "On-board logic-level only; go RS-232/RS-485 for anything off-board." },
  { family: "Low-speed misc", name: "JTAG / SWD", speed: "10–25 MHz", limit: "timing", len: 250,
    note: "TCK is the critical net — series-terminate and don't stub it across the board." },
  { family: "Low-speed misc", name: "MDIO / MDC", speed: "2.5–25 MHz", limit: "cap", len: 300,
    note: "Multi-drop allowed; keep total bus cap reasonable, 1.5–2.2 kΩ pull-up on MDIO." },
  { family: "Low-speed misc", name: "JTAG chain", speed: "≤ 25 MHz TCK", limit: "cap", len: 500,
    note: "Daisy-chain FPGA/CPLD/CPU. Buffer TCK/TMS past ~3 devices; series 22–33 Ω at the source; keep stubs short on TDO." },
  { family: "Low-speed misc", name: "eSPI / LPC", speed: "≤ 66 MHz", limit: "timing", len: 250,
    note: "BMC↔PCH/SoC sideband on server/switch CPU boards. Match CLK vs IO loosely (±500 mil); 1.8 V eSPI — don't mix with 3.3 V LPC levels." },
  { family: "Low-speed misc", name: "RS-485 / CAN (cable)", speed: "≤ 1 Mbps", limit: "timing", len: 40000,
    note: "Cable interface — 40 m at 1 Mbps, up to 1200 m at low rates. On-PCB portion: keep stub to transceiver < 25 mm." },

  /* ---- USB / SATA / display ---- */
  { family: "USB", name: "USB 2.0 High-Speed", speed: "480 Mbps", limit: "loss", len: 300,
    note: "90 Ω diff; budget includes ESD parts and connector. Skew < 50 mil." },
  { family: "USB", name: "USB 3.2 Gen1", speed: "5 GT/s", limit: "loss", len: 250,
    note: "Nyquist 2.5 GHz. AC caps 100 nF; keep via count ≤ 2 per lane on FR-4." },
  { family: "USB", name: "USB 3.2 Gen2", speed: "10 GT/s", limit: "loss", len: 150,
    note: "Nyquist 5 GHz — beyond this on FR-4 use a redriver/retimer near the connector." },
  { family: "USB", name: "USB4 / TB3", speed: "20–40 GT/s", limit: "loss", len: 100,
    note: "Practically always retimed at the connector; low-loss laminate mandatory." },

  { family: "Storage", name: "SATA 2", speed: "3 GT/s", limit: "loss", len: 300,
    note: "100 Ω diff, AC coupled 10 nF." },
  { family: "Storage", name: "SATA 3", speed: "6 GT/s", limit: "loss", len: 220,
    note: "Nyquist 3 GHz. Back-drill not usually needed if stub < 15 mil." },

  { family: "Display / camera", name: "HDMI 2.0", speed: "6 Gbps/lane", limit: "loss", len: 150,
    note: "TMDS 100 Ω; tight inter-pair skew (< 0.2 UI). Use a redriver for longer runs." },
  { family: "Display / camera", name: "MIPI D-PHY", speed: "1.5–2.5 Gbps/lane", limit: "loss", len: 150,
    note: "Short flex/board runs by design; match clock to data lanes within 5 mil." },
  { family: "Display / camera", name: "LVDS", speed: "≤ 800 Mbps", limit: "loss", len: 500,
    note: "100 Ω diff, very robust; cables of several meters possible with good drivers." },

  /* ---- PCIe all gens ---- */
  { family: "PCIe", name: "PCIe Gen1", speed: "2.5 GT/s", limit: "loss", len: 500,
    note: "Nyquist 1.25 GHz — very forgiving. 85 Ω diff, AC caps 75–200 nF." },
  { family: "PCIe", name: "PCIe Gen2", speed: "5 GT/s", limit: "loss", len: 350,
    note: "Nyquist 2.5 GHz. Reference plane continuity matters from here up." },
  { family: "PCIe", name: "PCIe Gen3", speed: "8 GT/s", limit: "loss", len: 300,
    note: "~22 dB die-to-die budget @ 4 GHz. Back-drill stubs > 20 mil; ≤ 2 connectors." },
  { family: "PCIe", name: "PCIe Gen4", speed: "16 GT/s", limit: "loss", len: 160,
    note: "~28 dB @ 8 GHz. FR-4 is marginal — mid/low-loss laminate strongly preferred; retimer past ~10 in." },
  { family: "PCIe", name: "PCIe Gen5", speed: "32 GT/s", limit: "loss", len: 100,
    note: "~36 dB @ 16 GHz. Standard FR-4 effectively unusable; low-loss + back-drill everywhere, retimers common." },
  { family: "PCIe", name: "PCIe Gen6 (PAM4)", speed: "64 GT/s", limit: "loss", len: 75,
    note: "PAM4 @ 16 GHz Nyquist with ~32 dB budget but 9.5 dB less SNR margin — ultra-low-loss, retimers/CPO typical." },

  /* ---- Ethernet / SerDes all speeds ---- */
  { family: "Ethernet / SerDes", name: "RGMII", speed: "125 MHz DDR", limit: "timing", len: 175,
    note: "Parallel bus: match all 12 signals within ±50 mil; 1.5–2 ns clock-to-data skew via delay or trace." },
  { family: "Ethernet / SerDes", name: "SGMII / 1000BASE-KX", speed: "1.25 GT/s", limit: "loss", len: 500,
    note: "Nyquist 625 MHz — easy on FR-4. 100 Ω diff." },
  { family: "Ethernet / SerDes", name: "QSGMII", speed: "5 GT/s (4×1G)", limit: "loss", len: 400,
    note: "Four SGMII channels muxed on one 5G lane — the standard switch↔quad-PHY hookup. Nyquist 2.5 GHz, fine on FR-4." },
  { family: "Ethernet / SerDes", name: "USXGMII", speed: "10.3125 GT/s", limit: "loss", len: 300,
    note: "Multi-rate (10G→2.5G/1G) PHY attach used on mGig switch ports; same channel rules as 10G KR/SFI." },
  { family: "Ethernet / SerDes", name: "XAUI", speed: "3.125 GT/s ×4", limit: "loss", len: 350,
    note: "Legacy 10G; lane-to-lane skew handled by protocol." },
  { family: "Ethernet / SerDes", name: "10G SerDes (KR/SFI)", speed: "10.3125 GT/s", limit: "loss", len: 300,
    note: "Nyquist 5.16 GHz. IEEE 802.3 KR assumes ~1 m on improved FR-4 with strong EQ — derate hard for plain FR-4 and weak EQ." },
  { family: "Ethernet / SerDes", name: "25G NRZ (25G-KR/CR)", speed: "25.78 GT/s", limit: "loss", len: 120,
    note: "Nyquist 12.9 GHz, ~35 dB long-reach budget. Back-drill mandatory; via stub < 8 mil." },
  { family: "Ethernet / SerDes", name: "56G PAM4", speed: "56 GT/s", limit: "loss", len: 100,
    note: "Nyquist 14 GHz. Low-loss only; minimize via count, consider cabled backplane past ~25 cm." },
  { family: "Ethernet / SerDes", name: "112G PAM4", speed: "112 GT/s", limit: "loss", len: 60,
    note: "Nyquist 28 GHz. Ultra-low-loss + HDI; beyond ~15 cm use twinax flyover cable or co-packaged optics." },

  /* ---- Memory ---- */
  { family: "Memory (DDR)", name: "DDR3", speed: "≤ 1866 MT/s", limit: "timing", len: 125,
    note: "Total DQ route ≤ ~5 in. Fly-by addr/cmd with VTT termination; DQ–DQS ±10 mil within byte lane." },
  { family: "Memory (DDR)", name: "DDR4", speed: "≤ 3200 MT/s", limit: "timing", len: 100,
    note: "DQ ≤ ~4 in to DRAM. DQ–DQS ±5 mil, CK skew < 5 mil; write-leveling absorbs fly-by addr skew." },
  { family: "Memory (DDR)", name: "DDR5", speed: "≤ 6400 MT/s", limit: "timing", len: 75,
    note: "≤ ~3 in typical. On-DIMM PMIC helps PI, but channel loss @ 3.2 GHz Nyquist now dominates — treat like SerDes." },
  { family: "Memory (DDR)", name: "LPDDR4/4X", speed: "≤ 4266 MT/s", limit: "timing", len: 50,
    note: "Designed for PoP / adjacent placement. Keep byte lanes tightly bundled and referenced to solid ground." },
  { family: "Memory (DDR)", name: "LPDDR5/5X", speed: "≤ 8533 MT/s", limit: "timing", len: 40,
    note: "Very short reach by design; follow the SoC vendor's routing appendix exactly." },
];

const FAMILY_ORDER = ["PCIe", "Ethernet / SerDes", "Memory (DDR)", "USB", "Storage", "Display / camera", "SPI / QSPI", "I2C / SMBus", "Low-speed misc"];

const mmToIn = (mm) => mm / 25.4;
const reachOf = (row, scale) => (row.limit === "loss" ? row.len * scale : row.len);

const LIMIT_BADGE = {
  loss:   { label: "insertion loss", color: "var(--accent)" },
  timing: { label: "timing / skew",  color: "var(--info)" },
  cap:    { label: "bus capacitance", color: "var(--ok)" },
};

function ReachPanel() {
  const [matId, setMatId] = useState("fr4");
  const [family, setFamily] = useState("All");
  const mat = MATERIALS.find((m) => m.id === matId);
  const families = ["All", ...FAMILY_ORDER];
  const rows = family === "All" ? INTERFACES : INTERFACES.filter((r) => r.family === family);
  const grouped = FAMILY_ORDER.filter((f) => rows.some((r) => r.family === f))
    .map((f) => ({ family: f, items: rows.filter((r) => r.family === f) }));

  return (
    <div className="h-full overflow-y-auto hw-scroll px-4 py-5">
      {/* Material selector */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="hw-mono text-[11px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>PCB material</span>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--card2)", border: "1px solid var(--bd2)" }}>
          {MATERIALS.map((m) => (
            <button key={m.id} onClick={() => setMatId(m.id)}
              className="px-3 py-1.5 rounded-md text-xs transition-colors text-left"
              style={matId === m.id
                ? { background: "var(--accent2)", color: "var(--onaccent)", fontWeight: 600 }
                : { color: "var(--fg2)" }}>
              <span className="block">{m.label}</span>
              <span className="hw-mono block text-[9px] opacity-70">{m.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Family filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {families.map((f) => (
          <button key={f} onClick={() => setFamily(f)}
            className="hw-mono text-xs px-3 py-1.5 rounded-full transition-colors"
            style={family === f
              ? { background: "var(--accent2)", color: "var(--onaccent)", fontWeight: 600 }
              : { background: "var(--chip)", border: "1px solid var(--bd)", color: "var(--fg2)" }}>
            {f}
          </button>
        ))}
      </div>

      {grouped.map((g) => (
        <div key={g.family} className="mb-6">
          <h3 className="hw-display font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: "var(--fg)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent2)" }} />
            {g.family}
          </h3>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--bd2)" }}>
            {g.items.map((row, i) => {
              const reach = reachOf(row, mat.scale);
              const badge = LIMIT_BADGE[row.limit];
              const scaled = row.limit === "loss" && matId !== "fr4";
              const isCable = reach >= 5000;
              return (
                <div key={row.name + row.speed}
                  className="px-4 py-3 grid gap-x-4 gap-y-1 items-baseline"
                  style={{
                    background: i % 2 ? "var(--card)" : "var(--card2)",
                    gridTemplateColumns: "minmax(150px,1.3fr) minmax(80px,0.7fr) minmax(110px,0.8fr) minmax(120px,0.9fr) 3fr",
                    borderTop: i ? "1px solid var(--bd5)" : "none",
                  }}>
                  <span className="text-sm font-medium" style={{ color: "var(--fg)" }}>{row.name}</span>
                  <span className="hw-mono text-xs" style={{ color: "var(--fg2)" }}>{row.speed}</span>
                  <span className="hw-mono text-[10px] uppercase tracking-wide" style={{ color: badge.color }}>{badge.label}</span>
                  <span className="hw-mono text-sm font-semibold" style={{ color: "var(--accent)" }}>
                    {isCable
                      ? `${fmt(reach / 1000, 0)} m`
                      : `${fmt(reach, 0)} mm`}
                    {!isCable && <span className="text-[10px] font-normal" style={{ color: "var(--muted)" }}> · {fmt(mmToIn(reach), 1)} in</span>}
                    {scaled && <span className="text-[9px] block" style={{ color: "var(--muted)" }}>scaled for {mat.label}</span>}
                  </span>
                  <span className="text-xs leading-relaxed" style={{ color: "var(--fg6)" }}>{row.note}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-[11px] leading-relaxed max-w-3xl pb-6" style={{ color: "var(--muted4)" }}>
        Lengths are practical rules of thumb for clean routing (solid reference planes, controlled impedance,
        minimal stubs) and assume typical driver/receiver equalization. Loss-limited rows scale with laminate;
        timing- and capacitance-limited rows don't. Actual reach depends on via count, connectors, AC caps and
        silicon EQ — always confirm critical channels (PCIe Gen4+, 25G+ SerDes, DDR5) with channel simulation
        against the spec's insertion-loss mask before tape-out.
      </p>
    </div>
  );
}


/* ============================================================
   CHANNEL DESIGNER — full insertion-loss budget calculator
   reach = (IL budget − package − vias − connectors − caps) / (dB per inch)
   dB/in = conductor loss (skin effect × foil roughness) + dielectric loss
   ============================================================ */
const LAMINATES = [
  { id: "fr4std", name: "Standard FR-4", dk: 4.4, df: 0.020 },
  { id: "it180a", name: "IT-180A (mid-Tg FR-4)", dk: 4.2, df: 0.0155 },
  { id: "m4", name: "Megtron-4", dk: 3.9, df: 0.006 },
  { id: "m6", name: "Megtron-6", dk: 3.55, df: 0.003 },
  { id: "tachyon", name: "Tachyon 100G", dk: 3.02, df: 0.0021 },
  { id: "custom", name: "Custom (enter Dk/Df)", dk: 4.0, df: 0.010 },
];

const FOILS = [
  { id: "ed", name: "Standard ED", rz: "Rz ≈ 8 µm", k: 1.9 },
  { id: "rtf", name: "RTF (reverse-treated)", rz: "Rz ≈ 5 µm", k: 1.5 },
  { id: "vlp", name: "VLP", rz: "Rz ≈ 3 µm", k: 1.25 },
  { id: "hvlp", name: "HVLP / HVLP2", rz: "Rz ≈ 1.8 µm", k: 1.1 },
];

const STANDARDS = [
  { id: "g3", name: "PCIe Gen3", rate: 8, mod: "NRZ", budget: 22 },
  { id: "g4", name: "PCIe Gen4", rate: 16, mod: "NRZ", budget: 28 },
  { id: "g5", name: "PCIe Gen5", rate: 32, mod: "NRZ", budget: 36 },
  { id: "g6", name: "PCIe Gen6", rate: 64, mod: "PAM4", budget: 32 },
  { id: "kr10", name: "10GBASE-KR", rate: 10.3125, mod: "NRZ", budget: 24 },
  { id: "kr25", name: "25G-KR (LR)", rate: 25.78125, mod: "NRZ", budget: 35 },
  { id: "kr56", name: "56G PAM4 (KR4)", rate: 56, mod: "PAM4", budget: 30 },
  { id: "lr112", name: "112G PAM4 (LR)", rate: 112, mod: "PAM4", budget: 36 },
  { id: "usb32", name: "USB 3.2 Gen2", rate: 10, mod: "NRZ", budget: 23 },
  { id: "custom", name: "Custom", rate: 10, mod: "NRZ", budget: 25 },
];

function Field({ label, value, onChange, unit }) {
  return (
    <label className="block">
      <span className="hw-mono text-[10px] uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>
        {label}{unit ? ` (${unit})` : ""}
      </span>
      <input type="text" inputMode="decimal" value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md px-2.5 py-1.5 text-sm hw-mono outline-none"
        style={{ background: "var(--bg2)", border: "1px solid var(--bd)", color: "var(--fg)" }} />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="hw-mono text-[10px] uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md px-2 py-1.5 text-sm outline-none"
        style={{ background: "var(--bg2)", border: "1px solid var(--bd)", color: "var(--fg)" }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function ChannelDesigner() {
  const [stdId, setStdId] = useState("g4");
  const [rate, setRate] = useState("16");
  const [mod, setMod] = useState("NRZ");
  const [budget, setBudget] = useState("28");
  const [lamId, setLamId] = useState("fr4std");
  const [dk, setDk] = useState("4.4");
  const [df, setDf] = useState("0.020");
  const [foilId, setFoilId] = useState("rtf");
  const [layer, setLayer] = useState("strip");      // microstrip | stripline
  const [w, setW] = useState("5");                  // mil
  const [h, setH] = useState("4");                  // PP / dielectric height, mil
  const [cu, setCu] = useState("0.5");              // oz
  const [z0, setZ0] = useState("50");
  const [pkg, setPkg] = useState("4");              // dB, both packages
  const [nBgaVia, setNBgaVia] = useState("2");
  const [nConnVia, setNConnVia] = useState("0");
  const [nConn, setNConn] = useState("0");
  const [nCaps, setNCaps] = useState("1");
  const [backdrill, setBackdrill] = useState(true);
  const [stub, setStub] = useState("30");           // mil, if not back-drilled

  const applyStandard = (id) => {
    setStdId(id);
    const s = STANDARDS.find((x) => x.id === id);
    if (s && id !== "custom") { setRate(String(s.rate)); setMod(s.mod); setBudget(String(s.budget)); }
  };
  const applyLaminate = (id) => {
    setLamId(id);
    const l = LAMINATES.find((x) => x.id === id);
    if (l && id !== "custom") { setDk(String(l.dk)); setDf(String(l.df)); }
  };

  /* ---------- physics ---------- */
  const v = { rate: num(rate), budget: num(budget), dk: num(dk), df: num(df),
    w: num(w), h: num(h), cu: num(cu), z0: num(z0), pkg: num(pkg),
    nBgaVia: num(nBgaVia) ?? 0, nConnVia: num(nConnVia) ?? 0,
    nConn: num(nConn) ?? 0, nCaps: num(nCaps) ?? 0, stub: num(stub) };
  const ready = [v.rate, v.budget, v.dk, v.df, v.w, v.h, v.cu, v.z0, v.pkg].every((x) => x !== null);

  let out = null;
  if (ready) {
    const fN = mod === "PAM4" ? v.rate / 4 : v.rate / 2;          // Nyquist, GHz
    const dkEff = layer === "strip" ? v.dk : 0.64 * v.dk + 0.36;   // effective Dk
    const foil = FOILS.find((f) => f.id === foilId);

    // Dielectric loss (dB/in)
    const aD = 2.3 * fN * v.df * Math.sqrt(dkEff);

    // Conductor loss: skin effect, scaled by foil roughness (dB/in)
    const wM = v.w * 25.4e-6;
    const Rs = Math.sqrt(Math.PI * fN * 1e9 * 4 * Math.PI * 1e-7 * 1.68e-8);
    const aCsmooth = (8.686 * Rs / (2 * v.z0 * wM)) * 0.0254;
    const aC = aCsmooth * foil.k;
    const perIn = aD + aC;

    // Skin depth vs copper thickness — show why Cu weight ≈ irrelevant for AC loss
    const skinUm = Math.sqrt(1.68e-8 / (Math.PI * fN * 1e9 * 4 * Math.PI * 1e-7)) * 1e6;
    const cuUm = v.cu * 35;

    // Discrete losses (scale with Nyquist)
    const viaDb = backdrill ? 0.045 * fN : 0.12 * fN;
    const connDb = 0.11 * fN;
    const capDb = 0.15;
    const totalVias = v.nBgaVia + v.nConnVia;
    const discrete = totalVias * viaDb + v.nConn * connDb + v.nCaps * capDb;

    // Stub resonance check (quarter-wave); c = 299.79 mm/ns
    let stubWarn = null;
    if (!backdrill && v.stub) {
      const stubMm = v.stub * 0.0254;
      const fRes = 299.79 / (4 * stubMm * Math.sqrt(v.dk)); // GHz
      if (fRes < 2 * fN) stubWarn = { fRes, severe: fRes < 1.3 * fN };
    }

    // Suggested width for target Z0 from PP height + Cu thickness
    const tMil = v.cu * 1.378;
    let wSuggest;
    if (layer === "strip") {
      const b = 2 * v.h + tMil;
      wSuggest = ((1.9 * b) / Math.exp((v.z0 * Math.sqrt(v.dk)) / 60) - tMil) / 0.8;
    } else {
      wSuggest = ((5.98 * v.h) / Math.exp((v.z0 * Math.sqrt(v.dk + 1.41)) / 87) - tMil) / 0.8;
    }

    const traceBudget = v.budget - v.pkg - discrete;
    const reachIn = traceBudget > 0 ? traceBudget / perIn : 0;

    out = { fN, aD, aC, perIn, discrete, viaDb, connDb, totalVias, traceBudget, reachIn,
      skinUm, cuUm, stubWarn, wSuggest, foilK: foil.k };
  }

  const Row = ({ l, val, accent }) => (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <span className="text-xs" style={{ color: "var(--fg2)" }}>{l}</span>
      <span className="hw-mono text-sm font-semibold" style={{ color: accent || "var(--accent)" }}>{val}</span>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto hw-scroll px-4 py-5">
      <div className="grid lg:grid-cols-5 gap-4 max-w-6xl mx-auto pb-8">

        {/* ---------- INPUTS ---------- */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl p-5" style={{ background: "var(--card2)", border: "1px solid var(--bd2)" }}>
            <h3 className="hw-display font-semibold mb-3" style={{ color: "var(--fg)" }}>1 · Signal & budget</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <Select label="Standard preset" value={stdId} onChange={applyStandard}
                options={STANDARDS.map((s) => ({ value: s.id, label: s.name }))} />
              <Field label="Data rate" unit="GT/s" value={rate} onChange={(x) => { setRate(x); setStdId("custom"); }} />
              <Select label="Modulation" value={mod} onChange={(x) => { setMod(x); setStdId("custom"); }}
                options={[{ value: "NRZ", label: "NRZ" }, { value: "PAM4", label: "PAM4" }]} />
              <Field label="IL budget (die-to-die)" unit="dB" value={budget} onChange={(x) => { setBudget(x); setStdId("custom"); }} />
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ background: "var(--card2)", border: "1px solid var(--bd2)" }}>
            <h3 className="hw-display font-semibold mb-3" style={{ color: "var(--fg)" }}>2 · Stackup, laminate & copper</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <Select label="Laminate" value={lamId} onChange={applyLaminate}
                options={LAMINATES.map((l) => ({ value: l.id, label: l.name }))} />
              <Field label="Dk" value={dk} onChange={(x) => { setDk(x); setLamId("custom"); }} />
              <Field label="Df" value={df} onChange={(x) => { setDf(x); setLamId("custom"); }} />
              <Select label="Copper foil" value={foilId} onChange={setFoilId}
                options={FOILS.map((f) => ({ value: f.id, label: `${f.name} — ${f.rz}` }))} />
              <Select label="Routing layer" value={layer} onChange={setLayer}
                options={[{ value: "strip", label: "Stripline (inner)" }, { value: "micro", label: "Microstrip (outer)" }]} />
              <Field label="Copper weight" unit="oz" value={cu} onChange={setCu} />
              <Field label="PP / dielectric height" unit="mil" value={h} onChange={setH} />
              <Field label="Trace width" unit="mil" value={w} onChange={setW} />
              <Field label="Target Z₀ (single-ended)" unit="Ω" value={z0} onChange={setZ0} />
            </div>
            {out && isFinite(out.wSuggest) && out.wSuggest > 0 && (
              <button onClick={() => setW(fmt(Math.max(out.wSuggest, 2.5), 2))}
                className="hw-mono text-[11px] mt-3 px-2.5 py-1 rounded-md"
                style={{ background: "var(--btnsoft)", border: "1px solid var(--bd)", color: "var(--accent)" }}>
                use suggested width for {z0} Ω on this stackup → {fmt(out.wSuggest, 2)} mil
              </button>
            )}
          </div>

          <div className="rounded-xl p-5" style={{ background: "var(--card2)", border: "1px solid var(--bd2)" }}>
            <h3 className="hw-display font-semibold mb-3" style={{ color: "var(--fg)" }}>3 · Vias, connectors & discretes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <Field label="BGA breakout vias" value={nBgaVia} onChange={setNBgaVia} />
              <Field label="Connector vias" value={nConnVia} onChange={setNConnVia} />
              <Field label="Connectors" value={nConn} onChange={setNConn} />
              <Field label="AC cap pairs" value={nCaps} onChange={setNCaps} />
              <Field label="Package loss (both ends)" unit="dB" value={pkg} onChange={setPkg} />
              <label className="block">
                <span className="hw-mono text-[10px] uppercase tracking-wider block mb-1" style={{ color: "var(--muted)" }}>Vias back-drilled?</span>
                <button onClick={() => setBackdrill(!backdrill)}
                  className="w-full rounded-md px-2.5 py-1.5 text-sm hw-mono"
                  style={{ background: backdrill ? "var(--btnsoft)" : "#3a2418", border: `1px solid ${backdrill ? "var(--bd)" : "#6b4a2e"}`, color: backdrill ? "var(--ok)" : "var(--accent)" }}>
                  {backdrill ? "YES — back-drilled" : "NO — stub remains"}
                </button>
              </label>
              {!backdrill && <Field label="Worst via stub" unit="mil" value={stub} onChange={setStub} />}
            </div>
          </div>
        </div>

        {/* ---------- RESULTS ---------- */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl p-5" style={{ background: "var(--panel)", border: "1px solid var(--accent2)" }}>
            <h3 className="hw-display font-semibold mb-3" style={{ color: "var(--fg)" }}>Channel reach</h3>
            {!out && <div className="hw-mono text-xs" style={{ color: "var(--muted3)" }}>enter values…</div>}
            {out && (
              <>
                <div className="text-center py-3 mb-3 rounded-lg" style={{ background: "var(--bg2)" }}>
                  <div className="hw-mono text-4xl font-bold" style={{ color: out.traceBudget > 0 ? "var(--accent)" : "var(--danger)" }}>
                    {out.traceBudget > 0 ? `${fmt(out.reachIn * 25.4, 0)} mm` : "0 mm"}
                  </div>
                  <div className="hw-mono text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {out.traceBudget > 0 ? `≈ ${fmt(out.reachIn, 1)} in of trace` : "budget exhausted before any trace"}
                  </div>
                </div>
                <Row l={`Nyquist (${mod})`} val={`${fmt(out.fN, 2)} GHz`} />
                <Row l="Dielectric loss αd" val={`${fmt(out.aD, 3)} dB/in`} />
                <Row l={`Conductor loss αc (×${out.foilK} foil)`} val={`${fmt(out.aC, 3)} dB/in`} />
                <Row l="Total trace loss" val={`${fmt(out.perIn, 3)} dB/in`} />
                <div className="my-2" style={{ borderTop: "1px solid var(--bd4)" }} />
                <Row l="Package allowance" val={`−${fmt(num(pkg) ?? 0, 1)} dB`} accent="var(--fg2)" />
                <Row l={`Vias (${out.totalVias} × ${fmt(out.viaDb, 2)} dB)`} val={`−${fmt(out.totalVias * out.viaDb, 2)} dB`} accent="var(--fg2)" />
                <Row l={`Connectors (${v.nConn} × ${fmt(out.connDb, 2)} dB)`} val={`−${fmt(v.nConn * out.connDb, 2)} dB`} accent="var(--fg2)" />
                <Row l={`AC caps (${v.nCaps} × 0.15 dB)`} val={`−${fmt(v.nCaps * 0.15, 2)} dB`} accent="var(--fg2)" />
                <div className="my-2" style={{ borderTop: "1px solid var(--bd4)" }} />
                <Row l="Remaining for trace" val={`${fmt(out.traceBudget, 2)} dB`} accent={out.traceBudget > 0 ? "var(--ok)" : "var(--danger)"} />

                {out.stubWarn && (
                  <div className="mt-3 rounded-lg px-3 py-2.5 text-xs leading-relaxed"
                    style={{ background: "#2b1a10", border: "1px solid #6b4a2e", color: "var(--accent)" }}>
                    ⚠ Via stub of {stub} mil resonates near {fmt(out.stubWarn.fRes, 1)} GHz
                    {out.stubWarn.severe
                      ? " — right on top of your Nyquist. This will notch the channel; back-drilling is effectively mandatory."
                      : " — close enough to Nyquist to eat margin. Back-drilling strongly recommended."}
                  </div>
                )}
              </>
            )}
          </div>

          {out && (
            <div className="rounded-xl p-5" style={{ background: "var(--card2)", border: "1px solid var(--bd2)" }}>
              <h3 className="hw-display font-semibold text-sm mb-2" style={{ color: "var(--fg)" }}>Why copper weight barely matters here</h3>
              <Row l={`Skin depth @ ${fmt(out.fN, 1)} GHz`} val={`${fmt(out.skinUm, 2)} µm`} />
              <Row l={`Your copper (${cu} oz)`} val={`${fmt(out.cuUm, 1)} µm`} />
              <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "var(--muted4)" }}>
                Current crowds into ~{fmt(out.skinUm, 1)} µm of the conductor surface, so extra copper thickness
                doesn't reduce AC loss — but it does change the width needed for {z0} Ω (see the suggested-width
                button) and the foil surface roughness it carries, which is why foil type is a separate input.
              </p>
            </div>
          )}

          <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted4)" }}>
            First-order model: αd = 2.3·f·Df·√Dk_eff; αc from skin effect × Hammerstad-style roughness factor;
            via/connector losses scale with Nyquist frequency. Good for laminate and stackup trade studies —
            final sign-off still needs the laminate's measured loss curve and a channel sim against the spec's IL mask.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PDN PLANNER — impedance vs frequency with auto-suggestions
   Model (after Altera PDN Tool v1.1):
   Z_die→board = Z_BGAvia + Z_spread + parallel( VRM, PlaneCap, decap groups )
   Auto-suggest engine finds violations vs Ztarget and proposes
   concrete cap additions; Apply / Auto-Fix mutate the BOM live.
   ============================================================ */

/* ---- complex helpers ---- */
const cxAdd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cxInv = (z) => { const d = z[0] * z[0] + z[1] * z[1] || 1e-30; return [z[0] / d, -z[1] / d]; };
const cxMag = (z) => Math.hypot(z[0], z[1]);

/* ---- decap library (per Altera 0402 column, ESR in mΩ) ---- */
const CAP_LIB = [
  { c: 330,    esr: 6,   esl: 3.5, tag: "bulk polymer" },
  { c: 100,    esr: 8,   esl: 3.0, tag: "bulk polymer" },
  { c: 47,     esr: 3,   esl: 1.2, tag: "MLCC 1210" },
  { c: 22,     esr: 3,   esl: 1.2, tag: "MLCC 0805" },
  { c: 10,     esr: 4,   esl: 1.0, tag: "MLCC 0603" },
  { c: 4.7,    esr: 7,   esl: 1.0, tag: "MLCC 0402" },
  { c: 2.2,    esr: 9,   esl: 1.0, tag: "MLCC 0402" },
  { c: 1,      esr: 12,  esl: 1.0, tag: "MLCC 0402" },
  { c: 0.47,   esr: 16,  esl: 0.9, tag: "MLCC 0402" },
  { c: 0.22,   esr: 20,  esl: 0.9, tag: "MLCC 0402" },
  { c: 0.1,    esr: 28,  esl: 0.9, tag: "MLCC 0402" },
  { c: 0.047,  esr: 38,  esl: 0.8, tag: "MLCC 0201" },
  { c: 0.022,  esr: 43,  esl: 0.8, tag: "MLCC 0201" },
  { c: 0.01,   esr: 60,  esl: 0.8, tag: "MLCC 0201" },
  { c: 0.0047, esr: 83,  esl: 0.8, tag: "MLCC 0201" },
  { c: 0.001,  esr: 161, esl: 0.7, tag: "MLCC 0201" },
];
const capLabel = (c) => (c >= 1 ? `${c} µF` : `${fmt(c * 1000, 1)} nF`);

/* ---- sweep: returns {f[], z[], zt} ---- */
function pdnSweep(p, rows) {
  const N = 240;
  const fs = [], zs = [];
  for (let i = 0; i <= N; i++) {
    const f = Math.pow(10, 3 + (6 * i) / N); // 1 kHz → 1 GHz
    const w = 2 * Math.PI * f;
    const branches = [];
    branches.push([p.vrmR, w * p.vrmL]);                              // VRM
    if (p.planeC > 0) branches.push([p.planeR, -1 / (w * p.planeC)]); // plane cap
    for (const r of rows) {
      if (!r.qty || !r.c) continue;
      const C = r.c * 1e-6, L = r.esl * 1e-9, R = r.esr / 1000;
      branches.push([R / r.qty, (w * L - 1 / (w * C)) / r.qty]);
    }
    let inv = [0, 0];
    for (const b of branches) inv = cxAdd(inv, cxInv(b));
    let z = cxInv(inv);
    z = cxAdd(z, [p.sprR, w * p.sprL]);   // spreading
    z = cxAdd(z, [p.bgaR, w * p.bgaL]);   // BGA vias
    fs.push(f); zs.push(cxMag(z));
  }
  return { fs, zs };
}

/* ---- Z at specific frequencies (fast candidate scoring) ---- */
function pdnZat(p, rows, fList) {
  const out = [];
  for (const f of fList) {
    const w = 2 * Math.PI * f;
    const branches = [[p.vrmR, w * p.vrmL]];
    if (p.planeC > 0) branches.push([p.planeR, -1 / (w * p.planeC)]);
    for (const r of rows) {
      if (!r.qty || !r.c) continue;
      const C = r.c * 1e-6, L = r.esl * 1e-9, R = r.esr / 1000;
      branches.push([R / r.qty, (w * L - 1 / (w * C)) / r.qty]);
    }
    let inv = [0, 0];
    for (const b of branches) inv = cxAdd(inv, cxInv(b));
    let z = cxInv(inv);
    z = cxAdd(z, [p.sprR, w * p.sprL]);
    z = cxAdd(z, [p.bgaR, w * p.bgaL]);
    out.push(cxMag(z));
  }
  return out;
}

/* ---- feasibility: highest f where the series path (spreading+BGA)
   still leaves room under target. Above this, board caps CANNOT help. ---- */
function pdnFeasibleF(p) {
  const R = p.sprR + p.bgaR, L = p.sprL + p.bgaL;
  const zAllow = 0.8 * p.zt; // leave 20% for the parallel network
  if (R >= zAllow) return 1e3;
  const w = Math.sqrt(zAllow * zAllow - R * R) / L;
  return w / (2 * Math.PI);
}

/* ---- global optimizer: verified, near-minimal fix set ----
   Strategy (more robust than pure greedy):
   1. Find the worst violation frequency; add the cap whose MOUNTED self-
      resonance is closest to it (the physically correct choice), in a batch
      sized to the impedance gap — fast convergence, no over-adding.
   2. Re-evaluate; repeat until the whole feasible band is under target.
   3. Refinement pass: try removing one of each added cap; keep the removal
      only if the band still passes — trims redundant parts. Near-minimal,
      verified BOM. */
function pdnSRF(cand) { return 1 / (2 * Math.PI * Math.sqrt(cand.esl * 1e-9 * cand.c * 1e-6)); }

function pdnBandState(p, rows, fMax) {
  const sw = pdnSweep(p, rows);
  let worst = 0, worstF = 0, score = 0, n = 0;
  for (let i = 0; i < sw.fs.length; i++) {
    if (sw.fs[i] > fMax) break;
    const ratio = sw.zs[i] / p.zt;
    if (ratio > 1) { score += ratio - 1; n++; if (ratio > worst) { worst = ratio; worstF = sw.fs[i]; } }
  }
  return { worst, worstF, score, n, pass: worst <= 1.0001 };
}

function pdnOptimize(p, baseRows, eslScale = 1) {
  const cur = baseRows.map((r) => ({ ...r, esl: Math.max(0.3, r.esl * eslScale) }));
  const candidates = CAP_LIB.map((x) => ({ ...x, esl: Math.max(0.3, x.esl * eslScale) }));
  const fMax = Math.min(p.ftarget * 1e6, pdnFeasibleF(p));
  const added = new Map();

  const addCap = (cand, qty, store) => {
    const i = store.findIndex((r) => r.c === cand.c && r.esl === cand.esl);
    if (i >= 0) store[i] = { ...store[i], qty: store[i].qty + qty };
    else store.push({ c: cand.c, qty, esr: cand.esr, esl: cand.esl });
  };

  let st = pdnBandState(p, cur, fMax);
  let stalls = 0;

  for (let iter = 0; iter < 200 && !st.pass; iter++) {
    const fStar = st.worstF;
    // rank caps by how close their mounted SRF is to the worst frequency
    const ranked = candidates
      .map((cand) => ({ cand, err: Math.abs(Math.log10(pdnSRF(cand) / fStar)) + (pdnSRF(cand) < fStar * 0.6 ? 3 : 0) }))
      .sort((a, b) => a.err - b.err);
    // try ranked caps until one actually reduces the worst ratio
    let applied = false;
    for (let rk = 0; rk < ranked.length && !applied; rk++) {
      const best = ranked[rk].cand;
      const w = 2 * Math.PI * fStar;
      const zSingle = Math.hypot(best.esr / 1000, w * best.esl * 1e-9 - 1 / (w * best.c * 1e-6));
      const zCur = st.worst * p.zt;
      const invGap = Math.max(0, 1 / p.zt - 1 / zCur);
      let batch = invGap > 0 ? Math.ceil(zSingle * invGap) : 1;
      batch = Math.max(1, Math.min(batch, 16));
      const trial = cur.map((r) => ({ ...r }));
      const ti = trial.findIndex((r) => r.c === best.c && r.esl === best.esl);
      if (ti >= 0) trial[ti].qty += batch; else trial.push({ c: best.c, qty: batch, esr: best.esr, esl: best.esl });
      const trialSt = pdnBandState(p, trial, fMax);
      if (trialSt.worst < st.worst * 0.999 || trialSt.pass) {
        const ci = cur.findIndex((r) => r.c === best.c && r.esl === best.esl);
        if (ci >= 0) cur[ci].qty += batch; else cur.push({ c: best.c, qty: batch, esr: best.esr, esl: best.esl });
        const key = best.c + "|" + best.esl;
        const prev = added.get(key);
        added.set(key, prev ? { ...prev, qty: prev.qty + batch } : { c: best.c, qty: batch, esr: best.esr, esl: best.esl });
        st = trialSt;
        applied = true;
      }
    }
    if (!applied) { stalls++; if (stalls >= 1) break; }
    // sanity ceiling: if we're piling on bulk caps with little progress, stop and let
    // the feasibility advisory explain it's series/plane-limited, not a cap problem
    if (st.score > 0) {
      const totalSoFar = [...added.values()].reduce((a, r) => a + r.qty, 0);
      if (totalSoFar > 60) break;
    }
  }

  // ---- refinement: remove redundant caps while staying passing ----
  if (st.pass) {
    let improved = true;
    while (improved) {
      improved = false;
      for (const [key, rec] of [...added.entries()]) {
        if (rec.qty <= 0) continue;
        const i = cur.findIndex((r) => r.c === rec.c && r.esl === rec.esl);
        if (i < 0) continue;
        const savedQty = cur[i].qty;
        cur[i] = { ...cur[i], qty: cur[i].qty - 1 };
        if (pdnBandState(p, cur, fMax).pass) {
          rec.qty -= 1;
          if (rec.qty === 0) added.delete(key);
          improved = true;
        } else {
          cur[i] = { ...cur[i], qty: savedQty };
        }
      }
    }
    st = pdnBandState(p, cur, fMax);
  }

  const rows = [...added.values()].filter((r) => r.qty > 0).sort((a, b) => b.c - a.c);
  const totalAdded = rows.reduce((a, r) => a + r.qty, 0);
  return { rows, pass: st.pass, worstAfter: st.worst, totalAdded };
}

/* ---- suggestion list: best verified solution FIRST ---- */
function pdnSuggest(p, rows, sweep) {
  const fMax = p.ftarget * 1e6;
  let anyViol = false;
  for (let i = 0; i < sweep.fs.length; i++) {
    if (sweep.fs[i] > fMax) break;
    if (sweep.zs[i] > p.zt) { anyViol = true; break; }
  }
  if (!anyViol) return [];

  const out = [];
  const fFeas = pdnFeasibleF(p);
  const bandLimited = fFeas < fMax;
  const bandTxt = bandLimited ? ` up to the feasible ${fmt(fFeas / 1e6, 1)} MHz` : ` up to ${p.ftarget} MHz`;

  // #1 — the recommended, verified fix on the current mounting
  const opt = pdnOptimize(p, rows, 1);
  if (opt.rows.length) {
    const parts = opt.rows.map((r) => `${r.qty} × ${capLabel(r.c)}`).join("  +  ");
    out.push({
      label: `Recommended: add ${parts}`,
      why: opt.pass
        ? `Verified ✓ — this exact set brings |Z| under the ${fmt(p.zt * 1000, 2)} mΩ target across the entire band${bandTxt}, using ${opt.totalAdded} added cap${opt.totalAdded > 1 ? "s" : ""}. Each value was chosen by simulating every library option and keeping the one that closed the violations fastest.`
        : `Best achievable with capacitors on the current mounting — worst point remains ${fmt(opt.worstAfter, 2)}× target${bandTxt}. The residual is mounting-inductance-limited; see the via-in-pad option below.`,
      rows: opt.rows,
      verified: opt.pass,
    });
  }

  // #1b — hard physics: series path exceeds target before Ftarget
  if (bandLimited) {
    const wT = 2 * Math.PI * fMax;
    const lAllow = Math.sqrt(Math.max(0, (0.8 * p.zt) ** 2 - (p.sprR + p.bgaR) ** 2)) / wT;
    const pairsNeeded = Math.ceil(1e-9 / Math.max(1e-12, lAllow - p.sprL));
    const sprDominant = wT * p.sprL > 0.8 * p.zt;
    out.push({
      label: `Above ${fmt(fFeas / 1e6, 1)} MHz, board caps cannot meet this target`,
      why: sprDominant
        ? `At ${p.ftarget} MHz the spreading inductance alone (${fmt(p.sprL * 1e12, 0)} pH → ${fmt(wT * p.sprL * 1000, 1)} mΩ) exceeds the ${fmt(p.zt * 1000, 2)} mΩ target — no cap quantity fixes a series element. Options: place caps directly under the BGA to cut spreading L, lower the frequency target to what the package/die caps cover, or relax Ztarget.`
        : `The spreading + BGA-via path reaches the target impedance at ${fmt(fFeas / 1e6, 1)} MHz. Increasing PWR/GND via pairs from ${fmt(1e-9 / p.bgaL, 0)} to ≈${pairsNeeded} would extend board-cap effectiveness to ${p.ftarget} MHz; otherwise the ${fmt(fFeas / 1e6, 1)}–${p.ftarget} MHz band belongs to the package and die capacitance (normal for modern ASICs).`,
      rows: null,
    });
  }

  // #2 — alternative: improve mounting first (esl ×0.6 ≈ via-in-pad), usually needs fewer caps
  const optLow = pdnOptimize(p, rows, 0.6);
  if (optLow.pass && (!opt.pass || optLow.totalAdded < opt.totalAdded)) {
    const parts = optLow.rows.length
      ? "then add " + optLow.rows.map((r) => `${r.qty} × ${capLabel(r.c)}`).join("  +  ")
      : "— no extra caps needed";
    out.push({
      label: `Alternative: via-in-pad mounting ${parts}`,
      why: `Cutting mounting inductance ~40% (vias in or at the pad edge, ≈0.5–0.8 nH total) lowers the whole high-frequency floor. With that layout change this rail closes with ${optLow.totalAdded} added cap${optLow.totalAdded === 1 ? "" : "s"} instead of ${opt.pass ? opt.totalAdded : "caps alone failing"} — fewer parts, less board area. Note: Apply only adds the caps; the ESL reduction is a layout action.`,
      rows: optLow.rows.length ? optLow.rows : null,
      verified: true,
    });
  }

  // #3 — anti-resonance advisory if a distinct peak remains in the original curve
  for (let i = 1; i < sweep.fs.length - 1; i++) {
    if (sweep.fs[i] > fMax) break;
    if (sweep.zs[i] > p.zt * 1.05 && sweep.zs[i] > sweep.zs[i - 1] && sweep.zs[i] > sweep.zs[i + 1]) {
      out.push({
        label: `Watch the anti-resonance at ${fmt(sweep.fs[i] / 1e6, 2)} MHz`,
        why: `Parallel cap groups resonate against each other here (${fmt(sweep.zs[i] * 1000, 2)} mΩ peak). The recommended set above already accounts for it, but if you hand-edit the BOM afterwards, keep adjacent decades populated (e.g. don't jump 10 µF → 10 nF with nothing between).`,
        rows: null,
      });
      break;
    }
  }

  return out.slice(0, 3);
}

function PdnPlanner() {
  /* target */
  const [vmin, setVmin] = useState("0.9");
  const [imax, setImax] = useState("5");
  const [trans, setTrans] = useState("50");
  const [ripple, setRipple] = useState("3");
  const [ftarget, setFtarget] = useState("30");
  /* network */
  const [vrmR, setVrmR] = useState("1");      // mΩ
  const [vrmL, setVrmL] = useState("10");     // nH
  const [sprL, setSprL] = useState("40");     // pH
  const [bgaN, setBgaN] = useState("50");     // via pairs
  const [planeA, setPlaneA] = useState("100");// cm²
  const [planeH, setPlaneH] = useState("2.7");// mil
  /* decap BOM */
  const [rows, setRows] = useState([
    { c: 330, qty: 1, esr: 6, esl: 3.5 },
    { c: 22, qty: 2, esr: 3, esl: 1.2 },
    { c: 1, qty: 4, esr: 12, esl: 1.0 },
    { c: 0.1, qty: 6, esr: 28, esl: 0.9 },
  ]);

  const p = (() => {
    const v = num(vmin), i = num(imax), t = num(trans), r = num(ripple), ft = num(ftarget);
    if ([v, i, t, r, ft].some((x) => x === null || x <= 0)) return null;
    const zt = (v * r / 100) / (i * t / 100);
    const aM2 = num(planeA) * 1e-4, hM = num(planeH) * 25.4e-6;
    const planeC = aM2 > 0 && hM > 0 ? (8.854e-12 * 4.2 * aM2) / hM : 0;
    const nb = Math.max(1, num(bgaN) ?? 50);
    return {
      zt, ftarget: ft,
      vrmR: (num(vrmR) ?? 1) / 1000, vrmL: (num(vrmL) ?? 10) * 1e-9,
      sprR: 0.0005, sprL: (num(sprL) ?? 40) * 1e-12,
      bgaR: 0.008 / nb, bgaL: 1e-9 / nb,        // ~1 nH & 8 mΩ per via pair
      planeC, planeR: 0.002,
    };
  })();

  const sweep = p ? pdnSweep(p, rows) : null;
  const sugg = p && sweep ? pdnSuggest(p, rows, sweep) : [];
  const violCount = p && sweep ? sweep.fs.filter((f, i) => f <= p.ftarget * 1e6 && sweep.zs[i] > p.zt).length : 0;

  const applyRows = (list) => {
    if (!list || !list.length) return;
    setRows((prev) => {
      const cp = prev.map((r) => ({ ...r }));
      for (const row of list) {
        const i = cp.findIndex((r) => r.c === row.c && r.esl === row.esl);
        if (i >= 0) cp[i] = { ...cp[i], qty: cp[i].qty + row.qty };
        else cp.push({ ...row });
      }
      return cp;
    });
  };

  const autoFix = () => {
    if (sugg.length && sugg[0].rows) applyRows(sugg[0].rows);
  };

  /* ---- SVG log-log plot ---- */
  const Plot = () => {
    if (!sweep) return null;
    const W = 560, H = 290, mL = 52, mR = 12, mT = 12, mB = 30;
    const zMin = Math.min(...sweep.zs, p.zt) / 2, zMax = Math.max(...sweep.zs, p.zt) * 2;
    const lx = (f) => mL + ((Math.log10(f) - 3) / 6) * (W - mL - mR);
    const ly = (z) => mT + (1 - (Math.log10(z) - Math.log10(zMin)) / (Math.log10(zMax) - Math.log10(zMin))) * (H - mT - mB);
    const path = sweep.fs.map((f, i) => `${i ? "L" : "M"}${fmt(lx(f), 1)},${fmt(ly(sweep.zs[i]), 1)}`).join("");
    const fMax = p.ftarget * 1e6;
    const decadesX = [3, 4, 5, 6, 7, 8, 9];
    const zDecs = [];
    for (let e = Math.ceil(Math.log10(zMin)); e <= Math.floor(Math.log10(zMax)); e++) zDecs.push(Math.pow(10, e));
    const fLab = (e) => (e < 6 ? `${Math.pow(10, e - 3)}k` : e < 9 ? `${Math.pow(10, e - 6)}M` : "1G");
    const zLab = (z) => (z >= 1 ? `${z} Ω` : z >= 1e-3 ? `${z * 1000} mΩ` : `${fmt(z * 1e6, 0)} µΩ`);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ background: "var(--bg2)", borderRadius: 10 }}>
        {decadesX.map((e) => (
          <g key={e}>
            <line x1={lx(Math.pow(10, e))} y1={mT} x2={lx(Math.pow(10, e))} y2={H - mB} stroke="var(--bd5)" strokeWidth="1" />
            <text x={lx(Math.pow(10, e))} y={H - 12} textAnchor="middle" fontSize="10" fill="var(--muted)" fontFamily="monospace">{fLab(e)}</text>
          </g>
        ))}
        {zDecs.map((z) => (
          <g key={z}>
            <line x1={mL} y1={ly(z)} x2={W - mR} y2={ly(z)} stroke="var(--bd5)" strokeWidth="1" />
            <text x={mL - 6} y={ly(z) + 3} textAnchor="end" fontSize="9" fill="var(--muted)" fontFamily="monospace">{zLab(z)}</text>
          </g>
        ))}
        {/* violation shading */}
        {sweep.fs.map((f, i) =>
          f <= fMax && sweep.zs[i] > p.zt && i > 0 ? (
            <line key={i} x1={lx(f)} y1={ly(sweep.zs[i])} x2={lx(f)} y2={ly(p.zt)} stroke="var(--danger)" strokeWidth="2" opacity="0.35" />
          ) : null
        )}
        {/* target line */}
        <line x1={lx(1e3)} y1={ly(p.zt)} x2={lx(fMax)} y2={ly(p.zt)} stroke="var(--ok)" strokeWidth="1.5" strokeDasharray="6 4" />
        <line x1={lx(fMax)} y1={ly(p.zt)} x2={lx(fMax)} y2={mT} stroke="var(--ok)" strokeWidth="1" strokeDasharray="2 4" opacity="0.6" />
        <text x={lx(fMax) + 4} y={mT + 10} fontSize="9" fill="var(--ok)" fontFamily="monospace">F target</text>
        {/* impedance curve */}
        <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.2" />
        <text x={mL + 6} y={ly(p.zt) - 6} fontSize="10" fill="var(--ok)" fontFamily="monospace">Z target = {fmt(p.zt * 1000, 2)} mΩ</text>
      </svg>
    );
  };

  return (
    <div className="h-full overflow-y-auto hw-scroll px-4 py-5">
      <div className="grid lg:grid-cols-5 gap-4 max-w-6xl mx-auto pb-8">

        {/* ---------- LEFT: inputs ---------- */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl p-5" style={{ background: "var(--card2)", border: "1px solid var(--bd2)" }}>
            <h3 className="hw-display font-semibold mb-3" style={{ color: "var(--fg)" }}>1 · Target impedance</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Rail voltage (min)" unit="V" value={vmin} onChange={setVmin} />
              <Field label="I max" unit="A" value={imax} onChange={setImax} />
              <Field label="Transient step" unit="% of Imax" value={trans} onChange={setTrans} />
              <Field label="Ripple (±)" unit="%" value={ripple} onChange={setRipple} />
              <Field label="Frequency target" unit="MHz" value={ftarget} onChange={setFtarget} />
              <div className="rounded-md px-2.5 py-1.5 flex flex-col justify-center" style={{ background: "var(--bg2)", border: "1px solid var(--bd4)" }}>
                <span className="hw-mono text-[10px] uppercase" style={{ color: "var(--muted)" }}>Z target</span>
                <span className="hw-mono text-sm font-semibold" style={{ color: "var(--ok)" }}>{p ? `${fmt(p.zt * 1000, 2)} mΩ` : "—"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ background: "var(--card2)", border: "1px solid var(--bd2)" }}>
            <h3 className="hw-display font-semibold mb-3" style={{ color: "var(--fg)" }}>2 · VRM, planes & path</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="VRM output R" unit="mΩ" value={vrmR} onChange={setVrmR} />
              <Field label="VRM output L" unit="nH" value={vrmL} onChange={setVrmL} />
              <Field label="Spreading L" unit="pH" value={sprL} onChange={setSprL} />
              <Field label="BGA PWR/GND via pairs" unit="#" value={bgaN} onChange={setBgaN} />
              <Field label="Plane overlap area" unit="cm²" value={planeA} onChange={setPlaneA} />
              <Field label="P–G dielectric" unit="mil" value={planeH} onChange={setPlaneH} />
            </div>
            {p && (
              <div className="hw-mono text-[10px] mt-2.5" style={{ color: "var(--muted3)" }}>
                plane cap = {fmt(p.planeC * 1e9, 1)} nF · BGA path = {fmt(p.bgaL * 1e12, 0)} pH
              </div>
            )}
          </div>

          <div className="rounded-xl p-5" style={{ background: "var(--card2)", border: "1px solid var(--bd2)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="hw-display font-semibold" style={{ color: "var(--fg)" }}>3 · Decap BOM</h3>
              <button onClick={() => setRows((r) => [...r, { c: 0.1, qty: 2, esr: 28, esl: 0.9 }])}
                className="hw-mono text-[11px] px-2.5 py-1 rounded-md"
                style={{ background: "var(--btnsoft)", border: "1px solid var(--bd)", color: "var(--accent)" }}>+ add cap</button>
            </div>
            <div className="space-y-1.5">
              <div className="grid gap-1.5 hw-mono text-[9px] uppercase tracking-wider px-1" style={{ gridTemplateColumns: "1.4fr 0.8fr 0.9fr 0.9fr 24px", color: "var(--muted)" }}>
                <span>value</span><span>qty</span><span>esr mΩ</span><span>esl nH</span><span></span>
              </div>
              {rows.map((r, i) => (
                <div key={i} className="grid gap-1.5 items-center" style={{ gridTemplateColumns: "1.4fr 0.8fr 0.9fr 0.9fr 24px" }}>
                  <select value={r.c}
                    onChange={(e) => {
                      const lib = CAP_LIB.find((x) => x.c === parseFloat(e.target.value));
                      setRows((prev) => prev.map((x, j) => j === i ? { ...x, c: lib.c, esr: lib.esr, esl: lib.esl } : x));
                    }}
                    className="rounded-md px-1.5 py-1 text-xs hw-mono outline-none"
                    style={{ background: "var(--bg2)", border: "1px solid var(--bd)", color: "var(--fg)" }}>
                    {CAP_LIB.map((x) => <option key={x.c} value={x.c}>{capLabel(x.c)}</option>)}
                  </select>
                  {["qty", "esr", "esl"].map((k) => (
                    <input key={k} type="text" inputMode="decimal" value={r[k]}
                      onChange={(e) => setRows((prev) => prev.map((x, j) => j === i ? { ...x, [k]: num(e.target.value) ?? 0 } : x))}
                      className="rounded-md px-1.5 py-1 text-xs hw-mono outline-none w-full"
                      style={{ background: "var(--bg2)", border: "1px solid var(--bd)", color: "var(--fg)" }} />
                  ))}
                  <button onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                    style={{ color: "var(--muted)" }} aria-label="Remove row"><X size={13} /></button>
                </div>
              ))}
            </div>
            <div className="hw-mono text-[10px] mt-2.5" style={{ color: "var(--muted3)" }}>
              total {rows.reduce((a, r) => a + (r.qty || 0), 0)} caps · {fmt(rows.reduce((a, r) => a + r.c * (r.qty || 0), 0), 1)} µF equivalent
            </div>
          </div>
        </div>

        {/* ---------- RIGHT: plot + suggestions ---------- */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl p-5" style={{ background: "var(--panel)", border: `1px solid ${violCount ? "var(--danger)" : "var(--ok)"}` }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="hw-display font-semibold" style={{ color: "var(--fg)" }}>PDN impedance |Z(f)|</h3>
              <span className="hw-mono text-xs px-2.5 py-1 rounded-full"
                style={violCount
                  ? { background: "#2b1410", border: "1px solid #6b3a2e", color: "var(--warn)" }
                  : { background: "#13261a", border: "1px solid var(--bd)", color: "var(--ok)" }}>
                {violCount ? `✗ ${violCount} points above target` : "✓ meets target up to Ftarget"}
              </span>
            </div>
            <Plot />
          </div>

          <div className="rounded-xl p-5" style={{ background: "var(--card2)", border: "1px solid var(--accent2)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="hw-display font-semibold" style={{ color: "var(--fg)" }}>Automatic suggestions</h3>
              {violCount > 0 && (
                <button onClick={autoFix}
                  className="hw-mono text-xs px-3 py-1.5 rounded-lg font-semibold btn-primary"
                  style={{ color: "#fff" }}>⚡ Apply Recommended Fix</button>
              )}
            </div>
            {!sugg.length && (
              <p className="text-sm" style={{ color: "var(--ok)" }}>
                ✓ PDN meets the {p ? fmt(p.zt * 1000, 2) : "—"} mΩ target across the whole band up to {ftarget} MHz.
                Consider trimming the BOM: remove caps one row at a time and watch whether the curve stays under target.
              </p>
            )}
            <div className="space-y-3">
              {sugg.map((s, i) => (
                <div key={i} className="rounded-lg px-3.5 py-3" style={{ background: "var(--bg2)", border: "1px solid var(--bd4)" }}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium" style={{ color: i === 0 && s.verified ? "var(--ok)" : "var(--accent)" }}>
                      {i === 0 && s.verified ? "★ " : ""}{s.label}
                    </span>
                    {s.rows && (
                      <button onClick={() => applyRows(s.rows)}
                        className="hw-mono text-[11px] px-2.5 py-1 rounded-md shrink-0 font-semibold"
                        style={i === 0
                          ? { background: "var(--accent2)", color: "var(--onaccent)" }
                          : { background: "var(--btnsoft)", border: "1px solid var(--bd)", color: "var(--ok)" }}>
                        + Apply{s.rows.length > 1 ? " All" : ""}</button>
                    )}
                  </div>
                  <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--fg6)" }}>{s.why}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted4)" }}>
            Lumped-element model after the Altera PDN Design Tool v1.1: Z = Z_BGAvia + Z_spread + (VRM ∥ plane cap ∥ decaps).
            ESR/ESL defaults follow the tool's footprint library; edit per-row for your actual parts and mounting.
            Valid to roughly 100–200 MHz — above that the package and die capacitance dominate and plane resonances
            need a 2.5D solver. Auto-Fix targets the board-level band; final sign-off belongs to a PI simulation.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---- E24 feedback-divider solver (shared by VRM topologies) ---- */
const E24M = [1.0,1.1,1.2,1.3,1.5,1.6,1.8,2.0,2.2,2.4,2.7,3.0,3.3,3.6,3.9,4.3,4.7,5.1,5.6,6.2,6.8,7.5,8.2,9.1];
function bestDividerPair(vref, vout) {
  let best = null;
  for (const dec of [1e3, 1e4, 1e5]) {
    for (const m of E24M) {
      const r2 = m * dec;
      const r1req = r2 * (vout / vref - 1);
      if (r1req <= 0) continue;
      const r1 = nearestE24(r1req);
      const vAct = vref * (1 + r1 / r2);
      const err = (vAct - vout) / vout;
      const score = Math.abs(err) + Math.abs(Math.log10(r2 / 1e4)) * 1e-4;
      if (!best || score < best.score) best = { r1, r2, vAct, err, score };
    }
  }
  return best;
}

/* ============================================================
   VRM DESIGNER — topology workbench
   Sub-modes: Switching (buck) · LDO · Multiphase
   Each gives reference-design value picks for essential parts.
   ============================================================ */

/* ---- shared small UI ---- */
function VField({ label, value, onChange, unit }) {
  return (
    <label className="block">
      <span className="hw-mono text-[10px] uppercase tracking-wider block mb-1" style={{ color: "var(--label)" }}>
        {label}{unit ? ` (${unit})` : ""}
      </span>
      <input type="text" inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-2.5 py-1.5 text-sm hw-mono outline-none ring-focus"
        style={{ background: "var(--bg2)", border: "1px solid var(--inputbd)", color: "var(--fg)" }} />
    </label>
  );
}
function VRow({ l, val, c, hint }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <span className="text-xs" style={{ color: "var(--fg3)" }}>{l}{hint && <span className="hw-mono text-[9px] ml-1" style={{ color: "var(--muted6)" }}>{hint}</span>}</span>
      <span className="hw-mono text-sm font-semibold" style={{ color: c || "var(--accent)" }}>{val}</span>
    </div>
  );
}
function VCard({ title, accent, children }) {
  return (
    <div className="rounded-2xl p-5 card3d" style={{ background: "var(--card)", border: `1px solid ${accent || "var(--bd3)"}` }}>
      {title && <h3 className="hw-display font-semibold mb-3" style={{ color: "var(--fg)" }}>{title}</h3>}
      {children}
    </div>
  );
}
/* nearest standard inductor / capacitor value */
const STD_L = [0.1,0.15,0.22,0.33,0.47,0.68,1,1.5,2.2,3.3,4.7,6.8,10,15,22,33,47,68,100];
const STD_C = [1,2.2,4.7,10,22,33,47,68,100,150,220,330,470,680,1000,1500,2200];
const pickUp = (arr, x) => arr.find((v) => v >= x) ?? arr[arr.length - 1];


/* ---- VRM reference schematics + impact graphs (live) ---- */
const VS = { ln: "var(--dln)", cu: "var(--accent)", cy: "var(--accent3)", ok: "var(--ok)", warn: "var(--warn)", dim: "var(--label)", mut: "var(--muted5)" };
const VSvg = ({ children, h = 150 }) => (
  <svg viewBox={`0 0 320 ${h}`} className="w-full h-auto block" style={{ background: "var(--bg2)", borderRadius: 12, border: "1px solid var(--bd3)" }}>{children}</svg>
);
const VT = ({ x, y, c = VS.dim, s = 8.5, a = "middle", b, children }) => (
  <text x={x} y={y} fontSize={s} fill={c} textAnchor={a} fontFamily="'IBM Plex Mono',monospace" fontWeight={b ? 600 : 400}>{children}</text>
);

/* BUCK reference schematic with live values */
function BuckSchematic({ r, v }) {
  return (
    <VSvg h={160}>
      <VT x={160} y={15} c={VS.cy} b>Synchronous Buck — reference</VT>
      {/* Vin */}
      <VT x={20} y={42} c={VS.cu} a="start">Vin {fmt(v.vin,0)}V</VT>
      <path d="M18 46 H46" stroke={VS.ln} strokeWidth="1.5" fill="none" />
      {/* Cin */}
      <path d="M40 46 V60 M32 60 H48 M34 64 H46 M40 64 V74" stroke={VS.cu} strokeWidth="1.5" fill="none" />
      <VT x={52} y={70} a="start" s={7} c={VS.cu}>Cin {r?`${r.cinPick}µF`:""}</VT>
      <g stroke={VS.ln} strokeWidth="1.3"><line x1={32} y1={76} x2={48} y2={76}/><line x1={35} y1={79} x2={45} y2={79}/></g>
      {/* HS FET */}
      <rect x={64} y={36} width={22} height={18} rx={3} fill="none" stroke={VS.ln} strokeWidth="1.3" /><VT x={75} y={48} s={6.5}>HS</VT>
      <path d="M46 46 H64" stroke={VS.ln} strokeWidth="1.5" fill="none" />
      <path d="M86 46 H108" stroke={VS.ln} strokeWidth="1.5" fill="none" /><circle cx={108} cy={46} r={2} fill={VS.ln} />
      {/* SW node + LS FET */}
      <VT x={108} y={32} c={VS.cy} s={7}>SW</VT>
      <path d="M108 46 V66" stroke={VS.ln} strokeWidth="1.5" />
      <rect x={97} y={66} width={22} height={18} rx={3} fill="none" stroke={VS.ln} strokeWidth="1.3" /><VT x={108} y={78} s={6.5}>LS</VT>
      <path d="M108 84 V94" stroke={VS.ln} strokeWidth="1.5" />
      <g stroke={VS.ln} strokeWidth="1.3"><line x1={100} y1={94} x2={116} y2={94}/><line x1={103} y1={97} x2={113} y2={97}/></g>
      {/* Inductor */}
      <path d="M108 46 H128 M128 46 a5 5 0 0 1 10 0 a5 5 0 0 1 10 0 a5 5 0 0 1 10 0 a5 5 0 0 1 10 0 H180" stroke={VS.cu} strokeWidth="1.8" fill="none" />
      <VT x={150} y={36} c={VS.cu} b>{r?`L ${r.Lpick}µH`:"L"}</VT>
      <circle cx={180} cy={46} r={2} fill={VS.ln} />
      {/* Cout */}
      <path d="M180 46 V60 M172 60 H188 M174 64 H186 M180 64 V74" stroke={VS.cu} strokeWidth="1.5" fill="none" />
      <VT x={194} y={70} a="start" s={7} c={VS.cu}>Cout {r?`${r.coutPick}µF`:""}</VT>
      <g stroke={VS.ln} strokeWidth="1.3"><line x1={172} y1={76} x2={188} y2={76}/><line x1={175} y1={79} x2={185} y2={79}/></g>
      {/* Vout + divider */}
      <path d="M180 46 H250" stroke={VS.ln} strokeWidth="1.5" /><circle cx={250} cy={46} r={2} fill={VS.ln} />
      <VT x={258} y={42} a="start" c={VS.ok} b>{r?`${fmt(r.div.vAct,3)}V`:"Vout"}</VT>
      <rect x={244} y={54} width={12} height={20} rx={2} fill="none" stroke={VS.cu} strokeWidth="1.3" />
      <VT x={262} y={66} a="start" s={6.5} c={VS.cu}>R1 {r?`${fmt(r.div.r1/1000,1)}k`:""}</VT>
      <path d="M250 74 V82" stroke={VS.ln} strokeWidth="1.3" /><circle cx={250} cy={80} r={1.8} fill={VS.ln} />
      <path d="M250 80 H236" stroke={VS.ln} strokeWidth="1.3" /><VT x={232} y={83} a="end" s={6} c={VS.cy}>FB</VT>
      <rect x={244} y={84} width={12} height={20} rx={2} fill="none" stroke={VS.cu} strokeWidth="1.3" />
      <VT x={262} y={96} a="start" s={6.5} c={VS.cu}>R2 {r?`${fmt(r.div.r2/1000,1)}k`:""}</VT>
      <g stroke={VS.ln} strokeWidth="1.3"><line x1={244} y1={108} x2={256} y2={108}/><line x1={247} y1={111} x2={253} y2={111}/></g>
      {/* inductor current ripple sketch */}
      <VT x={20} y={130} a="start" s={7} c={VS.mut}>IL ripple:</VT>
      <path d="M72 138 L92 128 L112 138 L132 128 L152 138 L172 128 L192 138" stroke={VS.cy} strokeWidth="1.5" fill="none" />
      <VT x={210} y={135} a="start" s={7} c={VS.cy}>{r?`ΔI ${fmt(r.dIact,1)}A pk-pk`:""}</VT>
    </VSvg>
  );
}

/* BUCK impact graph: efficiency vs load (qualitative live curve) */
function BuckEffGraph({ r, v }) {
  if (!r) return null;
  // model eff(Iload) using same loss terms scaled
  const pts = [];
  const N = 40;
  for (let i = 1; i <= N; i++) {
    const I = (i / N) * v.iout;
    const D = v.vout / v.vin, fHz = v.fsw * 1e3;
    const pCond = D * I*I*(v.rhs??5)/1000 + (1-D)*I*I*(v.rls??3)/1000 + I*I*(v.dcr??8)/1000;
    const pFixed = 0.5*v.vin*I*((v.trf??10)*1e-9)*fHz + ((v.qg??20)*1e-9)*5*fHz;
    const eff = v.vout*I / (v.vout*I + pCond + pFixed) * 100;
    pts.push([I, eff]);
  }
  const x = (I) => 36 + (I / v.iout) * 268;
  const y = (e) => 96 - ((e - 60) / 40) * 76;
  const path = pts.map(([I,e],i)=>`${i?"L":"M"}${fmt(x(I),1)},${fmt(y(Math.max(60,e)),1)}`).join("");
  return (
    <VSvg h={120}>
      <VT x={160} y={14} c={VS.cy} b>Efficiency vs load current</VT>
      {[70,80,90,100].map(e=>(<g key={e}><line x1={36} y1={y(e)} x2={304} y2={y(e)} stroke="var(--bd3)" strokeWidth="1"/><VT x={30} y={y(e)+3} a="end" s={7}>{e}%</VT></g>))}
      <path d={path} fill="none" stroke={VS.cu} strokeWidth="2" />
      <VT x={36} y={112} a="start" s={7} c={VS.mut}>0A</VT><VT x={304} y={112} a="end" s={7} c={VS.mut}>{fmt(v.iout,0)}A</VT>
      <VT x={170} y={112} s={7} c={VS.mut}>peak η at light-mid load; conduction loss dominates near full load</VT>
    </VSvg>
  );
}

/* LDO reference schematic */
function LdoSchematic({ r, v, adj }) {
  return (
    <VSvg h={150}>
      <VT x={160} y={15} c={VS.cy} b>{adj==="adj"?"Adjustable LDO — reference":"Fixed LDO — reference"}</VT>
      <VT x={20} y={50} a="start" c={VS.cu}>Vin {fmt(v.vin,1)}V</VT>
      <path d="M18 54 H44" stroke={VS.ln} strokeWidth="1.5"/>
      <path d="M40 54 V66 M32 66 H48 M34 70 H46 M40 70 V80" stroke={VS.cu} strokeWidth="1.5" fill="none"/>
      <VT x={40} y={92} s={7} c={VS.cu}>Cin</VT>
      <g stroke={VS.ln} strokeWidth="1.3"><line x1={32} y1={80} x2={48} y2={80}/><line x1={35} y1={83} x2={45} y2={83}/></g>
      <path d="M44 54 H78" stroke={VS.ln} strokeWidth="1.5"/>
      <rect x={78} y={36} width={70} height={40} rx={6} fill="none" stroke={VS.ln} strokeWidth="1.4"/><VT x={113} y={60} s={11}>LDO</VT>
      {/* heat */}
      {[0,1,2].map(i=>(<path key={i} d={`M${98+i*14} 32 q3 -6 0 -11`} stroke={VS.warn} strokeWidth="1.2" fill="none"/>))}
      <VT x={113} y={26} s={7} c={VS.warn}>{r?`${fmt(r.pd,2)}W heat`:""}</VT>
      <path d="M148 54 H250" stroke={VS.ln} strokeWidth="1.5"/><circle cx={250} cy={54} r={2} fill={VS.ln}/>
      <VT x={196} y={50} c={VS.ok} b>{r?`${fmt(v.vout,2)}V`:"Vout"}</VT>
      {/* Cout */}
      <path d="M218 54 V66 M210 66 H226 M212 70 H224 M218 70 V80" stroke={VS.cu} strokeWidth="1.5" fill="none"/>
      <VT x={218} y={92} s={7} c={VS.cu}>Cout</VT>
      <g stroke={VS.ln} strokeWidth="1.3"><line x1={210} y1={80} x2={226} y2={80}/><line x1={213} y1={83} x2={223} y2={83}/></g>
      {adj==="adj" && r && r.div && (
        <g>
          <circle cx={250} cy={54} r={2} fill={VS.ln}/>
          <rect x={244} y={62} width={12} height={18} rx={2} fill="none" stroke={VS.cu} strokeWidth="1.3"/>
          <VT x={262} y={74} a="start" s={6.5} c={VS.cu}>R1 {fmt(r.div.r1/1000,1)}k</VT>
          <path d="M250 80 V86" stroke={VS.ln} strokeWidth="1.2"/><path d="M250 84 H236" stroke={VS.ln} strokeWidth="1.2"/><VT x={232} y={87} a="end" s={6} c={VS.cy}>ADJ</VT>
          <rect x={244} y={88} width={12} height={18} rx={2} fill="none" stroke={VS.cu} strokeWidth="1.3"/>
          <VT x={262} y={100} a="start" s={6.5} c={VS.cu}>R2 {fmt(r.div.r2/1000,1)}k</VT>
          <g stroke={VS.ln} strokeWidth="1.3"><line x1={244} y1={110} x2={256} y2={110}/><line x1={247} y1={113} x2={253} y2={113}/></g>
        </g>
      )}
      <VT x={113} y={92} s={7} c={VS.mut}>{r?`η = Vout/Vin = ${fmt(r.eff,0)}% — rest is heat`:""}</VT>
    </VSvg>
  );
}

/* LDO impact graph: Tj vs Iout with Tj,max line */
function LdoThermalGraph({ r, v }) {
  if (!r) return null;
  const iMax = Math.max(v.iout/1000*1.5, r.iMaxThermal*1.1, 0.05);
  const pts=[]; const N=40;
  for(let i=0;i<=N;i++){const I=(i/N)*iMax;const pd=(v.vin-v.vout)*I+v.vin*((v.iq??50)*1e-6);const tj=(v.ta??45)+pd*(v.theta??50);pts.push([I,tj]);}
  const tjmax=v.tjmax??125;
  const yMax=Math.max(tjmax*1.15, ...pts.map(p=>p[1]));
  const x=(I)=>40+(I/iMax)*264; const y=(t)=>100-((t-(v.ta??45))/(yMax-(v.ta??45)))*84;
  const path=pts.map(([I,t],i)=>`${i?"L":"M"}${fmt(x(I),1)},${fmt(y(t),1)}`).join("");
  const xOp=x(v.iout/1000), yOp=y(r.tj);
  return (
    <VSvg h={124}>
      <VT x={160} y={14} c={VS.cy} b>Junction temp vs output current</VT>
      <line x1={40} y1={y(tjmax)} x2={304} y2={y(tjmax)} stroke={VS.danger||"var(--danger)"} strokeWidth="1.3" strokeDasharray="5 3"/>
      <VT x={304} y={y(tjmax)-3} a="end" s={7} c="var(--danger)">Tj,max {fmt(tjmax,0)}°C</VT>
      <path d={path} fill="none" stroke={VS.cu} strokeWidth="2"/>
      <circle cx={xOp} cy={yOp} r={3.5} fill={r.tj>tjmax?"var(--danger)":VS.ok}/>
      <VT x={xOp} y={yOp-7} s={7} c={r.tj>tjmax?"var(--danger)":VS.ok}>{fmt(v.iout,0)}mA → {fmt(r.tj,0)}°C</VT>
      <VT x={40} y={116} a="start" s={7} c={VS.mut}>0</VT><VT x={304} y={116} a="end" s={7} c={VS.mut}>{fmt(iMax*1000,0)}mA</VT>
    </VSvg>
  );
}

/* MULTIPHASE schematic: N phases into one node */
function MultiphaseSchematic({ r, v }) {
  const N = r ? r.N : 4;
  const show = Math.min(N, 4);
  const rowY = (i) => 52 + i * 30;            // phase row y-centres
  const busX = 250;                            // shared output bus x
  const lastY = rowY(show - 1);
  const H = Math.max(180, lastY + 70);
  return (
    <VSvg h={H}>
      <VT x={160} y={16} c={VS.cy} b>{N}-phase interleaved buck — reference</VT>

      {/* Controller block (left) */}
      <rect x={14} y={40} width={30} height={lastY - 24} rx={5} fill="none" stroke={VS.ln} strokeWidth="1.3" />
      <VT x={29} y={(40 + lastY) / 2 - 4} s={7} c={VS.dim}>PWM</VT>
      <VT x={29} y={(40 + lastY) / 2 + 6} s={7} c={VS.dim}>ctrl</VT>

      {/* Vin rail (top) */}
      <VT x={70} y={34} a="start" c={VS.cu}>Vin {fmt(v.vin, 0)}V</VT>
      <path d={`M70 38 H${busX}`} stroke={VS.ln} strokeWidth="1.5" />

      {/* Phases */}
      {Array.from({ length: show }).map((_, i) => {
        const y = rowY(i);
        return (
          <g key={i}>
            <path d={`M44 ${42 + i * 8} H52 V${y - 9}`} stroke={VS.dln} strokeWidth="0.8" strokeDasharray="2 2" />
            <rect x={56} y={y - 11} width={30} height={22} rx={3} fill="none" stroke={VS.ln} strokeWidth="1.2" />
            <VT x={71} y={y - 1} s={6.5} c={VS.dim}>{`\u03c6${i + 1}`}</VT>
            <VT x={71} y={y + 7} s={5.5} c={VS.mut}>DrMOS</VT>
            <path d={`M86 38 V${y - 11}`} stroke={VS.ln} strokeWidth="0.8" opacity="0.5" />
            <path d={`M86 ${y} H100 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 H${busX}`} stroke={VS.cu} strokeWidth="1.6" fill="none" />
            <VT x={134} y={y - 9} s={6} c={VS.cu}>{r ? `${r.Lpick}\u00b5H` : "L"}</VT>
            <circle cx={busX} cy={y} r={2} fill={VS.ln} />
          </g>
        );
      })}
      {N > show && <VT x={150} y={lastY + 22} s={7} c={VS.mut}>+ {N - show} identical phases…</VT>}

      {/* shared output bus */}
      <path d={`M${busX} ${rowY(0)} V${lastY}`} stroke={VS.ln} strokeWidth="1.6" />

      {/* output node + Cout */}
      <path d={`M${busX} ${rowY(0)} H${busX + 52}`} stroke={VS.ln} strokeWidth="1.5" />
      <path d={`M${busX + 26} ${rowY(0)} V${rowY(0) + 12}`} stroke={VS.cu} strokeWidth="1.4" />
      <line x1={busX + 18} y1={rowY(0) + 12} x2={busX + 34} y2={rowY(0) + 12} stroke={VS.cu} strokeWidth="1.6" />
      <line x1={busX + 20} y1={rowY(0) + 15} x2={busX + 32} y2={rowY(0) + 15} stroke={VS.cu} strokeWidth="1.6" />
      <VT x={busX + 40} y={rowY(0) + 14} a="start" s={6.5} c={VS.cu}>Cout</VT>
      <g stroke={VS.ln} strokeWidth="1.2">
        <line x1={busX + 19} y1={rowY(0) + 20} x2={busX + 33} y2={rowY(0) + 20} />
        <line x1={busX + 22} y1={rowY(0) + 23} x2={busX + 30} y2={rowY(0) + 23} />
      </g>
      <VT x={busX + 54} y={rowY(0) - 6} a="end" s={8} c={VS.ok} b>{fmt(v.vout, 2)} V</VT>

      {/* load */}
      <rect x={busX + 14} y={lastY - 12} width={42} height={24} rx={4} fill="none" stroke={VS.cu} strokeWidth="1.2" />
      <path d={`M${busX} ${lastY} H${busX + 14}`} stroke={VS.ln} strokeWidth="1.5" />
      <VT x={busX + 35} y={lastY - 1} s={6.5} c={VS.cu}>ASIC</VT>
      <VT x={busX + 35} y={lastY + 7} s={5.5} c={VS.cy}>{fmt(v.iout, 0)}A</VT>

      <VT x={160} y={H - 10} s={7} c={VS.mut}>
        {r ? `${fmt(r.iPhase, 0)} A per phase · clocked ${fmt(360 / N, 0)}\u00b0 apart · shared output node` : ""}
      </VT>
    </VSvg>
  );
}

/* MULTIPHASE impact graph: per-phase inductor currents (interleaved) and the
   summed output current showing ripple cancellation — with real axes. */
function MultiphaseGraph({ r, v }) {
  if (!r) return null;
  const N = r.N;
  const D = v.vout / v.vin;
  const W = 320, x0 = 40, x1 = 306;
  const topY0 = 30, topY1 = 96;      // per-phase band
  const botY0 = 116, botY1 = 168;    // summed band
  const NP = 160;

  // per-phase triangular current, normalized 0..1, offset by phase
  const tri = (ph, t) => {
    const tp = ((t + ph / N) % 1 + 1) % 1;
    return tp < D ? tp / D : 1 - (tp - D) / (1 - D);
  };
  const px = (t) => x0 + t * (x1 - x0);
  const colors = [VS.cu, VS.cy, VS.ok, VS.warn];

  // per-phase traces (top band): map 0..1 ripple into the band
  const phaseLines = [];
  for (let ph = 0; ph < Math.min(N, 4); ph++) {
    let d = "";
    for (let i = 0; i <= NP; i++) { const t = i / NP; d += `${i ? "L" : "M"}${fmt(px(t), 1)},${fmt(topY1 - tri(ph, t) * (topY1 - topY0), 1)}`; }
    phaseLines.push(<path key={ph} d={d} stroke={colors[ph % 4]} strokeWidth="1.3" fill="none" opacity="0.8" />);
  }

  // summed current (bottom band): average of all N phases, auto-scaled to show ripple
  let sMin = 1e9, sMax = -1e9; const sum = [];
  for (let i = 0; i <= NP; i++) { const t = i / NP; let s = 0; for (let ph = 0; ph < N; ph++) s += tri(ph, t); s /= N; sum.push(s); if (s < sMin) sMin = s; if (s > sMax) sMax = s; }
  const span = Math.max(1e-6, sMax - sMin);
  const pad = span * 0.6;
  let dsum = "";
  for (let i = 0; i <= NP; i++) { const t = i / NP; const norm = (sum[i] - sMin + pad / 2) / (span + pad); dsum += `${i ? "L" : "M"}${fmt(px(t), 1)},${fmt(botY1 - norm * (botY1 - botY0), 1)}`; }

  const cancelPct = (1 - r.dIout / (r.dIph * N)) * 100;

  return (
    <VSvg h={184}>
      <VT x={160} y={14} c={VS.cy} b>Inductor currents interleave → output ripple cancels</VT>

      {/* top band frame + label */}
      <line x1={x0} y1={topY0} x2={x0} y2={topY1} stroke={VS.dln} strokeWidth="1" />
      <line x1={x0} y1={topY1} x2={x1} y2={topY1} stroke={VS.dln} strokeWidth="1" />
      <VT x={x0 - 4} y={topY0 + 4} a="end" s={6.5} c={VS.mut}>Ipk</VT>
      <VT x={x0 - 4} y={topY1} a="end" s={6.5} c={VS.mut}>Ivly</VT>
      <VT x={x1} y={topY0 + 2} a="end" s={7} c={VS.dim}>per-phase IL ({Math.min(N, 4)} of {N} shown)</VT>
      {phaseLines}

      {/* bottom band frame + label */}
      <line x1={x0} y1={botY0} x2={x0} y2={botY1} stroke={VS.dln} strokeWidth="1" />
      <line x1={x0} y1={botY1} x2={x1} y2={botY1} stroke={VS.dln} strokeWidth="1" />
      <VT x={x1} y={botY0 + 2} a="end" s={7} c={VS.ok}>summed output current</VT>
      <path d={dsum} stroke={VS.ok} strokeWidth="2" fill="none" />

      {/* x-axis label */}
      <VT x={(x0 + x1) / 2} y={182} s={6.5} c={VS.mut}>one switching period (phases {fmt(360 / N, 0)}° apart)</VT>
      <VT x={x0} y={botY0 - 4} a="start" s={7} c={VS.ok} b>{fmt(cancelPct, 0)}% ripple cancelled</VT>
    </VSvg>
  );
}

/* ---- shared: BOM table + manual divider ---- */
function BomTable({ rows, title = "Complete BOM (generic specs)" }) {
  const total = rows.reduce((a, r) => a + (r.qty || 1), 0);
  const copyBom = () => {
    const txt = title + "\n" + rows.map((r) => `${r.qty||1}x  ${r.ref||""}  ${r.value}  ${r.rating||""}  ${r.pkg||""}  ${r.note||""}`.replace(/\s+/g," ").trim()).join("\n");
    try { navigator.clipboard.writeText(txt); } catch {}
  };
  return (
    <VCard title={title} accent="var(--bd3)">
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "var(--label)" }} className="hw-mono text-[9px] uppercase tracking-wider">
              <th className="text-left py-1 pr-2">Qty</th><th className="text-left py-1 pr-2">Ref</th>
              <th className="text-left py-1 pr-2">Value</th><th className="text-left py-1 pr-2">Rating</th>
              <th className="text-left py-1 pr-2">Pkg</th><th className="text-left py-1">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--divider)", color: "var(--fg3)" }}>
                <td className="py-1.5 pr-2 hw-mono" style={{ color: "var(--accent)" }}>{r.qty || 1}×</td>
                <td className="py-1.5 pr-2 hw-mono" style={{ color: "var(--fg4)" }}>{r.ref || "—"}</td>
                <td className="py-1.5 pr-2 hw-mono font-semibold" style={{ color: "var(--fg)" }}>{r.value}</td>
                <td className="py-1.5 pr-2 hw-mono">{r.rating || "—"}</td>
                <td className="py-1.5 pr-2 hw-mono">{r.pkg || "—"}</td>
                <td className="py-1.5 text-[11px]">{r.note || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="hw-mono text-[10px]" style={{ color: "var(--muted5)" }}>{rows.length} line items · {total} components</span>
        <button onClick={copyBom} className="hw-mono text-[10px] flex items-center gap-1 px-2.5 py-1 rounded-md btn-primary" style={{ color: "#fff" }}>copy BOM</button>
      </div>
    </VCard>
  );
}

/* manual divider: fix R1, R2, both, or auto — returns {r1,r2,vAct,err,mode} */
function resolveDivider(vref, vout, r1Man, r2Man) {
  const r1 = num(r1Man), r2 = num(r2Man); // kΩ
  const ratio = vout / vref - 1;
  if (r1 > 0 && r2 > 0) { const vAct = vref * (1 + (r1 * 1e3) / (r2 * 1e3)); return { r1: r1 * 1e3, r2: r2 * 1e3, vAct, err: (vAct - vout) / vout, mode: "both" }; }
  if (r2 > 0) { const r1e = nearestE24(r2 * 1e3 * ratio); const vAct = vref * (1 + r1e / (r2 * 1e3)); return { r1: r1e, r2: r2 * 1e3, vAct, err: (vAct - vout) / vout, mode: "r2", exact: r2 * 1e3 * ratio }; }
  if (r1 > 0) { const r2e = nearestE24((r1 * 1e3) / ratio); const vAct = vref * (1 + (r1 * 1e3) / r2e); return { r1: r1 * 1e3, r2: r2e, vAct, err: (vAct - vout) / vout, mode: "r1", exact: (r1 * 1e3) / ratio }; }
  return null;
}

function DividerCard({ vref, vout, r1Man, setR1Man, r2Man, setR2Man, auto }) {
  const manual = resolveDivider(vref, vout, r1Man, r2Man);
  return (
    <VCard title="Feedback divider — Vout = Vref·(1 + R1/R2)" accent="var(--accent2)">
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <VField label="Fix R1 top — optional" unit="kΩ" value={r1Man} onChange={setR1Man} />
        <VField label="Fix R2 bottom — optional" unit="kΩ" value={r2Man} onChange={setR2Man} />
      </div>
      {manual && (
        <div className="rounded-lg px-3 py-2.5 mb-3" style={{ background: "var(--bg2)", border: "1px solid var(--bd)" }}>
          <div className="hw-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--ok)" }}>your divider</div>
          {manual.mode !== "both" && <VRow l={`Fix ${manual.mode === "r2" ? "R2" : "R1"} → exact ${manual.mode === "r2" ? "R1" : "R2"}`} val={`${fmt(manual.exact / 1000, 3)} kΩ`} />}
          <VRow l={manual.mode === "both" ? "Your pair" : "Nearest E24 pair"} val={`R1 ${fmt(manual.r1 / 1000, 2)}k / R2 ${fmt(manual.r2 / 1000, 2)}k`} c="var(--ok)" />
          <VRow l="Resulting Vout" val={`${fmt(manual.vAct, 4)} V (${manual.err >= 0 ? "+" : ""}${fmt(manual.err * 100, 2)}%)`} c={Math.abs(manual.err) < 0.01 ? "var(--ok)" : "var(--warn)"} />
        </div>
      )}
      {auto && (
        <>
          <div className="hw-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--label)" }}>auto suggestion{manual ? " (for comparison)" : ""}</div>
          <VRow l="Best E24 pair" val={`R1 ${fmt(auto.r1 / 1000, 2)}k / R2 ${fmt(auto.r2 / 1000, 2)}k`} c="var(--ok)" />
          <VRow l="Resulting Vout" val={`${fmt(auto.vAct, 4)} V (${auto.err >= 0 ? "+" : ""}${fmt(auto.err * 100, 2)}%)`} c={Math.abs(auto.err) < 0.01 ? "var(--ok)" : "var(--warn)"} />
        </>
      )}
      <p className="text-[11px] mt-2" style={{ color: "var(--muted5)" }}>Leave both blank for auto. Use 0.1% (E96) parts on tight core rails. Keep divider current ≫ FB bias (~100×).</p>
    </VCard>
  );
}

/* ============================ SWITCHING (BUCK) ============================ */
function SwitchingDesigner() {
  const [vin, setVin] = useState("12");
  const [vout, setVout] = useState("1.2");
  const [iout, setIout] = useState("10");
  const [fsw, setFsw] = useState("600");
  const [vref, setVref] = useState("0.6");
  const [ripL, setRipL] = useState("30");
  const [vripO, setVripO] = useState("10");
  const [iStep, setIStep] = useState("5");
  const [dvTran, setDvTran] = useState("30");
  const [rhs, setRhs] = useState("5");
  const [rls, setRls] = useState("3");
  const [qg, setQg] = useState("20");
  const [trf, setTrf] = useState("10");
  const [dcr, setDcr] = useState("8");
  const [r1Man, setR1Man] = useState("");
  const [r2Man, setR2Man] = useState("");

  const v = Object.fromEntries(Object.entries({ vin, vout, iout, fsw, vref, ripL, vripO, iStep, dvTran, rhs, rls, qg, trf, dcr }).map(([k, x]) => [k, num(x)]));
  const ok = [v.vin, v.vout, v.iout, v.fsw, v.vref].every((x) => x && x > 0) && v.vout < v.vin && v.vref < v.vout;

  let r = null;
  if (ok) {
    const D = v.vout / v.vin, fHz = v.fsw * 1e3, ton = D / fHz;
    const div = bestDividerPair(v.vref, v.vout);
    const dI = v.iout * (v.ripL ?? 30) / 100;
    const Lraw = ((v.vin - v.vout) * D) / (fHz * dI);
    const Lpick = pickUp(STD_L, Lraw * 1e6);
    const dIact = ((v.vin - v.vout) * D) / (fHz * Lpick * 1e-6);
    const iPk = v.iout + dIact / 2, iRms = Math.sqrt(v.iout ** 2 + dIact ** 2 / 12);
    const coutRip = dIact / (8 * fHz * (v.vripO ?? 10) * 1e-3);
    const coutTran = (Lpick * 1e-6 * (v.iStep ?? 5) ** 2) / (((v.vout + (v.dvTran ?? 30) * 1e-3) ** 2) - v.vout ** 2);
    const coutNeed = Math.max(coutRip, coutTran) * 1e6;
    const coutPick = pickUp(STD_C, coutNeed);
    const esrMaxO = ((v.vripO ?? 10) * 1e-3) / dIact;
    const iRmsIn = v.iout * Math.sqrt(D * (1 - D));
    const cinNeed = (v.iout * D * (1 - D)) / (fHz * 100 * 1e-3) * 1e6;
    const cinPick = pickUp(STD_C, cinNeed);
    const pHs = D * v.iout ** 2 * (v.rhs ?? 5) / 1000, pLs = (1 - D) * v.iout ** 2 * (v.rls ?? 3) / 1000;
    const pSw = 0.5 * v.vin * v.iout * ((v.trf ?? 10) * 1e-9) * fHz, pGate = ((v.qg ?? 20) * 1e-9) * 5 * fHz;
    const pL = iRms ** 2 * (v.dcr ?? 8) / 1000, pTot = pHs + pLs + pSw + pGate + pL;
    const eff = v.vout * v.iout / (v.vout * v.iout + pTot) * 100;
    r = { D, ton, div, Lraw: Lraw * 1e6, Lpick, dIact, iPk, iRms, coutNeed, coutPick, coutTran: coutTran * 1e6, esrMaxO: esrMaxO * 1000, cinNeed, cinPick, iRmsIn,
          losses: [["HS conduction", pHs], ["LS conduction", pLs], ["Switching", pSw], ["Gate", pGate], ["Inductor DCR", pL]], pTot, eff,
          tonOk: ton * 1e9 > 50 };
  }

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <VCard title="Specification">
          <div className="grid grid-cols-2 gap-2.5">
            <VField label="Vin" unit="V" value={vin} onChange={setVin} />
            <VField label="Vout" unit="V" value={vout} onChange={setVout} />
            <VField label="Iout max" unit="A" value={iout} onChange={setIout} />
            <VField label="fsw" unit="kHz" value={fsw} onChange={setFsw} />
            <VField label="VFB / Vref" unit="V" value={vref} onChange={setVref} />
            <VField label="Ripple ΔI/Iout" unit="%" value={ripL} onChange={setRipL} />
          </div>
        </VCard>
        <VCard title="Ripple & transient">
          <div className="grid grid-cols-2 gap-2.5">
            <VField label="Output ripple" unit="mVpp" value={vripO} onChange={setVripO} />
            <VField label="Load step" unit="A" value={iStep} onChange={setIStep} />
            <VField label="Transient window" unit="mV" value={dvTran} onChange={setDvTran} />
          </div>
        </VCard>
        <VCard title="FET & inductor parts">
          <div className="grid grid-cols-2 gap-2.5">
            <VField label="HS Rds(on)" unit="mΩ" value={rhs} onChange={setRhs} />
            <VField label="LS Rds(on)" unit="mΩ" value={rls} onChange={setRls} />
            <VField label="Gate charge" unit="nC" value={qg} onChange={setQg} />
            <VField label="tr + tf" unit="ns" value={trf} onChange={setTrf} />
            <VField label="Inductor DCR" unit="mΩ" value={dcr} onChange={setDcr} />
          </div>
        </VCard>
      </div>

      <div className="lg:col-span-3 space-y-4">
        {!ok && <VCard title="Buck regulator">
          <p className="text-sm" style={{ color: "var(--fg3)" }}>Needs Vout &lt; Vin and Vref &lt; Vout. Reference schematic, component picks and efficiency graph appear here.</p></VCard>}
        {r && <div className="space-y-3"><BuckSchematic r={r} v={v} /><BuckEffGraph r={r} v={v} /></div>}
        {r && <DividerCard vref={v.vref} vout={v.vout} r1Man={r1Man} setR1Man={setR1Man} r2Man={r2Man} setR2Man={setR2Man} auto={r.div} />}
        {r && (
          <div className="grid sm:grid-cols-2 gap-4">
            <VCard title="✓ Pick: Inductor" accent="var(--bd3)">
              <VRow l="Calculated" val={`${fmt(r.Lraw, 2)} µH`} />
              <VRow l="Use standard" val={`${r.Lpick} µH`} c="var(--ok)" hint="next std up" />
              <VRow l="Actual ripple" val={`${fmt(r.dIact, 2)} A`} />
              <VRow l="Rate Isat ≥" val={`${fmt(1.2 * r.iPk, 1)} A`} c="var(--accent3)" />
              <VRow l="Rate Irms ≥" val={`${fmt(r.iRms, 2)} A`} />
            </VCard>
            <VCard title="✓ Pick: Capacitors" accent="var(--bd3)">
              <VRow l="Cout calculated" val={`${fmt(r.coutNeed, 0)} µF`} />
              <VRow l="Use Cout ≥" val={`${r.coutPick} µF`} c="var(--ok)" />
              <VRow l="Cout ESR max" val={`${fmt(r.esrMaxO, 1)} mΩ`} />
              <VRow l="Cin calculated" val={`${fmt(r.cinNeed, 0)} µF`} />
              <VRow l="Use Cin ≥" val={`${r.cinPick} µF`} c="var(--ok)" />
              <VRow l="Cin RMS rating" val={`${fmt(r.iRmsIn, 2)} A`} c="var(--warn)" />
            </VCard>
          </div>
        )}
        {r && (
          <VCard title={`Losses & efficiency — η ≈ ${fmt(r.eff, 1)}%`} accent={r.eff > 88 ? "var(--bd3)" : "#6b4a2e"}>
            <div className="space-y-1.5 mb-3">
              {r.losses.map(([k, p]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="text-xs w-32 shrink-0" style={{ color: "var(--fg3)" }}>{k}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg2)" }}>
                    <div className="h-full rounded-full accent-grad" style={{ width: `${Math.min(100, p / r.pTot * 100)}%` }} />
                  </div>
                  <span className="hw-mono text-xs w-14 text-right" style={{ color: "var(--accent)" }}>{fmt(p * 1000, 0)}mW</span>
                </div>
              ))}
            </div>
            <VRow l="Total loss" val={`${fmt(r.pTot, 2)} W`} c="var(--warn)" />
            {!r.tonOk && <VRow l="⚠ on-time" val="below typical min — lower fsw" c="var(--warn)" />}
            <p className="text-[11px] mt-2" style={{ color: "var(--muted5)" }}>First-order (no body-diode/Coss/core loss). Real η lands 1–3 pts lower.</p>
          </VCard>
        )}
        {r && (() => {
          const dv = resolveDivider(v.vref, v.vout, r1Man, r2Man) || r.div;
          const vcc = Math.ceil(v.vin * 1.3);
          const bom = [
            { qty: 1, ref: "U1", value: "Sync buck controller/IC", rating: `Vin ${fmt(v.vin,0)}V`, pkg: "—", note: `Vout ${fmt(v.vout,2)}V, ${fmt(v.iout,0)}A` },
            { qty: 1, ref: "L1", value: `${r.Lpick} µH`, rating: `Isat ≥ ${fmt(1.2*r.iPk,0)}A, Irms ≥ ${fmt(r.iRms,0)}A`, pkg: "shielded", note: `DCR ≤ ${fmt(v.dcr,0)}mΩ` },
            { qty: Math.max(1, Math.ceil(r.cinPick/22)), ref: "Cin", value: "22 µF", rating: `${vcc}V X7R`, pkg: "1210", note: `${r.cinPick}µF total, RMS ${fmt(r.iRmsIn,1)}A` },
            { qty: 1, ref: "Cin2", value: "0.1 µF", rating: `${vcc}V X7R`, pkg: "0402", note: "HF bypass at IC" },
            { qty: Math.max(1, Math.ceil(r.coutPick/47)), ref: "Cout", value: "47 µF", rating: `${Math.ceil(v.vout*2)}V X7R`, pkg: "1210", note: `${r.coutPick}µF total, ESR ≤ ${fmt(r.esrMaxO,0)}mΩ` },
            { qty: 2, ref: "Cout2", value: "0.1 µF", rating: `${Math.ceil(v.vout*2)}V X7R`, pkg: "0402", note: "HF decoupling" },
            { qty: 1, ref: "R1", value: `${fmt(dv.r1/1000,2)} kΩ`, rating: "1%", pkg: "0402", note: "FB top" },
            { qty: 1, ref: "R2", value: `${fmt(dv.r2/1000,2)} kΩ`, rating: "1%", pkg: "0402", note: "FB bottom" },
            { qty: 1, ref: "Cff", value: "10–100 pF", rating: "50V", pkg: "0402", note: "feed-fwd (optional)" },
          ];
          return <BomTable rows={bom} title="Complete buck BOM (generic specs)" />;
        })()}
      </div>
    </div>
  );
}

/* ============================ LDO ============================ */
function LdoDesigner() {
  const [vin, setVin] = useState("3.3");
  const [vout, setVout] = useState("1.8");
  const [iout, setIout] = useState("300");
  const [vref, setVref] = useState("0.8");
  const [iq, setIq] = useState("50");
  const [theta, setTheta] = useState("50");
  const [ta, setTa] = useState("45");
  const [tjmax, setTjmax] = useState("125");
  const [adj, setAdj] = useState("adj"); // fixed | adj
  const [r1Man, setR1Man] = useState("");
  const [r2Man, setR2Man] = useState("");

  const v = Object.fromEntries(Object.entries({ vin, vout, iout, vref, iq, theta, ta, tjmax }).map(([k, x]) => [k, num(x)]));
  const ok = v.vin > 0 && v.vout > 0 && v.iout > 0 && v.vout < v.vin;

  let r = null;
  if (ok) {
    const iA = v.iout / 1000;
    const drop = v.vin - v.vout;
    const pd = drop * iA + (v.vin) * ((v.iq ?? 50) * 1e-6);
    const tj = (v.ta ?? 45) + pd * (v.theta ?? 50);
    const eff = v.vout / v.vin * 100;
    const div = adj === "adj" && v.vref && v.vref < v.vout ? bestDividerPair(v.vref, v.vout) : null;
    const headroom = (v.tjmax ?? 125) - tj;
    const pdMax = ((v.tjmax ?? 125) - (v.ta ?? 45)) / (v.theta ?? 50);
    const iMaxThermal = (pdMax - v.vin * ((v.iq ?? 50) * 1e-6)) / drop;
    r = { iA, drop, pd, tj, eff, div, headroom, pdMax, iMaxThermal };
  }

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <VCard title="Specification">
          <div className="grid grid-cols-2 gap-2.5">
            <VField label="Vin" unit="V" value={vin} onChange={setVin} />
            <VField label="Vout" unit="V" value={vout} onChange={setVout} />
            <VField label="Iout" unit="mA" value={iout} onChange={setIout} />
            <VField label="Quiescent Iq" unit="µA" value={iq} onChange={setIq} />
          </div>
          <div className="mt-2.5">
            <span className="hw-mono text-[10px] uppercase tracking-wider block mb-1" style={{ color: "var(--label)" }}>LDO type</span>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--bg2)", border: "1px solid var(--inputbd)" }}>
              {[["adj", "Adjustable"], ["fixed", "Fixed"]].map(([id, lab]) => (
                <button key={id} onClick={() => setAdj(id)} className="flex-1 rounded-md py-1 text-xs hw-mono"
                  style={adj === id ? { background: "var(--accent)", color: "#fff", fontWeight: 600 } : { color: "var(--label)" }}>{lab}</button>
              ))}
            </div>
          </div>
          {adj === "adj" && <div className="mt-2.5"><VField label="ADJ pin Vref" unit="V" value={vref} onChange={setVref} /></div>}
        </VCard>
        <VCard title="Thermal">
          <div className="grid grid-cols-2 gap-2.5">
            <VField label="θJA package" unit="°C/W" value={theta} onChange={setTheta} />
            <VField label="Ambient Ta" unit="°C" value={ta} onChange={setTa} />
            <VField label="Tj max" unit="°C" value={tjmax} onChange={setTjmax} />
          </div>
        </VCard>
      </div>

      <div className="lg:col-span-3 space-y-4">
        {!ok && <VCard title="LDO regulator"><p className="text-sm" style={{ color: "var(--fg3)" }}>Needs Vout &lt; Vin. Reference schematic, dissipation, thermal-limit graph and divider appear here.</p></VCard>}
        {r && <div className="space-y-3"><LdoSchematic r={r} v={v} adj={adj} /><LdoThermalGraph r={r} v={v} /></div>}
        {r && adj === "adj" && r.div && <DividerCard vref={v.vref} vout={v.vout} r1Man={r1Man} setR1Man={setR1Man} r2Man={r2Man} setR2Man={setR2Man} auto={r.div} />}
        {r && (
          <VCard title="Power & thermal" accent={r.tj > (v.tjmax ?? 125) ? "var(--danger)" : r.headroom < 20 ? "#6b4a2e" : "var(--bd3)"}>
            <VRow l="Dropout (Vin−Vout)" val={`${fmt(r.drop, 2)} V`} />
            <VRow l="Dissipation Pd" val={`${fmt(r.pd, 3)} W`} c="var(--accent3)" />
            <VRow l="Junction temp Tj" val={`${fmt(r.tj, 0)} °C`} c={r.tj > (v.tjmax ?? 125) ? "var(--danger)" : "var(--accent)"} />
            <VRow l="Headroom to Tj,max" val={`${fmt(r.headroom, 0)} °C`} c={r.headroom < 20 ? "var(--warn)" : "var(--ok)"} />
            <VRow l="Verdict" val={r.tj > (v.tjmax ?? 125) ? "OVERHEATS" : r.headroom < 20 ? "Marginal" : "OK"} c={r.tj > (v.tjmax ?? 125) ? "var(--danger)" : r.headroom < 20 ? "var(--warn)" : "var(--ok)"} />
            <VRow l="Efficiency" val={`${fmt(r.eff, 1)} %`} />
            <VRow l="Max thermal Iout" val={`${fmt(r.iMaxThermal * 1000, 0)} mA`} c="var(--accent3)" hint="at this θJA/Ta" />
          </VCard>
        )}
        {r && (() => {
          const dv = adj === "adj" ? (resolveDivider(v.vref, v.vout, r1Man, r2Man) || r.div) : null;
          const coutVal = r.iA > 0.5 ? "10 µF" : "2.2 µF";
          const bom = [
            { qty: 1, ref: "U1", value: adj === "adj" ? "Adjustable LDO" : `Fixed ${fmt(v.vout,2)}V LDO`, rating: `Vin ≥ ${fmt(v.vin,1)}V, Iout ≥ ${fmt(v.iout,0)}mA`, pkg: r.pd > 0.5 ? "thermal pad" : "SOT-23/SOT-223", note: `Pd ${fmt(r.pd,2)}W` },
            { qty: 1, ref: "Cin", value: "1–10 µF", rating: `${Math.ceil(v.vin*1.5)}V X7R`, pkg: "0805", note: "close to IN pin" },
            { qty: 1, ref: "Cout", value: coutVal, rating: `${Math.ceil(v.vout*2)}V X7R`, pkg: "0805", note: "check stable-ESR window" },
            { qty: 1, ref: "Cnr", value: "10 nF", rating: "16V", pkg: "0402", note: "noise-reduction/SS (low-noise LDO)" },
          ];
          if (dv) {
            bom.push({ qty: 1, ref: "R1", value: `${fmt(dv.r1/1000,2)} kΩ`, rating: "1%", pkg: "0402", note: "ADJ top" });
            bom.push({ qty: 1, ref: "R2", value: `${fmt(dv.r2/1000,2)} kΩ`, rating: "1%", pkg: "0402", note: "ADJ bottom" });
          }
          return <BomTable rows={bom} title="Complete LDO BOM (generic specs)" />;
        })()}
      </div>
    </div>
  );
}

/* ============================ MULTIPHASE ============================ */
function MultiphaseDesigner() {
  const [vin, setVin] = useState("12");
  const [vout, setVout] = useState("0.9");
  const [iout, setIout] = useState("120");
  const [nph, setNph] = useState("4");
  const [fsw, setFsw] = useState("500");
  const [ripL, setRipL] = useState("35");
  const [iStep, setIStep] = useState("60");
  const [dvTran, setDvTran] = useState("30");

  const v = Object.fromEntries(Object.entries({ vin, vout, iout, nph, fsw, ripL, iStep, dvTran }).map(([k, x]) => [k, num(x)]));
  const ok = [v.vin, v.vout, v.iout, v.nph, v.fsw].every((x) => x && x > 0) && v.vout < v.vin && v.nph >= 1;

  let r = null;
  if (ok) {
    const N = Math.round(v.nph), D = v.vout / v.vin, fHz = v.fsw * 1e3;
    const iPhase = v.iout / N;
    const dIph = iPhase * (v.ripL ?? 35) / 100;
    const Lraw = ((v.vin - v.vout) * D) / (fHz * dIph);
    const Lpick = pickUp(STD_L, Lraw * 1e6);
    /* ripple cancellation factor (Kic) at integer phases */
    const m = Math.floor(N * D), kic = ((N * D - m) * (m + 1 - N * D)) / (D * (1 - D) * N) || 1 / N;
    const dIout = dIph * N * kic; // net output ripple after interleaving
    const iRmsPhase = Math.sqrt(iPhase ** 2 + dIph ** 2 / 12);
    const iPkPhase = iPhase + dIph / 2;
    /* input cap RMS with interleaving — approx reduces vs single phase */
    const iRmsInSingle = v.iout * Math.sqrt(D * (1 - D));
    const iRmsIn = iRmsInSingle / Math.sqrt(N);
    const coutTran = ((v.iStep ?? 60)) / (2 * Math.PI * (fHz * N / 8) * (v.dvTran ?? 30) * 1e-3) * 1e6; // effective fsw = N·fsw
    const fEff = N * v.fsw;
    r = { N, D, iPhase, dIph, Lraw: Lraw * 1e6, Lpick, kic, dIout, iRmsPhase, iPkPhase, iRmsIn, iRmsInSingle, coutTran, fEff };
  }

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <VCard title="Specification">
          <div className="grid grid-cols-2 gap-2.5">
            <VField label="Vin" unit="V" value={vin} onChange={setVin} />
            <VField label="Vout (core)" unit="V" value={vout} onChange={setVout} />
            <VField label="Iout total" unit="A" value={iout} onChange={setIout} />
            <VField label="Phases N" unit="#" value={nph} onChange={setNph} />
            <VField label="fsw per phase" unit="kHz" value={fsw} onChange={setFsw} />
            <VField label="Phase ripple" unit="%" value={ripL} onChange={setRipL} />
          </div>
        </VCard>
        <VCard title="Transient">
          <div className="grid grid-cols-2 gap-2.5">
            <VField label="Load step" unit="A" value={iStep} onChange={setIStep} />
            <VField label="Droop window" unit="mV" value={dvTran} onChange={setDvTran} />
          </div>
        </VCard>
        <VCard title="Why multiphase">
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--muted5)" }}>
            Splitting current across N interleaved phases cuts per-phase heat, multiplies the effective ripple
            frequency by N (smaller output caps), and cancels output ripple. Standard for FPGA/ASIC/CPU core
            rails — exactly the 0.8–1.0 V high-current rails on switch main boards.
          </p>
        </VCard>
      </div>

      <div className="lg:col-span-3 space-y-4">
        {!ok && <VCard title="Multiphase buck"><p className="text-sm" style={{ color: "var(--fg3)" }}>Enter the core-rail spec and phase count. Reference schematic, per-phase picks, ripple-cancellation graph appear here.</p></VCard>}
        {r && <div className="space-y-3"><MultiphaseSchematic r={r} v={v} /><MultiphaseGraph r={r} v={v} /></div>}
        {r && (
          <VCard title={`${r.N}-phase — per-phase design`} accent="var(--accent2)">
            <VRow l="Current per phase" val={`${fmt(r.iPhase, 1)} A`} c="var(--ok)" hint={`${fmt(v.iout, 0)}A ÷ ${r.N}`} />
            <VRow l="Inductor (calc)" val={`${fmt(r.Lraw, 3)} µH`} />
            <VRow l="Use standard L" val={`${r.Lpick} µH`} c="var(--ok)" />
            <VRow l="Phase Ipeak" val={`${fmt(r.iPkPhase, 1)} A`} />
            <VRow l="Phase Irms (DCR heat)" val={`${fmt(r.iRmsPhase, 1)} A`} c="var(--accent3)" />
            <VRow l="Pick Isat per phase ≥" val={`${fmt(1.2 * r.iPkPhase, 1)} A`} c="var(--accent3)" />
          </VCard>
        )}
        {r && (
          <VCard title="Interleaving benefit" accent="var(--bd3)">
            <VRow l="Effective ripple freq" val={`${fmt(r.fEff, 0)} kHz`} c="var(--ok)" hint={`${r.N} × fsw`} />
            <VRow l="Ripple cancellation" val={`${fmt((1 - r.dIout / (r.dIph * r.N)) * 100, 0)} %`} c="var(--ok)" />
            <VRow l="Net output ripple ΔI" val={`${fmt(r.dIout, 2)} A`} hint="after cancellation" />
            <VRow l="Cout for transient ≥" val={`${fmt(r.coutTran, 0)} µF`} c="var(--ok)" hint="benefits from N·fsw" />
          </VCard>
        )}
        {r && (
          <VCard title="Input capacitor — the multiphase win" accent="var(--bd3)">
            <VRow l="Cin RMS, single-phase" val={`${fmt(r.iRmsInSingle, 1)} A`} c="var(--muted)" />
            <VRow l={`Cin RMS, ${r.N}-phase`} val={`${fmt(r.iRmsIn, 1)} A`} c="var(--ok)" hint={`≈ ÷√${r.N}`} />
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "var(--muted5)" }}>
              Interleaving spreads input current pulses in time, cutting input-cap RMS heating by roughly √N.
              On a 120 A core rail that's the difference between a bank of bulk caps and a much smaller one.
              Balance phase currents in layout (symmetric inductor placement, matched sense traces) or one phase
              runs hot. First-order: excludes phase-to-phase mismatch and controller current-share error.
            </p>
          </VCard>
        )}
        {r && (() => {
          const vcc = Math.ceil(v.vin * 1.3);
          const cinPerPhase = Math.max(1, Math.ceil(r.iRmsIn / 2));
          const bom = [
            { qty: 1, ref: "U1", value: `${r.N}-phase buck controller`, rating: `Vin ${fmt(v.vin,0)}V`, pkg: "—", note: `${fmt(v.vout,2)}V / ${fmt(v.iout,0)}A core` },
            { qty: r.N, ref: "U2..", value: "DrMOS / smart power stage", rating: `≥ ${fmt(1.3*r.iPkPhase,0)}A`, pkg: "PowerStage", note: `one per phase, ${fmt(r.iPhase,0)}A each` },
            { qty: r.N, ref: "L1..", value: `${r.Lpick} µH`, rating: `Isat ≥ ${fmt(1.2*r.iPkPhase,0)}A`, pkg: "shielded", note: "one per phase, matched" },
            { qty: r.N * Math.max(2, Math.ceil(r.coutTran/220)), ref: "Cout", value: "220 µF", rating: `${Math.ceil(v.vout*2)}V`, pkg: "polymer/POSCAP", note: `bulk, shared output` },
            { qty: 20, ref: "Cout2", value: "22 µF", rating: `${Math.ceil(v.vout*2)}V X5R`, pkg: "0805", note: "ceramic, spread under load" },
            { qty: 40, ref: "Cout3", value: "0.22 µF", rating: `${Math.ceil(v.vout*2)}V`, pkg: "0201", note: "HF, near die" },
            { qty: cinPerPhase, ref: "Cin", value: "22 µF", rating: `${vcc}V X7R`, pkg: "1210", note: `input bulk, RMS ${fmt(r.iRmsIn,1)}A total` },
            { qty: r.N, ref: "Cboot", value: "0.1 µF", rating: "25V", pkg: "0402", note: "bootstrap per phase" },
            { qty: r.N, ref: "Rsense", value: "DCR or shunt", rating: "—", pkg: "—", note: "per-phase current sense" },
          ];
          return <BomTable rows={bom} title={`Complete ${r.N}-phase BOM (generic specs)`} />;
        })()}
      </div>
    </div>
  );
}

/* ============================ LOOP COMPENSATION ============================ */
function LoopCompDesigner() {
  const [ctrl, setCtrl] = useState("cm"); // cm (current mode, Type II) | vm (voltage mode, Type III)
  const [vin, setVin] = useState("12");
  const [vout, setVout] = useState("1.2");
  const [iout, setIout] = useState("10");
  const [lval, setLval] = useState("1.5");
  const [cval, setCval] = useState("470");
  const [esr, setEsr] = useState("2");
  const [fsw, setFsw] = useState("600");
  const [fcT, setFcT] = useState("60");
  const [vramp, setVramp] = useState("1.5");
  const [ri, setRi] = useState("0.05");

  const v = Object.fromEntries(Object.entries({ vin, vout, iout, lval, cval, esr, fsw, fcT, vramp, ri }).map(([k, x]) => [k, num(x)]));
  const ok = [v.vin, v.vout, v.iout, v.lval, v.cval, v.fsw, v.fcT].every((x) => x && x > 0) && v.vout < v.vin && v.fcT * 1e3 < v.fsw * 1e3 / 2;

  let r = null;
  if (ok) {
    const L = v.lval * 1e-6, C = v.cval * 1e-6, ESR = v.esr * 1e-3;
    const R = v.vout / v.iout;
    const w0 = 1 / Math.sqrt(L * C), Q = Math.max(0.2, R * Math.sqrt(C / L));
    const wzE = 1 / (ESR * C);
    const fLC = w0 / (2 * Math.PI), fESR = wzE / (2 * Math.PI);
    const fswHz = v.fsw * 1e3, fcHz = v.fcT * 1e3;
    const wnyq = Math.PI * fswHz; // half-switching sampling pole pair (current mode)

    // ---- plant ----
    const plant = (f) => {
      const w = 2 * Math.PI * f;
      if (ctrl === "vm") {
        // Gvd = Vin/Vramp · (1+s/wzE) / (1 + s/(Q·w0) + s²/w0²)
        const nRe = 1, nIm = w / wzE;
        const dRe = 1 - (w / w0) ** 2, dIm = w / (Q * w0);
        return {
          mag: (v.vin / (v.vramp || 1.5)) * Math.hypot(nRe, nIm) / Math.hypot(dRe, dIm),
          ph: Math.atan2(nIm, nRe) - Math.atan2(dIm, dRe),
        };
      }
      // current mode: Gvc = (R/Ri) · (1+s/wzE)/(1+s·RC) · sampling 2nd-order at fsw/2
      const Ri = v.ri || 0.05;
      const nIm = w / wzE;
      const pIm = w * R * C;
      const sRe = 1 - (w / wnyq) ** 2, sIm = w / (wnyq * (2 / Math.PI));
      return {
        mag: (R / Ri) * Math.hypot(1, nIm) / (Math.hypot(1, pIm) * Math.hypot(sRe, sIm)),
        ph: Math.atan(nIm) - Math.atan(pIm) - Math.atan2(sIm, sRe),
      };
    };

    // ---- compensator pole/zero placement ----
    let wz1, wz2, wp1, wp2;
    if (ctrl === "vm") { wz1 = w0; wz2 = w0; wp1 = wzE; wp2 = Math.PI * fswHz; }
    else { wz1 = 2 * Math.PI * fcHz / 4; wz2 = null; wp1 = Math.min(wzE, Math.PI * fswHz); wp2 = null; }

    const comp = (f, wI) => {
      const w = 2 * Math.PI * f;
      let mag = wI / w, ph = -Math.PI / 2;
      mag *= Math.hypot(1, w / wz1); ph += Math.atan(w / wz1);
      if (wz2) { mag *= Math.hypot(1, w / wz2); ph += Math.atan(w / wz2); }
      mag /= Math.hypot(1, w / wp1); ph -= Math.atan(w / wp1);
      if (wp2) { mag /= Math.hypot(1, w / wp2); ph -= Math.atan(w / wp2); }
      return { mag, ph };
    };

    // gain-set the integrator for |T(fc)| = 1
    const p0 = plant(fcHz), c0 = comp(fcHz, 1);
    const wI = 1 / (p0.mag * c0.mag);

    // ---- sweep for plot + margins ----
    const fLo = 100, fHi = fswHz;
    const N = 240, pts = [];
    let fc = 0, pm = 0, gm = null, prev = null;
    for (let i = 0; i <= N; i++) {
      const f = Math.pow(10, Math.log10(fLo) + (i / N) * (Math.log10(fHi) - Math.log10(fLo)));
      const P = plant(f), Cc = comp(f, wI);
      const mag = P.mag * Cc.mag;
      let ph = (P.ph + Cc.ph) * 180 / Math.PI;
      const db = 20 * Math.log10(mag);
      pts.push({ f, db, ph });
      if (prev && prev.mag >= 1 && mag < 1 && !fc) { fc = f; pm = 180 + ph; }
      if (prev && prev.ph > -180 && ph <= -180 && gm === null) gm = -db;
      prev = { mag, ph };
    }

    // ---- compensator component values (op-amp network, R1 top of divider) ----
    const R1 = 10e3;
    const C1 = 1 / (wI * R1);
    const R2 = 1 / (wz1 * C1);
    const C2 = wp2 ? 1 / (wp2 * R2) : 1 / (wp1 * R2);
    const C3 = wz2 ? 1 / (wz2 * R1) : null;
    const R3 = wz2 ? 1 / (wp1 * C3) : null;

    r = { fLC, fESR, Q, fc, pm, gm, pts, fLo, fHi, wI, R1, R2, C1, C2, C3, R3,
          droop: v.iout * 0.5 / (2 * Math.PI * (fc || fcHz) * C) * 1000 };
  }

  const fmtC = (c) => c >= 1e-9 ? fmt(c * 1e9, 2) + " nF" : fmt(c * 1e12, 0) + " pF";
  const fmtR = (x) => x >= 1000 ? fmt(x / 1000, 2) + " kΩ" : fmt(x, 0) + " Ω";

  return (
    <div className="grid lg:grid-cols-5 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <VCard title="Control method">
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--bg2)", border: "1px solid var(--inputbd)" }}>
            {[["cm", "Current mode · Type II"], ["vm", "Voltage mode · Type III"]].map(([id, lab]) => (
              <button key={id} onClick={() => setCtrl(id)} className="flex-1 rounded-md py-1.5 text-[11px] hw-mono"
                style={ctrl === id ? { background: "var(--accent)", color: "#fff", fontWeight: 600 } : { color: "var(--label)" }}>{lab}</button>
            ))}
          </div>
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "var(--muted5)" }}>
            Most modern VRM / multiphase controllers are current-mode: the inner current loop makes the power stage
            look like a single pole, so a simpler Type II compensator is enough. Voltage mode sees the raw LC double
            pole and needs Type III's two zeros to survive it.
          </p>
        </VCard>
        <VCard title="Power stage">
          <div className="grid grid-cols-2 gap-2.5">
            <VField label="Vin" unit="V" value={vin} onChange={setVin} />
            <VField label="Vout" unit="V" value={vout} onChange={setVout} />
            <VField label="Iout (load)" unit="A" value={iout} onChange={setIout} />
            <VField label="Inductor L" unit="µH" value={lval} onChange={setLval} />
            <VField label="Cout total" unit="µF" value={cval} onChange={setCval} />
            <VField label="Cout ESR" unit="mΩ" value={esr} onChange={setEsr} />
            <VField label="fsw" unit="kHz" value={fsw} onChange={setFsw} />
            <VField label="Target crossover fc" unit="kHz" value={fcT} onChange={setFcT} />
            {ctrl === "vm"
              ? <VField label="PWM ramp Vramp" unit="V" value={vramp} onChange={setVramp} />
              : <VField label="Current sense Ri" unit="V/A" value={ri} onChange={setRi} />}
          </div>
        </VCard>
        <VCard title="How to read the plot — plain language">
          <div className="space-y-2 text-[11px] leading-relaxed" style={{ color: "var(--note-fg)" }}>
            <p><b style={{ color: "var(--fg)" }}>The loop:</b> the regulator constantly measures Vout, compares it to
            the reference, and adjusts duty cycle to correct the error. The <b>gain curve</b> shows how strongly it
            corrects at each frequency; the <b>phase curve</b> shows how <i>delayed</i> that correction arrives.</p>
            <p><b style={{ color: "var(--fg)" }}>Crossover (fc):</b> where gain crosses 0 dB — beyond this the loop is
            too weak to correct. Below fc the loop fixes disturbances; above fc your output capacitors are on
            their own (that's the PDN's job).</p>
            <p><b style={{ color: "var(--fg)" }}>Phase margin:</b> at fc, how far the phase still is from −180°.
            At −180° the "correction" arrives exactly inverted — it feeds the error and the rail oscillates.
            45–60° = fast and stable. Under 30° = rings hard after every load step.</p>
            <p><b style={{ color: "var(--fg)" }}>What the compensator does:</b> the LC filter delays phase toward
            −180° (the cliff on the plot). The compensator's zeros push phase back up right where it matters, and
            its integrator gives huge DC gain so Vout is millivolt-accurate at DC.</p>
            <p><b style={{ color: "var(--fg)" }}>On the bench:</b> inject a swept sine across a small resistor in the
            feedback path (Bode 100) and you measure this exact plot. No injection point? Watch a load-step:
            2–3 rings dying out ≈ 45° PM; continuous ringing = you're at the edge.</p>
          </div>
        </VCard>
      </div>

      <div className="lg:col-span-3 space-y-4">
        {!ok && <VCard title="Loop compensation"><p className="text-sm" style={{ color: "var(--fg3)" }}>
          Enter the power stage. Needs Vout &lt; Vin and fc &lt; fsw/2. The Bode plot, margins and compensator values appear here.</p></VCard>}
        {r && <BodePlot r={r} v={v} ctrl={ctrl} />}
        {r && (
          <VCard title="Stability verdict" accent={r.pm >= 45 ? "var(--bd3)" : r.pm >= 30 ? "#6b4a2e" : "var(--danger)"}>
            <VRow l="Achieved crossover" val={`${fmt(r.fc / 1e3, 1)} kHz`} c="var(--accent3)" hint={`target ${fmt(v.fcT, 0)}`} />
            <VRow l="Phase margin" val={`${fmt(r.pm, 1)} °`} c={r.pm >= 45 ? "var(--ok)" : r.pm >= 30 ? "var(--warn)" : "var(--danger)"} />
            <VRow l="Gain margin" val={r.gm === null ? "> 20 dB (no −180° in band)" : `${fmt(r.gm, 1)} dB`} c={r.gm === null || r.gm > 10 ? "var(--ok)" : "var(--warn)"} />
            <VRow l="Verdict" val={r.pm >= 45 ? "STABLE — good damping" : r.pm >= 30 ? "Marginal — will ring" : "UNSTABLE-ISH — recompensate"} c={r.pm >= 45 ? "var(--ok)" : r.pm >= 30 ? "var(--warn)" : "var(--danger)"} />
            <VRow l="Est. droop @ ½-load step" val={`≈ ${fmt(r.droop, 1)} mV`} hint="ΔI/(2π·fc·C)" />
            <VRow l="LC double pole" val={`${fmt(r.fLC / 1e3, 2)} kHz`} hint={`Q ${fmt(r.Q, 1)}`} />
            <VRow l="ESR zero" val={`${fmt(r.fESR / 1e3, 0)} kHz`} />
          </VCard>
        )}
        {r && (
          <VCard title={`✓ Compensator values — ${ctrl === "vm" ? "Type III" : "Type II"} (op-amp, R1 = 10 kΩ)`} accent="var(--accent2)">
            <VRow l="R2 (across error amp)" val={fmtR(r.R2)} c="var(--ok)" hint="sets mid-band gain" />
            <VRow l="C1 (with R2)" val={fmtC(r.C1)} c="var(--ok)" hint="zero — phase boost" />
            <VRow l="C2 (across R2)" val={fmtC(r.C2)} c="var(--ok)" hint="high-freq pole" />
            {r.C3 && <VRow l="C3 (across R1)" val={fmtC(r.C3)} c="var(--ok)" hint="2nd zero at f_LC" />}
            {r.R3 && <VRow l="R3 (series C3)" val={fmtR(r.R3)} c="var(--ok)" hint="pole at ESR zero" />}
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "var(--muted5)" }}>
              Classic op-amp network around the error amplifier (R1 = divider top). Controllers with internal gm
              amps use the same pole/zero frequencies with the vendor's translation. Round to E24/E12 and re-check —
              the plot updates live if you nudge L, C or ESR to the real BOM values.
            </p>
          </VCard>
        )}
      </div>
    </div>
  );
}

/* Bode plot: gain + phase, log-f, with fc / PM annotations */
function BodePlot({ r, v, ctrl }) {
  const W = 320, x0 = 38, x1 = 306;
  const gT = 22, gB = 92;   // gain band
  const pT = 108, pB = 168; // phase band
  const lgLo = Math.log10(r.fLo), lgHi = Math.log10(r.fHi);
  const X = (f) => x0 + (Math.log10(f) - lgLo) / (lgHi - lgLo) * (x1 - x0);
  const dbMax = 60, dbMin = -40;
  const Yg = (db) => gT + (dbMax - Math.min(dbMax, Math.max(dbMin, db))) / (dbMax - dbMin) * (gB - gT);
  const Yp = (ph) => pT + (0 - Math.min(0, Math.max(-200, ph))) / 200 * (pB - pT);
  let dG = "", dP = "";
  r.pts.forEach((p, i) => {
    dG += `${i ? "L" : "M"}${fmt(X(p.f), 1)},${fmt(Yg(p.db), 1)}`;
    dP += `${i ? "L" : "M"}${fmt(X(p.f), 1)},${fmt(Yp(p.ph), 1)}`;
  });
  const decades = []; for (let d = Math.ceil(lgLo); d <= Math.floor(lgHi); d++) decades.push(Math.pow(10, d));
  const fmtF = (f) => f >= 1e6 ? fmt(f / 1e6, 0) + "M" : f >= 1e3 ? fmt(f / 1e3, 0) + "k" : fmt(f, 0);
  return (
    <VSvg h={184}>
      <VT x={160} y={13} c={VS.cy} b>Loop gain T(s) — {ctrl === "vm" ? "voltage mode" : "current mode"}</VT>
      {/* grids */}
      {decades.map((f) => (<g key={f}>
        <line x1={X(f)} y1={gT} x2={X(f)} y2={pB} stroke="var(--bd3)" strokeWidth="0.7" />
        <VT x={X(f)} y={pB + 10} s={6.5} c={VS.mut}>{fmtF(f)}</VT>
      </g>))}
      {[40, 0].map((db) => (<g key={db}>
        <line x1={x0} y1={Yg(db)} x2={x1} y2={Yg(db)} stroke={db === 0 ? VS.dln : "var(--bd3)"} strokeWidth={db === 0 ? 1.2 : 0.7} strokeDasharray={db === 0 ? "" : "3 3"} />
        <VT x={x0 - 3} y={Yg(db) + 2.5} a="end" s={6.5} c={VS.mut}>{db}dB</VT>
      </g>))}
      {[-90, -180].map((p) => (<g key={p}>
        <line x1={x0} y1={Yp(p)} x2={x1} y2={Yp(p)} stroke={p === -180 ? "var(--danger)" : "var(--bd3)"} strokeWidth={p === -180 ? 1 : 0.7} strokeDasharray="4 3" />
        <VT x={x0 - 3} y={Yp(p) + 2.5} a="end" s={6.5} c={p === -180 ? "var(--danger)" : VS.mut}>{p}°</VT>
      </g>))}
      {/* landmarks */}
      <VT x={X(r.fLC)} y={gT - 3} s={6} c={VS.warn}>LC pole</VT>
      <line x1={X(r.fLC)} y1={gT} x2={X(r.fLC)} y2={gB} stroke={VS.warn} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6" />
      {r.fESR < r.fHi && <VT x={X(r.fESR)} y={gT - 3} s={6} c={VS.ok}>ESR zero</VT>}
      {/* curves */}
      <path d={dG} fill="none" stroke={VS.cu} strokeWidth="1.8" />
      <path d={dP} fill="none" stroke={VS.cy} strokeWidth="1.6" />
      {/* fc marker + PM arrow */}
      {r.fc > 0 && (<g>
        <line x1={X(r.fc)} y1={gT} x2={X(r.fc)} y2={pB} stroke={VS.ok} strokeWidth="1" strokeDasharray="4 2" />
        <circle cx={X(r.fc)} cy={Yg(0)} r={3} fill={VS.ok} />
        <VT x={X(r.fc) + 3} y={gT + 8} a="start" s={7} c={VS.ok} b>fc {fmt(r.fc / 1e3, 0)}k</VT>
        <line x1={X(r.fc)} y1={Yp(-180)} x2={X(r.fc)} y2={Yp(-180 + r.pm)} stroke={r.pm >= 45 ? VS.ok : VS.warn} strokeWidth="2.5" />
        <VT x={X(r.fc) + 4} y={(Yp(-180) + Yp(-180 + r.pm)) / 2 + 2} a="start" s={7} c={r.pm >= 45 ? VS.ok : VS.warn} b>PM {fmt(r.pm, 0)}°</VT>
      </g>)}
      <VT x={x0} y={gT - 3} a="start" s={6.5} c={VS.cu}>gain</VT>
      <VT x={x0 + 30} y={gT - 3} a="start" s={6.5} c={VS.cy}>phase</VT>
    </VSvg>
  );
}

/* ============================ shell ============================ */
function VrmDesigner() {
  const [mode, setMode] = useState("switching");
  const MODES = [
    { id: "switching", label: "Switching (Buck)", icon: Activity },
    { id: "ldo", label: "LDO (Linear)", icon: Zap },
    { id: "multiphase", label: "Multiphase", icon: Layers },
    { id: "loop", label: "Loop Comp", icon: Gauge },
  ];
  return (
    <div className="h-full overflow-y-auto hw-scroll px-4 py-5">
      <div className="max-w-6xl mx-auto pb-8">
        {/* topology selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {MODES.map((m) => {
            const Icon = m.icon, active = mode === m.id;
            return (
              <button key={m.id} onClick={() => setMode(m.id)}
                className={"flex items-center gap-2 px-4 py-2 rounded-xl text-sm hw-display font-semibold transition-all sheen " + (active ? "accent-grad glow-accent" : "")}
                style={active
                  ? { color: "#fff", border: "1px solid transparent" }
                  : { color: "var(--label)", border: "1px solid var(--bd)", background: "var(--card)" }}>
                <Icon size={16} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
        <div className="fade-up" key={mode}>
          {mode === "switching" && <SwitchingDesigner />}
          {mode === "ldo" && <LdoDesigner />}
          {mode === "multiphase" && <MultiphaseDesigner />}
          {mode === "loop" && <LoopCompDesigner />}
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   SIMULATOR — embedded Falstad CircuitJS (GPLv2, hosted iframe)
   We embed the hosted simulator (not its source) so Hardware Hub
   stays independent of GPL. Pre-loads example circuits via URL.
   ============================================================ */
const SIM_BASE = "https://www.falstad.com/circuit/circuitjs.html";
const SIM_EXAMPLES = [
  { id: "lrc", label: "LRC resonance", q: "?ctz=CQAgjgTBBMAcDsBaCAWFBmFn4QqACwoBmJFAUwFowwAoAJ2zCRWmTBoBYUUyaUYUHmAA" },
  { id: "buck", label: "Buck regulator", startCircuit: "buck" },
  { id: "rc", label: "RC low-pass", startCircuit: "rc" },
  { id: "diode", label: "Diode / rectifier", startCircuit: "rectify" },
  { id: "blank", label: "Blank canvas", q: "" },
];
function SimulatorPanel() {
  const [mode, setMode] = useState("checking"); // checking | offline | online
  const [ex, setEx] = useState("blank");
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || "light");
  const [reloadKey, setReloadKey] = useState(0);
  const OFFLINE_PATH = "circuitjs-offline/circuitjs.html";
  const ONLINE_BASE = "https://www.falstad.com/circuit/circuitjs.html";

  // keep sim colors in sync if the app theme changes while on this tab
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setTheme(el.getAttribute("data-theme") || "light"));
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const probe = async () => {
      for (const m of ["HEAD", "GET"]) {
        try { const r = await fetch(OFFLINE_PATH, { method: m }); if (!cancelled) { setMode(r.ok ? "offline" : "online"); return; } } catch (_) {}
      }
      if (!cancelled) setMode("online");
    };
    probe();
    return () => { cancelled = true; };
  }, []);

  const EXAMPLES = [
    { id: "blank", label: "Blank", file: "blank.txt" },
    { id: "buck", label: "Buck converter", file: "conv-buck.txt" },
    { id: "boost", label: "Boost converter", file: "conv-boost.txt" },
    { id: "ldo", label: "Op-amp regulator", file: "opamp-regulator.txt" },
    { id: "lopass", label: "Low-pass filter", file: "filt-lopass.txt" },
    { id: "lrc", label: "LRC resonance", file: "lrc.txt" },
    { id: "555", label: "555 astable", file: "555int.txt" },
  ];
  const cur = EXAMPLES.find((e) => e.id === ex) || EXAMPLES[0];

  const dark = theme !== "light";
  const params = [
    cur.file ? `startCircuit=${cur.file}` : "",
    "hideMenu=true",
    "running=true",
    `whiteBackground=${dark ? "false" : "true"}`,
    `positiveColor=${encodeURIComponent(dark ? "#818cf8" : "#4f46e5")}`,
    `negativeColor=${encodeURIComponent(dark ? "#f87171" : "#dc2626")}`,
    "conventionalCurrent=true",
  ].filter(Boolean).join("&");

  const url = `${mode === "offline" ? OFFLINE_PATH : ONLINE_BASE}?${params}&r=${reloadKey}`;
  const fullUrl = `${ONLINE_BASE}?${cur.file ? `startCircuit=${cur.file}` : ""}`;

  return (
    <div className="h-full flex flex-col px-4 py-4">
      {/* ===== glass toolbar ===== */}
      <div className="glass rounded-2xl px-3 py-2.5 mb-3 flex flex-wrap items-center gap-2 fade-up"
        style={{ background: "var(--glass-bg)", border: "1px solid var(--bd)", boxShadow: "var(--shadow)" }}>
        {/* brand chip */}
        <div className="flex items-center gap-2 pr-3 mr-1" style={{ borderRight: "1px solid var(--bd3)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center accent-grad glow-accent">
            <Waves size={15} style={{ color: "#fff" }} />
          </div>
          <span className="hw-display font-semibold text-sm hidden sm:inline" style={{ color: "var(--fg)" }}>Simulator</span>
        </div>

        {/* circuit selector */}
        <span className="hw-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--label)" }}>load</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {EXAMPLES.map((e) => {
            const active = ex === e.id;
            return (
              <button key={e.id} onClick={() => setEx(e.id)}
                className={"hw-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-200 sheen " + (active ? "accent-grad glow-accent" : "")}
                style={active
                  ? { color: "#fff", fontWeight: 600, transform: "translateY(-1px)" }
                  : { border: "1px solid var(--bd3)", color: "var(--label)", background: "var(--card)" }}>
                {e.label}
              </button>
            );
          })}
        </div>

        {/* right cluster: status + actions */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="hw-mono text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5"
            style={{ background: "var(--chip)", color: mode === "offline" ? "var(--ok)" : mode === "online" ? "var(--info)" : "var(--label)" }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: "currentColor", display: "inline-block" }} />
            {mode === "checking" ? "loading" : mode === "offline" ? "built-in" : "online"}
          </span>
          <button onClick={() => setReloadKey((k) => k + 1)} title="Reload / reset circuit"
            className="w-8 h-8 rounded-lg flex items-center justify-center sheen transition-all"
            style={{ background: "var(--card)", border: "1px solid var(--bd3)", color: "var(--accent)" }}>
            <RotateCcw size={14} />
          </button>
          <a href={fullUrl} target="_blank" rel="noopener noreferrer" title="Open full simulator in a new window"
            className="h-8 px-3 rounded-lg flex items-center gap-1.5 hw-mono text-[11px] sheen btn-primary" style={{ color: "#fff" }}>
            <Maximize2 size={12} /> <span className="hidden sm:inline">expand</span>
          </a>
        </div>
      </div>

      {/* ===== embedded canvas ===== */}
      <div className="flex-1 rounded-2xl overflow-hidden card3d relative fade-up" style={{ background: "var(--card)", border: "1px solid var(--bd3)", minHeight: 460 }}>
        {mode === "checking" ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 hw-mono text-xs" style={{ color: "var(--label)" }}>
            <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "var(--bd)", borderTopColor: "var(--accent)" }} />
            loading simulator…
          </div>
        ) : (
          <iframe key={url} src={url} title="Circuit Simulator" className="w-full h-full block"
            style={{ border: "none", minHeight: 460 }} allow="fullscreen" />
        )}
      </div>

      <p className="text-[11px] mt-3 leading-relaxed" style={{ color: "var(--muted5)" }}>
        Live circuit simulation built into the Hub{mode === "offline" ? " — running fully offline" : ""}. Right-click the
        canvas to add components, double-click any part to edit its value, and watch current flow in real time.
        Engine: CircuitJS (open source, GPLv2) — see the NOTICE file in the app folder.
      </p>
    </div>
  );
}



/* ============================================================
   KNOWLEDGE HUB — hardware engineering reference
   Curated for network-equipment design: foundations, SI, power,
   every interface on a switch board, optics, and methodology.
   ============================================================ */
const KNOWLEDGE = [
  /* ---------------- Foundations ---------------- */
  { id: "stackup", group: "Foundations", title: "PCB Stackup & Materials",
    summary: "The stackup decides your impedance, loss, EMI and cost before a single trace is drawn.",
    points: [
      "Keep every signal layer adjacent to an unbroken reference plane — the return current flows directly under the trace and needs that plane.",
      "Symmetry about the board centre prevents warp during reflow; pair copper weights and dielectric thicknesses top↔bottom.",
      "Core (cured) vs prepreg (flows in lamination): impedance-critical layers prefer core dielectric for tighter thickness control.",
      "Dk (dielectric constant) sets impedance and speed; Df (loss tangent) sets dielectric loss. Standard FR-4: Dk≈4.2, Df≈0.02.",
      "Above ~10 Gbps per lane, move to mid-loss (Df≈0.01) or low-loss (Df≈0.005) laminate on the SerDes layers — hybrid stackups keep cost down by mixing materials.",
      "Copper roughness adds conductor loss at high f — smooth foils (RTF/HVLP) matter from ~25G; specify foil type, not just laminate.",
      "⚠ Never route a high-speed signal across a plane split — the return detours, radiating and ringing. Move the trace or stitch the split with caps only as a last resort.",
    ] },
  { id: "impedance", group: "Foundations", title: "Controlled Impedance",
    summary: "Why every serious board is quoted with impedance control, and what actually sets Z₀.",
    points: [
      "Z₀ rises with trace height above the plane and falls with width and Dk. Thickness (t) matters second-order.",
      "Standard targets: 50 Ω single-ended, 85 Ω diff (PCIe), 90 Ω diff (USB), 100 Ω diff (Ethernet SerDes, LVDS).",
      "Fab tolerance is typically ±10 % standard, ±7–8 % on request — design centre accordingly; your Hub calculators give the starting geometry, the fab's field solver gives the final one.",
      "Order impedance coupons on the panel and require TDR reports — it's the only proof the stackup was built as designed.",
      "Different layers of the same board need different widths for the same Z₀ — never copy a width across layers blindly.",
      "⚠ Soldermask over microstrip drops impedance a few ohms; outer-layer diff pairs are the least predictable. Critical pairs belong on stripline.",
    ] },
  { id: "components", group: "Foundations", title: "Component Selection & Derating",
    summary: "Parts fail at their ratings; healthy designs never operate there.",
    points: [
      "MLCC DC-bias effect: a 22 µF X5R at its rated voltage can deliver a small fraction of nameplate capacitance. Check the vendor's DC-bias curve at YOUR rail voltage — this silently breaks PDN designs.",
      "Derate ceramic caps to 50–70 % of rated voltage; electrolytics on temperature (every 10 °C cooler ≈ double the life).",
      "X7R (±15 % to 125 °C) for anything that matters; X5R acceptable on cost-driven consumer rails; avoid Y5V entirely.",
      "Inductors have two current ratings: Isat (inductance collapse — respect peak current) and Irms (heating — respect RMS). Both must clear your numbers with margin.",
      "Resistor power derating: run at ≤50 % rated power; watch pulse ratings for sense resistors.",
      "Plan second sources at design time — matched footprints and electricals — and mark the alternates in the BOM before the buyer asks.",
      "⚠ Long-lifecycle products (switches live 7–10 years): check EOL status and automotive/industrial grades before committing a sole-source part.",
    ] },
  { id: "dfmdft", group: "Foundations", title: "DFM & DFT",
    summary: "A board that can't be built or tested cheaply isn't finished.",
    points: [
      "Aspect ratio (board thickness ÷ drill) ≤ 10:1 for reliable plating; microvias ≤ 0.8:1 per lamination.",
      "Annular ring, soldermask dam, and copper-to-edge minimums come from your fab's capability sheet — get it before layout, not after.",
      "Via-in-pad must be filled and capped (VIPPO) under BGAs; unfilled via-in-pad wicks solder and gives voids.",
      "Testpoints: every rail, every reset, every strap, key clocks — 1 mm pads on a grid the ICT vendor can hit; boundary-scan (JTAG) coverage for what probes can't reach.",
      "Panelize with the assembler: rails, fiducials (3 per panel + 2 local per fine-pitch part), tooling holes.",
      "⚠ Bottom-side heavy parts near the wave/selective side, and tall parts vs cage/heatsink keep-outs — mechanical checks catch more respins than electrical ones.",
    ] },

  /* ---------------- Signal Integrity ---------------- */
  { id: "reflections", group: "Signal Integrity", title: "Reflections & Termination",
    summary: "When a trace becomes a transmission line and how each termination style works.",
    points: [
      "A trace needs treatment when its delay exceeds ~1/6 of the edge's rise time — length matters against tr, not clock frequency.",
      "Series termination (at driver): resistor makes driver Z match line Z₀; the far end sees one clean full-swing edge. Right choice for point-to-point clocks, RGMII, SPI.",
      "Parallel/Thevenin (at receiver): terminates multi-drop and constantly-driven lines; burns DC power.",
      "AC termination (R+C at end): parallel benefits without DC power — used on clocks.",
      "On-die termination (ODT) replaced discrete resistors on DDR and SerDes — but it must be enabled/trained correctly.",
      "Γ = (ZL−Z₀)/(ZL+Z₀): a stub, connector, or via is a mini mismatch; many small reflections close an eye as surely as one big one.",
      "⚠ The classic bring-up bug: ringing on a 'slow' bus like SPI at 50 MHz — fast edges make it a transmission line even when the clock is modest. Series-terminate at the source.",
    ] },
  { id: "crosstalk", group: "Signal Integrity", title: "Crosstalk",
    summary: "Neighbouring traces couple; the rules that keep it below your noise budget.",
    points: [
      "Coupling falls roughly with 1/(1+(D/H)²): distance-to-neighbour vs height-above-plane is the ratio that matters — thin dielectrics fight crosstalk for free.",
      "3W rule (centre-to-centre ≥ 3× width) is the everyday spacing; 5W for clocks and victims that must stay clean.",
      "NEXT (near-end) accumulates on parallel runs; FEXT (far-end) grows with coupled length and edge rate — stripline has near-zero FEXT, another reason inner layers win.",
      "Broadside coupling (traces stacked on adjacent layers) is stronger than edge coupling — offset routing between adjacent signal layers.",
      "Guard traces only help if via-stitched to ground frequently; an unstitched guard can make things worse.",
      "⚠ Aggressor risk ranking: switching-regulator nodes, clocks, and parallel buses next to reset/analog/sense lines — check these pairs explicitly at review.",
    ] },
  { id: "losses", group: "Signal Integrity", title: "Losses & Equalization",
    summary: "Why long channels die and how modern SerDes claw the signal back.",
    points: [
      "Conductor loss grows with √f (skin effect + roughness); dielectric loss grows linearly with f and dominates at high rates on lossy laminate.",
      "Total channel insertion loss at Nyquist is the budget currency: e.g. ~28 dB class for 25G-KR long reach; check your ASIC's supported class.",
      "CTLE (receiver analog peaking) flattens the channel's high-f roll-off; FFE (TX de-emphasis) pre-distorts the launched edge; DFE cancels reflections/ISI decision-by-decision.",
      "PAM4 (56G+) trades SNR for bandwidth — 3 eyes, ~9.5 dB less margin than NRZ — which is why FEC (RS-544) became mandatory.",
      "Loss is roughly linear per inch on a given layer: measure one reference channel (VNA), derive dB/in, and budget every route with it — the Channel Designer tab automates this.",
      "⚠ A channel that passes IL can still fail on return loss or crosstalk — the eye is closed by all three together.",
    ] },
  { id: "vias", group: "Signal Integrity", title: "Vias & Transitions",
    summary: "Every layer change is a discontinuity; managed vias are the difference at 10G+.",
    points: [
      "A via stub (the unused barrel below your exit layer) is a quarter-wave resonator: fnull ≈ c/(4·stub·√Dk). A 60-mil stub nulls near 12 GHz — right on 25G Nyquist.",
      "Back-drilling removes the stub; specify remaining stub ≤ 8–10 mil on 25G+ lanes.",
      "Place a ground return via within ~15–20 mil of every high-speed signal via — the return current must change layers too.",
      "Antipad size tunes the via's impedance (bigger antipad = higher Z); oval/teardrop antipads on diff pairs balance the pair.",
      "Minimize transitions: each connector, via, and AC cap costs margin; route SerDes with 1–2 layer changes max.",
      "⚠ Connector break-out regions concentrate every sin at once (stubs, antipad voids, reference changes) — give them field-solver attention first.",
    ] },
  { id: "timing", group: "Signal Integrity", title: "Timing, Skew & Clocking",
    summary: "Length matching is really delay matching; jitter is the clock's noise budget.",
    points: [
      "Match delay, not length: outer vs inner layers differ ~15 % in propagation speed — serpentine on the same layer as the run being padded.",
      "Match within the group that samples together: DDR byte lanes to their strobe, clock to its bus — cross-group matching wastes routing space.",
      "Jitter decomposes into RJ (random, unbounded — quote as RMS × 14.07 for 1e-12 BER) and DJ (deterministic, bounded: ISI, duty-cycle, SSC).",
      "Reference-clock ppm error accumulates in FIFOs; SyncE/PTP systems need the clock tree's stratum plan drawn before schematic.",
      "For source-synchronous DDR interfaces, the strobe travels with data — absolute length matters little, intra-group skew is everything.",
      "⚠ Serpentine coupling: tight meanders couple to themselves and shortcut the added delay — keep 3W+ between serpentine legs.",
    ] },

  /* ---------------- Power ---------------- */
  { id: "pdnknow", group: "Power", title: "PDN Design Principles",
    summary: "The impedance-vs-frequency view that the PDN Planner tab automates.",
    points: [
      "Target impedance Z = (V × ripple%) / (transient ΔI) — flat across the loop-crossover-to-package band.",
      "Tiered defence: VRM handles DC→fc; bulk caps fc→~1 MHz; ceramics ~1–100 MHz; plane capacitance and package/die caps above that.",
      "Mounting inductance dominates a ceramic's usefulness: short wide traces, via-next-to-pad, or via-in-pad — a 0402 mounted badly is worth less than an 0603 mounted well.",
      "Each cap value covers about a decade around its mounted resonance; spread values (e.g. 220n/1µ/4.7µ/22µ) rather than one giant value count.",
      "Anti-resonance peaks appear between cap groups — damp with ESR diversity or fill with an intermediate value.",
      "⚠ The plane pair under the BGA is your fastest capacitor: thin dielectric there (2–3 mil) buys margin no discrete cap can reach.",
    ] },
  { id: "vrmknow", group: "Power", title: "VRM Topology Choices",
    summary: "LDO vs buck vs multiphase — the decision tree the VRM tab implements.",
    points: [
      "LDO: quiet, cheap, instant — but efficiency = Vout/Vin and heat = (Vin−Vout)·I. Right for <1 A cleanup rails and noise-sensitive analog (PLL, clock, SerDes AVDD).",
      "Single buck: workhorse for 1–30 A rails; efficiency 85–95 %; needs layout care (hot loop small!).",
      "Multiphase: >30 A core rails — splits heat, cancels ripple, √N less input-cap stress; controller adds current sharing, droop (AVP), PMBus telemetry.",
      "Droop/AVP intentionally sags Vout with load — halves the transient window requirement; it's a feature, not an error.",
      "DCR current sensing (RC across the inductor) is free but tolerance-sensitive; sense resistors cost efficiency but read true.",
      "⚠ The 'hot loop' (Cin → HS FET → LS FET → Cin) is the EMI source: minimize its area above all other layout goals on a buck.",
    ] },
  { id: "sequencing", group: "Power", title: "Sequencing, Monitoring & Protection",
    summary: "Big ASICs die from rail order, not just rail voltage.",
    points: [
      "Follow the datasheet's rail order and ramp rates exactly — core-before-IO or IO-before-core is chip-specific, and violations can latch-up or slowly degrade.",
      "PGOOD daisy-chains are the simple sequencer; CPLD-based sequencing adds retries, fault logging, and timing you can patch — the norm on switch mainboards.",
      "Every rail needs UV monitoring for reset generation; OV protection on rails whose failure would kill an expensive ASIC.",
      "PMBus POLs give telemetry (V/I/T), margining for test, and remote OCP thresholds — wire the bus and address straps even if firmware comes later.",
      "Power-down order matters too — controlled discharge prevents back-powering through IO clamp diodes.",
      "⚠ Back-power check at review: any IO pulled up to a rail that's alive while the device's core rail is down feeds the dead rail through ESD diodes.",
    ] },
  { id: "thermalknow", group: "Power", title: "Thermal Design",
    summary: "From junction to air: the resistor chain that sets every device's fate.",
    points: [
      "θJA in a datasheet is measured on a JEDEC board — yours differs. Use θJC + your heatsink/board path for real numbers.",
      "Tj = Ta + P·Σθ: junction→case→sink→air. Attack the biggest resistor in the chain first.",
      "Copper pours and thermal vias are the board's contribution — a 3×3 via array under a PowerPAD cuts its path resistance ~9×.",
      "Airflow direction and preheating: downstream devices see upstream exhaust — budget inlet temperature per zone, not one ambient.",
      "Place thermal sensors where policy acts: ASIC diode for throttle, inlet for fan curves, optics cage for module protection.",
      "⚠ Derate at altitude (thinner air) and for a failed fan (N+1) — the spec point is worst-case, not the bench.",
    ] },

  /* ---------------- Interfaces · Control & Management ---------------- */
  { id: "i2c", group: "Control Interfaces", title: "I²C / SMBus / PMBus",
    summary: "The management backbone of every network device.",
    points: [
      "Speeds: 100 kHz standard, 400 kHz fast, 1 MHz FM+; 7-bit addressing (128 slots, minus reserved).",
      "Open-drain: pull-up sizing trades rise time vs drive — 2.2–4.7 kΩ at 3.3 V typical; total bus capacitance limit 400 pF drives topology.",
      "SMBus adds timeouts (a stuck bus recovers), fixed logic levels, and optional PEC (CRC-8) — hosts expect it; PMBus layers power-management commands on SMBus.",
      "Big I²C trees (optics cages!) need muxes/switches (e.g. 1-of-8) — draw the tree with addresses at schematic time and keep a live map document.",
      "Clock stretching is legal — masters must tolerate it; some hardware masters don't. Check both ends.",
      "⚠ Address collisions are the classic bring-up wall: strap pins sampled at reset decide addresses — verify strapping against the tree map before power-on.",
    ] },
  { id: "spi", group: "Control Interfaces", title: "SPI / QSPI / eSPI",
    summary: "Boot flash, sensors, and the BMC sideband.",
    points: [
      "Four modes from CPOL/CPHA — mode mismatch reads shifted-by-one data, the signature SPI bug.",
      "QSPI (quad IO) is the boot-flash standard: dummy cycles let the flash fetch ahead at high clock; verify dummy-cycle config matches the SoC's boot ROM expectation.",
      "Boot-flash reads at 50–133 MHz make SPI a real transmission line: series-terminate CLK at the source, keep the group matched loosely.",
      "One CS per device; keep MISO short-stubbed on shared buses — a slow slave's turn-around can clash at high clock.",
      "eSPI replaces LPC for BMC↔PCH/SoC: 1.8 V only, up to 66 MHz quad — never mix with 3.3 V LPC levels on the same header.",
      "⚠ Flash quirks: 3-byte vs 4-byte addressing above 16 MB, write-protect straps, and vendor-specific status registers — the bring-up trio to check when boot hangs.",
    ] },
  { id: "uartjtag", group: "Control Interfaces", title: "UART Console & JTAG",
    summary: "The two lifelines you'll use on every board you ever bring up.",
    points: [
      "Console UART: 115200-8-N-1 is the ecosystem default; TTL levels (3.3/1.8 V) on headers — never wire RS-232 ±12 V into a TTL pin.",
      "Give the console its own header plus a USB-UART bridge footprint (DNI) — the cheapest debug investment on any board.",
      "JTAG TAP: TCK/TMS/TDI/TDO (+TRST optional). Chain order: TDI → device1 TDO → device2 TDI → … → header TDO.",
      "Buffer TCK/TMS beyond ~3 chained devices; series-terminate TCK; pull TMS up so a floating chain idles in reset state.",
      "Boundary scan doubles as manufacturing test (opens/shorts on BGA nets no probe can reach) — plan chain coverage at schematic time.",
      "⚠ A held-low TRST or wrong chain order makes every tool report 'chain broken' — verify with a slow blind interrogation first (IDCODE scan at 100 kHz).",
    ] },
  { id: "mdio", group: "Control Interfaces", title: "MDIO / MDC",
    summary: "How the switch talks to every PHY on the board.",
    points: [
      "Two wires, up to 32 PHY addresses per bus; MDC typically 2.5 MHz (Clause 22 default), faster where both ends allow.",
      "Clause 22: 5-bit reg space, the classic GbE PHY world. Clause 45: extended addressing for 10G+ PHYs/PMA/PMD — different frame format; the MAC must speak the right clause for the part.",
      "MDIO is open-drain-ish: 1.5–2.2 kΩ pull-up; preamble of 32 ones precedes frames (suppressible if the PHY allows).",
      "PHY address straps (like I²C) are latched at reset — a strap conflict makes two PHYs answer as one address.",
      "Multi-drop is normal; keep the bus short-ish and star-stubbed lightly — it's slow but edges still ring on long messy routing.",
      "⚠ Reading 0xFFFF from every register = address/clause mismatch or a PHY still in reset — the two first checks, always.",
    ] },

  /* ---------------- Interfaces · Ethernet & SerDes ---------------- */
  { id: "phyattach", group: "Ethernet / SerDes", title: "PHY Attach: RGMII → USXGMII",
    summary: "The family tree of MAC↔PHY connections on switch boards.",
    points: [
      "RGMII: 12 pins, 125 MHz DDR for GbE. The eternal gotcha: the 2 ns clock-to-data delay — provided by PCB serpentine OR internal delay (RGMII-ID) but never both. Confirm which side adds it.",
      "SGMII: serializes GbE onto one 1.25 GBd diff pair each way, with in-band autonegotiation — the pin-saver that replaced RGMII in dense designs.",
      "QSGMII: four SGMII channels muxed on a single 5 GBd lane — one SerDes serves a quad-PHY; the standard hookup for 48-port GbE line cards.",
      "USXGMII: 10.3125 GBd multi-rate attach for mGig (10G/5G/2.5G/1G on the same lane) — the modern access-switch PHY link.",
      "All the serial variants are AC-coupled diff pairs at 100 Ω — normal SerDes layout rules apply (the Reach tab has lengths).",
      "⚠ In-band vs out-of-band autoneg config mismatch between MAC and PHY gives 'link up, no traffic' — the most-reported SGMII bug in bring-up.",
    ] },
  { id: "serdeskr", group: "Ethernet / SerDes", title: "High-Speed SerDes & Backplane (KR)",
    summary: "10G to 112G per lane: naming, modulation, FEC and training.",
    points: [
      "Suffix decoder: -KR = backplane, -CR = copper cable, -SR/-LR = optics; number = total rate (25G = 1×25G, 100G could be 4×25G NRZ or 2×56G/1×112G PAM4).",
      "NRZ up to 25–28 GBd; PAM4 (4 levels, 2 bits/symbol) from 50G/lane up — less SNR, so RS-FEC (544,514) is effectively mandatory.",
      "Link training (KR startup): TX equalizer taps negotiated live over the link — needs the protocol enabled both ends; a trained link can pass where a fixed-preset one fails.",
      "Channel budgets by class: reference ~28–35 dB IL at Nyquist for long-reach — your loss/inch × route length + connectors must fit inside it.",
      "Eye margining via on-chip sampling ('eye scan') is the production-friendly proof — record eye height/width per lane at system test.",
      "⚠ Polarity and lane-order swaps are legal and common (layout freedom) — but must be declared to the SerDes config; 'no link' after a clean layout is often just an undeclared P/N swap.",
    ] },
  { id: "pcieknow", group: "Ethernet / SerDes", title: "PCIe Essentials",
    summary: "The host bus of every NPU, CPU and NIC on your carrier boards.",
    points: [
      "Rates: Gen1 2.5 GT/s → Gen2 5 → Gen3 8 → Gen4 16 → Gen5 32 → Gen6 64 (PAM4 + FLIT). Lanes gang ×1/×4/×8/×16.",
      "100 MHz reference clock, usually common-clocked with SSC (spread spectrum) — SRIS/SRNS clocking modes matter when clocks are separate (retimed NICs).",
      "AC coupling caps in the TX pairs: 75–265 nF for Gen3+; place near the transmitter, symmetric within the pair.",
      "PERST# timing: device must be ready to enumerate ~100 ms after PERST# release — heavy FPGAs need fast config (see the Config Time calculator) or a PERST delay.",
      "Redriver (analog re-amplify) vs retimer (full CDR re-clock): Gen4+ long channels almost always need retimers; redrivers can't fix jitter.",
      "Bifurcation (one ×16 as 2×8/4×4) is strap/BIOS configured — decide at schematic time; clock and reset fan-out must match the split.",
      "⚠ 'Trains at Gen1 but not Gen3+' = signal-integrity margin problem, not protocol — check channel loss and the RX presets before firmware archaeology.",
    ] },

  /* ---------------- Interfaces · Memory & Host ---------------- */
  { id: "ddrknow", group: "Memory & Storage", title: "DDR4 / DDR5 Design",
    summary: "The interface with the most rules per pin on the board.",
    points: [
      "Topology: fly-by for clock/addr/cmd/ctrl (daisy-chain with end termination) — write-leveling in the controller compensates the per-DRAM arrival skew; data groups route point-to-point to each DRAM.",
      "Match within a byte lane (DQ0-7 + DQS±) tightly; lanes to each other loosely — cross-lane skew is trained out.",
      "ODT (on-die termination) and drive strengths come from the controller's training — but the board must give training room: keep the impedance clean, stubs minimal.",
      "DDR5 moves the PMIC and voltage regulation onto the DIMM/board-down region, splits channels (2×32-bit), and runs banks of decision-feedback in the DRAM — the board rules stay familiar, the power tree changes.",
      "Vref DQ is trained internally (DDR4+); external Vref nets are gone — but VTT termination for CA still needs its regulator placed at the fly-by end.",
      "⚠ The classic DDR bring-up failure is a single swapped bit within a byte (allowed!) declared wrong in the controller config, or byte-swaps (also allowed) undeclared — layout freedom must be mirrored in the init code.",
    ] },
  { id: "bootmedia", group: "Memory & Storage", title: "Boot & Storage Media",
    summary: "NOR, eMMC and friends: where firmware lives on a switch.",
    points: [
      "QSPI NOR: the BIOS/bootloader home — execute-in-place capable, byte-addressable, 16–256 MB class; dual-flash (golden + upgrade) is standard for field-safe updates.",
      "eMMC: managed NAND for the OS image — 8-bit bus, HS200/HS400 modes need length matching (loose) and a clean VCCQ (1.8 V).",
      "NVMe/M.2 on newer platforms: it's just PCIe — all PCIe rules apply, plus the 3.3 V power budget of the socket.",
      "Boot straps select the boot source at reset — document the strap table on page 1 of the schematic; half of all 'dead board' reports are a strap resistor.",
      "Hold flash WP#/HOLD# pins deliberately (pulled, not floating); a floating HOLD# gives intermittent boot failures that look like SI ghosts.",
      "⚠ Verify erase-sector compatibility and JEDEC ID in the bootloader's flash driver when second-sourcing NOR — 'same footprint' ≠ 'same commands'.",
    ] },

  /* ---------------- Optics & Modules ---------------- */
  { id: "optics", group: "Optics & Modules", title: "SFP / QSFP / QSFP-DD & CMIS",
    summary: "Pluggable optics: the electrical, management and thermal contract.",
    points: [
      "Form factors: SFP+/SFP28 (1 lane), QSFP+/QSFP28 (4 lanes), QSFP-DD/OSFP (8 lanes) — electrical lanes are standard SerDes at the matching rate.",
      "Management is I²C at address 0x50 (plus 0x51 device on SFP): SFP family = SFF-8472 (A0/A2 maps), QSFP28 = SFF-8636, QSFP-DD/OSFP = CMIS (paged, stateful modules with firmware).",
      "Control pins: ModPrsL (presence), IntL (interrupt), LPMode/Reset — wire them per cage to the CPLD/BMC; don't gang Reset across cages.",
      "Power classes escalate: SFP+ ~1.5 W → QSFP28 3.5–5 W → QSFP-DD to ~14 W+ class optics (ZR!) — cage heatsinking and per-cage airflow become real design work at the high end.",
      "Sequence high-power modules: CMIS modules boot in low-power state and are stepped up by software after negotiation — host must implement the state machine.",
      "⚠ The I²C tree behind 32+ cages needs muxing, per-cage isolation (a hung module must not hang the tree), and 3.3 V inrush handling on hot-plug.",
    ] },
  { id: "poeknow", group: "Optics & Modules", title: "PoE System Design",
    summary: "Power over the same RJ-45: classes, detection and system budgeting.",
    points: [
      "Standards ladder: 802.3af (15.4 W PSE / 12.95 W PD), 802.3at (30/25.5), 802.3bt Type 3 (60 W) & Type 4 (90 W, all 4 pairs).",
      "Detection (25 kΩ signature) then classification (class current or LLDP fine-grained) happens before full power — a PD that skips signature never gets powered.",
      "The PSE↔PD delta is cable loss: budget it, and remember 4-pair bt splits current to halve the I²R.",
      "Isolation: the PoE domain must meet 1500 Vrms isolation from chassis/earth — transformer and DC/DC isolation design is safety-relevant, not optional.",
      "System budget = Σ per-port allocation, not Σ maximums — smart budgeting (LLDP negotiated) lets a 740 W supply serve 48 'at' ports that never all peak.",
      "⚠ Thermal in the magjack area: 90 W ports heat the connector block itself — check magnetics current ratings and connector temperature rise, not just the PSE silicon.",
    ] },

  /* ---------------- Methodology ---------------- */
  { id: "bringup", group: "Methodology", title: "Board Bring-Up Flow",
    summary: "The disciplined order that turns first silicon-on-board into a running system.",
    points: [
      "Before power: visual inspection, then resistance-to-ground on every rail (catch shorts at 0 V, not at 12 V).",
      "First power on current-limited bench supply, rails enabled in sequence order; verify each voltage, ripple, and sequencing timing against spec before the next.",
      "Then clocks (frequency + amplitude at destinations), then resets (released in order, correct polarity), then JTAG alive (IDCODE readout = the chip is fundamentally awake).",
      "Boot minimal firmware; bring interfaces up one at a time — console first, then management (I²C tree walk, MDIO scan), then high-speed lanes.",
      "Log everything as you go: strap tables, register dumps, scope shots — bring-up notes become the production test spec and the next revision's checklist.",
      "⚠ Change one variable at a time. The boards that stay broken longest are the ones where three fixes were applied at once and one made it worse.",
    ] },
  { id: "instruments", group: "Methodology", title: "Debug Instruments & Probing",
    summary: "Choosing and trusting the tools between you and the truth.",
    points: [
      "Scope bandwidth ≥ 3–5× the signal's knee frequency (0.5/tr) — a 100 MHz scope shows a 1 ns edge as ~3.5 ns fiction.",
      "Passive 10:1 probes load ~10 pF — enough to 'fix' a marginal clock while you watch. Active probes (<1 pF) for anything fast; know your probe before trusting the waveform.",
      "Ground-lead inductance rings: use the spring-tip ground, not the 6-inch clip, for any edge under 5 ns.",
      "TDR finds impedance vs distance (opens, shorts, connector dips); VNA measures channels in frequency domain (IL/RL) — the pair covers passive-channel truth.",
      "Current probes + IR camera for power debugging; a thermal image finds the shorted cap faster than any meter.",
      "⚠ Measure at the receiver, not the driver — the waveform mid-line is physically different from what the input pin experiences.",
    ] },
  { id: "review", group: "Methodology", title: "Schematic & Layout Review Checklist",
    summary: "The recurring catches — a review culture in one card.",
    points: [
      "Power tree walk: every rail's source, sequence position, monitor, and consumers on one diagram; check current budgets bottom-up.",
      "Strap pins: list every configuration strap, its resistor, and what samples it — the highest-yield review item on processor boards.",
      "Level domains: colour IO voltage domains on the schematic; every crossing needs a shifter or a deliberate 'tolerant' note.",
      "Resets: sources, sinks, polarity, and release order drawn as one tree; RC delays checked against every device's minimum.",
      "Pull-up/down audit: I²C, straps, enables, open-drain outputs — floating enables are the classic intermittent.",
      "DNI strategy: debug aids (headers, series 0 Ω, testpoints) stuffed on proto, removed at MP — mark stuffing options clearly.",
      "⚠ Diff-pair polarity, lane order, and connector pinout mirroring (top vs bottom entry) — the three layout-transfer errors that survive every automated check.",
    ] },
];

function KnowledgePanel() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("All");
  const [open, setOpen] = useState(() => new Set());
  const groups = ["All", ...Array.from(new Set(KNOWLEDGE.map((k) => k.group)))];
  const ql = q.trim().toLowerCase();
  let list = KNOWLEDGE;
  if (ql) list = KNOWLEDGE.filter((k) => (k.title + " " + k.summary + " " + k.group + " " + k.points.join(" ")).toLowerCase().includes(ql));
  else if (group !== "All") list = KNOWLEDGE.filter((k) => k.group === group);
  const toggle = (id) => setOpen((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="h-full overflow-y-auto hw-scroll px-4 py-5">
      <div className="max-w-4xl mx-auto pb-8">
        {/* hero */}
        <div className="mb-4 fade-up">
          <h2 className="hw-display font-bold text-xl accent-text">Knowledge Hub</h2>
          <p className="text-xs mt-1" style={{ color: "var(--muted2)" }}>
            The working reference for network-hardware design — foundations, signal integrity, power, every interface on a switch board, and the methodology that ties it together. Curated by Niroj Kapri.
          </p>
        </div>

        {/* search + groups */}
        <div className="flex items-center gap-2 mb-3 max-w-xl">
          <div className="flex items-center gap-2 flex-1 rounded-2xl px-4 py-2.5 ring-focus"
            style={{ background: "var(--card)", border: "1px solid var(--bd)", boxShadow: "var(--shadow)" }}>
            <Search size={16} style={{ color: "var(--accent)" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${KNOWLEDGE.length} topics — interface, rule, or pitfall…`}
              className="flex-1 bg-transparent outline-none text-sm" style={{ color: "var(--fg)" }} />
            {q && <button onClick={() => setQ("")} style={{ color: "var(--label)" }}><X size={14} /></button>}
          </div>
        </div>
        {!ql && (
          <div className="flex flex-wrap gap-2 mb-5">
            {groups.map((g) => {
              const active = group === g;
              const count = g === "All" ? KNOWLEDGE.length : KNOWLEDGE.filter((k) => k.group === g).length;
              return (
                <button key={g} onClick={() => setGroup(g)}
                  className="hw-mono text-[11px] px-3 py-1.5 rounded-full transition-all"
                  style={active
                    ? { color: "#fff", border: "1px solid transparent", fontWeight: 600 }
                    : { border: "1px solid var(--bd3)", color: "var(--label)", background: "var(--card)" }}>
                  <span className={active ? "accent-grad px-3 py-1.5 -mx-3 -my-1.5 rounded-full" : ""} style={active ? { display: "inline-block" } : {}}>{g} <span style={{ opacity: 0.7 }}>{count}</span></span>
                </button>
              );
            })}
          </div>
        )}
        {ql && <div className="hw-mono text-[11px] mb-4" style={{ color: "var(--label)" }}>{list.length} topic{list.length === 1 ? "" : "s"} match "{q}"</div>}

        {/* topic cards */}
        <div className="space-y-3">
          {list.map((k) => {
            const isOpen = open.has(k.id) || !!ql;
            return (
              <div key={k.id} className="rounded-2xl card3d fade-up overflow-hidden"
                style={{ background: "var(--card)", border: "1px solid var(--bd3)" }}>
                <button onClick={() => toggle(k.id)} className="w-full text-left px-5 py-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 accent-grad">
                    <Lightbulb size={15} style={{ color: "#fff" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="hw-display font-semibold text-[15px]" style={{ color: "var(--fg)" }}>{k.title}</h3>
                      <span className="hw-mono text-[9px] uppercase tracking-wider" style={{ color: "var(--muted6)" }}>{k.group}</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted2)" }}>{k.summary}</p>
                  </div>
                  <span className="hw-mono text-[10px] mt-1 shrink-0" style={{ color: "var(--accent)" }}>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 fade-up">
                    <ul className="space-y-2">
                      {k.points.map((p, i) => {
                        const warn = p.startsWith("⚠");
                        return (
                          <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed"
                            style={{ color: warn ? "var(--warn)" : "var(--fg3)" }}>
                            <span className="shrink-0 mt-1" style={{ width: 5, height: 5, borderRadius: 99, background: warn ? "var(--warn)" : "var(--accent)", display: "inline-block" }} />
                            <span>{warn ? p.slice(1).trim() : p}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HardwareHub() {
  const [tab, setTab] = useState("calc");
  const [theme, setTheme] = useState("light");
  const [learnMode, setLearnMode] = useState("hover");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.style.background = theme === "light"
      ? "radial-gradient(900px 500px at 85% -8%, rgba(34,211,238,0.10), transparent 55%), radial-gradient(1000px 560px at 10% -5%, rgba(99,102,241,0.10), transparent 55%), radial-gradient(800px 500px at 50% 120%, rgba(79,70,229,0.05), transparent 60%), #f6f8fc"
      : "radial-gradient(900px 480px at 85% -10%, rgba(34,211,238,0.10), transparent 55%), radial-gradient(1000px 560px at 8% -8%, rgba(99,102,241,0.16), transparent 55%), radial-gradient(900px 520px at 50% 120%, rgba(129,140,248,0.06), transparent 60%), #080b14";
  }, [theme]);
  const TABS = [
    { id: "calc", label: "Calculators", icon: Calculator, sub: `${CALCULATORS.length} tools` },
    { id: "vrm", label: "VRM Designer", icon: Zap, sub: "buck design" },
    { id: "pdn", label: "PDN Planner", icon: Gauge, sub: "decoupling" },
    { id: "channel", label: "Channel Designer", icon: Activity, sub: "loss budget" },
    { id: "reach", label: "Interface Reach", icon: Cable, sub: "max length" },
    { id: "know", label: "Knowledge", icon: Lightbulb, sub: "learn & reference" },
    { id: "sim", label: "Simulator", icon: Waves, sub: "live circuits" },
  ];
  return (
    <LearnContext.Provider value={{ mode: learnMode, setMode: setLearnMode }}>
    <div className="flex flex-col h-screen" style={{ background: "var(--bg)" }}>
      <style>{FONTS}</style>

      <header className="shrink-0 glass" style={{ borderBottom: "1px solid var(--bd3)", background: "var(--header-bg)" }}>
        <div className="px-5 pt-4 pb-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 accent-grad glow-accent sheen">
            <CircuitBoard size={21} style={{ color: "#fff" }} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="hw-display font-bold text-[19px] leading-tight truncate accent-text">
              Hardware Engineering Hub
            </h1>
            <p className="hw-mono text-[10px] truncate tracking-wide" style={{ color: "var(--label)" }}>
              calculate · plan · simulate · learn — Niroj Kapri · v{APP_VERSION}
            </p>
          </div>
          <button onClick={() => setLearnMode(learnMode === "always" ? "hover" : "always")}
            title={learnMode === "always" ? "Notes: always shown — click for hover-only" : "Notes: hover to read — click to always show"}
            className="h-10 px-3 rounded-2xl flex items-center gap-1.5 shrink-0 sheen hw-mono text-[11px]"
            style={{ background: learnMode === "always" ? "var(--chip)" : "var(--card2)", border: "1px solid var(--bd)", color: learnMode === "always" ? "var(--accent)" : "var(--label)", boxShadow: "var(--shadow)", fontWeight: learnMode === "always" ? 600 : 400 }}>
            <Info size={15} /> <span className="hidden sm:inline">{learnMode === "always" ? "notes on" : "learn"}</span>
          </button>
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            title={theme === "light" ? "Switch to night mode" : "Switch to light mode"}
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 sheen"
            style={{ background: "var(--card2)", border: "1px solid var(--bd)", color: "var(--accent)", boxShadow: "var(--shadow)" }}>
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
        {/* prominent section bar — scrollable on narrow screens */}
        <nav className="flex px-2 gap-1 overflow-x-auto hw-scroll" style={{ scrollbarWidth: "none" }}>
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 px-3 transition-all min-w-[64px] sm:min-w-0 rounded-t-xl tab-ind sheen"
                style={{
                  color: active ? "var(--accent)" : "var(--label)",
                  borderBottom: active ? "2.5px solid var(--accent2)" : "2.5px solid transparent",
                  background: active ? "var(--tab-active)" : "transparent",
                }}>
                <div className="flex items-center gap-1.5">
                  <Icon size={16} className="shrink-0" />
                  <span className="hw-display font-semibold text-[13px] truncate hidden sm:inline">{t.label}</span>
                </div>
                <span className="hw-mono text-[8.5px] truncate hidden sm:block" style={{ opacity: active ? 0.7 : 0.5 }}>{t.sub}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main key={tab} className="flex-1 min-h-0 fade-up">
        {tab === "calc" && <CalcPanel />}
        {tab === "reach" && <ReachPanel />}
        {tab === "channel" && <ChannelDesigner />}
        {tab === "pdn" && <PdnPlanner />}
        {tab === "vrm" && <VrmDesigner />}
        {tab === "know" && <KnowledgePanel />}
        {tab === "sim" && <SimulatorPanel />}
      </main>
    </div>
    </LearnContext.Provider>
  );
}
