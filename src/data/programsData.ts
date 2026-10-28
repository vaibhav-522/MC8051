import type { ProgramItem, ProgramVariant, SimState, SimStep } from '../types';

/* ============================================================
 * Helpers — hex formatting + 8051 flag arithmetic
 * ============================================================ */

const h8 = (n: number): string => (n & 0xff).toString(16).toUpperCase().padStart(2, '0') + 'H';
const h16 = (n: number): string => (n & 0xffff).toString(16).toUpperCase().padStart(4, '0') + 'H';

interface Flags {
  CY: 0 | 1;
  OV: 0 | 1;
  AC: 0 | 1;
}

/** 8051 ADD (no carry-in) flag semantics */
function addFlags(a: number, b: number): { result: number; flags: Flags } {
  const raw = a + b;
  const result = raw & 0xff;
  return {
    result,
    flags: {
      CY: raw > 0xff ? 1 : 0,
      AC: (a & 0x0f) + (b & 0x0f) > 0x0f ? 1 : 0,
      OV: (~(a ^ b) & (a ^ result) & 0x80) !== 0 ? 1 : 0,
    },
  };
}

/** 8051 SUBB (subtract with borrow) flag semantics */
function subbFlags(a: number, b: number, cy: 0 | 1): { result: number; flags: Flags } {
  const raw = a - b - cy;
  const result = raw & 0xff;
  return {
    result,
    flags: {
      CY: raw < 0 ? 1 : 0,
      AC: (a & 0x0f) - (b & 0x0f) - cy < 0 ? 1 : 0,
      OV: ((a ^ b) & (a ^ result) & 0x80) !== 0 ? 1 : 0,
    },
  };
}

/* ============================================================
 * Trace builder — collects immutable snapshots per step
 * ============================================================ */

class Trace {
  private steps: SimStep[] = [];
  private regs: Record<string, string | null> = { A: null, B: null, R0: null, R1: null, R2: null, PC: null };
  private flags: Flags = { CY: 0, OV: 0, AC: 0 };
  private vars: { name: string; value: string }[] | undefined;
  private mem: { addr: string; value: number }[] | undefined;
  private memIndex: number | undefined;
  private p1: number | undefined;
  private buzzer: boolean | undefined;
  private output: string[] = [];

  reg(name: string, value: string | null): this {
    this.regs = { ...this.regs, [name]: value };
    return this;
  }

  setFlags(f: Partial<Flags>): this {
    this.flags = { ...this.flags, ...f };
    return this;
  }

  setVars(vars: { name: string; value: string }[]): this {
    this.vars = vars.map((v) => ({ ...v }));
    return this;
  }

  setMem(cells: { addr: string; value: number }[], index?: number): this {
    this.mem = cells.map((c) => ({ ...c }));
    this.memIndex = index;
    return this;
  }

  setPort(p1: number): this {
    this.p1 = p1 & 0xff;
    return this;
  }

  setBuzzer(on: boolean): this {
    this.buzzer = on;
    return this;
  }

  say(line: string): this {
    this.output = [...this.output, line];
    return this;
  }

  step(line: number, label: string, loopTo?: number): this {
    const state: SimState = {
      regs: { ...this.regs },
      flags: { ...this.flags },
      output: [...this.output],
    };
    if (this.vars) state.vars = this.vars.map((v) => ({ ...v }));
    if (this.mem) state.mem = this.mem.map((c) => ({ ...c }));
    if (this.memIndex !== undefined) state.memIndex = this.memIndex;
    if (this.p1 !== undefined) state.p1 = this.p1;
    if (this.buzzer !== undefined) state.buzzer = this.buzzer;
    this.steps.push(loopTo === undefined ? { line, label, state } : { line, label, state, loopTo });
    return this;
  }

  done(): SimStep[] {
    return this.steps;
  }
}

/* ============================================================
 * Program 1 — Addition of two 8-bit numbers
 * ============================================================ */

const ADD_A = 0xc8; // 200
const ADD_B = 0x57; // 87

const ADD_ASM = [
  '; Addition of two 8-bit numbers',
  '; Inputs : 0C8H + 057H',
  '; Result : A = 1FH with CY = 1',
  '',
  '        ORG     0000H',
  '        MOV     A, #0C8H     ; A = first number',
  '        MOV     R0, #057H    ; R0 = second number',
  '        ADD     A, R0        ; A = A + R0',
  '        SJMP    $            ; hold result',
];

