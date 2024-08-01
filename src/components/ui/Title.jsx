export function Title({ children, ...props }) {
    return (
        <div className="mb-6 bg rounded-sm border bg-green-500 ">
            <h2
                className="text-2xl p-4   uppercase font-bold text-center text-white"
                {...props}
            >
                {children}
            </h2>
        </div>
    );
}
