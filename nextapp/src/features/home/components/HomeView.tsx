import type { ReactNode } from 'react'

import Image from 'next/image'

import { HeroActions } from './hero/HeroActions'
import { HeroIntro } from './hero/HeroIntro'
import { Menu } from './Menu'

/**
 * Home page content: logo, menu, intro and calls-to-action.
 * @returns The full home page view.
 */
export function HomeView(): ReactNode {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-background px-16 py-32 sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <Menu />
        <HeroIntro />
        <HeroActions />
      </main>
    </div>
  )
}
