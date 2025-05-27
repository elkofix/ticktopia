"use client"
import axiosClient from "@/shared/lib/axiosServer";
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

export async function createPresentation(presentation: CreatePresentationDto): Promise<Presentation> {
    const res = await axiosClient.post(`${prefix}`, {...presentation});
    console.log(JSON.stringify(res.data, null, 2));
    return res.data;
}

export async function updatePresentation(eventId: string): Promise<Presentation[]> {
    const res = await axiosClient.get(`${prefix}`);
    console.log(JSON.stringify(res.data, null, 2));
    return res.data;
}

export async function deletePresentation(eventId: string): Promise<Presentation[]> {
    const res = await axiosClient.get(`${prefix}}`);
    console.log(JSON.stringify(res.data, null, 2));
    return res.data;
}

