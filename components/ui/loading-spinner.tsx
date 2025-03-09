export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative h-12 w-12">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-3 bg-blue-500 rounded-full transform-origin-50-100"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${i * 30}deg) translateY(-150%)`,
              animation: `loadingFade 1.2s linear ${i * 0.1}s infinite`,
              opacity: 0.1
            }}
          />
        ))}
      </div>
    </div>
  );
}
