"use client"

import axiosClient from "@/shared/lib/axiosClient";

const prefix = "/report"

export async function generateSalesReport(): Promise<{ data: string; mimeType: string }>{
    const res = await axiosClient.get(`${prefix}/sales`);
    return res.data;
}

export async function generateOccupationReport(): Promise<{ data: string; mimeType: string }> {
    const res = await axiosClient.get(`${prefix}/ocupation`);
    return res.data;
}

