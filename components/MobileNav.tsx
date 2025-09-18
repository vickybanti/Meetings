"use client"
import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <section className='w-full max-w-[264px]'>
      <Sheet>
  <SheetTrigger asChild>
    <Image
    src="/icons/hamburger.svg"
    alt="menu"
    width={36}
    height={36}
    className='cursor-pointer text-white sm:hidden'
    />
  </SheetTrigger>
  <SheetContent side="left" className='border-none bg-[#1C1F2E]'>
 <Link href="/" className="flex items-center gap-1">

 <Image src="/icons/logo.svg"
          alt="logo" width={32} height={32} 
          className='max-sm:size-10'/>
         <p className="text-[26px] font-extrabold text-white">Zoom Clone</p>
    </Link>

    <div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto'>
      <SheetClose asChild>
      <section className='pt-16 flex flex-col gap-6 text-white'>
         {sidebarLinks.map((link) => {
                const isActive  = pathname === link.route;
                return (
                  <SheetClose asChild key={link.route}>
                    <Link 
                    href={link.route} 
                    key={link.label} 
                    className={cn('flex gap-4 items-center p-4 rounded-lg w-full max-w-60 mx-4 justify-start',{'bg-[#0E78F9]':isActive}
                    )}>

                        <Image
                        src={link.imgUrl}
                        alt={link.label}
                        width={20}
                        height={20}
                        className={cn({'text-white':isActive})}
                        />

                        <p className='font-semibold'>{link.label}</p>

                    </Link>
                    </SheetClose>
                )
            })}
      </section>
      </SheetClose>
    </div>

</SheetContent>
</Sheet>
    </section>
  )
}

export default MobileNav