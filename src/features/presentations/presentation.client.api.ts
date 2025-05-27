"use client"
import axiosClient from "@/shared/lib/axiosClient";
import { Presentation } from "@/shared/types/presentation";

const prefix = "/presentation";

interface CreatePresentationDto{
    place: string;
    capacity: number;
    openDate: string;
    startDate: string;
    ticketAvailabilityDate: string;
    ticketSaleAvailabilityDate: string;
    price: number;
    latitude: number;
    longitude: number;
    description: string;
    city: string;
    eventId: string;
}

interface UpdatePresentationDto{
    place?: string;
    capacity?: number;
    openDate?: string;
    startDate?: string;
    ticketAvailabilityDate?: string;
    ticketSaleAvailabilityDate?: string;
    price?: number;
    latitude?: number;
    longitude?: number;
    description?: string;
    city?: string;
}

export async function createPresentation(presentation: CreatePresentationDto): Promise<Presentation> {
    console.log("press",presentation)
    const res = await axiosClient.post(`${prefix}`, {...presentation});
    console.log(JSON.stringify(res.data, null, 2));
    return res.data;
}

export async function updatePresentation(presentationId:string, presentation: UpdatePresentationDto): Promise<Presentation> {
    const res = await axiosClient.put(`${prefix}/${presentationId}`, {...presentation});
    console.log(JSON.stringify(res.data, null, 2));
    return res.data;
}

export async function deletePresentation(presentationId: string): Promise<Presentation | {error: string}> {
    const res = await axiosClient.delete(`${prefix}/${presentationId}`);
    console.log(JSON.stringify(res.data, null, 2));
    return res.data;
}

