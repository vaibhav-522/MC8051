import React, { useEffect, useRef, useState } from 'react';
import type { ProgramItem } from '../types';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';

/* Speed presets — ms per animation step */
const SPEEDS = [
  { label: '0.5×', ms: 1600 },
  { label: '1×', ms: 950 },
  { label: '2×', ms: 520 },
  { label: '4×', ms: 270 },
];

const ASM_WORDS = new Set([
  'ORG', 'MOV', 'ADD', 'SUBB', 'MUL', 'DIV', 'CLR', 'SETB',
  'SJMP', 'ACALL', 'RET', 'DJNZ', 'DEC', 'INC', 'JC', 'JNC',
]);
const C_WORDS = new Set(['void', 'unsigned', 'char', 'int', 'sbit', 'while', 'for', 'if', 'return', 'include', 'main']);

/* Matches #0C8H / #14 / 0xAA / 5AH / plain decimals */
const NUM_RE = /(#0[xX][0-9A-Fa-f]+|\b0[xX][0-9A-Fa-f]+\b|#[0-9A-Fa-f]+H?|\b[0-9A-Fa-f]{1,4}H\b|\b\d+\b)/;

const hex8 = (n: number): string => (n & 0xff).toString(16).toUpperCase().padStart(2, '0') + 'H';

function tokenize(text: string): React.ReactNode[] {
  return text
    .split(NUM_RE)
    .filter((p) => p !== '')
    .map((part, i) =>
      NUM_RE.test(part) ? (
        <span key={i} className="pgm-tok-num">{part}</span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    );
}

/** Syntax-highlight one source line (labels, mnemonics/keywords, numbers, comments) */
function renderLine(line: string, lang: 'asm' | 'c'): React.ReactNode {
  if (line.trim() === '') return '\u00A0';

  let code = line;
  let comment = '';
  if (lang === 'asm') {
    const i = line.indexOf(';');
    if (i >= 0) {
      code = line.slice(0, i);
      comment = line.slice(i);
    }
  } else {
    const i = line.indexOf('/*');
    if (i >= 0) {
      code = line.slice(0, i);
      comment = line.slice(i);
    }
  }

  const nodes: React.ReactNode[] = [];
  const labelMatch = code.match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*:)/);
  if (labelMatch) {
    nodes.push(<span key="lbl" className="pgm-tok-label">{labelMatch[2]}</span>);
    code = code.slice(labelMatch[0].length);
  }
  const wordMatch = code.match(/^(\s*)([A-Za-z_#][A-Za-z0-9_]*)/);
  if (wordMatch) {
    const word = wordMatch[2];
    const isKw = lang === 'asm' ? ASM_WORDS.has(word.toUpperCase()) : C_WORDS.has(word);
    nodes.push(
      isKw ? (
        <span key="kw" className="pgm-tok-kw">{word}</span>
      ) : (
        <React.Fragment key="w">{word}</React.Fragment>
      ),
    );
    code = code.slice(wordMatch[0].length);
  }
  tokenize(code).forEach((n, i) => nodes.push(<React.Fragment key={`t${i}`}>{n}</React.Fragment>));
  if (comment) nodes.push(<span key="cmt" className="pgm-tok-comment">{comment}</span>);
  return nodes.length > 0 ? nodes : '\u00A0';
}

interface CodeAnimatorProps {
  program: ProgramItem;
  lang: 'asm' | 'c';
}

/**
 * Code + animated execution player for one program.
 * Steps through the source line-by-line while showing the live
 * register file, flags, variables, RAM, LED bar, buzzer and console.
 */
export const CodeAnimator: React.FC<CodeAnimatorProps> = ({ program, lang }) => {
  const data = lang === 'asm' ? program.asm : program.c;
  const steps = data.steps;
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const codeRef = useRef<HTMLDivElement | null>(null);

  /* Reset whenever the program or language changes */
  const progKey = `${program.id}:${lang}`;
  const [prevProgKey, setPrevProgKey] = useState(progKey);
  if (prevProgKey !== progKey) {
    setPrevProgKey(progKey);
    setIdx(0);
    setPlaying(false);
  }

  /* Auto-advance timer */
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      const cur = steps[idx];
      const next = idx + 1;
      if (next >= steps.length) {
        if (cur.loopTo !== undefined) {
          setIdx(cur.loopTo); // infinite-loop programs cycle back
        } else {
          setPlaying(false);
        }
      } else {
        setIdx(next);
      }
    }, SPEEDS[speedIdx].ms);
    return () => window.clearTimeout(id);
  }, [playing, idx, speedIdx, steps]);

  /* Keep the highlighted line visible */
  useEffect(() => {
    const el = codeRef.current?.querySelector('.pgm-line-active');
    el?.scrollIntoView({ block: 'nearest' });
  }, [idx]);

  const step = steps[Math.min(idx, steps.length - 1)];
  const state = step.state;
  const regKeys = (['A', 'B', 'R0', 'R1', 'R2', 'PC'] as const).filter((k) => state.regs[k] != null);
  const isLast = idx >= steps.length - 1;
  const isLoop = step.loopTo !== undefined;

  return (
    <div className="pgm-animator">
      {/* ---------- Code pane ---------- */}
      <div className="pgm-code-pane">
        <div className="pgm-code-head">
          <span className="pgm-code-lang">{lang === 'asm' ? '8051 Assembly' : 'C — Keil C51'}</span>
          <span className="pgm-code-meta">{data.code.length} lines</span>
        </div>
        <div className="pgm-code" ref={codeRef}>
          {data.code.map((line, i) => (
            <div key={i} className={`pgm-line${i === step.line ? ' pgm-line-active' : ''}`}>
              <span className="pgm-ln">{i + 1}</span>
              <code className="pgm-src">{renderLine(line, lang)}</code>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- State panel ---------- */}
      <div className="pgm-side">
        <div className="pgm-controls">
          <button
            className="pgm-btn"
            onClick={() => {
              setIdx(0);
              setPlaying(false);
            }}
            title="Reset"
            aria-label="Reset execution"
          >
            <RotateCcw size={15} />
          </button>
          <button
            className="pgm-btn"
            onClick={() => {
              setPlaying(false);
              setIdx((i) => Math.max(0, i - 1));
            }}
            title="Previous step"
            aria-label="Previous step"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            className="pgm-btn pgm-btn-primary"
            onClick={() => {
              if (isLast && !isLoop) setIdx(0);
              setPlaying((p) => !p);
            }}
          >
            {playing ? (
              <>
                <Pause size={15} /> Pause
              </>
            ) : (
              <>
                <Play size={15} /> {isLast && !isLoop ? 'Replay' : 'Play'}
              </>
            )}
          </button>
          <button
            className="pgm-btn"
            onClick={() => {
              setPlaying(false);
              setIdx((i) => Math.min(steps.length - 1, i + 1));
            }}
            title="Next step"
            aria-label="Next step"
          >
            <ChevronRight size={15} />
          </button>
          <select
            className="pgm-speed"
            value={speedIdx}
            onChange={(e) => setSpeedIdx(Number(e.target.value))}
            aria-label="Animation speed"
          >
            {SPEEDS.map((s, i) => (
              <option key={s.label} value={i}>
                {s.label} speed
              </option>
            ))}
          </select>
          <span className="pgm-stepcount">
            Step {idx + 1} / {steps.length}
          </span>
        </div>

        <div className="pgm-step-label">
          <span className="pgm-step-badge">{isLoop && isLast ? '↻ loop' : '▶'}</span>
          <span>{step.label}</span>
        </div>

        {regKeys.length > 0 && (
          <div className="pgm-panel">
            <div className="pgm-panel-title">Register File</div>
            <div className="pgm-regs">
              {regKeys.map((k) => (
                <div key={k} className="pgm-reg">
                  <span className="pgm-reg-name">{k}</span>
                  <span className="pgm-reg-val">{state.regs[k]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pgm-panel">
          <div className="pgm-panel-title">Flags (PSW)</div>
          <div className="pgm-flags">
            {(['CY', 'OV', 'AC'] as const).map((f) => (
              <span key={f} className={`pgm-flag${state.flags[f] ? ' on' : ''}`}>
                {f} = {state.flags[f]}
              </span>
            ))}
          </div>
        </div>

        {state.vars && (
          <div className="pgm-panel">
            <div className="pgm-panel-title">Variables</div>
            <div className="pgm-regs">
              {state.vars.map((v) => (
                <div key={v.name} className="pgm-reg">
                  <span className="pgm-reg-name">{v.name}</span>
                  <span className="pgm-reg-val">{v.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.mem && (
          <div className="pgm-panel">
            <div className="pgm-panel-title">
              Internal RAM {state.mem[0].addr}–{state.mem[state.mem.length - 1].addr}
            </div>
            <div className="pgm-mem">
              {state.mem.map((cell, i) => (
                <div key={cell.addr} className={`pgm-mem-cell${i === state.memIndex ? ' active' : ''}`}>
                  <span className="pgm-mem-addr">{cell.addr}</span>
                  <span className="pgm-mem-val">{hex8(cell.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.p1 !== undefined && (
          <div className="pgm-panel">
            <div className="pgm-panel-title">Port 1 — LED Bar</div>
            <div className="pgm-leds">
              {Array.from({ length: 8 }, (_, i) => 7 - i).map((bit) => {
                const on = ((state.p1 ?? 0) >> bit) & 1;
                return (
                  <div key={bit} className="pgm-led-col">
                    <div className={`pgm-led${on ? ' on' : ''}`} />
                    <span className="pgm-led-label">P1.{bit}</span>
                  </div>
                );
              })}
            </div>
            <div className="pgm-port-val">
              P1 = {hex8(state.p1)} → {(state.p1 ?? 0).toString(2).padStart(8, '0')}b
            </div>
          </div>
        )}

        {state.buzzer !== undefined && (
          <div className="pgm-panel">
            <div className="pgm-panel-title">Buzzer</div>
            <div className={`pgm-buzzer${state.buzzer ? ' on' : ''}`}>
              {state.buzzer ? (
                <Volume2 size={20} className="pgm-buzz-icon" />
              ) : (
                <VolumeX size={20} />
              )}
              <span>{state.buzzer ? 'ON — pin P1.7 HIGH, sound!' : 'OFF — pin P1.7 LOW, silent'}</span>
            </div>
          </div>
        )}

        <div className="pgm-panel">
          <div className="pgm-panel-title">Output Console</div>
          <div className="pgm-console">
            {state.output.length === 0 ? (
              <span className="pgm-console-empty">// output appears here as the program executes</span>
            ) : (
              state.output.map((l, i) => (
                <div key={i} className="pgm-console-line">
                  {l}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
