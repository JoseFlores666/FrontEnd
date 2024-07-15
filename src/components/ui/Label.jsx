export function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="text-base block my-1 text-black font-bold">
      {children}
    </label>
  );
}
