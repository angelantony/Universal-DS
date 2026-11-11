# Analisi dei requisiti — Milestone 0

Fonte: _Enterprise Design System Platform — Master Project Specification v2.0_.
Obiettivo: individuare contraddizioni, ambiguità e vincoli tecnici prima di scrivere codice.

---

## 1. Verifica delle tecnologie (registry npm, 2026-11-11)

| Tecnologia                           | Ultima versione | Esito                 | Note                                                                                                                         |
| ------------------------------------ | --------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Lit                                  | 3.3.3           | ✅ Adottata           | Decoratori standard supportati                                                                                               |
| TypeScript                           | 7.0.2           | ⚠️ **Non adottabile** | `@angular/compiler-cli@22` richiede `>=6.0 <6.1`; `typescript-eslint@8.72` richiede `<6.1.0`. Si adotta **6.0.3** (ADR-0002) |
| Nx                                   | 24.0.6          | ✅                    | Verifica compatibilità con pnpm 12 in M1                                                                                     |
| pnpm                                 | 12.18.0         | ✅                    | Da installare via corepack                                                                                                   |
| Vite                                 | 8.3.8           | ✅                    |                                                                                                                              |
| Vitest                               | 5.1.0           | ✅                    | Browser mode con provider Playwright                                                                                         |
| Playwright                           | 1.65.0          | ✅                    |                                                                                                                              |
| axe-core                             | 4.14.0          | ✅                    |                                                                                                                              |
| Storybook                            | 10.6.7          | ✅                    | Framework `@storybook/web-components-vite`                                                                                   |
| Style Dictionary                     | 5.8.0           | ✅                    | Supporto nativo DTCG                                                                                                         |
| Zod                                  | 4.6.7           | ✅                    | Export JSON Schema nativo                                                                                                    |
| React                                | 19.3.1          | ✅                    | Supporto nativo custom element                                                                                               |
| React Router                         | 8.5.1           | ✅                    |                                                                                                                              |
| Angular                              | 22.2.5          | ✅                    | Vincola la versione di TypeScript                                                                                            |
| Vue                                  | 3.5.45          | ✅                    |                                                                                                                              |
| Monaco Editor                        | 0.57.0          | ✅                    | Solo nel Playground, lazy                                                                                                    |
| Changesets                           | 3.0.3           | ✅                    | Richiede Node `^22.11 \|\| ^24`                                                                                              |
| `@lit/react`                         | 1.0.8           | ✅                    |                                                                                                                              |
| `@lit-labs/ssr`                      | 4.1.0           | ⚠️ Labs               | Pacchetto "labs": SSR dichiarato solo dopo test (M10)                                                                        |
| `@custom-elements-manifest/analyzer` | 0.11.0          | ⚠️                    | Usa internamente TS ~5.4: spike in M2 (R-05)                                                                                 |
| vite-plugin-pwa                      | 2.0.0           | ✅                    |                                                                                                                              |
| DOMPurify                            | 3.4.17          | ✅                    | Solo per SVG registrati a runtime                                                                                            |

Strumenti aggiuntivi rispetto alla specifica, con motivazione (§4 "non introdurre strumenti senza motivazione documentata"):

| Strumento                            | Motivazione                                                                                                                  |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `@custom-elements-manifest/analyzer` | Estrae il contratto reale dal sorgente per verificare i metadata (unico modo di evitare due fonti di verità non controllate) |
| `@lit/react`                         | Wrapper React ufficiale del team Lit                                                                                         |
| `ng-packagr`                         | Formato di pacchetto Angular (APF) richiesto per librerie Angular                                                            |
| `publint`, `@arethetypeswrong/cli`   | Verifica di export map e dichiarazioni dei tipi (§23 Build Test)                                                             |
| `size-limit`                         | Bundle size budget (§19)                                                                                                     |
| Stylelint + `postcss-lit`            | Controllo automatico dei valori grafici non conformi negli stili Lit (§7.4)                                                  |
| SVGO                                 | Ottimizzazione e pulizia delle icone in build (§8, §19)                                                                      |
| DOMPurify                            | Sanitizzazione di SVG a runtime (§8, §20)                                                                                    |
| Verdaccio (solo dev/CI)              | Registry locale per testare installazione e pubblicazione senza pubblicare (§24)                                             |

---

## 2. Contraddizioni e ambiguità individuate

### C-01 — App separate vs portale unico

§5 prevede `apps/portal`, `apps/documentation`, `apps/playground`; §13 colloca documentazione e playground **dentro** il portale.
**Risoluzione proposta:** un'unica app `portal`; la logica riusabile vive in package headless. → ADR-0007, decisione D-02.

### C-02 — Proprietà di stile del Button vs integrità semantica e accessibilità

§12.4 chiede proprietà come `background`, `color`, `width`, `padding`, `border`, `shadow`, `fontSize`; §12.4 e §12.8 chiedono anche di evitare configurazioni semanticamente scorrette e personalizzazioni che compromettano l'accessibilità.
Esporre ogni valore CSS come attributo crea una seconda API di stile parallela ai token, permette combinazioni con contrasto insufficiente e rende i temi non affidabili.
**Risoluzione proposta:** personalizzazione tramite CSS custom properties pubbliche (dichiarate nei metadata) e `variant="custom"` / `size="custom"`; nessuna proprietà-attributo per i singoli valori CSS. → ADR-0011, decisione D-06.

