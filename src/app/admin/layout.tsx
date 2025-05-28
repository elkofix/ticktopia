"use client"

import { ProtectedRoute } from "@/features/auth/login/components/ProtectedRoute";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectedRoute requiredRoles={["admin"]}>
            {children}
        </ProtectedRoute>
    );
}
