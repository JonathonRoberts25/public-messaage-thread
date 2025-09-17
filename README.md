This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, create a database on Supabase.

Create a table called messages in SQL Editor using this code:
-------------------------------------------------------------
-- Create the messages table
CREATE TABLE public.messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  content TEXT NOT NULL,
  name TEXT,
  parent_id BIGINT,

  -- Create the relationship for replies
  CONSTRAINT messages_parent_id_fkey
    FOREIGN KEY (parent_id)
    REFERENCES public.messages(id)
    ON DELETE CASCADE
);

-- Turn off Row Level Security (RLS) for this simple project
-- WARNING: For a real application, you would create specific security policies.
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.messages
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for all users" ON public.messages
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON public.messages
AS PERMISSIVE FOR DELETE
TO public
USING (true);

-----------------------------------------------------------
Click the "Run" button.

In the left sidebar, click the Settings icon (the gear).
In the new sidebar, click "API".
Under the "Project API keys" section, you will find two crucial pieces of information:
Project URL: It will look like https://xxxxxxxx.supabase.co
Project API Keys -> anon public: This is a long string of characters. This is your "Anonymous Key".

In the root directory of your project, create a new file named exactly .env.local.
Copy the following template into that file:

NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL_HERE"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY_HERE"

Go back to your Supabase API settings page.
Copy your Project URL and paste it in place of YOUR_SUPABASE_URL_HERE.
Copy your anon public key and paste it in place of YOUR_SUPABASE_ANON_KEY_HERE.
Save the .env.local file.

In the terminal, you will set up the Supabase CLI and link it to your project:
npm install
npm install -g supabase
supabase login
supabase link --project-ref (your-project-ref)
supabase gen types typescript --linked > types_db.ts


Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


