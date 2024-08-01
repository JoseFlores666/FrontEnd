export function Label({ children, ...props }) {
  return (
    <label
      className="block text-sm font-bold mb-1"
      {...props}
    >
      {children}

    </label>

  );
}