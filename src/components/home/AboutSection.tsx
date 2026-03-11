import React from 'react';
import Link from 'next/link';

const AboutSection: React.FC = () => {
    return (
        <section className="w-full py-20 px-4 bg-white relative">
            {/* Decorative subtle pattern or gradient if needed, keeping it clean for now */}
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 font-serif">
                    Our Vision
                </h2>

                <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-10">
                    <p>
                        The Visha Oswal community stands as a beacon of unity, compassion, and progress.
                        Rooted in our rich traditions and guided by the principles of Jainism, we strive to
                        foster a supportive environment where every family feels connected and empowered.
                    </p>
                    <p>
                        Our vision is to build a vibrant network that bridges generations, preserves our cultural
                        heritage, and encourages social and professional growth. Together, we celebrate our past
                        while paving the way for a prosperous future.
                    </p>
                </div>

                <Link href="/about">
                    <button className="px-8 py-3 rounded-full bg-saffron-500 text-white font-semibold text-lg hover:bg-saffron-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        Read More
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default AboutSection;
