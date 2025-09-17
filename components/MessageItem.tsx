"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import type { Database } from '@/types_db';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export default function MessageItem({ message, allMessages }: { message: Message, allMessages: Message[] }) {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter(); 
  const [isReplying, setIsReplying] = useState(false);
  const [name, setName] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const replies = allMessages.filter(m => m.parent_id === message.id);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this message and all its replies?')) {
      await supabase.from('messages').delete().eq('id', message.id);
      router.refresh(); // Refresh the page after deleting
    }
  };

  const handleReplySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (replyContent.trim() === '' || name.trim() === '') return;

    const newReply: MessageInsert = {
      content: replyContent,
      name: name,
      parent_id: message.id 
    };

    await supabase.from('messages').insert(newReply);
    
    setIsReplying(false);
    setReplyContent('');
    setName('');
    router.refresh(); // Refresh the page after submitting a reply
  };

  // The styled JSX is the same as the last "make it look better" step
  return (
    <div style={{ marginTop: '20px' }}>
      <div className="message-card">
        <p>{message.content}</p>
        <div className="message-footer">
          <span>— by <strong>{message.name || 'Anonymous'}</strong> on {new Date(message.created_at).toLocaleString()}</span>
          <div className="message-actions">
            <button onClick={() => setIsReplying(!isReplying)}>{isReplying ? 'Cancel' : 'Reply'}</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>

      {isReplying && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name..." required />
          <input type="text" value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="Write a reply..." required />
          <button type="submit">Post Reply</button>
        </form>
      )}

      {replies.length > 0 && (
        <div className="replies-container">
          {replies.map(reply => (
            <MessageItem key={reply.id} message={reply} allMessages={allMessages} />
          ))}
        </div>
      )}
    </div>
  );
}