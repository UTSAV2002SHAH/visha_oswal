"use client";

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { HomeIcon } from '../ui/icons/HomeIcon';
import { CalendarIcon } from '../ui/icons/CalendarIcon';
import { CreateIcon } from '../ui/icons/CreateIcon';
import { GalleryIcon } from '../ui/icons/GalleryIcon';
import { SearchIcon } from '../ui/icons/SearchIcon';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';

const NavIcon: React.FC<{ children: React.ReactNode; tooltip: string; label?: string; onClick?: () => void; isActive?: boolean }> = ({ children, tooltip, label, onClick, isActive }) => (
  <div className="group relative flex flex-col items-center">
    <button onClick={onClick} className={`transition-colors duration-200 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${isActive ? 'text-saffron-600 dark:text-saffron-500' : 'text-slate-600 dark:text-slate-300 hover:text-saffron-600 dark:hover:text-saffron-400'}`} aria-label={tooltip}>
      {children}
    </button>
    {label && <span className={`text-xs font-medium mt-1 ${isActive ? 'text-saffron-600 dark:text-saffron-500' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>}
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
      {tooltip}
    </div>
  </div>
);

const Navbar: React.FC = () => {
  const { isLoggedIn, openAuthModal, openCreatePostModal } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();

  return (
    // We hide the entire nav on mobile screens (`hidden sm:block`) to prevent conflicts with BottomNav
    <nav className="hidden sm:block fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left Zone: Brand / Logo — simplified on mobile */}
          <div className="flex-shrink-0 cursor-pointer flex items-center" onClick={() => router.push('/')}>
            <div className="relative w-32 h-10 sm:w-40 sm:h-12 flex-shrink-0">
              <Image
                src="/visha-oswal-tree-logo.png"
                alt="Visha Oswal Logo"
                fill
                sizes="(max-width: 640px) 128px, 160px"
                className="object-contain drop-shadow-sm"
                priority
              />
            </div>
          </div>

          {isLoggedIn ? (
            <>
              {/* Center Zone: DESKTOP nav only — strictly centered */}
              <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-6">
                <NavIcon tooltip="Home" label="Home" onClick={() => router.push('/')} isActive={pathname === '/'}>
                  <HomeIcon className="w-6 h-6" />
                </NavIcon>
                <NavIcon tooltip="Events" label="Events" onClick={() => router.push('/events')} isActive={pathname === '/events'}>
                  <CalendarIcon className="w-6 h-6" />
                </NavIcon>
                <NavIcon tooltip="Gallery" label="Gallery" onClick={() => router.push('/gallery')} isActive={pathname === '/gallery'}>
                  <GalleryIcon className="w-6 h-6" />
                </NavIcon>
                <NavIcon tooltip="Search" label="Search" onClick={() => router.push('/search')} isActive={pathname === '/search'}>
                  <SearchIcon className="w-6 h-6" />
                </NavIcon>
              </div>

              {/* Right Zone: Utilities & Actions */}
              <div className="hidden sm:flex items-center justify-end gap-4 flex-1">
                {/* Search */}
                <div className="w-64 max-w-sm">
                  <SearchBar />
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => openCreatePostModal()}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-2 px-4 rounded-full transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <CreateIcon className="w-5 h-5" />
                  <span className="text-sm">Create Post</span>
                </button>

                {/* Avatar — navigates to /profile */}
                <UserMenu />
              </div>

              {/* MOBILE top bar — just shows avatar on the right, bottom nav handles the rest */}
              <div className="flex sm:hidden items-center justify-end flex-1">
                <UserMenu />
              </div>
            </>
          ) : (
            /* Logged-out nav */
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => router.push('/')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Home</button>
                <button onClick={() => router.push('/events')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Events</button>
                <button className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">About Us</button>
              </div>
              <button
                onClick={openAuthModal}
                className="bg-slate-900 text-white font-medium px-5 py-2 rounded-full hover:bg-slate-800 transition-all duration-200 text-sm"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;