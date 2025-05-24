import axiosClient from "@/shared/lib/axiosClient";
import { Event, GetEventsParams } from "@/shared/types/event";
import { Presentation } from "@/shared/types/presentation";

const prefix = "/event"

export async function getEvents(params: GetEventsParams = {}): Promise<Event[]> {
  const { limit = 10, offset = 0 } = params;

  const res = await axiosClient.get(`${prefix}/findAll`, {
    params: {
      limit: limit.toString(),
      offset: offset.toString(),
    },
  });

  return res.data;
}


export async function getEventData(eventId: String): Promise<{event: Event, presentations: Presentation[]}> {
  const event = await axiosClient.get(`${prefix}/find/${eventId}`);
  const presentations = await axiosClient.get(`presentation/event/${eventId}`);


  return { event: event.data, presentations: presentations.data };
}