# **QuickStart v 0.3 ― Architecture Specification**  
*(workstream brief for the content‑implementation writer)*  

---

## 0 Purpose

Produce a **single 8‑page PDF** that lets a table run SWN‑compatible mech scenes with:

* **No Strain/Heat subsystem** – replaced by Break tests & escalating Crits.  
* **“PEX” damage model** – Projectile, Energy, Exotic (Option B).  
* **Tags embedded in stat blocks** (no global lookup).  

This spec describes **what** must exist, **how** modules fit, and **why** each rule was chosen, so the implementation writer can focus on prose, examples, and layout—not on system design.

---

## 1 Guiding Tenets (keep front‑of‑mind while writing)

| ID | Principle | Consequence in Text |
|----|-----------|---------------------|
| G‑1 | *Cognitive Load ≤ D&D B/X.* | One primary number per defensive category. |
| G‑2 | *Free Kriegsspiel > Edge‑Case Math.* | Present rule *intent* first, mechanics second. |
| G‑3 | *100 % SWN Compatibility.* | Use descending AC, 2d6 skill checks, vehicle HD. |
| G‑4 | *All info at Point‑of‑Use.* | Tags and special rules printed inside each weapon/fit line. |

---

## 2 Document Skeleton (deliverable tree)

| Page(s) | Section | Implementation Notes |
|---------|---------|----------------------|
| 1 | Cover + 50‑word elevator pitch | Include version, date, CC‑BY‑SA notice. |
| 2 | *Core Loop & Dice Basics* | ≤ 200 words, centre‑column. |
| 3 | *Critical Hit & Break Test* | Crit table + Break procedure side‑bar. |
| 4 | *Damage & Armor Model* | Explain P/E/X; include 2 tiny call‑out examples. |
| 5 | *Tag Glossary* | 8‑10 tags, two‑line definition each. |
| 6 | *Frame Catalogue* | 3 stat blocks; see schema §3. |
| 7 | *Weapon & Fitting List* | Table format; each entry ≤ 1 line. |
| 8 | *Referee Quick Cues* | Encounter budgets, cover, mixed arms tips. |

Total printable pages must not exceed **8**.

---

## 3 Data Schemas

### 3.1 Mech Stat Block Template

```
<FRAME NAME>  •  <Concept blurb, ≤15 words>
HD  /  AC  /  Move m  /  DR  /  Hard‑Pts  /  Power‑Mass
BUILT‑INS: item, item
MOUNTS:
  • Main — <Weapon name> (Tag, Tag) dmg
  • Heavy — ...
```

* **HD**: integer 2‑6.  
* **AC**: 2‑5 (descending).  
* **DR**: single integer vs. Projectile; note any mods vs. Energy/Exotic in Built‑ins.  
* **Power‑Mass**: “used‑of‑allowed”, e.g. `8‑8`. Do **not** print unused capacity.  

### 3.2 Weapon Entry Template

`Name  |  Range (m)  |  Damage dice  |  Type (P/E/X)  |  Tag(s)  |  Special`

1‑line width max 100 chars.

### 3.3 Fitting Entry Template

`Name  |  Effect (≤ 20 words)  |  Power  |  Mass`

---

## 4 Rule Modules (content to include)

### 4.1 Critical Hit Table

* Provide final d6 results exactly as v 0.2, but footnote **“duplication escalates”** rule: second identical result upgrades to “severe” (writer to draft a severe descriptor in italics).

### 4.2 Break Test

* Trigger events: **Overload tag**, GM‑sanctioned stunt.  
* Procedure: “Roll 2d6 + (INT or DEX). On 7‑ roll Crit.”  
* Rationale paragraph: emphasise drama over tracking.

### 4.3 PEX Armor Model

* Projectile hits subtract DR.  
* Energy ignores DR unless target has *Reflectors* (+4 vs E).  
* Exotic ignores DR; target makes **Evasion save** to halve damage.  
* Cover: +4 AC vs. Projectile only.

Writer must include 2 worked examples.

---

## 5 Tag Vocabulary (max 10)

Mandatory list: **Blast, Brace, Grapple, Hex, Overload, Piercing X, Rapid**.  
Writer may add up to 3 new tags if required by weapon list; each must fit definition spec (≤ 20 words, one mechanical sentence).

---

## 6 Style & Voice Guide

* Adopt neutral instructional tone (Moldvay/Traveller vibe).  
* Lead every rule with **intent sentence** in italics, then mechanic.  
* Use second person plural (“When you fire…”).  
* Numbers in bold the first time they appear in a line.  

---

## 7 Testing & Validation Criteria

| Metric | Threshold |
|--------|-----------|
| Page count | ≤ 8 |
| Average words per weapon entry | ≤ 25 |
| Play‑through audit | 1 full combat uses ≤ 2 page flips after first round |
| Stat block parse | Blind reader can identify AC and DR in ≤ 5 sec |

The implementation writer should supply a one‑page *Playtest Log* after internal run.

---

## 8 File Delivery Conventions

* Submit **Markdown source** (`v0_3_quickstart.md`) + **PDF export**.  
* Embed YAML front‑matter with version, author, changelog short‑hash.  
* All tables must render in GitHub Markdown.  

---

## 9 Future‑Proof Hooks (do NOT implement yet)

* Leave one empty column in weapon table for **“Heat”**; hide with HTML comment.  
* Tag glossary numbers can extend to 15; reserve IDs 11‑15.  
