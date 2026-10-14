import type { ReactNode } from 'react'

import { RibbonCard } from '@/components/shared/RibbonCard'

export function Header(): ReactNode {
  return (
    <div className="flex justify-center items-center gap-4 w-full min-h-4 p-4 bg-lime-100 font-bold text-3xl">
      <div>Welcome ➜</div>
      <RibbonCard title="Next.js" description="Development" />
    </div>
  )
}