function addAsmSteps(): SimStep[] {
  const t = new Trace();
  const { result, flags } = addFlags(ADD_A, ADD_B);
  t.reg('PC', '0000H').step(4, 'ORG 0000H — program starts at address 0000H');
  t.reg('A', h8(ADD_A)).reg('PC', '0005H').say(`A <- ${h8(ADD_A)} (first number)`).step(5, `MOV A, #${h8(ADD_A)} — load first operand into the Accumulator`);
  t.reg('R0', h8(ADD_B)).reg('PC', '0008H').say(`R0 <- ${h8(ADD_B)} (second number)`).step(6, `MOV R0, #${h8(ADD_B)} — load second operand into R0`);
  t.reg('A', h8(result))
    .setFlags(flags)
    .reg('PC', '000BH')
    .say(`ADD A, R0 -> A = ${h8(result)}   CY=${flags.CY} AC=${flags.AC} OV=${flags.OV}`)
    .say(`16-bit sum = ${h16(ADD_A + ADD_B)}${flags.CY ? ' (carry out of bit 7)' : ''}`)
    .step(7, `ADD A, R0 — 0${h8(ADD_A).slice(0, 2)} + 0${h8(ADD_B).slice(0, 2)}: result ${h8(result)}, carry flag CY = ${flags.CY}`);
  t.reg('PC', '000BH').say('Program complete — result held in A').step(8, 'SJMP $ — halt (infinite jump to itself)');
  return t.done();
}

const ADD_C = [
  '#include <reg51.h>',
  '',
  '/* Addition of two 8-bit numbers */',
  'void main(void)',
  '{',
  '    unsigned char a = 0xC8;  /* first number  */',
  '    unsigned char b = 0x57;  /* second number */',
  '    unsigned char sum;',
  '',
  '    sum = a + b;             /* 0xC8 + 0x57 */',
  '',
  '    while (1);               /* hold result */',
  '}',
];

function addCSteps(): SimStep[] {
  const t = new Trace();
  const { result, flags } = addFlags(ADD_A, ADD_B);
  t.step(0, '#include <reg51.h> — brings in the 8051 SFR declarations (sfr A, P1, ...)');
  t.setVars([{ name: 'a', value: h8(ADD_A) }]).say(`a = ${h8(ADD_A)}`).step(5, `unsigned char a = 0x${h8(ADD_A).slice(0, 2)} — variable in internal RAM`);
  t.setVars([
    { name: 'a', value: h8(ADD_A) },
    { name: 'b', value: h8(ADD_B) },
  ]).say('b = 57H').step(6, `unsigned char b = 0x${h8(ADD_B).slice(0, 2)} — second operand`);
  t.setVars([
    { name: 'a', value: h8(ADD_A) },
    { name: 'b', value: h8(ADD_B) },
    { name: 'sum', value: '--' },
  ]).step(7, 'unsigned char sum — storage reserved for the result');
  t.setVars([
    { name: 'a', value: h8(ADD_A) },
    { name: 'b', value: h8(ADD_B) },
    { name: 'sum', value: h8(result) },
  ])
    .setFlags(flags)
    .say(`sum = a + b -> ${h8(result)}   (CY=${flags.CY}, AC=${flags.AC}, OV=${flags.OV})`)
    .step(9, `sum = a + b — CPU executes ADD A, R0 under the hood; sum wraps to ${h8(result)}, hardware carry CY = ${flags.CY}`);
  t.say('Note: unsigned char keeps only the low 8 bits — use unsigned int for the 16-bit sum.').step(11, 'while (1); — result held forever');
  return t.done();
}

/* ============================================================
 * Program 2 — Subtraction of two 8-bit numbers
 * ============================================================ */

const SUB_A = 0x12;
const SUB_B = 0x32;

const SUB_ASM = [
  '; Subtraction of two 8-bit numbers',
  '; Inputs : 012H - 032H (borrow occurs)',
  '; Result : A = E0H with CY = 1',
  '',
  '        ORG     0000H',
  '        CLR     C            ; clear borrow first',
  '        MOV     A, #012H     ; A = minuend',
  '        SUBB    A, #032H     ; A = A - 032H - C',
  '        SJMP    $            ; hold result',
];

function subAsmSteps(): SimStep[] {
  const t = new Trace();
  const { result, flags } = subbFlags(SUB_A, SUB_B, 0);
  t.reg('PC', '0000H').step(4, 'ORG 0000H — program starts at address 0000H');
  t.setFlags({ CY: 0 }).reg('PC', '0005H').say('CLR C -> CY = 0').step(5, 'CLR C — SUBB always subtracts the borrow, so CY must be cleared first');
  t.reg('A', h8(SUB_A)).reg('PC', '0008H').say(`A <- ${h8(SUB_A)}`).step(6, `MOV A, #${h8(SUB_A)} — load the minuend (18) into A`);
  t.reg('A', h8(result))
    .setFlags(flags)
    .reg('PC', '000BH')
    .say(`SUBB A, #${h8(SUB_B)} -> A = ${h8(result)}   CY=${flags.CY} (borrow) AC=${flags.AC} OV=${flags.OV}`)
    .step(7, `SUBB — 0${h8(SUB_A).slice(0, 2)} < 0${h8(SUB_B).slice(0, 2)}, so the result borrows: A = ${h8(result)}, CY = 1`);
  t.say('Program complete — result held in A').step(8, 'SJMP $ — halt');
  return t.done();
}

