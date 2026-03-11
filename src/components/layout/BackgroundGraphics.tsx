import React from 'react';

export const BackgroundGraphics = () => {
    return (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-20"></div>

            {/* Soft Ambient Glow - Saffron & White theme */}
            <div className="absolute top-0 left-0 w-full h-full opacity-40">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-saffron-200/30 dark:bg-saffron-900/10 blur-3xl animate-pulse" />
                <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] rounded-full bg-orange-100/40 dark:bg-orange-900/10 blur-3xl" />
                <div className="absolute bottom-[0%] left-[20%] w-[30%] h-[30%] rounded-full bg-slate-200/50 dark:bg-slate-800/20 blur-3xl" />
            </div>
        </div>
    );
};
