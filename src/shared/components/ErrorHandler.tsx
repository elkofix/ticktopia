"use server';"
import { redirect } from 'next/navigation';
import React from 'react'
import ErrorCard from './ErrorCard';

export default async function ErrorHandler(error: any) {
    if (error?.status === 401 || error?.response?.status === 401) {
        redirect('/login?logout=true');
    }

    return (
        <ErrorCard message={error.response.data.message ?? "Ocurrió un error desesperado, intenta más tarde"} />
    )
}
