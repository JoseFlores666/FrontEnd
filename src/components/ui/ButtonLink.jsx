import { Link } from "react-router-dom";

export const ButtonLink = ({ to, children }) => (
  <Link to={to} className="bg-indigo-500 shadow-lg shadow-indigo-500/50  px-1 py-1 rounded-md my-2 disabled:bg-indigo-300">
    {children}
  </Link>
);
