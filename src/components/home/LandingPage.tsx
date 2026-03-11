"use client";

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import AboutSection from '@/components/home/AboutSection';
import InitiativesSection from '@/components/home/InitiativesSection';

const LandingPage: React.FC = () => {
    const { isLoggedIn, openAuthModal } = useAppContext();
    const router = useRouter();

    const handleGetStarted = () => {
        if (isLoggedIn) {
            // In the new architecture, this might just refresh or do nothing 
            // since they should already be on the feed, but keeping for safety.
            router.push('/');
        } else {
            openAuthModal();
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-white">

            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center p-4 bg-dot-pattern overflow-hidden">
                {/* Radial Gradient overlay for subtle depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white/40 pointer-events-none" />

                <div className="relative z-10 text-center max-w-5xl mx-auto px-4 animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
                        Experience connection <br className="hidden md:block" />
                        with <span className="text-saffron-600">Visha Oswal</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light mb-12">
                        A dedicated space to connect, share opportunities, and preserve our heritage.
                        <br className="hidden md:block" /> Join the next-generation digital network built for our family.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <button
                            onClick={handleGetStarted}
                            className="px-8 py-4 rounded-full bg-slate-900 text-white font-semibold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Join the Community
                        </button>
                        <button className="px-8 py-4 rounded-full bg-white text-slate-700 font-semibold text-lg border border-slate-200 hover:bg-slate-50 transition-all hover:border-slate-300">
                            Learn more
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-8 text-slate-400 text-sm font-medium tracking-wider">
                    Connect &bull; Share &bull; Grow
                </div>
            </div>

            {/* About Section */}
            <AboutSection />

            {/* Initiatives Section */}
            <InitiativesSection />

        </div>
    );
};

export default LandingPage;