const SUB_C = [
  '#include <reg51.h>',
  '',
  '/* Subtraction of two 8-bit numbers */',
  'void main(void)',
  '{',
  '    unsigned char a = 0x12;  /* minuend      */',
  '    unsigned char b = 0x32;  /* subtrahend   */',
  '    unsigned char diff;',
  '',
  '    diff = a - b;            /* 0x12 - 0x32 */',
  '',
  '    while (1);',
  '}',
];

function subCSteps(): SimStep[] {
  const t = new Trace();
  const { result, flags } = subbFlags(SUB_A, SUB_B, 0);
  t.step(0, '#include <reg51.h> — 8051 special-function-register declarations');
  t.setVars([{ name: 'a', value: h8(SUB_A) }]).say('a = 12H (18 decimal)').step(5, 'unsigned char a = 0x12 — minuend');
  t.setVars([
    { name: 'a', value: h8(SUB_A) },
    { name: 'b', value: h8(SUB_B) },
  ]).say('b = 32H (50 decimal)').step(6, 'unsigned char b = 0x32 — subtrahend');
  t.setVars([
    { name: 'a', value: h8(SUB_A) },
    { name: 'b', value: h8(SUB_B) },
    { name: 'diff', value: '--' },
  ]).step(7, 'unsigned char diff — result storage');
  t.setVars([
    { name: 'a', value: h8(SUB_A) },
    { name: 'b', value: h8(SUB_B) },
    { name: 'diff', value: h8(result) },
  ])
    .setFlags(flags)
    .say(`diff = a - b -> ${h8(result)} (wraps below zero, CY=${flags.CY} = borrow)`)
    .step(9, `diff = a - b — the CPU subtracts via SUBB; unsigned wrap gives ${h8(result)}, hardware borrow CY = ${flags.CY}`);
  t.say('Note: 0x12 - 0x32 is negative, so the byte wraps to E0H — check CY or cast to int for signed results.').step(11, 'while (1); — result held');
  return t.done();
}

/* ============================================================
 * Program 3 — Multiplication & Division of 8-bit numbers
 * ============================================================ */

const MUL_A = 0x14;
const MUL_B = 0x0f;
const DIV_A = 0x64;
const DIV_B = 0x07;

const MULDIV_ASM = [
  '; Multiplication & Division of 8-bit numbers',
  '; MUL: 14H x 0FH = 0126H  -> B:A',
  '; DIV: 64H / 07H -> A = quotient, B = remainder',
  '',
  '        ORG     0000H',
  '        MOV     A, #14H      ; multiplicand (20)',
  '        MOV     B, #0FH      ; multiplier   (15)',
  '        MUL     AB           ; B:A = 0126H, OV = 1',
  '        MOV     A, #64H      ; dividend     (100)',
  '        MOV     B, #07H      ; divisor      (7)',
  '        DIV     AB           ; A = 0EH, B = 02H',
  '        SJMP    $            ; hold results',
];

function muldivAsmSteps(): SimStep[] {
  const t = new Trace();
  const product = MUL_A * MUL_B;
  const bHigh = (product >> 8) & 0xff;
  const aLow = product & 0xff;
  const quotient = Math.floor(DIV_A / DIV_B);
  const remainder = DIV_A % DIV_B;

  t.reg('PC', '0000H').step(4, 'ORG 0000H — program start');
  t.reg('A', h8(MUL_A)).reg('PC', '0005H').say(`A <- ${h8(MUL_A)} (20)`).step(5, 'MOV A, #14H — multiplicand into the Accumulator');
  t.reg('B', h8(MUL_B)).reg('PC', '0008H').say(`B <- ${h8(MUL_B)} (15)`).step(6, 'MOV B, #0FH — multiplier into register B');
  t.reg('A', h8(aLow))
    .reg('B', h8(bHigh))
    .setFlags({ CY: 0, OV: bHigh !== 0 ? 1 : 0 })
    .reg('PC', '0009H')
    .say(`MUL AB -> B:A = ${h16(product)}   (B=${h8(bHigh)}, A=${h8(aLow)}, OV=${bHigh !== 0 ? 1 : 0})`)
    .step(7, `MUL AB — 14H x 0FH = ${h16(product)}: high byte in B, low byte in A, OV = ${bHigh !== 0 ? 1 : 0} because the product exceeds 255`);
  t.reg('A', h8(DIV_A)).reg('B', null).reg('PC', '000CH').say(`A <- ${h8(DIV_A)} (100)  [B cleared for next task]`).step(8, 'MOV A, #64H — dividend (100) into A');
  t.reg('B', h8(DIV_B)).reg('PC', '000FH').say(`B <- ${h8(DIV_B)} (7)`).step(9, 'MOV B, #0FH — divisor (7) into B');
  t.reg('A', h8(quotient))
    .reg('B', h8(remainder))
    .setFlags({ CY: 0, OV: 0 })
    .reg('PC', '0010H')
    .say(`DIV AB -> A = ${h8(quotient)} (quotient 14), B = ${h8(remainder)} (remainder 2), CY=0 OV=0`)
    .step(10, `DIV AB — 100 / 7 = ${quotient} remainder ${remainder}: quotient to A, remainder to B`);
  t.say('Program complete — quotient in A, remainder in B').step(11, 'SJMP $ — halt');
  return t.done();
}

