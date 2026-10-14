import type { ReactNode } from 'react'

const TEMPLATES_URL =
  'https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
const LEARN_URL =
  'https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'

/**
 * Home page heading with links to Next.js templates and learning resources.
 * @returns The intro heading and description.
 */
export function HeroIntro(): ReactNode {
  return (
    <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
      <h1 className="max-w-xs text-3xl leading-10 font-semibold tracking-tight text-foreground">
        To get started, edit the page.tsx file.
      </h1>
      <p className="max-w-md text-lg leading-8 text-muted-foreground">
        Looking for a starting point or more instructions? Head over to{' '}
        <a href={TEMPLATES_URL} className="font-medium text-foreground">
          Templates
        </a>{' '}
        or the{' '}
        <a href={LEARN_URL} className="font-medium text-foreground">
          Learning
        </a>{' '}
        center.
      </p>
    </div>
  )
}
