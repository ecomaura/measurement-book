# The Measurement Book

A digital measurement book for Blouse and Kurta Set client fittings — date-wise
history, never overwritten, with a clean thermal-printer slip per record.

## What's inside

- **Next.js 14** (App Router) — deploys free on Vercel
- **Supabase** — free Postgres database + staff login + daily backups
- Two measurement forms (Blouse, Kurta Set) matching your exact field list
- Every save creates a new dated record — nothing is ever overwritten
- Latest record is tagged and shown first; older ones stay accessible
- Edit fixes a specific record in place; Delete is a soft-delete (recoverable)
- Print view: client name only, no contact/date, sized for 58mm or 80mm
  thermal rolls
- "Export backup" button — one-click JSON download of everything, on top of
  Supabase's own daily backups

---

## 1. Set up Supabase (free)

1. Go to [supabase.com](https://supabase.com) → create a free account and a
   new project (pick a region close to you, e.g. Mumbai).
2. Once the project is ready, open **SQL Editor** → **New query**, paste the
   contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it.
   This creates the `clients` and `measurements` tables plus the security
   rules that keep data staff-only.
3. Go to **Authentication → Users → Add user**, and create a login (email +
   password) for each staff member who should have access. There's no public
   sign-up page in this app on purpose — accounts are added by you here.
4. Go to **Project Settings → API**. Copy the **Project URL** and the
   **anon public key** — you'll need both in step 3 below.

Backups: Supabase automatically takes daily backups of your database on the
free tier. Nothing to configure. The in-app "export backup" button is an
extra safety net on top of that.

## 2. Push this project to GitHub

```bash
cd measurement-book
git init
git add .
git commit -m "Initial commit"
```

Create a new empty repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/measurement-book.git
git branch -M main
git push -u origin main
```

## 3. Deploy on Vercel (free)

1. Go to [vercel.com](https://vercel.com) → sign up with GitHub → **Add New
   Project** → pick this repo.
2. Before deploying, add two environment variables (from Supabase step 4):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click **Deploy**. You'll get a live URL like
   `measurement-book.vercel.app` — this works immediately on iPad, Android,
   and desktop, no custom domain required.

To run it locally first: copy `.env.local.example` to `.env.local`, fill in
the same two values, then:

```bash
npm install
npm run dev
```

## 4. Using it day to day

- **Add a client** from the home screen.
- Open a client → switch between the **Blouse** and **Kurta Set** tabs.
- **Add new measurement** creates a new dated record — the previous one is
  kept, untouched, further down the history.
- **Edit** only changes that specific record (e.g. fixing a typo) — it never
  touches other dates.
- **Delete** soft-deletes a record — it disappears from the app but isn't
  permanently destroyed at the database level.
- **Print** opens a clean slip for that one record — client name at the top,
  each measurement on its own line, no contact number or date. Choose 58mm
  or 80mm to match the roll in your thermal printer, then use the browser's
  print dialog (the printer must already be paired/installed as a system
  printer on the iPad — see printer notes below).

## 5. Thermal printer notes

- Confirm the printer supports **AirPrint** (iPad) before buying — this is
  the one thing that determines whether "Print" here will find it.
- It should be a **continuous-roll** printer (58mm or 80mm), not a
  fixed-size/photo printer — Canon's PIXMA/SELPHY/IVY lineup does **not**
  support this; look at MUNBYN, Rongta, Epson TM-P series, or similar.
- The print CSS has no fixed page height — the slip grows to fit however
  many fields are filled in, and the roll just keeps feeding.

## Extending later

- Custom domain: buy one (Namecheap/Porkbun) and add it in Vercel's project
  settings → Domains — five-minute change, no code required.
- More garment types: duplicate the field list pattern in `lib/fields.ts`
  and add a new tab in `app/clients/[id]/page.tsx`.