const MULDIV_C = [
  '#include <reg51.h>',
  '',
  '/* Multiplication & Division of 8-bit numbers */',
  'void main(void)',
  '{',
  '    unsigned char x = 0x14, y = 0x0F;',
  '    unsigned char d = 0x64, e = 0x07;',
  '    unsigned int  product;',
  '    unsigned char quotient, remainder;',
  '',
  '    product   = x * y;   /* 16-bit result   */',
  '    quotient  = d / e;   /* integer division */',
  '    remainder = d % e;   /* modulo           */',
  '',
  '    while (1);',
  '}',
];

function muldivCSteps(): SimStep[] {
  const t = new Trace();
  const product = MUL_A * MUL_B;
  const quotient = Math.floor(DIV_A / DIV_B);
  const remainder = DIV_A % DIV_B;
  t.step(0, '#include <reg51.h> — 8051 SFR declarations');
  t.setVars([
    { name: 'x', value: h8(MUL_A) },
    { name: 'y', value: h8(MUL_B) },
  ]).say('x = 14H (20), y = 0FH (15)').step(5, 'unsigned char x, y — operands 20 and 15');
  t.setVars([
    { name: 'x', value: h8(MUL_A) },
    { name: 'y', value: h8(MUL_B) },
    { name: 'd', value: h8(DIV_A) },
    { name: 'e', value: h8(DIV_B) },
  ]).say('d = 64H (100), e = 07H (7)').step(6, 'unsigned char d, e — dividend 100, divisor 7');
  t.setVars([
    { name: 'x', value: h8(MUL_A) },
    { name: 'y', value: h8(MUL_B) },
    { name: 'd', value: h8(DIV_A) },
    { name: 'e', value: h8(DIV_B) },
    { name: 'product', value: '--' },
    { name: 'quotient', value: '--' },
    { name: 'remainder', value: '--' },
  ]).step(7, 'unsigned int product — 16 bits wide, holds the full multiply result');
  t.setVars([
    { name: 'x', value: h8(MUL_A) },
    { name: 'y', value: h8(MUL_B) },
    { name: 'd', value: h8(DIV_A) },
    { name: 'e', value: h8(DIV_B) },
    { name: 'product', value: h16(product) },
    { name: 'quotient', value: '--' },
    { name: 'remainder', value: '--' },
  ])
    .setFlags({ CY: 0, OV: product > 0xff ? 1 : 0 })
    .say(`product = x * y -> ${h16(product)}`)
    .step(10, `product = x * y — 20 x 15 = ${product} = ${h16(product)}; unsigned int prevents the 8-bit wrap the MUL AB instruction would need B for`);
  t.setVars([
    { name: 'x', value: h8(MUL_A) },
    { name: 'y', value: h8(MUL_B) },
    { name: 'd', value: h8(DIV_A) },
    { name: 'e', value: h8(DIV_B) },
    { name: 'product', value: h16(product) },
    { name: 'quotient', value: h8(quotient) },
    { name: 'remainder', value: '--' },
  ])
    .say(`quotient = d / e -> ${h8(quotient)} (14)`)
    .step(11, 'quotient = d / e — integer division 100 / 7, executed by DIV AB under the hood');
  t.setVars([
    { name: 'x', value: h8(MUL_A) },
    { name: 'y', value: h8(MUL_B) },
    { name: 'd', value: h8(DIV_A) },
    { name: 'e', value: h8(DIV_B) },
    { name: 'product', value: h16(product) },
    { name: 'quotient', value: h8(quotient) },
    { name: 'remainder', value: h8(remainder) },
  ])
    .say(`remainder = d % e -> ${h8(remainder)} (2)`)
    .step(12, `remainder = d % e — the leftover 2 stays in B after DIV AB`);
  t.say('Program complete — quotient 14, remainder 2').step(14, 'while (1); — hold results');
  return t.done();
}

/* ============================================================
 * Program 4 — Find largest byte in an array
 * ============================================================ */

const ARR = [0x12, 0x5a, 0x3c, 0x27, 0xf8];

const ARRAY_ASM = [
  '; Find the largest byte in an array',
  '; Array at 30H-34H : 12H 5AH 3CH 27H 0F8H',
  '; Result : A = F8H (largest), stored at 20H',
  '; (Swap JC <-> JNC to find the SMALLEST)',
  '',
  '        ORG     0000H',
  '        MOV     R0, #30H     ; R0 -> array pointer',
  '        MOV     R2, #05H     ; R2 = element count',
  '        MOV     A, @R0       ; A = largest = arr[0]',
  '        DEC     R2           ; one element done',
  'LOOP:   INC     R0           ; next element',
  '        MOV     R1, A        ; save current largest',
  '        CLR     C            ; clear borrow',
  '        SUBB    A, @R0       ; largest - arr[i]',
  '        JC      NEWMAX       ; CY=1 -> arr[i] bigger',
  '        MOV     A, R1        ; restore largest',
  '        SJMP    NEXT         ; keep old largest',
  'NEWMAX: MOV     A, @R0       ; arr[i] is new largest',
  'NEXT:   DJNZ    R2, LOOP     ; repeat for all',
  '        MOV     20H, A       ; store result in RAM',
  '        SJMP    $            ; halt',
];

