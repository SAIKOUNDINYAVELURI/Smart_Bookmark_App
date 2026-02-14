export default function Loading() {
  const letters = ["L", "O", "A", "D", "I", "N", "G"];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b1120] overflow-hidden">
      {/* Soft Glow Background */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-purple-600/20 blur-3xl rounded-full animate-pulse"></div>

      {/* Animated Letters */}
      <div className="relative flex gap-1 sm:gap-2 text-3xl sm:text-5xl font-extrabold">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="animate-loadingWave opacity-0 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            style={{
              animationDelay: `${index * 0.15}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
