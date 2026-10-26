export interface ArchitectureBlock {
  id: string;
  name: string;
  shortName: string;
  category: 'cpu' | 'memory' | 'peripherals' | 'control';
  categoryLabel: string;
  bitWidth: string;
  sfrAddress?: string;
  functionDescription: string;
  exampleUseCase: string;
  bulletPoints: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  badge: string;
  summary: string;
  details: string;
  iconName: string;
}

export type InstructionCategory =
  | 'data-transfer'
  | 'arithmetic'
  | 'logical'
  | 'bit-boolean'
  | 'program-branching';

export interface Instruction {
  id: string;
  /** Assembly mnemonic with operands, e.g. "MOV A, #data" */
  mnemonic: string;
  category: InstructionCategory;
  /** Opcode byte(s), e.g. "74" or "E8–EF" for register-bank ranges */
  opcode: string;
  /** Addressing mode used by the source operand, e.g. "Immediate" */
  addressingMode: string;
  /** Length in program memory bytes */
  bytes: number;
  /** Execution time in machine cycles (1 cycle = 12 oscillator periods) */
  machineCycles: number;
  /** Status flags modified by the instruction (P is omitted — it auto-updates with A) */
  flagsAffected: string[];
  description: string;
  example: string;
}

/** One clickable bit inside a Special Function Register diagram */
export interface RegisterBit {
  /** Bit index 7 … 0 */
  position: number;
  /** Bit name shown in the cell, or null for a reserved bit */
  name: string | null;
  description: string;
  /** Visual grouping used for cell colouring */
  group: 'timer0' | 'timer1' | 'flag' | 'control' | 'interrupt' | 'serial' | 'reserved';
}

/** Special Function Register with an interactive 8-bit diagram */
export interface SpecialRegister {
  id: string;
  name: string;
  /** Hex address, e.g. "89H" */
  address: string;
  /** Short explanation of what the register controls */
  purpose: string;
  /** Exactly 8 entries, ordered bit 7 → bit 0 */
  bits: RegisterBit[];
}

/** Timer/counter operating mode */
export interface TimerMode {
  id: string;
  modeNumber: 0 | 1 | 2 | 3;
  name: string;
  counterSize: string;
  summary: string;
  details: string;
  typicalUse: string;
  reloadExample: string;
}

/** One of the five 8051 interrupt sources */
export interface InterruptSource {
  /** Natural (fixed) priority: 1 = highest */
  naturalPriority: number;
  name: string;
  /** ROM vector address */
  vector: string;
  /** IE register enable bit */
  ieBit: string;
  /** IP register priority bit */
  ipBit: string;
  /** Hardware flag that requests the interrupt */
  requestFlag: string;
  description: string;
}

/** Serial port operating mode */
export interface SerialMode {
  id: string;
  /** SM0/SM1 encoding */
  smBits: string;
  name: string;
  frameFormat: string;
  baudRate: string;
  description: string;
  typicalUse: string;
}

/** One row of the baud-rate lookup table */
export interface BaudRateRow {
  baud: string;
  th1: string;
  smod: string;
  note: string;
}
