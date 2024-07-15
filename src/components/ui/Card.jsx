export function Card({ children, className }) {
  return (
    <div className={`bg-white text-black max-w-md w-full p-10 rounded-md shadow-md ${className}`}>
      {children}
    </div>
  );
}
