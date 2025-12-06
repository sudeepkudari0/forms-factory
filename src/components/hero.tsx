"use client";

import Link from "next/link";

interface HeroProps {
  isLoggedIn: boolean;
}

export function Hero({ isLoggedIn }: HeroProps) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#667eea]">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 animate-grid-move pointer-events-none">
        <div 
          className="h-full w-full" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating Icons - Hidden on mobile */}
      <div className="hidden md:block absolute top-[10%] left-[10%] text-5xl opacity-10 animate-float">📝</div>
      <div className="hidden md:block absolute top-[20%] right-[15%] text-5xl opacity-10 animate-float-delayed-1">🔗</div>
      <div className="hidden md:block absolute bottom-[15%] left-[20%] text-5xl opacity-10 animate-float-delayed-2">👥</div>
      <div className="hidden md:block absolute bottom-[25%] right-[10%] text-5xl opacity-10 animate-float-delayed-3">⚡</div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
        <div className="flex items-center gap-1.5 sm:gap-2 text-white">
          <span className="text-xl sm:text-2xl">📋</span>
          <span className="text-sm sm:text-lg md:text-xl font-bold tracking-tight">Forms Factory</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
          <a 
            href="https://github.com/sudeepkudari0/forms-factory" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur-md px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20 text-white text-xs sm:text-sm md:text-base font-medium hover:bg-white/25 transition-all duration-300"
          >
            <span className="text-sm sm:text-base">⭐</span>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-3 sm:px-4 md:px-6 py-16 sm:py-20 md:py-24">
        <div className="w-full max-w-6xl text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-6 bg-white/20 backdrop-blur-md px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full border border-white/30 animate-slide-down">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500"></span>
            </span>
            <span className="text-white text-[10px] sm:text-xs md:text-sm font-medium whitespace-nowrap">
              <span className="hidden xs:inline">100% Free & Open Source • </span>AGPL-3.0
            </span>
          </div>

          {/* Hero Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-3 sm:mb-4 md:mb-6 tracking-tight animate-fade-in-up px-2">
            Build Forms That Work<br />
            <span className="text-white/90">With Your Stack</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 leading-relaxed animate-fade-in-up-delayed px-2">
            Open-source form builder with webhooks, team collaboration, and API-first design. 
            <span className="hidden sm:inline"> Deploy on your infrastructure. Own your data. Integrate anywhere.</span>
          </p>

          {/* Feature Pills - Compact on Mobile */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2 md:gap-3 max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto mb-5 sm:mb-8 md:mb-10 animate-fade-in-up-delayed-2 px-2">
            {[
              { icon: '🎨', label: 'Drag & Drop' },
              { icon: '🔗', label: 'Webhooks' },
              { icon: '👥', label: 'Teams' },
              { icon: '🔑', label: 'API Keys' },
              { icon: '📊', label: 'Analytics' },
              { icon: '📤', label: 'CSV Export' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/15 backdrop-blur-md px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4 rounded-lg sm:rounded-xl border border-white/20 flex flex-col items-center gap-1 sm:gap-2 hover:bg-white/25 hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-lg sm:text-xl md:text-2xl">{feature.icon}</span>
                <span className="text-white text-[9px] sm:text-xs md:text-sm font-medium text-center leading-tight">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 justify-center items-center mb-6 sm:mb-10 md:mb-12 animate-fade-in-up-delayed-3 px-2 max-w-md sm:max-w-none mx-auto">
            <Link
              href={isLoggedIn ? "/onboarding" : "/login"}
              className="w-full sm:w-auto bg-white text-[#667eea] px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
            >
              <span className="truncate">{isLoggedIn ? "Go to Dashboard" : "Get Started Free"}</span>
              <span>→</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto animate-fade-in-up-delayed-4 px-2">
            {[
              { number: '15+', label: 'Field Types' },
              { number: '∞', label: 'Forms & Submissions' },
              { number: 'S3', label: 'File Uploads' },
              { number: 'API', label: 'First Design' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-1 sm:mb-2 animate-stat-pop">
                  {stat.number}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/80 font-medium leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
