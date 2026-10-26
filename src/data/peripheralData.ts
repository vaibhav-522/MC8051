import type {
  BaudRateRow,
  InterruptSource,
  SerialMode,
  SpecialRegister,
  TimerMode,
} from '../types';

/* ============================================================ */
/* SPECIAL FUNCTION REGISTERS                                   */
/* ============================================================ */

export const TMOD_REGISTER: SpecialRegister = {
  id: 'tmod',
  name: 'TMOD',
  address: '89H',
  purpose:
    'Timer Mode Register — configures both timers at once. The high nibble (bits 7–4) configures Timer 1, the low nibble (bits 3–0) configures Timer 0. TMOD is NOT bit-addressable, so it is always written as a whole byte.',
  bits: [
    {
      position: 7,
      name: 'GATE1',
      group: 'timer1',
      description:
        'Timer 1 gate control. When 0, Timer 1 runs purely under software control of TR1 (TCON.6). When 1, Timer 1 also requires the INT1# pin (P3.3) to be high — used to measure external pulse widths.',
    },
    {
      position: 6,
      name: 'C/T1',
      group: 'timer1',
      description:
        'Timer/Counter 1 select. 0 = Timer mode (counts internal machine cycles, ÷12 of fosc). 1 = Counter mode (counts falling edges on the T1 pin, P3.5).',
    },
    {
      position: 5,
      name: 'M11',
      group: 'timer1',
      description: 'Timer 1 mode bit 1. With M01 (bit 4) selects the operating mode: 00 = Mode 0, 01 = Mode 1, 10 = Mode 2, 11 = Mode 3.',
    },
    {
      position: 4,
      name: 'M01',
      group: 'timer1',
      description: 'Timer 1 mode bit 0. See M11 above for the encoding. Exam favourite: Mode 2 (8-bit auto-reload) is the standard baud-rate generator for the serial port.',
    },
    {
      position: 3,
      name: 'GATE0',
      group: 'timer0',
      description:
        'Timer 0 gate control. When 1, Timer 0 runs only while the INT0# pin (P3.2) is high AND TR0 = 1 — the classic pulse-width measurement setup.',
    },
    {
      position: 2,
      name: 'C/T0',
      group: 'timer0',
      description:
        'Timer/Counter 0 select. 0 = Timer mode (counts machine cycles). 1 = Counter mode (counts falling edges on the T0 pin, P3.4).',
    },
    {
      position: 1,
      name: 'M10',
      group: 'timer0',
      description: 'Timer 0 mode bit 1. With M00 (bit 0) selects the mode: 00 = Mode 0 (13-bit), 01 = Mode 1 (16-bit), 10 = Mode 2 (8-bit auto-reload), 11 = Mode 3 (split).',
    },
    {
      position: 0,
      name: 'M00',
      group: 'timer0',
      description: 'Timer 0 mode bit 0. See M10 above. Reset value of TMOD is 00H, so after reset both timers are 13-bit timers counting machine cycles.',
    },
  ],
};

