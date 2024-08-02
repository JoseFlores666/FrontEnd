export function Th({ children, sortable = true, extraClass = '', ...props }) {
    const className = `px-3 py-1 w-1/12 font-medium tracking-wider border text-center ${sortable ? 'cursor-pointer' : ''} ${extraClass}`;

    return (
        <th className={className} {...props}>
            {children}
        </th>
    );
}
