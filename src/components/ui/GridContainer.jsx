export function GridContainer({ children, ...props }) {
    return (
        <div
            className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-4"
            {...props}
        >
            {children}
        </div>
    );
}