function arrayAsmSteps(): SimStep[] {
  const t = new Trace();
  const cells = ARR.map((value, i) => ({ addr: h8(0x30 + i), value }));
  let max = ARR[0];
  t.reg('PC', '0000H').step(5, 'ORG 0000H — program start');
  t.reg('R0', '30H').reg('PC', '0005H').say('R0 <- 30H (pointer to first element)').step(6, 'MOV R0, #30H — R0 becomes the array pointer at RAM 30H');
  t.reg('R2', '05H').reg('PC', '0008H').say('R2 <- 05H (5 elements)').step(7, 'MOV R2, #05H — loop counter = number of elements');
  t.setMem(cells, 0).reg('A', h8(max)).reg('PC', '0009H').say(`A <- [30H] = ${h8(max)} (assume largest)`).step(8, `MOV A, @R0 — A loaded with arr[0] = ${h8(max)}; it starts as the largest`);
  t.reg('R2', '04H').reg('PC', '000AH').say('R2 <- 04H (4 comparisons left)').step(9, 'DEC R2 — first element needs no comparison');

  for (let i = 1; i < ARR.length; i++) {
    const cur = ARR[i];
    const prevMax = max;
    const cmp = subbFlags(prevMax, cur, 0);
    const bigger = cmp.flags.CY === 1;
    t.reg('PC', '000CH').say(`LOOP: R0 -> ${h8(0x30 + i)}`).step(10, `LOOP / INC R0 — pointer advances to element ${i + 1} at RAM ${h8(0x30 + i)}`);
    t.reg('R1', h8(prevMax)).reg('PC', '000FH').say(`R1 <- ${h8(prevMax)} (save candidate)`).step(11, `MOV R1, A — current largest ${h8(prevMax)} saved in R1 before the destructive SUBB`);
    t.setFlags({ CY: 0 }).reg('PC', '0010H').say('CLR C -> CY = 0').step(12, 'CLR C — prepare SUBB (no borrow in)');
    t.setMem(cells, i)
      .reg('A', h8(cmp.result))
      .setFlags(cmp.flags)
      .reg('PC', '0013H')
      .say(`SUBB A, [${h8(0x30 + i)}] = ${h8(cur)} -> A=${h8(cmp.result)}, CY=${cmp.flags.CY}`)
      .step(13, `SUBB A, @R0 — ${h8(prevMax)} - ${h8(cur)}: CY = ${cmp.flags.CY} (1 means arr[${i}] = ${h8(cur)} is larger)`);
    if (bigger) {
      max = cur;
      t.reg('PC', '0015H').say('taken -> NEWMAX').step(14, `JC NEWMAX — carry set, branch TAKEN: ${h8(cur)} beats ${h8(prevMax)}`);
      t.reg('A', h8(max)).reg('PC', '0017H').say(`A <- ${h8(max)} (new largest)`).step(17, `MOV A, @R0 — largest is now ${h8(max)}`);
    } else {
      t.reg('PC', '0015H').say('not taken -> continue').step(14, `JC NEWMAX — carry clear, branch NOT taken: ${h8(max)} is still the largest`);
      t.reg('A', h8(max)).reg('PC', '0015H').say(`A restored -> ${h8(max)}`).step(15, `MOV A, R1 — restore the unchanged largest ${h8(max)}`);
      t.reg('PC', '0016H').step(16, 'SJMP NEXT — skip the NEWMAX branch');
    }
    t.reg('R2', h8(ARR.length - 1 - i)).reg('PC', '0018H').say(`R2 <- ${h8(ARR.length - 1 - i)} (${ARR.length - i - 1} left)`).step(18, `DJNZ R2, LOOP — counter down to ${ARR.length - i - 1}, ${ARR.length - i - 1 > 0 ? 'loops again' : 'falls through'}`);
  }
  t.setMem(cells).reg('A', h8(max)).say(`LARGEST = ${h8(max)} (${max} unsigned)`).reg('PC', '001FH').step(19, `MOV 20H, A — store the largest byte ${h8(max)} into RAM location 20H`);
  t.say('Program complete').step(20, 'SJMP $ — halt. (Tip: use JNC instead of JC to track the SMALLEST)');
  return t.done();
}

const ARRAY_C = [
  '#include <reg51.h>',
  '',
  '/* Find the largest element in an array */',
  'void main(void)',
  '{',
  '    unsigned char arr[5] = {0x12, 0x5A, 0x3C, 0x27, 0xF8};',
  '    unsigned char max = arr[0];',
  '    unsigned char i;',
  '',
  '    for (i = 1; i < 5; i++) {',
  '        if (arr[i] > max)   /* unsigned compare */',
  '            max = arr[i];',
  '    }',
  '',
  '    while (1);             /* max = 0xF8 */',
  '}',
];

