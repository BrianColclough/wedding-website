"use client";

import { useEffect } from 'react';

export default function Registry() {
  useEffect(() => {
    // Create and append the Zola script
    const script = document.createElement('script');
    script.id = 'zola-wjs';
    script.src = 'https://widget.zola.com/js/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById('zola-wjs');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="container mx-auto bg-black text-white px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Gift Registry
      </h1>

      <p className="text-center text-gray-200">
        We&apos;ve been building our home together for a while now, so our registry is designed to help us enjoy our honeymoon and add a few special touches to our home. If you&apos;d like to contribute, you can find our Amazon registry below. Your love and support are the best gift of all!
      </p>

      <div className="flex justify-center mt-8">
        <a
          className="zola-registry-embed"
          href="https://www.zola.com/registry/brianandalexismay15"
          data-registry-key="brianandalexismay15"
        />
      </div>
    </div>
  );
}