### C-03 — Elenco varianti che mescola enfasi e semantica

§12.1 elenca insieme Primary/Secondary/Tertiary/Outline/Ghost/Text (enfasi/aspetto) e Danger/Success/Warning (semantica), chiedendo poi di "distinguere varianti di azione e semantica".
**Risoluzione proposta:** due assi: `variant` (enfasi visiva) e `tone` (significato). Esempio: `variant="outline" tone="danger"`. → ADR-0011, decisione D-07.

### C-04 — "Elemento button nativo" dentro lo Shadow DOM

Un `<button type="submit">` nello Shadow DOM non invia il `<form>` del documento.
**Risoluzione:** `ElementInternals` + controller di form association in `@uds/core`. → ADR-0003.

### C-05 — Metadata come fonte unica vs proprietà dichiarate nella classe Lit

Lit richiede la dichiarazione delle proprietà nella classe: esistono inevitabilmente due dichiarazioni.
**Risoluzione:** i valori ammessi e i tipi sono importati dai metadata; il contract test sul Custom Elements Manifest garantisce l'uguaglianza. → ADR-0004.

### C-06 — Monaco Editor e sicurezza del Playground

Un editor che esegue codice scritto dall'utente richiede un sandbox robusto ed è un vettore di rischio (§20).
**Risoluzione:** nella v1 Monaco mostra codice generato (sola lettura) e permette la modifica della configurazione JSON validata; nessuna esecuzione di codice arbitrario. La preview gira in iframe sandbox. → ADR-0007.

### C-07 — Requisito SSR vs "non dichiarare senza test reali"

**Risoluzione:** garanzia "import-safe" testata da M2; supporto SSR con Declarative Shadow DOM e hydration dichiarato solo dopo i test di M10.

### C-08 — High Contrast

"High Contrast" può indicare un tema proprietario o la modalità _forced colors_ del sistema operativo.
**Risoluzione:** si supportano entrambi, come requisiti distinti con test distinti.

### C-09 — Browser matrix

Playwright fornisce WebKit, non Safari; Edge condivide il motore Chromium.
**Risoluzione:** matrice documentata (Chromium, Firefox, WebKit automatici; Edge via canale `msedge`; Safari reale manuale o via servizio cloud da autorizzare).

### C-10 — Storybook vs portale

**Risoluzione:** Storybook è interno (sviluppo isolato, test di interazione, base della regressione visiva), non pubblicato agli utenti; il portale è l'unica documentazione per i consumatori. Le storie leggono gli `args` dai metadata. → ADR-0007.

### C-11 — Semantica di `cli add button` con distribuzione via package

In una libreria distribuita via NPM "aggiungere un componente" non significa copiare il sorgente.
**Risoluzione:** `add` installa i package necessari e aggiunge l'import di registrazione nell'entry configurato; mostra le modifiche in **dry-run** per default e applica solo con `--yes`.

### C-12 — "Evoluzione indipendente" vs coerenza delle versioni

**Risoluzione:** gruppo fixed per i package runtime (una versione = un design system compatibile) e versioni indipendenti per gli strumenti. → ADR-0009, decisione D-03.

### C-13 — Storybook e regressione visiva non assegnati a una milestone

**Risoluzione:** Storybook in M2, regressione visiva operativa da M3.

### C-14 — Scope `@company`

Segnaposto. **Risoluzione:** `@uds` provvisorio, decisione D-01.

### C-15 — Persistenza del tema e flash al caricamento

La persistenza in `localStorage` causa un flash del tema predefinito prima del caricamento JS.
**Risoluzione:** `ThemeManager` fornisce uno snippet inline da inserire nell'`<head>`; responsabilità dell'applicazione, documentata.

---

## 3. Tracciabilità requisiti → milestone

| Sezione specifica         | Milestone                | Documento                      |
| ------------------------- | ------------------------ | ------------------------------ |
| §3 Principi               | Tutte                    | ARCHITECTURE §1                |
| §5 Monorepo               | M1                       | ARCHITECTURE §3, ADR-0001      |
| §6 Metadata               | M2 (schema), M3 (Button) | metadata-registry.md, ADR-0004 |
| §7 Token e temi           | M2                       | ADR-0005                       |
| §8 Icone                  | M2                       | ADR-0010                       |
| §9 Accessibilità          | M2–M10                   | testing-strategy.md            |
| §10 Responsive            | M3+                      | component standard (M2)        |
| §11 Cross-framework / SSR | M4 / M10                 | ADR-0006                       |
| §12 Button                | M3                       | ADR-0011                       |
| §13 Portale               | M5–M7                    | ADR-0007                       |
| §14 Builder               | M8                       | ARCHITECTURE §4                |
| §15 Code Generator        | M6                       | metadata-registry.md §6        |
| §16 Theme Builder         | M7                       | ADR-0005                       |
| §17 CLI                   | M9                       | C-11                           |
| §19 Performance           | M3, M10                  | ARCHITECTURE §15               |
| §20 Sicurezza             | M2, M6, M10              | ARCHITECTURE §14, ADR-0010     |
| §21 PWA                   | M10                      | ARCHITECTURE §11               |
| §22 Governance            | M1, M9                   | versioning-governance.md       |
| §23 Testing               | Tutte                    | testing-strategy.md            |
| §24 CI/CD                 | M1 (base), M9–M10        | ADR-0009                       |
