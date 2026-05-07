# 🧾 ShopLedger — Voice‑Driven Accounting for Small Businesses

ShopLedger is a conversational AI application that transforms any small business owner into a fully‑equipped accountant—just by talking.

## How It Works (First Run)
1. User opens the app and says: "I want to set up my shop."
2. ShopLedger asks one question at a time:
   - What is your name?
   - What is your business type?
   - What is your shop name?
3. Then, category by category:
   - Tell me your product categories one by one. Say "done" when finished.
   - For each category, list subcategories. Say "done" when finished.
4. For each item:
   - How many do you have?
   - What is the purchase price?
   - What is the selling price?
5. When setup is complete: "Your inventory is ready."

## Daily Use
- **Record a sale:** "I sold 2 tires from 'Car Parts > Tires' for 500 each."
- **Daily report:** "How much did I sell today?"
- **Profit calculation:** "What was my profit today?"
- **Add category:** "Add new category: Engine Oil."
- **Add product:** "Add product to Engine Oil: 10W40."
- **Inventory check:** "Give me the full inventory list."
- **Invoicing:** "Generate an invoice for today's sales."

## Technical Notes
- Runs on NeoOS with persistent memory across sessions.
- All data stored locally with optional cloud backup.
- Free tier: single shop, unlimited products. VIP tier: multi‑shop, advanced analytics.

## Companion Repositories
- **NeoOS (OS):** https://github.com/axamir/NeoOS
- **Softwares (Market):** https://github.com/axamir/softwares
- **Shahnameh of Agents (History & Law):** https://github.com/axamir/shahnameh-of-agents
