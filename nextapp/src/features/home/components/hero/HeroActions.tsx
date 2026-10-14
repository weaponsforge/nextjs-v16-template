import type { ReactNode } from 'react'

import Image from 'next/image'

import { Button, buttonVariants } from '@/components/ui/button'

const DEPLOY_URL =
  'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
const DOCS_URL =
  'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'

/** Pill sizing shared by every call-to-action. */
const ACTION_CLASS_NAME = 'h-12 w-full rounded-full px-5 text-base md:w-40'

/**
 * Home page calls-to-action. Links use `buttonVariants()` to keep link
 * semantics; `Button` is reserved for actions.
 * @returns The row of call-to-action links and buttons.
 */
export function HeroActions(): ReactNode {
  const deployClassName = buttonVariants({ className: ACTION_CLASS_NAME })
  const docsClassName = buttonVariants({
    variant: 'outline',
    className: ACTION_CLASS_NAME,
  })

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <a
        className={deployClassName}
        href={DEPLOY_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          className="dark:invert"
          src="/vercel.svg"
          alt="Vercel logomark"
          width={16}
          height={16}
        />
        Deploy Now
      </a>
      <a
        className={docsClassName}
        href={DOCS_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Documentation
      </a>
      <Button type="button" variant="outline" className={ACTION_CLASS_NAME}>
        Get Started
      </Button>
    </div>
  )
}
