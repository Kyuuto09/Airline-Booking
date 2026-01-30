import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const creditRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(logoRef.current, 
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 1.2 }
    )
    .fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.5"
    )
    .fromTo(subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.6"
    )
    .fromTo(buttonRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      "-=0.4"
    )
    .fromTo(creditRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.2"
    );

    // Background animation effect
    gsap.to(".bg-shape", {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "linear"
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-shape absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-400/10 blur-3xl"></div>
        <div className="bg-shape absolute top-[40%] -right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-3xl" style={{ animationDirection: 'reverse' }}></div>
        <div className="bg-shape absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-sky-400/10 blur-3xl"></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center px-4">
        {/* Logo */}
        <div ref={logoRef} className="mb-8 p-6 bg-white rounded-3xl shadow-xl shadow-blue-200/50">
           <svg className="w-24 h-24 text-[#1a73e8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
           </svg>
        </div>

        {/* Text Content */}
        <h1 ref={titleRef} className="font-heading text-5xl md:text-7xl font-bold text-[#202124] mb-4 tracking-tight">
          SkyBook
        </h1>
        
        <p ref={subtitleRef} className="text-xl md:text-2xl text-[#5f6368] mb-12 max-w-2xl font-light">
          Experience the world with comfort and style. <br/> Your premium journey starts here.
        </p>

        {/* CTA Button */}
        <button
          ref={buttonRef}
          onClick={() => navigate('/flights')}
          className="group relative px-8 py-4 bg-[#1a73e8] text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-300 hover:shadow-xl hover:bg-[#1765cc] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            Search Flights
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        </button>
      </div>

      {/* Credits */}
      <div ref={creditRef} className="absolute bottom-6 z-20 opacity-0">
        <a 
          href="https://github.com/Kyuuto09" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-[#5f6368] hover:text-[#1a73e8] transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:bg-white/80 shadow-sm"
        >
          <span>Made by Kyuuto09</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Home;
