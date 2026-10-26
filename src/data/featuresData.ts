import type { FeatureItem } from '../types';

export const CLASSIC_8051_FEATURES: FeatureItem[] = [
  {
    id: 'cpu',
    title: '8-Bit CPU',
    badge: 'Core Processing',
    summary: 'Processes 8 bits of data at a time using an internal 8-bit data bus.',
    details: 'The Central Processing Unit contains the Arithmetic Logic Unit (ALU) and handles boolean bit-level manipulations as well as byte operations with standard 8-bit registers.',
    iconName: 'Cpu',
  },
  {
    id: 'rom',
    title: '4 KB On-Chip Program ROM',
    badge: 'Code Memory',
    summary: '4,096 bytes of internal mask ROM in the classic 8051 (addresses 0000H to 0FFFH).',
    details: 'Used to store the firmware and machine code instructions. When the microcontroller powers on or resets, execution starts at ROM address 0000H.',
    iconName: 'FileCode',
  },
  {
    id: 'ram',
    title: '128 Bytes Internal RAM',
    badge: 'Data Memory',
    summary: 'High-speed internal data memory spanning hex addresses 00H through 7FH.',
    details: 'Houses four 8-byte working register banks (00H–1FH), a 16-byte bit-addressable RAM area (20H–2FH), and general-purpose scratchpad RAM used for user variables and the hardware stack (30H–7FH).',
    iconName: 'HardDrive',
  },
  {
    id: 'io-ports',
    title: '32 Programmable I/O Lines',
    badge: 'Parallel I/O',
    summary: 'Organized into four bidirectional 8-bit ports: Port 0, Port 1, Port 2, and Port 3.',
    details: 'Each pin can be individually configured as an input or output. Ports P0 and P2 can also act as the multiplexed address/data bus when accessing external memory, while Port 3 provides alternate peripheral functions.',
    iconName: 'Network',
  },
  {
    id: 'timers',
    title: 'Two 16-Bit Timers / Counters',
    badge: 'Timing & Counting',
    summary: 'Timer 0 and Timer 1 operate independently in 13-bit, 16-bit, or 8-bit auto-reload modes.',
    details: 'When configured as timers, they count internal machine cycles to create precise time delays. When configured as counters, they count external event pulses received on pins T0 (P3.4) and T1 (P3.5).',
    iconName: 'Clock',
  },
  {
    id: 'uart',
    title: 'Full-Duplex Serial Port (UART)',
    badge: 'Serial Communication',
    summary: 'Allows simultaneous data transmission and reception via dedicated TXD and RXD pins.',
    details: 'Features a double-buffered receiver and uses the SBUF register. Baud rates are typically generated using Timer 1 in 8-bit auto-reload mode (Mode 2) for standard asynchronous serial communication.',
    iconName: 'Radio',
  },
  {
    id: 'interrupts',
    title: 'Five Interrupt Sources',
    badge: 'Event Handling',
    summary: 'Includes two external hardware interrupts, two timer overflows, and one serial communication interrupt.',
    details: 'The classic 8051 handles INT0 and INT1 (external pins), TF0 and TF1 (timer overflows), and RI/TI (serial data received or transmitted), all with two programmable priority levels.',
    iconName: 'Zap',
  },
  {
    id: 'oscillator',
    title: 'On-Chip Oscillator & Clock Circuit',
    badge: 'System Timing',
    summary: 'Integrated inverter and drive circuitry connected across external pins XTAL1 and XTAL2.',
    details: 'Typically driven by an external quartz crystal (e.g., 11.0592 MHz or 12 MHz) and two ceramic capacitors. An internal divide-by-12 counter generates machine cycles for instruction execution.',
    iconName: 'Activity',
  },
];

export const VARIANT_DISCLAIMER = {
  title: 'Important Architectural Note for Students',
  text: 'The specifications listed above apply specifically to the original classic Intel 8051 microcontroller. Later commercial variants—such as the popular Atmel/Microchip AT89C51/AT89S52, NXP 80C51 family, or Silicon Labs C8051—feature flash memory instead of mask ROM, larger internal RAM (such as 256 bytes), extra 16-bit timers (Timer 2), in-system programming (ISP), and higher clock frequencies, but they all retain this same core instruction set and register architecture.',
};
