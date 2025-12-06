---
layout: post
title: "Critical Analysis: Lancer vs D&D 5e Critical Hit Systems"
date: 2025-04-30
description: "A deep dive into the mathematics and psychology behind critical hit systems in Lancer and D&D 5e, exploring their design implications and impact on gameplay."
tags: [game-design, lancer, dnd, mechanics, analysis]
toc: true
math: true
visibility: public  # Options: public, private, draft

---

I've been working on For Want Of Fuel and got to thinking about Critical Hits. When converting mechanics between systems, we need to understand what the original design is doing and whether it works in the new context. We don't want to go tear down [Chesterton's Fence](https://www.lesswrong.com/w/chesterton-s-fence).[[Chesterton's Fence is the principle that reforms shouldn't be made until the reasoning behind the existing state is understood.]]



So some analysis is in order. For this mechanic it makes sense to split our analysis into two parts. Math and Psychology.
Here math is the pure logical and statistical impact of the design. Both Lancer and SWN are skirmish games with combat mechanics that are relatively detached from the Fiction layer of the game. You could write a program or computer game using the rules of these games that works perfectly fine without a human having to imagine, describe or think about what the Mechs are actually doing.
The interplay of the rules happens more or less on the character sheets, dice and map. Whether it is the players that compute the changes of this state machine or a computer makes little difference.

Why is this important? Well it means that a large part of the gameplay dynamics is determined by this state machine and its behaviors. Since it is indifferent to a human in the loop we can analyze it without having to worry about pesky player psychology and only model the math.
Obviously the outputs or results of this state machine or how players perceive it has a impact on psychology but that is a separate analysis.

## The Math

Let's compare Lancer's crit system to the familiar 5e system:

#### Lancer Crits
- Trigger: Roll 20+ on attack roll
- Effect: Roll damage twice, keep highest result

#### 5e Crits
- Trigger: Natural 20 on attack roll
- Effect: Roll all damage dice twice, add together

Similar at first glance, but fundamentally different. Not only is the damage calculation different, but the trigger condition is too.

Both systems follow the same basic combat flow:
1. Roll to attack (chance to hit = $p(hit)$)
2. If hit, roll damage (average damage = $d$)
3. Total expected damage = $d \times p(hit)$

But this doesn't account for critical hits. The probability of a crit ($p(crit)$) and the damage of a crit ($d(crit)$) differ between systems:

#### Lancer
- $p(crit)$ = probability of 20+ on attack roll
- $d(crit)$ = average damage when critting

#### 5e
- $p(crit) = 0.05$ (natural 20)
- $d(crit) = 2 \times d$ (ignoring flat bonuses)

## 1. Notation and Common Ground

Let[[Shoutout to o3 for making double checking all the math a lot easier.]]:
- **B** = attack bonus (5e: proficiency + ability; Lancer: grit + mods)
- **T** = defense to beat (AC or Evasion)
- **d** = mean damage of a *normal* hit (flat mods included once)
- **dᶜ** = mean damage of a critical hit
- **p_hit** = P(hit) (includes crits)
- **p_crit** = P(critical ∧ hit)

Expected damage per attack:

$$E[D] = d \times p_{\text{hit}} + p_{\text{crit}} \times (d^c - d) \tag{1}$$

The second term is the *increment* supplied by the crit rule.


## 2. Mathematics: 5e
### 2.1 Trigger Probabilities

- **Natural 1** auto-miss
- **Natural 20** auto-hit and crit

$$p_{\text{crit}}^{5e} = 0.05$$

For other results:

$$p_{\text{hit}}^{5e} = \frac{|\{r \in [2,19] \mid r+B \ge T\}|}{20} + 0.05 \tag{2}$$

### 2.2 Critical Damage

If the ordinary dice distribution is **X**, a 5e crit rolls 2 × X; flats stay once:

$$d_{5e}^c = 2 \times E[X] + C \implies d_{5e}^c = 2d - C$$

(*C* is the total flat modifier.)

### 2.3 Increment

Because $d^c = 2d - C$:

$$\Delta E = D_{\text{crit}} - D_{\text{no-crit}} = p_{\text{crit}}^{5e} \times (d^c - d) = 0.05 \times (d - C)$$

So with a +3 flat on a 1d8 longsword (§ 4.1 below) only the dice part is doubled.

## 3. Mathematics: Lancer

### 3.1 Trigger Probabilities

Let **r** ~ Uniform{1…20}. A result counts as a crit only if it both hits *and* is ≥ 20 after modifiers:

$$p_{\text{crit}}^{\text{Lan}} = \Pr[r+B \ge \max(20,T)] = \frac{21 - \max(20,T-B+1)}{20} \tag{3}$$

*If* T ≤ 20 (the usual case) this simplifies to

$$p_{\text{crit}}^{\text{Lan}} = \frac{21 - (20-B)}{20} = \frac{B+1}{20}$$

so a LL 3 pilot (B ≈ +3) crits 20% of all attacks that reach the target. Notice the frequency scales with level rather than being a flat 5%.

### 3.2 Critical Damage

Damage dice are rolled twice; keep the higher aggregate.  
For i.i.d. variables **X₁,X₂** with pmf *f(x)*:

$$d_{\text{Lan}}^c = E[\max(X_1,X_2)] + C = \sum_x x(F(x))^2 - (F(x-1))^2 + C \tag{4}$$

where F is the CDF of **X**.  
Closed form for a single uniform die *d*:

$$E[\max(d)] = \frac{n(n+1)}{2n} = \frac{2n+1}{3} \quad (n = \text{sides})$$

— ≈ 1.28 × basic for d6, ≈ 1.29 × for d8.

### 3.3 Increment

Let $k = \frac{d^c}{d} - 1$ (15–30% in practice):

$$\Delta E = p_{\text{crit}}^{\text{Lan}} \times k \times d$$

Because both $p_{\text{crit}}$ *and* k are level- and weapon-dependent, Lancer bakes more of its DPR into crits as pilots advance.

## 4. Concrete Numbers

The table below shows the mean outcomes for common dice packages. Lancer ratios sit in the 1.15–1.30 band; 5e is a clean ×2 unless flats dominate.

| Dice | Normal | Lancer-crit | Lancer / Norm | 5e-crit | 5e / Norm |
|------|--------|-------------|---------------|---------|-----------|
| 1d6 | 3.50 | 4.47 | 1.28 | 7.00 | 2.00 |
| 1d6 + 2 | 5.50 | 6.47 | 1.18 | 9.00 | 1.64 |
| 2d6 | 7.00 | 8.37 | 1.20 | 14.00 | 2.00 |
| 3d6 | 10.50 | 12.18 | 1.16 | 21.00 | 2.00 |
| 1d8 | 4.50 | 5.81 | 1.29 | 9.00 | 2.00 |
| 1d8 + 3 | 7.50 | 8.81 | 1.17 | 12.00 | 1.60 |

### 4.1 Worked DPR Example

**Weapon:** 1d6 + 2  
**Targets:** Lancer Evasion 15; 5e AC 15  
**Pilots:** LL 3 (+3) vs. 5e Fighter level 5 (+5)

| | $p_{\text{hit}}$ | $p_{\text{crit}}$ | $E[D]$ per swing | % via crit |
|--|-------|--------|----------------|------------|
| **Lancer** | 0.45 | 0.20 | 2.67 | **48%** |
| **5e** | 0.55 | 0.05 | 3.20 | **14%** |

Although the raw DPRs are close, nearly half of a Lancer pilot's output comes from crit spikes, whereas 5e keeps crits a low-frequency surprise. This difference in design philosophy affects how "swingy" combat feels.

## 5. Design Implications for For Want of Fuel

**Frequency vs. Magnitude**  
Lancer ties crit frequency to skill progression and keeps the damage bump modest. 5e fixes frequency but doubles dice, making each crit spectacular.
    
**Variance Profile**  
Higher $p_{\text{crit}}$ with smaller k yields *moderate* variance increases in Lancer, while 5e produces *rare, high-variance* spikes. Consider whether FWOF wants steady upticks (maintains tactical predictability) or show-stopping moments.
    
**Scaling with Flat Bonuses**  
Both systems *exclude* flats from the multiplication, so weapons with large static riders nerf 5e crit scaling more severely than Lancer's highest-of-two rule. If FWOF leans on flat-heavy damage, adopting 5e-style doubling flattens crit impact.
    
**Psychological Impact**  
Lancer crits reward "feeling skilled" as the character improves  
5e crits reward "lucky moments" independent of build  
