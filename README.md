# 8051 Basics

A clean, modern educational web application designed for **Electronics and Telecommunication Engineering** students to understand the hardware features, Harvard architecture, and register structure of the classic Intel 8051 microcontroller.

It runs as a website locally and is also packaged as a native **Android app** via Capacitor.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Dev Server:** Vite
- **Android packaging:** Capacitor (native WebView shell)
- **Icons:** Lucide React
- **Diagrams:** Pure scalable vector graphics (SVG) with interactive click states and accessibility support
- **Styling:** Clean light theme — white palette with light blue accents (`#38bdf8`) and deep blue text (`#1e3a8a`)

---

## 🚀 How to Run the Project

1. Open a terminal in the project directory:
   ```bash
   cd "MC8051"
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser to the local URL shown in the terminal:
   ```text
   http://localhost:5173/
   ```

4. To build for production:
   ```bash
   npm run build
   ```

5. To preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure & File Guide

```text
MC8051/
├── index.html                   # HTML entry point with metadata
├── package.json                 # Project dependencies and npm scripts
├── src/
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces for blocks & features
│   ├── data/
│   │   ├── architectureData.ts  # 📌 EDIT HERE to add/modify architecture blocks & descriptions
│   │   ├── featuresData.ts      # 📌 EDIT HERE to edit the 8 classic features & variant disclaimer
│   │   ├── instructionSetData.ts # 📌 EDIT HERE to edit the complete instruction set, operand key & flag legend
│   │   ├── peripheralData.ts    # 📌 EDIT HERE for TMOD/TCON/IE/IP/SCON, timer modes, interrupts, serial modes & ports
│   ├── components/
│   │   ├── Header.tsx           # Sticky navigation header
│   │   ├── Hero.tsx             # Hero intro with "Explore Architecture" button
│   │   ├── FeaturesSection.tsx  # 8 classic feature cards & variant disclaimer banner
│   │   ├── ArchitectureSection.tsx # Section container, category filters & quick picker
│   │   ├── ArchitectureDiagram.tsx # Accurate interactive SVG 8051 schematic
│   │   ├── BlockDetailPanel.tsx # Interactive information card for clicked blocks
│   │   ├── MemoryMapSection.tsx # RAM vs. ROM and PC vs. DPTR educational breakdown
│   │   ├── InstructionSetSection.tsx # Searchable instruction set table (mode, bytes, cycles, flags)
│   │   ├── RegisterBitGrid.tsx  # Reusable interactive 8-bit SFR diagram (click a bit to read it)
│   │   ├── TimersSection.tsx    # TMOD/TCON/IE/IP explorer, timer modes, interrupt vectors
│   │   ├── SerialIoSection.tsx  # Port structure, P3 pin map, SCON, serial modes & baud rates
│   │   └── Footer.tsx           # Engineering textbook references and back-to-top button
│   ├── App.tsx                  # Main app layout and smooth scroll management
│   ├── App.css                  # Modern engineering white + light blue UI styles
│   ├── index.css                # Global CSS variables, font definitions & resets
│   └── main.tsx                 # React DOM mount point
```

---

## ✏️ How to Add More Architecture Blocks or Edit Descriptions

All architecture information is decoupled from the UI code into simple, clean TypeScript data files:

### 1. Modifying or Adding Architecture Blocks
Open [`src/data/architectureData.ts`](src/data/architectureData.ts):
- Every block is defined as an object in the `ARCHITECTURE_BLOCKS` array adhering to the `ArchitectureBlock` interface:
  ```typescript
  {
    id: 'my-new-block',
    name: 'Block Title (e.g., Watchdog Timer)',
    shortName: 'WDT',
    category: 'control', // 'cpu' | 'memory' | 'peripherals' | 'control'
    categoryLabel: 'System Safety',
    bitWidth: '16-bit',
    sfrAddress: '0xA6', // Optional SFR address
    functionDescription: '2-4 simple sentences explaining what the hardware does in plain English.',
    exampleUseCase: 'Practical assembly code example or scenario (e.g. "MOV WDTRST, #01EH").',
    bulletPoints: [
      'Key bullet point 1 for lab exams',
      'Key bullet point 2'
    ]
  }
  ```

### 2. Modifying or Adding Feature Cards
Open [`src/data/featuresData.ts`](src/data/featuresData.ts):
- Update `CLASSIC_8051_FEATURES` or the `VARIANT_DISCLAIMER` text as needed.

### 3. Editing the Instruction Set Table
Open [`src/data/instructionSetData.ts`](src/data/instructionSetData.ts):
- `INSTRUCTION_SET` holds every instruction form with its opcode, addressing mode, byte length, machine cycles, affected flags, description and an assembly example. Register-bank variants (`Rn` = R0–R7, `@Ri` = @R0/@R1) are grouped into a single row with their opcode range shown.
- `OPERAND_SYMBOL_KEY` and `FLAG_LEGEND` control the two reference cards below the table.
- The table is searchable (mnemonic, operand, description, opcode) and filterable by the five categories in `INSTRUCTION_CATEGORIES`.

### 4. Editing Timers, Interrupts, Ports & Serial
Open [`src/data/peripheralData.ts`](src/data/peripheralData.ts):
- `TMOD_REGISTER`, `TCON_REGISTER`, `IE_REGISTER`, `IP_REGISTER`, `SCON_REGISTER` — each is a `SpecialRegister` with 8 clickable `bits` (position 7 → 0). Edit `name` or `description` of any bit and the interactive diagram updates automatically.
- `TIMER_MODES`, `INTERRUPT_SOURCES`, `SERIAL_MODES`, `BAUD_TABLE`, `PORTS`, `PORT3_PIN_MAP` feed the mode cards, vector table, baud lookup and port cards.

### 5. Updating the SVG Schematic
If you add a new hardware block to the SVG diagram itself, edit [`src/components/ArchitectureDiagram.tsx`](src/components/ArchitectureDiagram.tsx). Each block is wrapped in a clickable group `<g>`:
```tsx
<g
  className={`diagram-block ${isSelected('my-new-block') ? 'selected' : ''}`}
  onClick={() => onSelectBlock('my-new-block')}
  tabIndex={0}
  role="button"
  aria-label="My New Block"