export const TCON_REGISTER: SpecialRegister = {
  id: 'tcon',
  name: 'TCON',
  address: '88H',
  purpose:
    'Timer Control Register — starts/stops the timers, holds the overflow flags and configures/flags the two external interrupts. TCON is bit-addressable (e.g. SETB TR0).',
  bits: [
    {
      position: 7,
      name: 'TF1',
      group: 'flag',
      description:
        'Timer 1 Overflow Flag. Set automatically when Timer 1 overflows (rolls over from its max value); cleared by hardware when the CPU vectors to the ISR at 001BH, or by software. Requests the Timer 1 interrupt when ET1 = 1.',
    },
    {
      position: 6,
      name: 'TR1',
      group: 'control',
      description:
        'Timer 1 Run Control. Set (SETB TR1) to start Timer 1, clear it to stop. If GATE1 = 1, the INT1# pin must also be high.',
    },
    {
      position: 5,
      name: 'TF0',
      group: 'flag',
      description:
        'Timer 0 Overflow Flag. Set automatically when Timer 0 overflows; cleared on hardware vectoring to 000BH or by software. Requests the Timer 0 interrupt when ET0 = 1.',
    },
    {
      position: 4,
      name: 'TR0',
      group: 'control',
      description: 'Timer 0 Run Control. Set (SETB TR0) to start Timer 0, clear it to stop. The standard way to begin a delay routine.',
    },
    {
      position: 3,
      name: 'IE1',
      group: 'flag',
      description:
        'External Interrupt 1 Flag. In edge mode it is set when a falling edge is detected on INT1# and cleared automatically when the ISR is entered. In level mode it follows the INT1# pin level.',
    },
    {
      position: 2,
      name: 'IT1',
      group: 'control',
      description:
        'Interrupt 1 Type select. 0 = low-level triggered (INT1# held low keeps requesting). 1 = falling-edge triggered (single request per press).',
    },
    {
      position: 1,
      name: 'IE0',
      group: 'flag',
      description:
        'External Interrupt 0 Flag. Set on a falling edge at INT0# in edge mode; cleared by hardware when vectoring to 0003H.',
    },
    {
      position: 0,
      name: 'IT0',
      group: 'control',
      description: 'Interrupt 0 Type select. 0 = low-level triggered, 1 = falling-edge triggered on INT0# (P3.2). Edge mode is typical for push-buttons.',
    },
  ],
};

export const IE_REGISTER: SpecialRegister = {
  id: 'ie',
  name: 'IE',
  address: 'A8H',
  purpose:
    'Interrupt Enable Register — each source has its own enable bit, plus the master switch EA. IE is bit-addressable, so single bits can be set with SETB (e.g. SETB ET0).',
  bits: [
    {
      position: 7,
      name: 'EA',
      group: 'interrupt',
      description:
        'Master Interrupt Enable. When EA = 0 NO interrupt is acknowledged regardless of the individual bits — check this first in every "interrupts do not work" debugging session.',
    },
    { position: 6, name: null, group: 'reserved', description: 'Reserved — not implemented on the classic 8051. Leave as 0.' },
    {
      position: 5,
      name: 'ES',
      group: 'interrupt',
      description: 'Serial Port Interrupt Enable. Enables the shared RI/TI interrupt (vector 0023H). Check which flag fired inside the ISR — the hardware does not clear either one.',
    },
    {
      position: 4,
      name: 'ET1',
      group: 'interrupt',
      description: 'Timer 1 Interrupt Enable. Allows TF1 (TCON.7) to trigger the ISR at vector 001BH.',
    },
    {
      position: 3,
      name: 'EX1',
      group: 'interrupt',
      description: 'External Interrupt 1 Enable. Allows INT1# (P3.3) events to trigger the ISR at vector 0013H.',
    },
    {
      position: 2,
      name: 'ET0',
      group: 'interrupt',
      description: 'Timer 0 Interrupt Enable. Allows TF0 (TCON.5) to trigger the ISR at vector 000BH — used by every timer-based delay or event counter.',
    },
    {
      position: 1,
      name: 'EX0',
      group: 'interrupt',
      description: 'External Interrupt 0 Enable. Allows INT0# (P3.2) events to trigger the ISR at vector 0003H — the highest-priority source.',
    },
    { position: 0, name: null, group: 'reserved', description: 'Reserved — not implemented on the classic 8051. Leave as 0.' },
  ],
};

export const IP_REGISTER: SpecialRegister = {
  id: 'ip',
  name: 'IP',
  address: 'B8H',
  purpose:
    'Interrupt Priority Register — each source can be placed in the high or low priority group. With only two programmable levels the effective ranking is (high group first, in natural order) then (low group, in natural order).',
  bits: [
    { position: 7, name: null, group: 'reserved', description: 'Reserved — leave as 0.' },
    { position: 6, name: null, group: 'reserved', description: 'Reserved — leave as 0.' },
    {
      position: 5,
      name: 'PS',
      group: 'interrupt',
      description: 'Serial Port Priority. PS = 1 raises the RI/TI interrupt into the high-priority group.',
    },
    {
      position: 4,
      name: 'PT1',
      group: 'interrupt',
      description: 'Timer 1 Priority. PT1 = 1 raises the Timer 1 interrupt above all low-priority sources.',
    },
    {
      position: 3,
      name: 'PX1',
      group: 'interrupt',
      description: 'External Interrupt 1 Priority. PX1 = 1 places INT1# handling in the high-priority group.',
    },
    {
      position: 2,
      name: 'PT0',
      group: 'interrupt',
      description: 'Timer 0 Priority. PT0 = 1 lets a timer-based task preempt lower-priority interrupts.',
    },
    {
      position: 1,
      name: 'PX0',
      group: 'interrupt',
      description: 'External Interrupt 0 Priority. PX0 = 1 gives INT0# the highest standing of all sources.',
    },
    { position: 0, name: null, group: 'reserved', description: 'Reserved — leave as 0.' },
  ],
};

