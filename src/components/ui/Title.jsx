import { BackButton } from "./BackButton";

export function Title({ children, showBackButton, ...props }) {
    return (
        <div className="mb-6 bg rounded-sm border bg-green-500">
            <div className="flex items-center justify-between p-4">
                {showBackButton && (
                    <div className="mr-4">
                        <BackButton />
                    </div>
                )}
                <h2
                    className={`text-2xl uppercase font-bold text-white flex-1 text-center ${showBackButton ? '' : 'ml-4'}`}
                    {...props}
                >
                    {children}
                </h2>
                {showBackButton && <div className="w-8" />} {/* Espaciador para compensar el ancho del botón */}
            </div>
        </div>
    );
}
