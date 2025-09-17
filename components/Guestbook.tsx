"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState, FormEvent } from 'react';
import type { Database } from '@/types_db';
import MessageItem from './MessageItem';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export default function Guestbook({ serverMessages }: { serverMessages: Message[] }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const [name, setName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  const topLevelMessages = serverMessages.filter(m => m.parent_id === null);

  useEffect(() => {
    const channel = supabase
      .channel('realtime messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' },
        () => {
          // On any change from another user, refresh the page to get the latest data.
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newMessage.trim() === '' || name.trim() === '') return;

    const messageToInsert: MessageInsert = { 
      content: newMessage,
      name: name,
    };

    await supabase.from('messages').insert(messageToInsert);

    setNewMessage('');
    setName('');
    router.refresh(); // Refresh the page after you submit a new top-level message
  };

  // The styled JSX is the same
  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="guestbook-form">
        <h3>Leave a new message</h3>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name..." required />
        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Write a message..." required />
        <button type="submit">Sign Guestbook</button>
      </form>

      <div>
        {topLevelMessages.map((message) => (
          <MessageItem key={message.id} message={message} allMessages={serverMessages} />
        ))}
      </div>
    </div>
  );
}