function arrayCSteps(): SimStep[] {
  const t = new Trace();
  const cells = ARR.map((value, i) => ({ addr: h8(0x30 + i), value }));
  let max = ARR[0];
  const v = (i: number | string, m: number) => [
    { name: 'i', value: typeof i === 'number' ? h8(i) : i },
    { name: 'max', value: h8(m) },
  ];
  t.step(0, '#include <reg51.h> — 8051 SFR declarations');
  t.setMem(cells).setVars(v(0, max)).say(`arr[] = ${ARR.map(h8).join(' ')}`).step(5, 'unsigned char arr[5] — five bytes stored in internal RAM');
  t.setVars(v(0, max)).say(`max <- ${h8(max)} (arr[0])`).step(6, 'max = arr[0] — seed the maximum with the first element');
  t.setVars(v('--', max)).step(7, 'unsigned char i — loop index');
  for (let i = 1; i < ARR.length; i++) {
    const cur = ARR[i];
    const bigger = cur > max;
    t.setMem(cells, i).setVars(v(i, max)).say(`i = ${i} -> arr[${i}] = ${h8(cur)} compared with max = ${h8(max)}`).step(9, `for loop — examine element ${i + 1}: ${h8(cur)} ${bigger ? '>' : '<='} ${h8(max)}?`);
    if (bigger) {
      t.setMem(cells, i).setVars(v(i, max)).step(10, `if (arr[i] > max) — TRUE: ${h8(cur)} is bigger than ${h8(max)}`);
      max = cur;
      t.setVars(v(i, max)).say(`max <- ${h8(max)}`).step(11, `max = arr[i] — new maximum ${h8(max)}`);
    } else {
      t.setMem(cells, i).setVars(v(i, max)).say(`keep max = ${h8(max)}`).step(10, `if (arr[i] > max) — FALSE: ${h8(max)} stays the largest`);
      t.step(12, 'max unchanged — skip the assignment, loop continues');
    }
  }
  t.setMem(cells).setVars(v(5, max)).say(`LARGEST = ${h8(max)} (${max} unsigned)`).step(12, 'for loop finished — all five elements scanned');
  t.say('Program complete (for the SMALLEST, change > to <)').step(14, 'while (1); — hold the result');
  return t.done();
}

/* ============================================================
 * Program 5 — Flashing LED on P1.0
 * ============================================================ */

const FLASH_ASM = [
  '; Flashing LED on P1.0',
  '; Wire an LED + resistor from P1.0 to GND',
  '',
  '        ORG     0000H',
  'LOOP:   SETB    P1.0         ; LED ON',
  '        ACALL   DELAY        ; wait about 200 ms',
  '        CLR     P1.0         ; LED OFF',
  '        ACALL   DELAY        ; wait about 200 ms',
  '        SJMP    LOOP         ; repeat forever',
  '',
  'DELAY:  MOV     R7, #00H     ; 256 iterations',
  'D1:     DJNZ    R7, D1       ; spin loop',
  '        RET',
];

function flashAsmSteps(): SimStep[] {
  const t = new Trace();
  t.reg('PC', '0000H').step(3, 'ORG 0000H — program start');
  t.setPort(0x01).reg('PC', '0005H').say('SETB P1.0 -> P1 = 01H  (LED ON)').step(4, 'SETB P1.0 — pin P1.0 goes HIGH, current flows through the LED');
  t.reg('PC', '0008H').say('delay ~200 ms ...').step(5, 'ACALL DELAY — 256 x DJNZ spin loop ≈ 200 ms of visible ON time');
  t.setPort(0x00).reg('PC', '000BH').say('CLR P1.0 -> P1 = 00H  (LED OFF)').step(6, 'CLR P1.0 — pin P1.0 goes LOW, the LED turns off');
  t.reg('PC', '000EH').say('delay ~200 ms ...').step(7, 'ACALL DELAY — keeps the OFF state visible for ~200 ms');
  t.reg('PC', '0010H').say('loop -> SETB P1.0').step(8, 'SJMP LOOP — jump back; the LED now blinks continuously', 4);
  return t.done();
}

const FLASH_C = [
  '#include <reg51.h>',
  '',
  'sbit LED = P1^0;            /* LED on P1.0 */',
  '',
  'void delay(unsigned int n)',
  '{',
  '    while (n--);            /* busy-wait   */',
  '}',
  '',
  'void main(void)',
  '{',
  '    while (1) {',
  '        LED = 1;            /* LED ON      */',
  '        delay(60000);       /* ~200 ms     */',
  '        LED = 0;            /* LED OFF     */',
  '        delay(60000);       /* ~200 ms     */',
  '    }',
  '}',
];

