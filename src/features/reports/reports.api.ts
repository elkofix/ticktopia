"use client"

import axiosClient from "@/shared/lib/axiosClient";

const prefix = "/report"

export async function generateSalesReport(): Promise<{ data: string; mimeType: string } | { error: string }> {
    try {
        const res = await axiosClient.get(`${prefix}/sales`);
        return res.data;
    } catch (error: any) {
        console.error("Error generating sales report:", error);
        return { error: error.response?.data?.message || "Error al generar el reporte de ventas" };
    }
}

export async function generateOccupationReport(): Promise<{ data: string; mimeType: string } | { error: string }> {
    try {
    const res = await axiosClient.get(`${prefix}/ocupation`);
    return res.data;
    }catch (error: any) {   
        console.error("Error generating occupation report:", error);
        return { error: error.response?.data?.message || "Error al generar el reporte de ocupación" };
    }
}