export const SCON_REGISTER: SpecialRegister = {
  id: 'scon',
  name: 'SCON',
  address: '98H',
  purpose:
    'Serial Control Register — selects the operating mode, enables reception, holds the 9th data bit for 9-bit modes and carries the TI/RI interrupt flags. SCON is bit-addressable.',
  bits: [
    {
      position: 7,
      name: 'SM0',
      group: 'serial',
      description: 'Serial Mode bit 0. Together with SM1 selects the mode: 00 = Mode 0 (shift register), 01 = Mode 1 (8-bit UART), 10 = Mode 2 (9-bit UART, fixed baud), 11 = Mode 3 (9-bit UART, Timer 1 baud).',
    },
    {
      position: 6,
      name: 'SM1',
      group: 'serial',
      description: 'Serial Mode bit 1. See SM0 above. Modes 1 and 3 are the everyday UART modes; mode 0 is used for synchronous I/O expansion.',
    },
    {
      position: 5,
      name: 'SM2',
      group: 'serial',
      description:
        'Multi-Processor Communication Enable (modes 2/3). When SM2 = 1, RI is only set if the received 9th bit (RB8) = 1 — an "address byte" convention that lets several microcontrollers share one serial line.',
    },
    {
      position: 4,
      name: 'REN',
      group: 'serial',
      description: 'Receive Enable. REN = 1 allows the serial port to accept a frame; reception is blocked while REN = 0. SETB REN before waiting for RI.',
    },
    {
      position: 3,
      name: 'TB8',
      group: 'serial',
      description: 'Transmit Bit 8. The 9th bit sent in modes 2/3 — commonly used as a parity bit (e.g. MOV C, P followed by MOV TB8, C) or as the address/data marker in multi-processor schemes.',
    },
    {
      position: 2,
      name: 'RB8',
      group: 'serial',
      description:
        'Receive Bit 8. Holds the 9th bit received in modes 2/3; in mode 1 it carries the stop bit. Read it after RI fires.',
    },
    {
      position: 1,
      name: 'TI',
      group: 'flag',
      description:
        'Transmit Interrupt Flag. Set by hardware after the final stop bit has left the shift register; the CPU vectors to 0023H if ES = EA = 1. Cleared only by software (before writing the next byte to SBUF).',
    },
    {
      position: 0,
      name: 'RI',
      group: 'flag',
      description:
        'Receive Interrupt Flag. Set by hardware when a complete frame has been shifted into SBUF; cleared only by software after reading SBUF.',
    },
  ],
};

/* ============================================================ */
/* TIMER MODES                                                  */
/* ============================================================ */

