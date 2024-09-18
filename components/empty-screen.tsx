import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to Mockdatagen AI Chatbot!
        </h1>
        <p className="leading-normal text-muted-foreground">
          This is an AI driven chatbot called{' '}
          <ExternalLink href="https://mockdatagen.ai">MockDataGen.ai</ExternalLink>
          built with the user in mind. The chatbot is a mock data generator, 
          but also helps with questions about mock data in general.{' '}
          {/* <ExternalLink href="https://sdk.vercel.ai">
            Vercel AI SDK
          </ExternalLink>
          , and{' '}
          <ExternalLink href="https://vercel.com/storage/kv">
            Vercel KV
          </ExternalLink> */}
          
        </p>
        <p className="leading-normal text-muted-foreground">
          {/* It uses{' '}
          <ExternalLink href="https://vercel.com/blog/ai-sdk-3-generative-ui">
            React Server Components
          </ExternalLink>{' '} */}
          Furthermore, we work with a credit system where 1 credit = 1 message.
          Users that are not signed in will get 10 credits to spend, if you enjoy
          our services we welcome you to upgrade your plan here.
        </p>
      </div>
    </div>
  )
}