function flashCSteps(): SimStep[] {
  const t = new Trace();
  t.step(0, '#include <reg51.h> — declares sbit and the P1 SFR');
  t.setPort(0x00).say('LED = P1.0').step(2, 'sbit LED = P1^0; — names pin P1.0 as the variable LED');
  t.step(9, 'void main(void) — program entry');
  t.setPort(0x01).say('LED = 1 -> P1 = 01H (ON)').step(12, 'LED = 1 — bit-bang P1.0 HIGH, the LED lights');
  t.step(13, 'delay(60000) — while(n--) burns ~200 ms keeping the LED ON');
  t.setPort(0x00).say('LED = 0 -> P1 = 00H (OFF)').step(14, 'LED = 0 — pin LOW, LED off');
  t.step(15, 'delay(60000) — pause with the LED dark', 12);
  return t.done();
}

/* ============================================================
 * Program 6 — Alternate LED flashing on Port 1
 * ============================================================ */

const ALT_ASM = [
  '; Alternate LED flashing on Port 1',
  '; Odd LEDs and even LEDs blink alternately',
  '; 0AAH = 1010 1010 , 055H = 0101 0101',
  '',
  '        ORG     0000H',
  'LOOP:   MOV     P1, #0AAH    ; odd LEDs ON',
  '        ACALL   DELAY        ; wait',
  '        MOV     P1, #055H    ; even LEDs ON',
  '        ACALL   DELAY        ; wait',
  '        SJMP    LOOP         ; repeat forever',
  '',
  'DELAY:  MOV     R7, #00H',
  'D1:     DJNZ    R7, D1',
  '        RET',
];

function altAsmSteps(): SimStep[] {
  const t = new Trace();
  t.reg('PC', '0000H').step(4, 'ORG 0000H — program start');
  t.setPort(0xaa).reg('PC', '0007H').say('P1 <- 0AAH = 1010 1010 (odd LEDs ON)').step(5, 'MOV P1, #0AAH — lights P1.7, P1.5, P1.3, P1.1');
  t.reg('PC', '000AH').say('delay ~200 ms ...').step(6, 'ACALL DELAY — hold this pattern briefly');
  t.setPort(0x55).reg('PC', '000DH').say('P1 <- 055H = 0101 0101 (even LEDs ON)').step(7, 'MOV P1, #055H — lights P1.6, P1.4, P1.2, P1.0: the alternate pattern');
  t.reg('PC', '0010H').say('delay ~200 ms ...').step(8, 'ACALL DELAY — hold the second pattern');
  t.reg('PC', '0012H').say('loop -> MOV P1, #0AAH').step(9, 'SJMP LOOP — cycle the two patterns forever, giving the "running lights" effect', 5);
  return t.done();
}

const ALT_C = [
  '#include <reg51.h>',
  '',
  '/* Alternate LED flashing on Port 1 */',
  '',
  'void delay(unsigned int n)',
  '{',
  '    while (n--);',
  '}',
  '',
  'void main(void)',
  '{',
  '    while (1) {',
  '        P1 = 0xAA;          /* 1010 1010 — odd ON  */',
  '        delay(60000);',
  '        P1 = 0x55;          /* 0101 0101 — even ON */',
  '        delay(60000);',
  '    }',
  '}',
];

function altCSteps(): SimStep[] {
  const t = new Trace();
  t.step(0, '#include <reg51.h> — P1 declared as a byte-wide SFR');
  t.setPort(0x00).step(9, 'void main(void) — program entry');
  t.setPort(0xaa).say('P1 = 0AAH (1010 1010)').step(12, 'P1 = 0xAA — writing the byte lights every second LED (odd positions)');
  t.step(13, 'delay(60000) — pause so the pattern is visible');
  t.setPort(0x55).say('P1 = 055H (0101 0101)').step(14, 'P1 = 0x55 — the complementary byte: even LEDs light instead');
  t.step(15, 'delay(60000) — pause again', 12);
  return t.done();
}

/* ============================================================
 * Program 7 — Buzzer ON/OFF using 8051
 * ============================================================ */

const BUZZ_ASM = [
  '; Buzzer ON/OFF control',
  '; Buzzer (via transistor) from P1.7 to VCC',
  '',
  '        ORG     0000H',
  'LOOP:   SETB    P1.7         ; buzzer ON',
  '        ACALL   DELAY        ; sound ~300 ms',
  '        CLR     P1.7         ; buzzer OFF',
  '        ACALL   DELAY        ; pause ~300 ms',
  '        SJMP    LOOP         ; repeat forever',
  '',
  'DELAY:  MOV     R7, #00H',
  'D1:     DJNZ    R7, D1',
  '        RET',
];