>
  {/* SVG shape and text labels */}
</g>
```

---

## 🤖 Android App (Capacitor)

The web app is wrapped into a native Android project using Capacitor. The native project lives in the `android/` folder.

- **App name:** 8051 Basics
- **Package ID:** `com.vaibhav.mc8051`
- **Web assets:** built to `dist/`, synced into `android/app/src/main/assets/public/`

### One-time setup (install build tools)

1. **Install Android Studio** (includes the Android SDK + Gradle):
   - Download from https://developer.android.com/studio
   - Run the installer, accept defaults. Open it once and let it finish downloading the SDK.
2. **Install a JDK** (Android Studio bundles one, so this is optional if you use its JBR).
   - If you want a standalone JDK, install Microsoft Build of OpenJDK 17 or Temurin 17.
3. **Enable USB debugging** on your phone: Settings → About phone → tap "Build number" 7 times → Settings → Developer options → enable "USB debugging".

### Build the app

From the project folder:

```bash
# 1. Build the web app and copy it into the Android project
npm run android:sync

# 2. Open the native project in Android Studio
npm run android:open
```

Then in Android Studio:

- **To run on a phone/emulator:** connect the device (or start an emulator), then click the green ▶ Run button.
- **To build an installable APK:** Build → Build App Bundle(s) / APK(s) → **Build APK(s)**. The file appears at:
  `android/app/build/outputs/apk/debug/app-debug.apk`
- **To build a release AAB for the Play Store:** Build → Generate Signed Bundle → choose **Android App Bundle**, create/choose a keystore, then Build.

### Install on a phone (sideload)

1. Copy `app-debug.apk` to your phone (USB, Drive, email, etc.).
2. On the phone, open the APK and allow "Install from unknown sources" if prompted.
3. The **8051 Basics** app icon appears in your app drawer. It works fully offline.

### Publish to Google Play Store

1. Create a developer account at https://play.google.com/console (one-time $25 fee).
2. In Android Studio: Build → Generate Signed Bundle → **Android App Bundle** (release).
3. In the Play Console: Create app → upload the `.aab` file to a testing track (internal testing first).
4. Fill in the store listing (title "8051 Basics", description, screenshots), set content rating, then promote the release to **Production** and submit for review.

### After you change web code

Re-sync so the Android project picks up new builds:

```bash
npm run android:sync
```

Then re-run from Android Studio (or rebuild the APK).

### Use it everywhere

- **Local dev:** `npm run dev` → http://localhost:5173 (browser).
- **Local production preview:** `npm run build && npm run preview`.
- **On your website:** deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, Railway). The app uses a relative base path, so it works from any sub-folder.
- **On Android:** build the APK as above — the same code, running natively and offline.
