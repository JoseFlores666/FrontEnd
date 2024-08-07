export function Td({ children, ...props }) {
    return (
        <td
            className="p-1 whitespace-normal border  border-gray-400 text-center"
            {...props}
        >
            {children}
        </td>
    );
}