export const TIMER_MODES: TimerMode[] = [
  {
    id: 'mode-0',
    modeNumber: 0,
    name: 'Mode 0 — 13-Bit Timer',
    counterSize: '13-bit (TH 8 bits + TL low 5 bits)',
    summary:
      'The original 8051 mode: an 8-bit TH register plus only the lower 5 bits of TL, giving a modulus of 8192 counts.',
    details:
      'On overflow (TL and the 5-bit field roll over, carrying into TH) TF is set and TL is reloaded with 0. Kept mainly for backward compatibility with legacy 8051 firmware.',
    typicalUse:
      'Legacy code and exam questions about the original architecture — new designs almost always use mode 1 or 2.',
    reloadExample:
      'Example (12 MHz, 1 ms delay): 8192 − 1000 = 7192 = 1C18H → the low 5 bits of TL start at 18H and TH = 1CH.',
  },
  {
    id: 'mode-1',
    modeNumber: 1,
    name: 'Mode 1 — 16-Bit Timer',
    counterSize: '16-bit (TH:TL full registers)',
    summary:
      'Full 16-bit counting from 0000H to FFFFH — the workhorse mode for generating precise time delays.',
    details:
      'The count value = 65536 − (TH×256 + TL). When the register rolls over past FFFFH, TF is set (triggering the timer interrupt) and the CPU must reload the initial values in software if another interval is needed.',
    typicalUse:
      'Millisecond delays, event timing, and periodic interrupts — by far the most-examined mode.',
    reloadExample:
      'Example (12 MHz → 1 µs per count, 10 ms interval): 65536 − 10000 = 55536 = D8F0H → MOV TH0, #0D8H / MOV TL0, #0F0H.',
  },
  {
    id: 'mode-2',
    modeNumber: 2,
    name: 'Mode 2 — 8-Bit Auto-Reload',
    counterSize: '8-bit (TL counts, TH holds the reload value)',
    summary:
      'TL counts up to FFH and on overflow automatically copies TH back into TL — no software reload needed, so the period never drifts.',
    details:
      'Interval = (256 − TH) counts. Because the hardware reloads TH into TL the moment TL overflows, this mode produces a perfectly periodic signal — ideal for baud-rate generation.',
    typicalUse:
      'Serial baud-rate generator (TH1 = FDH gives 9600 baud at 11.0592 MHz with SMOD = 0) and continuous square-wave generation on a pin.',
    reloadExample:
      'Example (12 MHz, 100 µs period): 256 − 100 = 156 = 9CH → MOV TH0, #9CH / MOV TL0, #9CH.',
  },
  {
    id: 'mode-3',
    modeNumber: 3,
    name: 'Mode 3 — Split 8-Bit (Timer 0 only)',
    counterSize: 'Two independent 8-bit timers (TH0 and TL0)',
    summary:
      'Timer 0 splits into two separate 8-bit timers: TL0 uses TF0/TR0, TH0 uses TF1/TR1. Timer 1 in mode 3 simply holds its count.',
    details:
      'The split lets one chip run two short intervals at once, or keep Timer 1 free to generate the serial baud rate while Timer 0 provides two event counters. Remember TH0 then "borrows" the Timer 1 overflow flag and run bit.',
    typicalUse:
      'Baud-rate generation on Timer 1 (modes 2 or 3) while still needing two 8-bit timing/event channels on Timer 0.',
    reloadExample:
      'Setup example: MOV TMOD, #27H → Timer 0 mode 3 (split) + Timer 1 mode 2 as the serial baud generator.',
  },
];

/* ============================================================ */
/* INTERRUPT SOURCES                                            */
/* ============================================================ */

export const INTERRUPT_SOURCES: InterruptSource[] = [
  {
    naturalPriority: 1,
    name: 'External Interrupt 0 (INT0#)',
    vector: '0003H',
    ieBit: 'EX0',
    ipBit: 'PX0',
    requestFlag: 'IE0 (TCON.1)',
    description:
      'Falling edge or low level on pin P3.2. Highest natural priority — the go-to interrupt for emergency inputs like emergency-stop buttons.',
  },
  {
    naturalPriority: 2,
    name: 'Timer 0 Overflow (TF0)',
    vector: '000BH',
    ieBit: 'ET0',
    ipBit: 'PT0',
    requestFlag: 'TF0 (TCON.5)',
    description:
      'Timer 0 rolled over past FFFFH (mode 1) or FFH (modes 0/2). Basis of all periodic timer interrupts and delay-without-blocking code.',
  },
  {
    naturalPriority: 3,
    name: 'External Interrupt 1 (INT1#)',
    vector: '0013H',
    ieBit: 'EX1',
    ipBit: 'PX1',
    requestFlag: 'IE1 (TCON.3)',
    description: 'Falling edge or low level on pin P3.3. Same behaviour and configuration as INT0, one step lower in the natural order.',
  },
  {
    naturalPriority: 4,
    name: 'Timer 1 Overflow (TF1)',
    vector: '001BH',
    ieBit: 'ET1',
    ipBit: 'PT1',
    requestFlag: 'TF1 (TCON.7)',
    description:
      'Timer 1 rolled over. Often used as a periodic tick while Timer 1 itself is busy as the baud-rate generator (in that case the flag is ignored and only TR1 matters).',
  },
  {
    naturalPriority: 5,
    name: 'Serial Port (RI or TI)',
    vector: '0023H',
    ieBit: 'ES',
    ipBit: 'PS',
    requestFlag: 'RI (SCON.0) or TI (SCON.1)',
    description:
      'One shared vector for both directions: the ISR must test TI and RI to learn what happened and clear the flag it handled in software.',
  },
];

