export function Button({ onClick, children }) {
  return (
    <button
      className="bg-indigo-500 text-white shadow-lg shadow-indigo-500/50 px-4 py-1 rounded-md my-2 disabled:bg-indigo-300"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