function buzzAsmSteps(): SimStep[] {
  const t = new Trace();
  t.reg('PC', '0000H').step(3, 'ORG 0000H — program start');
  t.setPort(0x80).setBuzzer(true).reg('PC', '0005H').say('SETB P1.7 -> buzzer ON (P1 = 80H)').step(4, 'SETB P1.7 — pin P1.7 HIGH drives the transistor, the buzzer sounds');
  t.reg('PC', '0008H').say('buzzer sounding ~300 ms ...').step(5, 'ACALL DELAY — the ON tone lasts ~300 ms');
  t.setPort(0x00).setBuzzer(false).reg('PC', '000BH').say('CLR P1.7 -> buzzer OFF (P1 = 00H)').step(6, 'CLR P1.7 — pin LOW, the buzzer stops');
  t.reg('PC', '000EH').say('silence ~300 ms ...').step(7, 'ACALL DELAY — pause between beeps');
  t.reg('PC', '0010H').say('loop -> SETB P1.7').step(8, 'SJMP LOOP — repeat forever for a regular beep-beep alert', 4);
  return t.done();
}

const BUZZ_C = [
  '#include <reg51.h>',
  '',
  'sbit BUZZ = P1^7;           /* buzzer on P1.7 */',
  '',
  'void delay(unsigned int n)',
  '{',
  '    while (n--);',
  '}',
  '',
  'void main(void)',
  '{',
  '    while (1) {',
  '        BUZZ = 1;           /* buzzer ON  */',
  '        delay(90000);       /* ~300 ms    */',
  '        BUZZ = 0;           /* buzzer OFF */',
  '        delay(90000);       /* ~300 ms    */',
  '    }',
  '}',
];

function buzzCSteps(): SimStep[] {
  const t = new Trace();
  t.step(0, '#include <reg51.h> — declares sbit and the P1 SFR');
  t.setPort(0x00).setBuzzer(false).say('BUZZ = P1.7').step(2, 'sbit BUZZ = P1^7; — names pin P1.7 as BUZZ');
  t.step(9, 'void main(void) — program entry');
  t.setPort(0x80).setBuzzer(true).say('BUZZ = 1 -> P1 = 80H (ON)').step(12, 'BUZZ = 1 — pin HIGH, transistor conducts, buzzer sounds');
  t.step(13, 'delay(90000) — tone held for ~300 ms');
  t.setPort(0x00).setBuzzer(false).say('BUZZ = 0 -> P1 = 00H (OFF)').step(14, 'BUZZ = 0 — pin LOW, buzzer silent');
  t.step(15, 'delay(90000) — silence for ~300 ms', 12);
  return t.done();
}

/* ============================================================
 * Program table
 * ============================================================ */

const variant = (lang: 'asm' | 'c', code: string[], steps: SimStep[]): ProgramVariant => ({ lang, code, steps });

export const PROGRAMS: ProgramItem[] = [
  {
    id: 'add',
    title: 'Addition of Two 8-bit Numbers',
    summary: 'Load two bytes into A and R0, add them and inspect the result plus the CY / AC / OV flags.',
    iconName: 'Plus',
    asm: variant('asm', ADD_ASM, addAsmSteps()),
    c: variant('c', ADD_C, addCSteps()),
  },
  {
    id: 'sub',
    title: 'Subtraction of Two 8-bit Numbers',
    summary: 'Clear the borrow, then SUBB — watch how an unsigned underflow sets CY and wraps the result.',
    iconName: 'Minus',
    asm: variant('asm', SUB_ASM, subAsmSteps()),
    c: variant('c', SUB_C, subCSteps()),
  },
  {
    id: 'muldiv',
    title: 'Multiplication & Division of 8-bit Numbers',
    summary: 'MUL AB spreads a 16-bit product across B:A; DIV AB puts quotient in A and remainder in B.',
    iconName: 'Calculator',
    asm: variant('asm', MULDIV_ASM, muldivAsmSteps()),
    c: variant('c', MULDIV_C, muldivCSteps()),
  },
  {
    id: 'array',
    title: 'Find Largest (or Smallest) in an Array',
    summary: 'Scan five bytes in internal RAM at 30H–34H with SUBB + JC, keeping the largest in A.',
    iconName: 'ArrowUpDown',
    asm: variant('asm', ARRAY_ASM, arrayAsmSteps()),
    c: variant('c', ARRAY_C, arrayCSteps()),
  },
  {
    id: 'flash',
    title: 'Flashing LED',
    summary: 'Toggle P1.0 with a delay loop — the classic “hello world” of embedded systems.',
    iconName: 'Lightbulb',
    asm: variant('asm', FLASH_ASM, flashAsmSteps()),
    c: variant('c', FLASH_C, flashCSteps()),
  },
  {
    id: 'alternate',
    title: 'Alternate LED Flashing',
    summary: 'Drive Port 1 with 0AAH ↔ 055H so odd and even LEDs take turns blinking.',
    iconName: 'ArrowLeftRight',
    asm: variant('asm', ALT_ASM, altAsmSteps()),
    c: variant('c', ALT_C, altCSteps()),
  },
  {
    id: 'buzzer',
    title: 'Buzzer ON/OFF Using 8051',
    summary: 'Set and clear P1.7 with timed pauses to produce a regular beep-beep alert pattern.',
    iconName: 'Volume2',
    asm: variant('asm', BUZZ_ASM, buzzAsmSteps()),
    c: variant('c', BUZZ_C, buzzCSteps()),
  },
];