/* ============================================================ */
/* SERIAL MODES & BAUD RATES                                    */
/* ============================================================ */

export const SERIAL_MODES: SerialMode[] = [
  {
    id: 'serial-mode-0',
    smBits: 'SM0 SM1 = 00',
    name: 'Mode 0 — Synchronous Shift Register',
    frameFormat: '8 data bits on RXD; TXD outputs the shift clock',
    baudRate: 'Fixed at fosc / 12',
    description:
      'Not an asynchronous UART mode at all: data is shifted out LSB-first on RXD while TXD carries a clock at fosc/12. Bytes are shifted in and out simultaneously (full duplex at the pin level).',
    typicalUse:
      'Cheap I/O expansion with external shift registers such as the 74HC595 — the classic way to drive LED displays from three pins.',
  },
  {
    id: 'serial-mode-1',
    smBits: 'SM0 SM1 = 01',
    name: 'Mode 1 — 8-Bit UART',
    frameFormat: '1 start bit + 8 data bits + 1 stop bit (10 bits total)',
    baudRate: 'Timer 1 (mode 2) overflow rate × 2^SMOD / 32',
    description:
      'The everyday asynchronous mode. A byte written to SBUF is framed with start/stop bits and shifted out on TXD; a full frame received on RXD lands in SBUF and raises RI.',
    typicalUse:
      'PC/USB-serial communication, GPS modules, Bluetooth HC-05 modules, debug console output.',
  },
  {
    id: 'serial-mode-2',
    smBits: 'SM0 SM1 = 10',
    name: 'Mode 2 — 9-Bit UART (Fixed Baud)',
    frameFormat: '1 start bit + 8 data bits + 9th bit (TB8/RB8) + 1 stop bit',
    baudRate: 'Fixed: fosc/64 with SMOD = 0, fosc/32 with SMOD = 1',
    description:
      'Adds a programmable 9th bit, usually sent as even parity (the 8051 sets P automatically) or as an address/data marker for multi-processor networks. No timer needed for the baud rate.',
    typicalUse:
      'Multi-drop RS-485 networks where an address byte must be distinguished from data bytes using SM2/RB8.',
  },
  {
    id: 'serial-mode-3',
    smBits: 'SM0 SM1 = 11',
    name: 'Mode 3 — 9-Bit UART (Timer Baud)',
    frameFormat: '1 start bit + 8 data bits + 9th bit (TB8/RB8) + 1 stop bit',
    baudRate: 'Timer 1 overflow rate × 2^SMOD / 32 (any standard rate)',
    description:
      'Mode 2\'s 9-bit frame with mode 1\'s flexible timer-generated baud rate — the best of both. TI and RI behave exactly as in the other UART modes.',
    typicalUse:
      '9-bit communication at custom baud rates; parity-checked links to other microcontrollers.',
  },
];

/** Common baud rates with Timer 1 mode 2 reload values at 11.0592 MHz. */
export const BAUD_TABLE: BaudRateRow[] = [
  { baud: '9600', th1: 'FDH', smod: '0', note: 'The classic default — crystal chosen so the division is exact' },
  { baud: '4800', th1: 'FAH', smod: '0', note: 'Doubled reload period of the 9600 setup' },
  { baud: '2400', th1: 'F4H', smod: '0', note: 'Reliable over long RS-232 cable runs' },
  { baud: '1200', th1: 'E8H', smod: '0', note: 'Long-distance / low-power links' },
  { baud: '19200', th1: 'FDH', smod: '1', note: 'Same TH1 as 9600, with PCON.7 (SMOD) doubling the baud' },
  { baud: '38400', th1: 'FAH', smod: '1', note: 'SMOD = 1 doubling of the 4800 setup' },
];

