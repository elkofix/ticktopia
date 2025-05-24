import axiosClient from "@/shared/lib/axiosClient";
import { Presentation } from "@/shared/types/presentation";

export async function getPresentationsByEventId(eventId: string): Promise<Presentation[]> {
  const res = await axiosClient.get(`/presentation/event/${eventId}`);
  return res.data;
}