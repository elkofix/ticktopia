"use client"
import axiosClient from "@/shared/lib/axiosClient";
import { Presentation } from "@/shared/types/presentation";

const prefix = "/presentation";

export async function getPresentationsByEventId(eventId: string): Promise<Presentation[]> {
  const res = await axiosClient.get(`${prefix}/event/${eventId}`);
  console.log(JSON.stringify(res.data, null, 2));
  return res.data;
}

export async function getPresentationById(presentationId: string): Promise<Presentation> {
  const res = await axiosClient.get(`${prefix}/${presentationId}`);
  return res.data;
}
