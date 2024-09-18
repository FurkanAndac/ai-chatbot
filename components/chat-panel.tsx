import * as React from 'react';

import { shareChat } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { PromptForm } from '@/components/prompt-form';
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom';
import { IconShare } from '@/components/ui/icons';
import { FooterText } from '@/components/footer';
import { ChatShareDialog } from '@/components/chat-share-dialog';
import { useAIState, useActions, useUIState } from 'ai/rsc';
import type { AI } from '@/lib/chat/actions';
import { nanoid } from 'nanoid';
import { UserMessage } from './stocks/message';

export interface ChatPanelProps {
  id?: string;
  title?: string;
  input: string;
  setInput: (value: string) => void;
  isAtBottom: boolean;
  scrollToBottom: () => void;
  onSendMessage: (() => void) | undefined; // Function to call when a message is sent (e.g., for credit deduction)
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  onSendMessage, // Destructure the onSendMessage function from props
}: ChatPanelProps) {
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
    // Deduct credits when sending messages
    const handleSendMessage = () => {
      // You can include your logic to deduct credits here
      if (onSendMessage) {
        onSendMessage(); // Deduct credits when a message is sent
      } else {
        Error("No credits available!");
      }
    };
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  const exampleMessages = [
    {
      heading: 'Can you provide',
      subheading: '20 mock data on user profiles?',
      message: `Can you provide me with 20 mock data on user profiles?`,
    },
    {
      heading: 'What format suits ',
      subheading: 'my project the best?',
      message: 'What format suits my project the best?',
    },
    {
      heading: 'How can I use',
      subheading: 'mock data in my application?',
      message: `How can I use the generated mock data in my application?`,
    },
    {
      heading: 'How do you ensure',
      subheading: `the data is realistic and varied?`,
      message: `How do you ensure the generated data is realistic and varied?`,
    },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                  // Add example message to chat
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>,
                    },
                  ]);

                  // Call onSendMessage function to deduct credits


                  // Submit example message and get the response
                  const responseMessage = await submitUserMessage(example.message);

                  // Add response message to chat
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    responseMessage,
                  ]);
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">{example.subheading}</div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button variant="outline" onClick={() => setShareDialogOpen(true)}>
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages,
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          {/* PromptForm now triggers onSendMessage */}
          <PromptForm
            input={input}
            setInput={setInput}
            onSubmit={async (userInput) => {
              if (userInput.trim()) {
                // Add user's input to chat
                // setMessages((currentMessages) => [
                //   ...currentMessages,
                //   {
                //     id: nanoid(),
                //     display: <UserMessage>{userInput}</UserMessage>,
                //   },
                // ]);

                // Call onSendMessage function to deduct credits
                handleSendMessage()
                // Submit user's input and get the AI's response
                // const responseMessage = await submitUserMessage(userInput);

                // // Add the AI's response to the chat
                // setMessages((currentMessages) => [
                //   ...currentMessages,
                //   responseMessage,
                // ]);
              }
            }}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
