import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-brand-blue to-brand-red px-4 text-white">
            <div className="text-center">
                <h1 className="mb-3 text-3xl font-bold xs:mb-4 xs:text-4xl sm:text-5xl">404</h1>
                <p className="mb-4 text-base text-white/80 xs:text-lg sm:text-xl">
                    Stránka nenalezena
                </p>
                <Link to="/" className="text-sm underline hover:text-white/80 xs:text-base">
                    Zpět na scoreboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
