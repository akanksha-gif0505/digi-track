import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { HERO_IMAGE_URL } from '../data/initialData';

export const OnboardingScreen: React.FC = () => {
  const { setActiveTab, updateUserProfile } = useExpense();

  const handleFinish = () => {
    updateUserProfile({ onboarded: true });
    setActiveTab('dashboard');
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-16 relative overflow-hidden min-h-screen bg-[#f8f9ff]">
      {/* Background Graphic Element (Subtle Rupee watermark) */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none flex justify-center items-center select-none overflow-hidden">
        <span
          className="material-symbols-outlined text-[340px] text-[#005c55]"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          currency_rupee
        </span>
      </div>

      {/* Content Container */}
      <div className="z-10 w-full max-w-md flex flex-col items-center text-center space-y-6">
        {/* Hero Image / Illustration */}
        <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg bg-[#dce9ff] flex items-center justify-center relative">
          <img
            className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 hover:scale-105"
            alt="Digi Track financial dashboard 3D smartphone illustration"
            src={HERO_IMAGE_URL}
            referrerPolicy="no-referrer"
          />
          {/* Overlay gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
        </div>

        {/* Typography & Messaging */}
        <div className="space-y-2">
          <h1 className="font-display text-[26px] sm:text-[30px] leading-tight font-bold text-[#0b1c30]">
            Master Your Money
          </h1>
          <p className="font-sans text-[15px] leading-[23px] text-[#3e4947] px-2">
            Track every Rupee with{' '}
            <strong className="font-semibold text-[#005c55]">Quick Daily Capture</strong>. Reliable{' '}
            <strong className="font-semibold text-[#005c55]">Offline Tracking</strong> ensures your data is safe, anytime, anywhere.
          </p>
        </div>

        {/* Feature Highlight Cards (Bento-ish) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {/* Feature 1: Quick Capture */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#bdc9c6]/50 flex items-start space-x-3 text-left">
            <div className="bg-[#0f766e]/15 p-2.5 rounded-full flex-shrink-0">
              <span
                className="material-symbols-outlined text-[#005c55] fill-1 text-[22px]"
              >
                bolt
              </span>
            </div>
            <div>
              <h3 className="font-display text-[15px] font-semibold text-[#0b1c30]">
                Lightning Fast
              </h3>
              <p className="font-sans text-[13px] text-[#3e4947] leading-snug mt-0.5">
                Log expenses in seconds, perfect for busy markets.
              </p>
            </div>
          </div>

          {/* Feature 2: Offline */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#bdc9c6]/50 flex items-start space-x-3 text-left">
            <div className="bg-[#fd761a]/15 p-2.5 rounded-full flex-shrink-0">
              <span
                className="material-symbols-outlined text-[#9d4300] fill-1 text-[22px]"
              >
                wifi_off
              </span>
            </div>
            <div>
              <h3 className="font-display text-[15px] font-semibold text-[#0b1c30]">
                Works Offline
              </h3>
              <p className="font-sans text-[13px] text-[#3e4947] leading-snug mt-0.5">
                No internet? No problem. Syncs automatically later.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col space-y-2.5 pt-4">
          <button
            onClick={handleFinish}
            className="w-full min-h-[50px] bg-[#005c55] hover:bg-[#0f766e] text-white font-display text-[16px] font-semibold rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined text-white text-[20px]">
              arrow_forward
            </span>
          </button>
          <button
            onClick={handleFinish}
            className="w-full min-h-[46px] bg-transparent text-[#005c55] font-display text-[15px] font-semibold rounded-full hover:bg-[#e5eeff]/50 active:scale-95 transition-all duration-200"
          >
            Skip for now
          </button>
        </div>
      </div>
    </main>
  );
};
