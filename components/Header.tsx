import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs'
import Image from 'next/image'
export default function Header() {
	return (
		<header className="bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
				<div className="flex items-center space-x-2">
					{/* <!-- Biểu tượng/Logo đơn giản --> */}
					<Image src="/logo.png" alt='' width="100" height="50"/>
					<a href="/">
						<span className="text-xl font-bold text-gray-900">The Mindful Journal</span>
					</a>
				</div>
				<nav className="space-x-4">
					{/* <a href="#features" className="text-text-soft hover:text-primary-calm transition duration-300">Tính Năng</a>
					<a href="#safety" className="text-text-soft hover:text-safe-alert transition duration-300">An Toàn</a> */}
					<SignedOut>
						<SignInButton>
							<button className="cursor-pointer">
								Sign in
							</button>
						</SignInButton>
						<SignUpButton>
							<button className="cursor-pointer">
								Sign Up
							</button>
						</SignUpButton>
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</nav>
			</div>
		</header>
	)
}