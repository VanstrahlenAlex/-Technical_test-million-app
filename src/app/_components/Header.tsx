"use client";
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs';
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function Header() {
	const path = usePathname();
	const { user, isSignedIn } = useUser();

	return (
		<div className='fixed top-0 w-full z-50 bg-white border-b border-gray-100 shadow-sm'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo y Navegación */}
					<div className='flex items-center gap-10'>
						<Link href="/">
							<Image
								src="/million_and_up_logo.jpg"
								alt="Million & Up"
								width={130}
								height={40}
								className="h-8 w-auto object-contain"
							/>
						</Link>

						<nav className='hidden md:flex gap-8'>
							{[
								{ href: '/for-sell', label: 'For Sell' },
								{ href: '/for-rent', label: 'For Rent' },
								{ href: '/agent-finder', label: 'Agent Finder' }
							].map((item) => (
								<Link key={item.href} href={item.href}>
									<span className={`transition-colors duration-200 font-medium text-sm ${path === item.href
											? 'text-gray-600 font-semibold'
											: 'text-gray-700 hover:text-gray-900'
										}`}>
										{item.label}
									</span>
								</Link>
							))}
						</nav>
					</div>

					{/* Acciones */}
					<div className='flex items-center gap-3'>
						<Link href="/add-new-listing">	
							<Button className='flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white text-sm'>
								<Plus className='h-4 w-4' />
								Post Your Ad
							</Button>
						</Link>
						{isSignedIn && user ? (
							<UserButton
								appearance={{
									elements: {
										avatarBox: "w-8 h-8 rounded-lg border border-gray-200",
										rootBox: "rounded-lg",
									}
								}}
							/>
						) : (
							<Link href="/sign-in">
								<Button variant="outline" className='text-gray-700 border-gray-300 hover:bg-gray-50 text-sm'>
									Login
								</Button>
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