/* ============================================================ */
/* I/O PORTS                                                    */
/* ============================================================ */

export interface PortInfo {
  id: string;
  name: string;
  alternateLabel: string;
  specialFunction: string;
  pinStructure: string;
  examNote: string;
}

export const PORTS: PortInfo[] = [
  {
    id: 'port-0',
    name: 'Port 0 (P0)',
    alternateLabel: 'AD0 – AD7',
    specialFunction:
      'Multiplexed low-byte address/data bus during external memory access (with ALE strobing the address out on P0 first).',
    pinStructure:
      'True open-drain: P0 has NO internal pull-ups. As general I/O it needs external pull-up resistors; writing 1 turns both output FETs off and the pin floats.',
    examNote:
      'The only port without internal pull-ups — that is why external RAM designs always show resistor packs on P0.',
  },
  {
    id: 'port-1',
    name: 'Port 1 (P1)',
    alternateLabel: 'P1.0 – P1.7',
    specialFunction:
      'Pure general-purpose I/O. P1.5, P1.6 and P1.7 double as the SPI programming pins (MOSI/MISO/SCK) on AT89S-series chips.',
    pinStructure:
      'Quasi-bidirectional with an internal pull-up: write 1 to a latch bit to use the pin as an input, then read the pin with MOV A, P1.',
    examNote:
      'The textbook "clean" port — no bus duty, no alternate functions on the classic 8051.',
  },
  {
    id: 'port-2',
    name: 'Port 2 (P2)',
    alternateLabel: 'A8 – A15',
    specialFunction:
      'High byte of the external address bus when external code or data memory is accessed.',
    pinStructure:
      'Quasi-bidirectional with internal pull-ups. While the bus is idle it can be used as ordinary I/O.',
    examNote:
      'P0 carries the low address byte (latched by ALE) and P2 carries the high byte — together they address 64 KB.',
  },
  {
    id: 'port-3',
    name: 'Port 3 (P3)',
    alternateLabel: 'P3.0 – P3.7 (alternate functions)',
    specialFunction:
      'Every pin carries a peripheral duty in addition to plain I/O: RXD, TXD, INT0#, INT1#, T0, T1, WR#, RD#.',
    pinStructure:
      'Quasi-bidirectional with internal pull-ups. An alternate function takes over its pin only when the corresponding port latch bit is 1.',
    examNote:
      'Memorise the P3 map — it appears in almost every 8051 lab viva: P3.0 RXD, P3.1 TXD, P3.2 INT0, P3.3 INT1, P3.4 T0, P3.5 T1, P3.6 WR, P3.7 RD.',
  },
];

/** Port 3 alternate-function pin map for the reference table. */
export const PORT3_PIN_MAP: { pin: string; primary: string; alternate: string; direction: string }[] = [
  { pin: 'P3.0', primary: 'General I/O', alternate: 'RXD — serial data input', direction: 'Input (serial)' },
  { pin: 'P3.1', primary: 'General I/O', alternate: 'TXD — serial data output', direction: 'Output (serial)' },
  { pin: 'P3.2', primary: 'General I/O', alternate: 'INT0# — external interrupt 0', direction: 'Input' },
  { pin: 'P3.3', primary: 'General I/O', alternate: 'INT1# — external interrupt 1', direction: 'Input' },
  { pin: 'P3.4', primary: 'General I/O', alternate: 'T0 — Timer/Counter 0 external input', direction: 'Input' },
  { pin: 'P3.5', primary: 'General I/O', alternate: 'T1 — Timer/Counter 1 external input', direction: 'Input' },
  { pin: 'P3.6', primary: 'General I/O', alternate: 'WR# — external data RAM write strobe', direction: 'Output' },
  { pin: 'P3.7', primary: 'General I/O', alternate: 'RD# — external data RAM read strobe', direction: 'Output' },
];
