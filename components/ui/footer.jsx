export const Footer = () => {
    return (
        <footer className="flex flex-col items-center justify-center py-4">
            <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Creado por Pastor Jerlib Gonzalez.
            </p>
        </footer>
    );
};