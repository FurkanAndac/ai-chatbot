"use client";

import { cn } from '@/lib/utils';
import { ChatList } from '@/components/chat-list';
import { ChatPanel } from '@/components/chat-panel';
import { EmptyScreen } from '@/components/empty-screen';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { useEffect, useState } from 'react';
import { useUIState, useAIState } from 'ai/rsc';
import { Message, Session } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor';
import { toast } from 'sonner';
import { Header } from '@/components/header'; // Import the Header component

// Simple hash generator for validating credits (use a more secure hash function in production)
function generateHash(credits: number): string {
  const secretKey = 'your-secret-key'; // This should be a server-side secret or more secure
  return btoa(credits + secretKey); // Base64 encoding as a placeholder
}

// Function to assign initial credits and set up hash validation
function assignInitialCredits() {
  const credits = localStorage.getItem('creditsAmount');
  if (!credits) {
    localStorage.setItem('creditsAmount', '10');
    // Set a hash to validate credits later
    localStorage.setItem('creditsHash', generateHash(10));
  }
}

// Function to validate credits by comparing the stored hash with a generated hash
function validateCredits(credits: number): boolean {
  const storedHash = localStorage.getItem('creditsHash');
  return storedHash === generateHash(credits);
}

// **Function to reset credits to 10 for testing purposes**
function resetCreditsToTen() {
  localStorage.setItem('creditsAmount', '10'); // Set credits to 10
  localStorage.setItem('creditsHash', generateHash(10)); // Update the hash
  window.location.reload(); // Optional: reload the page to reflect changes
}

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
  session?: Session;
  missingKeys: string[];
}

export function Chat({ id, className, session, missingKeys }: ChatProps) {
  const router = useRouter();
  const path = usePathname();
  const [input, setInput] = useState('');
  const [messages] = useUIState();
  const [aiState] = useAIState();

  // Track the chat ID in localStorage
  const [_, setNewChatId] = useLocalStorage('newChatId', id);

  // Initial effect to assign and validate credits
  useEffect(() => {
    assignInitialCredits();

    const currentCredits = Number(localStorage.getItem('creditsAmount'));
    if (!validateCredits(currentCredits)) {
      // If tampering is detected, reset credits to 0
      toast.error('Credit tampering detected. Resetting credits to 0.');
      localStorage.setItem('creditsAmount', '0'); // Reset credits to 0
      localStorage.setItem('creditsHash', generateHash(0)); // Reset hash
      setCredits(0); // Update credits state
    }
  }, []);

  const [credits, setCredits] = useLocalStorage('creditsAmount', 10); // Default to 10 credits

  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`);
      }
    }
  }, [id, path, session?.user, messages]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    setNewChatId(id);
  });

  useEffect(() => {
    missingKeys.map(key => {
      toast.error(`Missing ${key} environment variable!`);
    });
  }, [missingKeys]);

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  // Function to deduct 1 credit when a message is sent
  const handleCreditDeduction = () => {
    const currentCredits = Number(localStorage.getItem('creditsAmount'));
    if (validateCredits(currentCredits)) {
      if (credits > 0) {
        const updatedCredits = credits - 1;
        setCredits(updatedCredits);
        // Update the hash to reflect the new credit count
        localStorage.setItem('creditsHash', generateHash(updatedCredits));
      } else {
        toast.error('No credits left!'); // Show error if no credits are left
      }
    } else {
      // If tampering is detected during message sending
      toast.error('Credit tampering detected. Resetting credits to 0.');
      localStorage.setItem('creditsAmount', '0'); // Reset credits to 0
      localStorage.setItem('creditsHash', generateHash(0)); // Reset hash
      setCredits(0); // Update credits state
    }
  };

  return (
    <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]" ref={scrollRef}>
      
      {/* Header displaying dynamic credits */}
      
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)} ref={messagesRef}>
        {messages.length ? (
          <ChatList messages={messages} isShared={false} session={session} />
        ) : (
          <EmptyScreen />
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <div className="flex justify-between items-center p-4">
        <div>Credits: {credits}</div> {/* Display remaining credits */}
        {/* Temporary button to reset credits to 10 for testing */}
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={resetCreditsToTen}>
          Reset Credits to 10
        </button>
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        onSendMessage={handleCreditDeduction} // Pass handleCreditDeduction unconditionally
      />
    </div>
  );
}
