import type { ArchitectureBlock } from '../types';

export const ARCHITECTURE_BLOCKS: ArchitectureBlock[] = [
  {
    id: 'cpu-alu',
    name: 'CPU & Arithmetic Logic Unit (ALU)',
    shortName: 'CPU / ALU',
    category: 'cpu',
    categoryLabel: 'Processing Core',
    bitWidth: '8-bit',
    functionDescription:
      'The Central Processing Unit (CPU) controls all microcomputer operations and decodes instructions. The Arithmetic Logic Unit (ALU) performs 8-bit arithmetic operations (addition, subtraction, multiplication, division) and logical operations (AND, OR, XOR, complement). It also includes a Boolean processor capable of setting, clearing, and testing individual bits.',
    exampleUseCase:
      'When adding two numbers with "ADD A, R2", the ALU takes the value in Register A and Register R2, calculates their binary sum, and updates flags like Carry (CY) in the Program Status Word.',
    bulletPoints: [
      'Executes instructions fetched from Program ROM',
      'Performs 8-bit arithmetic (+, -, ×, ÷) and bitwise logic',
      'Includes dedicated Boolean bit processor for 1-bit operations',
      'Updates flag bits in the PSW register automatically'
    ]
  },
  {
    id: 'acc',
    name: 'Accumulator (Register A)',
    shortName: 'Accumulator (A)',
    category: 'cpu',
    categoryLabel: 'CPU Register',
    bitWidth: '8-bit',
    sfrAddress: '0xE0',
    functionDescription:
      'The Accumulator (Register A) is the primary working register in the 8051 CPU. It holds the source operand for arithmetic and logical instructions and automatically stores the result of the operation. Almost all math, logic, external memory transfers, and I/O movements pass through the Accumulator.',
    exampleUseCase:
      'To load an immediate value of 25H and send it out to Port 1, you write: "MOV A, #25H" followed by "MOV P1, A".',
    bulletPoints: [
      'SFR address: 0xE0 (Bit-addressable: E0H to E7H)',
      'Primary operand and result register for the ALU',
      'Required for all math instructions (ADD, SUBB, MUL, DIV)',
      'Default register for external memory access (MOVX) and ROM lookup (MOVC)'
    ]
  },
  {
    id: 'b-reg',
    name: 'B Register',
    shortName: 'B Register',
    category: 'cpu',
    categoryLabel: 'CPU Register',
    bitWidth: '8-bit',
    sfrAddress: '0xF0',
    functionDescription:
      'The B register is an 8-bit special function register designed primarily to work with the Accumulator during multiplication and division operations. For other instructions, it can serve as a general-purpose scratchpad register. It is bit-addressable, meaning single bits within it can be manipulated directly.',
    exampleUseCase:
      'When multiplying two 8-bit numbers with "MUL AB", the CPU multiplies A by B; the lower 8 bits of the 16-bit product stay in A and the upper 8 bits are stored in B.',
    bulletPoints: [
      'SFR address: 0xF0 (Bit-addressable: F0H to F7H)',
      'Paired with the Accumulator for MUL AB and DIV AB instructions',
      'In division ("DIV AB"), quotient goes to A and remainder goes to B',
      'Can be used as a general-purpose storage register for standard MOV instructions'
    ]
  },
  {
    id: 'psw',
    name: 'Program Status Word (PSW)',
    shortName: 'PSW (Flags)',
    category: 'cpu',
    categoryLabel: 'CPU Register',
    bitWidth: '8-bit',
    sfrAddress: '0xD0',
    functionDescription:
      'The Program Status Word is an 8-bit register containing arithmetic status flags and control bits. It includes the Carry flag (CY), Auxiliary Carry (AC), Overflow flag (OV), Parity flag (P), and user flag F0. It also houses RS1 and RS0, which select which of the four register banks (Bank 0 to 3) is currently active in RAM.',
    exampleUseCase:
      'After an addition instruction, if the result exceeds 255 (FFH), the ALU sets CY = 1 so your program can branch using "JC Label" (Jump if Carry is set).',
    bulletPoints: [
      'SFR address: 0xD0 (Bit-addressable)',
      'Flags: CY (Carry), AC (Auxiliary Carry for BCD), OV (Signed Overflow), P (Parity)',
      'RS1 and RS0 bits select active Register Bank (0, 1, 2, or 3) in RAM',
      'Parity bit (P) is automatically set to 1 if Accumulator has an odd number of 1s'
    ]
  },
  {
    id: 'pc',
    name: 'Program Counter (PC)',
    shortName: 'Program Counter (PC)',
    category: 'control',
    categoryLabel: 'Pointer & Flow Control',
    bitWidth: '16-bit',
    functionDescription:
      'The Program Counter (PC) is a 16-bit register that always holds the memory address of the next instruction byte to be fetched from Program ROM. Because it is 16 bits wide, it can address up to 64 KB of program code (0000H to FFFFH). Each time an instruction byte is read, the PC is automatically incremented.',
    exampleUseCase:
      'When the 8051 is powered on or reset, the PC is initialized to 0000H, causing the CPU to fetch and execute the very first instruction located at ROM address 0000H.',
    bulletPoints: [
      'Width: 16-bit (Can address up to 64 KB of code memory)',
      'Not part of the Special Function Register (SFR) address map',
      'Points exclusively to Program ROM (Code Memory), never data RAM',
      'Modified by jump (JMP, SJMP, LJMP), branch, call (ACALL, LCALL), and return (RET) instructions'
    ]
  },
  {
    id: 'dptr',
    name: 'Data Pointer (DPTR)',
    shortName: 'Data Pointer (DPTR)',
    category: 'control',
    categoryLabel: 'Pointer & Flow Control',
    bitWidth: '16-bit',
    sfrAddress: '0x82 (DPL) / 0x83 (DPH)',
    functionDescription:
      'The Data Pointer (DPTR) is a 16-bit register used to hold memory addresses when accessing external data RAM or lookup tables stored in Program ROM. It is divided into two individually accessible 8-bit registers: DPH (Data Pointer High) and DPL (Data Pointer Low). Unlike the Program Counter which tracks instruction execution, the DPTR is programmer-controlled for data indexing.',
    exampleUseCase:
      'To look up a 7-segment display pattern from a lookup table in ROM, you load the table start address into DPTR ("MOV DPTR, #Table") and fetch data with "MOVC A, @A+DPTR".',
    bulletPoints: [
      '16-bit register composed of DPH (SFR 0x83) and DPL (SFR 0x82)',
      'Used to point to external data memory using "MOVX A, @DPTR"',
      'Used with Accumulator for indexed lookup tables in ROM using "MOVC"',
      'Can be loaded with a 16-bit constant directly (e.g. "MOV DPTR, #1234H")'
    ]
  },
  {
    id: 'sp',
    name: 'Stack Pointer (SP)',
    shortName: 'Stack Pointer (SP)',
    category: 'control',
    categoryLabel: 'Pointer & Flow Control',
    bitWidth: '8-bit',
    sfrAddress: '0x81',
    functionDescription:
      'The Stack Pointer (SP) is an 8-bit register that stores the internal RAM address of the current top of the stack. In the 8051, the stack grows upward in internal RAM (addresses increase as items are pushed). When a PUSH or subroutine CALL occurs, SP is incremented first, and then the data is written into RAM at the address stored in SP.',
    exampleUseCase:
      'Upon system reset, the SP defaults to 07H, meaning the first pushed byte goes to RAM address 08H; programs usually set SP to 2FH ("MOV SP, #2FH") so the first push lands at 30H, avoiding overwriting register banks.',
    bulletPoints: [
      'SFR address: 0x81 (Points into internal data RAM only)',
      'Pre-increment on PUSH: SP is incremented by 1, then data is saved',
      'Post-decrement on POP: data is retrieved, then SP is decremented by 1',
      'Automatically stores 16-bit return address (PC) during LCALL/ACALL and restores it during RET'
    ]
  },
  {
    id: 'reg-banks',
    name: 'Register Banks R0–R7',
    shortName: 'Register Banks (R0–R7)',
    category: 'memory',
    categoryLabel: 'Internal Memory',
    bitWidth: '8-bit × 32 registers',
    functionDescription:
      'The lowest 32 bytes of internal RAM (addresses 00H to 1FH) are partitioned into four separate working register banks (Bank 0, Bank 1, Bank 2, Bank 3). Each bank contains 8 general-purpose 8-bit registers labeled R0 through R7. At any given moment, one active bank is chosen by configuring bits RS1 and RS0 in the Program Status Word (PSW).',
    exampleUseCase:
      'An interrupt service routine can switch from Bank 0 to Bank 1 by setting RS0 in the PSW, giving the interrupt its own fresh set of R0–R7 registers without needing to push all registers onto the stack.',
    bulletPoints: [
      'Located in Internal RAM from 00H to 1FH (32 bytes total)',
      'Bank 0: 00H–07H, Bank 1: 08H–0FH, Bank 2: 10H–17H, Bank 3: 18H–1FH',
      'Selected using RS1 and RS0 bits in the PSW (defaults to Bank 0 on reset)',
      'Registers R0 and R1 can also act as 8-bit pointers for indirect RAM access (@R0, @R1)'
    ]
  },
  {
    id: 'ram',
    name: 'Internal Data RAM',
    shortName: 'Internal RAM (128 B)',
    category: 'memory',
    categoryLabel: 'Internal Memory',
    bitWidth: '128 Bytes (8-bit addressable)',
    functionDescription:
      'The original classic 8051 contains 128 bytes of high-speed internal static RAM mapped from address 00H to 7FH. It is organized into three distinct operational functional zones: 32 bytes for four Register Banks (00H–1FH), 16 bytes of bit-addressable memory containing 128 individually testable bits (20H–2FH), and 80 bytes of general-purpose scratchpad RAM (30H–7FH) for variables and the hardware stack.',
    exampleUseCase:
      'To store a sensor reading into scratchpad RAM, you can execute "MOV 35H, A", which copies the 8-bit value from the Accumulator directly into internal RAM address 35H.',
    bulletPoints: [
      'Address range: 00H through 7FH (128 bytes total in classic 8051)',
      '00H–1FH: 4 Register Banks (R0 to R7 each)',
      '20H–2FH: Bit-addressable RAM (128 software flags addressable from 00H to 7FH)',
      '30H–7FH: Scratchpad RAM for program variables and stack storage'
    ]
  },
  {
    id: 'rom',
    name: 'Program ROM (Code Memory)',
    shortName: 'Program ROM (4 KB)',
    category: 'memory',
    categoryLabel: 'Internal Memory',
    bitWidth: '4 KB (16-bit addressable)',
    functionDescription:
      'The original classic 8051 includes 4 KB (4,096 bytes) of on-chip mask ROM mapped from address 0000H to 0FFFH. This memory is non-volatile and exclusively stores the machine instructions, constant lookup tables, and interrupt service routines of your firmware. The CPU fetches instructions from ROM using the 16-bit Program Counter (PC).',
    exampleUseCase:
      'When the microcontroller powers up, the CPU automatically branches to ROM address 0000H (the Reset Vector) to begin executing your main startup code.',
    bulletPoints: [
      'Size: 4 KB (addresses 0000H through 0FFFH) in the original standard 8051',
      'Non-volatile code storage (firmware is retained when power is removed)',
      'Can be expanded externally up to 64 KB (addresses 0000H to FFFFH) using pin EA#',
      'Houses the fixed Interrupt Vector Table starting at address 0003H'
    ]
  },
  {
    id: 'io-ports',
    name: 'Four I/O Ports (P0, P1, P2, P3)',
    shortName: 'I/O Ports (P0–P3)',
    category: 'peripherals',
    categoryLabel: 'Parallel I/O',
    bitWidth: '32 pins total (4 × 8-bit)',
    sfrAddress: 'P0: 0x80, P1: 0x90, P2: 0xA0, P3: 0xB0',
    functionDescription:
      'The 8051 provides 32 bidirectional I/O pins grouped into four 8-bit parallel ports: Port 0, Port 1, Port 2, and Port 3. Each port has an internal latch, input buffer, and output driver mapped to a Special Function Register (SFR). While Port 1 is purely general-purpose, Ports 0, 2, and 3 also serve multiplexed hardware roles for external memory buses and peripheral signals.',
    exampleUseCase:
      'To toggle an LED connected to pin 2 of Port 1, you can simply write the bit manipulation instruction "CPL P1.2".',
    bulletPoints: [
      'Port 0 (SFR 0x80): Open-drain I/O; also serves as multiplexed Address/Data bus (AD0–AD7)',
      'Port 1 (SFR 0x90): Dedicated 8-bit quasi-bidirectional general-purpose I/O port',
      'Port 2 (SFR 0xA0): Quasi-bidirectional I/O; also emits high-order address bus (A8–A15)',
      'Port 3 (SFR 0xB0): Multi-functional port providing RXD, TXD, INT0#, INT1#, T0, T1, WR#, and RD#'
    ]
  },
  {
    id: 'timers',
    name: 'Timers / Counters (T0 & T1)',
    shortName: 'Timers (T0 & T1)',
    category: 'peripherals',
    categoryLabel: 'Timing & Counting',
    bitWidth: '16-bit each (TH0/TL0 & TH1/TL1)',
    sfrAddress: 'TMOD: 0x89, TCON: 0x88',
    functionDescription:
      'The classic 8051 has two independent 16-bit timer/counter units designated Timer 0 and Timer 1. Each timer consists of two 8-bit registers (THx for high byte and TLx for low byte) controlled by the TMOD (Timer Mode) and TCON (Timer Control) registers. They can function either as internal timers (counting clock cycles to generate delays) or as external event counters (counting falling edges on external pins).',
    exampleUseCase:
      'Timer 1 is frequently programmed in Mode 2 (8-bit auto-reload) to establish standard baud rates (e.g. 9600 baud) for serial UART communication.',
    bulletPoints: [
      'Timer 0 registers: TH0 (0x8C) & TL0 (0x8A); Timer 1: TH1 (0x8D) & TL1 (0x8B)',
      'Four software-configurable modes (13-bit, 16-bit, 8-bit auto-reload, split timer)',
      'Timer mode counts oscillator pulses divided by 12 (1 machine cycle)',
      'Counter mode counts pulses received on pins P3.4 (T0) and P3.5 (T1)'
    ]
  },
  {
    id: 'serial',
    name: 'Serial Communication Unit (UART)',
    shortName: 'Serial Port (UART)',
    category: 'peripherals',
    categoryLabel: 'Communication',
    bitWidth: '8-bit full-duplex',
    sfrAddress: 'SBUF: 0x99, SCON: 0x98',
    functionDescription:
      'The on-chip serial port is a full-duplex Universal Asynchronous Receiver/Transmitter (UART) capable of sending and receiving data simultaneously. It connects to the outside world through pins RXD (P3.0) and TXD (P3.1) and is governed by the SCON register. The serial data buffer (SBUF) physically consists of two separate registers: a write-only transmit buffer and a read-only receive buffer sharing the same address.',
    exampleUseCase:
      'To transmit the ASCII letter "A" to a computer serial monitor, the CPU writes "MOV SBUF, #\'A\'" and waits for the Transmit Interrupt flag (TI) to be set by hardware.',
    bulletPoints: [
      'Full-duplex operation: can transmit and receive at the exact same time',
      'SBUF register (SFR 0x99): physically double-buffered for receiving bytes',
      'SCON register (SFR 0x98): configures serial modes, framing, and interrupt flags (TI/RI)',
      'Supports 4 operating modes (Shift register, 8-bit UART, 9-bit UART with parity)'
    ]
  },
  {
    id: 'interrupts',
    name: 'Interrupt Control Unit',
    shortName: 'Interrupt Control',
    category: 'control',
    categoryLabel: 'Event Handling',
    bitWidth: '5 sources, 2 priority levels',
    sfrAddress: 'IE: 0xA8, IP: 0xB8',
    functionDescription:
      'The interrupt control block monitors internal peripherals and external pins for urgent events, temporarily suspending normal program execution to service them. The classic 8051 handles five hardware interrupt sources: two external interrupts (INT0, INT1), two timer overflows (TF0, TF1), and one serial port interrupt (RI/TI). Programmers enable and configure priorities using the IE (Interrupt Enable) and IP (Interrupt Priority) registers.',
    exampleUseCase:
      'When an external emergency stop button triggers the INT0 pin (P3.2), the CPU pauses main code and jumps directly to ROM address 0003H to execute the emergency stop routine.',
    bulletPoints: [
      '5 classic sources: INT0# (0003H), TF0 (000BH), INT1# (0013H), TF1 (001BH), Serial (0023H)',
      'IE register (SFR 0xA8) allows global (EA) and individual interrupt enabling',
      'IP register (SFR 0xB8) assigns Low (0) or High (1) priority to each interrupt',
      'Automatic vectoring: CPU saves PC on stack and jumps to pre-defined ROM address'
    ]
  },
  {
    id: 'oscillator',
    name: 'Oscillator & Clock Circuitry',
    shortName: 'Oscillator & Clock',
    category: 'control',
    categoryLabel: 'System Timing',
    bitWidth: 'Clock Generator',
    functionDescription:
      'The on-chip oscillator circuit includes an internal inverting amplifier connected between pins XTAL1 and XTAL2. When connected to an external quartz crystal (commonly 11.0592 MHz or 12 MHz) and two capacitors (typically 30 pF), it generates the fundamental system clock. An internal divide-by-12 counter generates 12 oscillator periods (P1 to P12) to produce one single machine cycle.',
    exampleUseCase:
      'With a standard 12 MHz crystal, one machine cycle lasts exactly 12 ÷ 12 MHz = 1.0 microsecond, meaning a 1-cycle instruction like "NOP" or "MOV A, R0" executes in exactly 1 µs.',
    bulletPoints: [
      'Pins XTAL1 (input to inverting amp) and XTAL2 (output from inverting amp)',
      'Internal circuitry divides crystal frequency by 12 to yield machine cycle frequency',
      '11.0592 MHz crystal is widely favored because it divides evenly into standard UART baud rates',
      'Synchronizes all internal CPU bus timing, instruction decoding, and ALU execution'
    ]
  }
];

export const ARCHITECTURE_CATEGORIES = [
  { id: 'all', label: 'All 15 Blocks' },
  { id: 'cpu', label: 'CPU & ALU' },
  { id: 'memory', label: 'Memory (RAM & ROM)' },
  { id: 'control', label: 'Control & Pointers' },
  { id: 'peripherals', label: 'I/O & Peripherals' },
];
