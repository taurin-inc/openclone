---
topic: "The AI Circular Capital Trap"
source_type: newsletter
source_url: "https://ethancho12.substack.com/p/the-ai-circular-capital-trap-a1a"
authorship: self
published_at: 2026-01-30
---
# The AI Circular Capital Trap

### A Structural Analysis of Financial Fragility in the Generative AI Ecosystem

**Author:** [애당초 미디움-레어](https://substack.com/@ethancho)  
**Date:** Jan 30, 2026

_“I’m not saying it’s a bubble. I’m saying when everyone agrees it’s not a bubble, it’s a bubble.”_

* * *

![Source: Bloomberg](https://substackcdn.com/image/fetch/$s_!kMZd!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0148234d-6468-4bd8-8a3b-59ae96e4b41d_2278x1456.png)

On the surface, the generative AI industry looks spectacular. OpenAI’s valuation at $300 billion, Microsoft’s RPO at $625 billion, Nvidia’s quarterly revenue at $35 billion. By the numbers alone, this is the fastest-growing industry in history.

But connect these numbers, and a strange picture emerges.

The money Microsoft invests in OpenAI returns as Azure revenue. That revenue boosts OpenAI’s valuation, and the higher valuation becomes unrealized gains on Microsoft’s investment. Meanwhile, OpenAI spends more on inference costs than it earns in revenue, requiring continuous fundraising.

Is this growth, or is the same money just spinning in circles?

This report is a (somewhat lengthy) attempt to answer that question.

* * *

## Part I. Minsky’s Financial Instability Hypothesis

### Stability Breeds Instability

In the 1980s, economist Hyman Minsky made a paradoxical argument: the more stable a financial system appears, the more unstable it becomes.

The logic goes like this. When the economy is good, businesses and investors grow bolder. Conservative lending standards loosen, leverage increases, and the belief that “this time is different” spreads. Then, when a small shock arrives, all the accumulated vulnerabilities are exposed at once.

Minsky classified the financial state of economic entities into three stages:

**Stage 1: Hedge Finance**  
Operating income is sufficient to cover both principal and interest on debt. The healthiest state.

**Stage 2: Speculative Finance**  
Operating income covers interest but not principal repayment. Refinancing is needed at every maturity. Vulnerable when interest rates rise or credit tightens.

**Stage 3: Ponzi Finance**  
Operating income is insufficient even to cover interest payments. Survival depends on attracting new investors or continued asset price appreciation. Named after Bernard Madoff’s Ponzi scheme.

Minsky’s insight: During boom times, Stage 1 companies gradually slip to Stage 2, and Stage 2 companies to Stage 3. All without anyone noticing.

* * *

### The “Minsky Moment”

A term that became famous during the 2008 financial crisis: the “Minsky Moment”—the instant when multiple economic entities simultaneously face cash shortages and insolvency.

That’s what happened with subprime mortgages. As long as home prices kept rising, everyone looked fine. Borrowers covered interest payments with home equity gains, banks securitized bad loans and sold them off, and investors trusted AAA ratings.

Then home prices stopped rising, and everything collapsed at once.

A similar structure is visible in the AI ecosystem.

* * *

## Part II. Circular Capital: The Structure Through Real Data

### Microsoft-OpenAI: Where Does the Money Come From, Where Does It Go?

In November 2025, tech journalist Ed Zitron obtained internal documents. Amounts OpenAI paid to Microsoft:

- Full year 2024: $494 million
- January-September 2025: $866 million

Industry estimates suggest OpenAI pays approximately 20% of revenue to Microsoft as a revenue share. Working backward, OpenAI’s revenue would be:

- 2024: approximately $2.5 billion
- 9 months of 2025: approximately $4.3 billion

So far, so good. Rapid growth.

But according to the same documents, OpenAI’s inference costs:

- 2024: $3.8 billion
- 9 months of 2025: $8.65 billion

Wait. Revenue of $4.3 billion against inference costs of $8.65 billion?

That’s right. OpenAI is spending twice as much on server operations as it earns. The more revenue grows, the larger the losses.

It gets more complicated. Microsoft also pays OpenAI a portion of Bing and Azure OpenAI Service revenue. Money flows both ways. How much “external” cash is actually coming in has never been disclosed.

* * *

### The Reality of $625 Billion RPO

On January 29, 2026, Microsoft announced quarterly results. The number that caught the market’s attention:

**RPO (Remaining Performance Obligations): $625 billion**

RPO is “contracted revenue yet to be recognized.” Contracts signed but not yet booked as revenue. Up 110% year-over-year. An enormous number.

But do you know where approximately 45% of this $625 billion—about $281 billion—came from?

The $250 billion Azure contract with OpenAI announced in October 2025.

The problem is that OpenAI doesn’t have the cash to fulfill this contract. A company whose inference costs alone exceed revenue—how will it pay $250 billion? It needs continuous external investment.

This is what Minsky called **Ponzi finance**. Unable to cover costs with operating cash flow, dependent on new investor money.

The market noticed. Microsoft’s stock fell 12% that day. $440 billion in market cap evaporated in a single day.

![Microsoft stock chart](https://substackcdn.com/image/fetch/$s_!ltwU!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F271f62cc-9c54-4075-8cd5-d19230ef9a73_1031x593.png)

* * *

### Mapping the Circular Structure

Let’s follow the money:

1. **Microsoft → OpenAI**: $11.6 billion investment
2. **OpenAI → Azure**: $250 billion contract signed
3. **Microsoft**: Books this as RPO, reinforcing the “growth story”
4. **OpenAI**: Covers training costs with Azure credits (non-cash)
5. **OpenAI**: Burns cash on inference costs → needs fundraising
6. **New investor attraction**: $6.6 billion in October 2024, pursuing $60 billion in January 2026
7. **Back to step 1**: Higher valuation increases unrealized gains for existing investors

In this structure, the only pure cash entering from “outside” is **new investor money**.

An analogy: moving money from my left pocket to my right pocket and declaring “I made income.”

* * *

## Part III. Lessons from History: The 2000 Telecom Bubble

### The Fall of Lucent Technologies

In the late 1990s, Lucent Technologies was the world’s leading telecom equipment company. A storied firm spun off from AT&T. Fiscal year 2000 results:

- Revenue: $33.6 billion
- Vendor Financing balance: $8.1 billion

What is “Vendor Financing”? Selling equipment to customers while also lending them the money to buy it.

Lucent’s customers were mostly new telecom companies (CLECs). They had no revenue and no cash. Lucent “sold” equipment to them while simultaneously lending them the purchase funds. Revenue was booked, but actual cash never came in.

The result? Lucent’s **operating cash flow was just $300 million**. Revenue of $33.6 billion, cash flow of $300 million. Less than 1%.

When the 2000 bubble burst, customer companies went bankrupt one after another. Loans couldn’t be recovered, and already-recognized revenue had to be reversed. Lucent was charged by the SEC with $1.148 billion in revenue manipulation.

* * *

### WorldCom and the Illusion of Demand

WorldCom was worse. They committed over $11 billion in accounting fraud.

One method was “capacity swaps.” They “exchanged” network capacity with competitors and each recognized it as revenue. No new value was created, but on paper, both sides showed increased revenue.

The bigger problem was that WorldCom’s aggressive investment stimulated competitors. “They’re investing that much—shouldn’t we?” The entire industry fell into overinvestment.

Result: Less than **10% of installed fiber optic cable was actually used**. The remaining 90% became “dark fiber.”

* * *

### Is AI Different?

Let’s compare the telecom bubble with AI infrastructure:

**Vendor Financing Ratio**
- Lucent: 24% of revenue
- Nvidia: 67% of revenue (including direct investments)

**Customer Concentration**
- Lucent top 2 customers: 23%
- Nvidia top 4 customers: 46%

**Customer Financial Health**
- Lucent customers (CLECs): Mostly unprofitable startups
- Nvidia customers (hyperscalers): Profitable, cash-rich

Looking only at this, AI appears much healthier.

But let’s go one level deeper. Who are the hyperscalers’ “customers”?

One of Microsoft Azure’s largest customers is OpenAI. And OpenAI doesn’t generate cash.

Just as it wasn’t Lucent’s customers that went bankrupt but **Lucent’s customers’ customers**, this time too, the crisis may be hiding one level back.

* * *

## Part IV. GPU Depreciation: A $176 Billion Time Bomb

### Michael Burry’s Warning

In November 2025, “Big Short” Michael Burry warned on X:

> “The economic life of GPUs is 2-3 years, but they’re recorded as 6-year assets on the books. This is earnings overstatement.”

A simple explanation of depreciation: Say you bought $1,000 worth of equipment. If you expense it all this year, this year’s profit drops by $1,000. But if you say “this equipment will be used for 5 years,” you expense $200 each year. This year’s profit only drops by $200.

The longer the estimated life, the lower the annual expense and the higher the profits.

Changes in hyperscaler server depreciation periods:
- Amazon 3 years → 6 years → Some shortened to 5 years
- Meta 3 years → 5 years → 5.5 years
- Microsoft 4 years→ 6 years → Maintained at 6 years

For Meta, extending server life in 2025 **reduced expenses by $2.3 billion over 9 months**. That much became additional profit.

Burry’s estimate: Between 2026-2028, **understated depreciation could total $176 billion**. (Personally, I think this estimate is somewhat excessive.)

* * *

### The Counterargument: “Value Cascade” Theory

The logic of those defending depreciation extensions:

1. New GPUs are used for model training in the first 2 years
2. The next 2 years, redeployed to premium inference services
3. The final 2 years, used for high-volume, low-cost processing

In fact, Azure’s GPU retirement data shows:
K80/P100 GPUs launched in 2014-2016 were retired in 2023 = **7-9 years of use**

* * *

### Reality Is Somewhere in Between

However, the “value cascade” theory has conditions:

1. There must be customers willing to use older GPUs
2. If AI models advance rapidly, demand for older GPUs could disappear
3. Nvidia’s product cycle has shortened from **18-24 months to 12 months**

Microsoft CEO Satya Nadella’s November 2025 statement:

> “I don’t want to be stuck with 4-5 years of depreciation on one generation of GPUs.”

The truth is somewhere between Burry’s 2-3 years and the industry’s 6 years. Where exactly “somewhere” falls could determine whether **hundreds of billions in earnings adjustments are needed**.

* * *

## Part V. The Leverage Chain: SoftBank-ARM-OpenAI

### Why SoftBank?

The structures discussed so far—Microsoft-OpenAI’s circular capital, GPU depreciation issues—represent risks distributed across the entire system. They could normalize slowly or face sudden adjustment.

But when **leverage is concentrated in one place**, the story changes. A small shock can trigger a chain reaction.

That point is SoftBank.

![Masayoshi Son](https://substackcdn.com/image/fetch/$s_!oAPk!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4ac999b6-45b5-4e10-aaac-b081dba912fb_225x225.jpeg)

At the July 2025 shareholder meeting, Chairman Masayoshi Son declared:

> “We will become number one in the world in ASI (Artificial Super Intelligence) platforms. I’m all in.”

He didn’t just talk. He actually went all in.

* * *

### The Structure of ARM-Collateralized Loans

SoftBank’s primary asset is UK chip design company ARM. SoftBank holds approximately 90% of ARM’s shares.

According to November 2025 disclosures:

- **ARM collateral loan limit**: $20 billion
- **Current usage**: $8.5 billion
- **Collateral**: 923 million ARM shares
- **Collateral value**: Approximately $130 billion (at ARM share price of $141)
- **Participating financial institutions**: 33

What are they doing with this money?

- **OpenAI investment**: $40 billion total commitment ($10 billion invested, $30 billion more coming)
- **Ampere Computing acquisition**: $6.5 billion
- **Stargate Project**: Key partner in $500 billion AI infrastructure plan

* * *

### Concentration Risk

SoftBank’s Net Asset Value (NAV) is approximately $224 billion. ARM’s stake accounts for **$122 billion, or 54.6%**.

The problem is that **ARM, OpenAI, and Stargate all depend on AI optimism**.

If the AI bubble deflates:
- OpenAI value drops → SoftBank investment losses
- AI chip demand concerns → ARM share price falls
- ARM price falls → Collateral value decreases → Margin call risk
- Margin call → Forced selling → ARM price falls further
- ARM price falls further → SoftBank NAV decreases → Credit deteriorates
- (Repeat)

This is the **“death spiral.”** The exact mechanism we saw with Lehman Brothers in 2008 and Terra/Luna in 2022.

* * *

### Margin Call Trigger Analysis

At what ARM share price does a margin call get triggered?

It depends on the Loan-to-Value (LTV) ratio, but from the current ARM price of $141 to $37 requires a 74% decline. That seems distant.

However, ARM shares fell to the $40s in 2022. It’s not an impossible number.

And remember **reflexivity**. If the market recognizes SoftBank’s vulnerability, the ARM share price decline itself could become a self-fulfilling spiral.

* * *

## Part VI. The Grey Zone of Accounting

### Related Party Transaction Disclosures

US GAAP requires disclosure of related party transactions. The nature, amounts, and terms of transactions must be revealed.

Microsoft is disclosing its transactions with OpenAI. Legally, no problem.

But **disclosure and accounting recognition are different**. The key question from Harvard Business School’s June 2025 case study:

> “Microsoft invested over $14 billion in OpenAI—why didn’t they recognize revenue from training workloads?”

If Microsoft had recognized training “revenue,” OpenAI’s costs would have increased simultaneously. OpenAI’s losses would have looked larger.

Under the current structure:
- Training costs = Non-cash (offset by Azure credits)
- Inference costs = Cash

Because training costs are “invisible,” OpenAI’s financial condition looks better than it actually is.

* * *

### Warning Signs of Circular Transactions

The PCAOB (Public Company Accounting Oversight Board) defines the following as fraud risk indicators:

1. **Round-trip transactions**: Transactions exchanging similar amounts
2. **Repurchase conditions**: Implicit repurchase obligation at time of sale
3. **Abnormal guarantees**: Guarantee relationships outside normal business

Does the Microsoft-OpenAI structure meet these criteria? There’s no clear answer. But structural similarities clearly exist.

Remember Lehman Brothers’ “Repo 105” from 2008. Legally it was a “sale,” but the economic substance was a collateralized loan. Everyone understood afterward, but no one questioned it beforehand.

* * *

## Part VII. Examining the Counterarguments

### “This Time Is Different”

**Counterargument 1: Hyperscalers have abundant cash**  
True. Combined operating cash flow of Microsoft, Alphabet, Amazon, and Meta exceeds $450 billion annually. Different from Lucent’s CLEC customers.  
**However**: The hyperscalers’ “customer,” OpenAI, doesn’t generate cash. The leverage has just hidden one level back.

* * *

**Counterargument 2: AI delivers real productivity gains**  
True. AI does create value.  
**However**: Value creation and monetization are different issues. The internet also created real value in 2000. The question was whether that value justified the amount of capital invested.

* * *

**Counterargument 3: GPU shortages mean no overinvestment**  
Hyperscalers cite GPU shortages. Microsoft mentioned “capacity constraints through at least June 2026.”  
**However**: “Shortage” can be interpreted two ways:
1. Demand exceeds supply (optimistic)
2. Cost structure is so inefficient that no amount of investment is enough (pessimistic)  
With OpenAI’s inference costs at twice its revenue, a significant portion of “demand” may be induced by unsustainable price subsidies.

* * *

### An Honest Admission

None of the core claims in this report are **definitively proven**.

- OpenAI’s exact unit economics are not public
- The 45% OpenAI share of Microsoft’s RPO is an estimate
- The “true” economic life of GPUs varies by usage pattern
- The exact terms of SoftBank’s margin loan are not public

However, **structural vulnerabilities are confirmed**:

- Existence of circular capital flows
- Core players exhibiting Ponzi finance characteristics
- Concentrated leverage structures
- Accounting discretion systematically exercised toward profit maximization

* * *

## Part VIII. Investment Implications

### The Timing Problem

> “Markets can remain irrational longer than you can remain solvent.” — John Maynard Keynes

Just because a bubble exists doesn’t mean it bursts tomorrow.

**Potential triggers:**
1. OpenAI’s $60 billion fundraising fails
2. Depreciation policy changes forced (regulator/auditor pressure)
3. SoftBank margin call (if ARM shares plunge)
4. AI model performance stagnates (Scaling Law limits exposed)
5. Macro shock (rate hikes, recession)

**Most likely scenario:**
- Second half 2026 ~ 2027
- OpenAI’s next major fundraising is the litmus test

* * *

### Core Insight

The conclusion of this analysis connects to the **Edge AI Thesis** I’ve long advocated.

In a structure where inference costs exceed revenue, centralized cloud AI is not sustainable. The real money will be made in inference efficiency technology, edge device AI, and specialized lightweight models.

Whether the bubble bursts or slowly deflates, the cost structure problem must be solved. Companies with that solution will be the winners of the next cycle.

* * *

## Conclusion: History Doesn’t Repeat, But It Rhymes

During the 2000 dot-com bubble, people said “this time is different.” The internet was actually changing the world, and they were right. But the fact that the internet created value didn’t justify the price of every internet stock.

In 2025, AI is actually changing the world. That’s true. **But the fact that AI creates value doesn’t justify the current capital structure.**

The structural problems this report has presented:

1. **Circular capital flows**: Money spinning between Microsoft-OpenAI-Nvidia
2. **Ponzi finance characteristics**: OpenAI cannot cover costs with operating cash flow
3. **Accounting illusions**: GPU depreciation extensions may have overstated earnings
4. **Concentrated leverage**: SoftBank’s ARM-collateralized loan could be the trigger for cascading collapse

No one knows how these problems will be resolved. They could normalize slowly or face sudden adjustment.

But one thing is certain: **When structural vulnerabilities exist, the trigger always comes from where no one expects.**

* * *

> _“As long as the music is playing, you’ve got to get up and dance. We’re still dancing.”_  
> — Chuck Prince, Citigroup CEO (2007, just before the subprime crisis)

* * *

## References

**Academic Papers**
- Minsky, H. (1992). The Financial Instability Hypothesis. Levy Economics Institute WP No. 74
- Vercelli, A. (2009). Minsky Moments, Russell Chickens and Grey Swans. Levy Economics Institute WP No. 579
- Heese, J. et al. (2025). Accounting for OpenAI at Microsoft. Harvard Business School Case 125-118

**Industry Analysis**
- Usvyatsky, O. (2025). Depreciation of GPUs: between useful lives and useful myths. Deep Quarry
- Tunguz, T. (2025). Nvidia and Lucent: A Comparison
- Azhar, A. (2025). Unpicking OpenAI’s real revenues. Exponential View

**Corporate Filings**
- Microsoft 10-K, 10-Q (2024-2025)
- SoftBank Group Annual Report (2025)
- SEC Enforcement Action: Lucent Technologies (2004)
