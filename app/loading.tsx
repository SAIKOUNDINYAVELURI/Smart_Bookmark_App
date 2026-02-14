export default function Loading() {
  const letters = ["L", "O", "A", "D", "I", "N", "G"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="relative flex gap-2 text-4xl font-bold text-cyan-400">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="animate-loadingWave opacity-0 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            style={{
              animationDelay: `${index * 0.000001}s`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
