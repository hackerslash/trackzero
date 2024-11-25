export default function Loading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
