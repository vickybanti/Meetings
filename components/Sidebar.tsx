'use client'

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {
    const pathname= usePathname()
  return (
    <section className='sticky left-0 top-0 h-screen w-fit flex-col justify-between bg-[#1C1F2E] pt-28 p-6 text-white max-sm:hidden lg-w-[264px]'>
        <div className="flex-1 flex-col gap-6">
            {sidebarLinks.map((link) => {
                const isActive  = pathname === link.route || pathname?.startsWith(`${link.route}/`)
                return (
                    <Link 
                    href={link.route} 
                    key={link.label} 
                    className={cn('flex gap-4 items-center p-4 rounded-lg w-full max-w-60 justify-start',{'bg-[#0E78F9]':isActive}
                    )}>

                        <Image
                        src={link.imgUrl}
                        alt={link.label}
                        width={24}
                        height={24}
                        className={cn({'text-white':isActive})}
                        />

                        <p className='text-lg font-semibold max-lg:hidden'>{link.label}</p>

                    </Link>
                )
            })}
        </div>
    </section>
)
}

export default Sidebar