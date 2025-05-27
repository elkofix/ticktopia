import axiosClient from "@/shared/lib/axiosClient";
import { Event } from "@/shared/types/event";

const prefix = "/event"


export async function getEventsByUser(): Promise<Event[]> {
    const res = await axiosClient.get(`${prefix}/find/user`);
    console.log(res.data);
    return res.data;
}

interface CreateEventPros{
    name: string;
    bannerPhotoUrl: string;
    isPublic: boolean;
}

export async function createEvent(params: CreateEventPros): Promise<Event> {
    const res = await axiosClient.post(`${prefix}/create`, {...params});
    console.log(res.data);
    return res.data;
}
