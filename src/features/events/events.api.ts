"use server"
import axiosServer from "@/shared/lib/axiosServer";
import { Event, GetEventsParams } from "@/shared/types/event";
import { Presentation } from "@/shared/types/presentation";

const prefix = "/event"

export async function getEvents(params: GetEventsParams = {}): Promise<Event[]> {
  const { limit = 10, offset = 0 } = params;

  const res = await axiosServer.get(`${prefix}/findAll`, {
    params: {
      limit: limit.toString(),
      offset: offset.toString(),
    },
  });
  console.log(res);
  return res.data;
}

export async function getEventData(eventId: String): Promise<{ event: Event, presentations: Presentation[] }> {
  const event = await axiosServer.get(`${prefix}/find/${eventId}`);
  const presentations = await axiosServer.get(`presentation/event/${eventId}`);

  return { event: event.data, presentations: presentations.data };
}

