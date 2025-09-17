import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types_db'; // We will generate this next
import Guestbook from '@/components/Guestbook'; // We will create this next

// This tells Next.js to always render this page dynamically
export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  // Fetch the initial list of messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h1>Simple Guestbook</h1>
      {/* We pass the initial messages to the client component */}
      <Guestbook serverMessages={messages || []} />
    </div>
  );
}