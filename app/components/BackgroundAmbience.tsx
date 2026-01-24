export default function BackgroundAmbience() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Top Left Blob - Periwinkle */}
      <div 
        className="absolute top-[-10%] left-[-20%] w-[70vw] h-[70vw] opacity-30"
        style={{
          background: "radial-gradient(circle, var(--color-periwinkle-900) 0%, transparent 70%)"
        }}
      ></div>
      
      {/* Bottom Right Blob - Indigo */}
      <div 
        className="absolute bottom-[-10%] right-[-20%] w-[60vw] h-[60vw] opacity-30"
        style={{
          background: "radial-gradient(circle, #312e81 0%, transparent 70%)" // #312e81 is indigo-900
        }}
      ></div>
    </div>
  );
}
