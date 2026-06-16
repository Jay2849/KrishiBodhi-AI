import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-xs py-6 px-4 mt-auto border-t border-gray-800">
      <div className="max-w-6xl mx-auto text-center space-y-2">
        <p>© 2026 KrishiBodhi AI. All rights reserved.</p>
        <p className="max-w-md mx-auto text-[10px] text-gray-500 leading-normal">
          Disclaimer: All AI advice is configured strictly for regional high-altitude parameters. Please cross-verify outputs with certified agricultural extension officers.
        </p>
      </div>
    </footer>
  );
}