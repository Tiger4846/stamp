"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // List of paths that don't require authentication
        const publicPaths = ["/signin", "/signup", "/login", "/register"];

        // Check if the current path is public
        const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

        // If it's a public path, we don't need to check for a token
        if (isPublicPath) {
            setIsChecking(false);
            return;
        }

        // Check for token in localStorage
        const token = localStorage.getItem("token");

        if (!token) {
            // If no token and not public, redirect to signin
            router.push("/signin");
        } else {
            // If token exists, allow access
            setIsChecking(false);
        }
    }, [pathname, router]);

    // While checking, we can show nothing or a loading spinner
    // This prevents protected content from flashing before redirect
    if (isChecking) {
        return null;
    }

    return <>{children}</>;
}
