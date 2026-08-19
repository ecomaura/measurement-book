# The Measurement Book — Complete Beginner Setup Guide

This guide assumes you've never used GitHub, Supabase, or Vercel before. Follow
it top to bottom, in order. It should take about 30–45 minutes the first time.

You do **not** need to know how to code. You do **not** need to install
anything on your computer if you follow the "no terminal" path marked below.

---

## What you'll end up with

- A live web app link (like `measurement-book.vercel.app`) that works on
  iPad, Android, and any computer
- A free database (Supabase) storing all client and measurement data
- Login accounts for your staff
- Everything free, no credit card required

---

## Part 1 — Create your accounts

You need three free accounts. Create them in this order, using the **same
email address** for all three if possible (makes life easier later).

### 1.1 GitHub account
GitHub is just a storage place for the app's code.

1. Go to **github.com**
2. Click **Sign up**
3. Enter your email, create a password, choose a username
4. Verify your email when prompted

### 1.2 Supabase account
Supabase is your free database.

1. Go to **supabase.com**
2. Click **Start your project** / **Sign up**
3. Choose **Continue with GitHub** (easiest — links it to the account you
   just made)

### 1.3 Vercel account
Vercel is what makes your app live on the internet.

1. Go to **vercel.com**
2. Click **Sign up**
3. Choose **Continue with GitHub**

You now have all three accounts, linked together. Everything from here on
uses these same logins.

---

## Part 2 — Set up the database (Supabase)

### 2.1 Create a new project

1. Log into **supabase.com**
2. Click **New project**
3. Fill in:
   - **Name**: `measurement-book` (or anything)
   - **Database password**: click "Generate a password" and **save it
     somewhere** (a notes app is fine) — you likely won't need it again, but
     keep it safe
   - **Region**: pick the one closest to you (e.g. Mumbai, if available)
4. Click **Create new project**
5. Wait 1–2 minutes while Supabase sets things up

### 2.2 Create the database tables

This step creates the actual storage structure — client list, measurement
history, etc.

1. In the left sidebar, click **SQL Editor**
2. Click **New query**
3. Open the file `supabase/schema.sql` from the project folder I gave you
   (open it in Notepad, TextEdit, or any text editor — just to copy the
   text, you're not running it locally)
4. Copy **all** the text from that file
5. Paste it into the Supabase SQL editor box
6. Click **Run** (bottom right, or press Ctrl+Enter / Cmd+Enter)
7. You should see "Success. No rows returned" — that means it worked

If you see a red error instead, stop and check you copied the *entire* file,
including the very first line.

### 2.3 Add staff login accounts

This is who's allowed to open the app — there's no public sign-up page on
purpose.

1. In the left sidebar, click **Authentication**
2. Click **Users**
3. Click **Add user** → **Create new user**
4. Enter an email and password for yourself (or the client, or each staff
   member) — repeat this for everyone who needs access
5. Leave "Auto Confirm User" turned **on** so they can log in immediately

### 2.4 Get your two connection keys

You'll need these in Part 4.

1. In the left sidebar, click the **gear/Settings** icon → **API**
2. You'll see two values — keep this tab open, or copy both into a notes
   app:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (a long string of letters/numbers)

Do not share these publicly in a place strangers can see, but they're safe
to use in the setup steps below.

---

## Part 3 — Upload the code to GitHub

Pick **one** of the two options below. Option A is easier if you've never
used a terminal.

### Option A — No terminal, using GitHub's website (recommended for beginners)

1. Unzip the `measurement-book.zip` folder I gave you on your computer
2. Go to **github.com**, log in
3. Click the **+** icon (top right) → **New repository**
4. Name it `measurement-book`, leave it **Public** or **Private** (either
   works), don't check any of the extra boxes, click **Create repository**
5. On the next page, click **uploading an existing file**
6. Open the unzipped `measurement-book` folder on your computer, select
   **all** the files and folders inside it, and drag them into the browser
   window
   - Important: drag the *contents* of the folder, not the folder itself
7. Scroll down, click **Commit changes**

Your code is now on GitHub.

### Option B — Using a terminal (if you're comfortable with it)

```bash
cd measurement-book
git init
git add .
git commit -m "Initial commit"
```

Then create an empty repository on GitHub (steps 3–4 above, but stop before
uploading files), and run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/measurement-book.git
git branch -M main
git push -u origin main
```

---

## Part 4 — Deploy the app (Vercel)

1. Log into **vercel.com**
2. Click **Add New...** → **Project**
3. Find `measurement-book` in the list (it should appear since Vercel is
   linked to your GitHub) and click **Import**
4. Before clicking Deploy, look for **Environment Variables** on this same
   screen. Add these two, one at a time:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | paste the Project URL from step 2.4 |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | paste the anon public key from step 2.4 |

5. Click **Deploy**
6. Wait 1–2 minutes. When it's done, you'll see "Congratulations" and a
   screenshot of your live app

Click **Visit** — you now have a live link, something like
`measurement-book-yourname.vercel.app`. This works from any phone, tablet,
or computer with internet.

---

## Part 5 — First login and test

1. Open your new Vercel link on the device you'll actually use day to day
   (e.g. the iPad)
2. You'll land on a **Sign in** screen — use one of the staff emails/
   passwords you created in step 2.3
3. Once logged in, click **+ New client**, add a test client
4. Open that client, add a Blouse measurement, save it
5. Click **print** on that record to check the print layout — connect your
   thermal printer at this point to test end to end

If login fails: double check the email/password matches exactly what you
created in Supabase (Part 2.3), and that "Auto Confirm User" was on.

If the app loads but shows a blank error instead of a login screen: double
check the two environment variable values in Vercel (Part 4, step 4) — a
typo in the URL or key is the most common cause.

---

## Bookmark this for later: making changes

Any time you (or I) want to change something about the app:

1. Update the files
2. Upload the changed files to the same GitHub repo (Option A, step 6 —
   GitHub will ask if you want to replace the old ones, say yes)
3. Vercel automatically redeploys within a minute or two — no extra steps
   needed on Vercel's side

---

## Quick reference — what goes where

| Thing | Where it lives |
|---|---|
| App code | GitHub |
| Client & measurement data | Supabase (Postgres database) |
| Staff logins | Supabase → Authentication → Users |
| Live app hosting | Vercel |
| Daily automatic backups | Supabase (built in, free) |
| Manual backup download | Inside the app → "export backup" button |

---

## If you get stuck

Take a screenshot of exactly where you are and any error message, and send
it over — that's usually enough to pinpoint what's wrong without you needing
to describe it in technical terms.
