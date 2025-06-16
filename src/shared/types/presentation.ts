import { Event } from "./event";

export interface Presentation {
  idPresentation: string;
  place: string;
  event: Event;
  capacity: number;
  price: number;
  openDate: string;
  startDate: string;
  latitude: number;
  longitude: number;
  description: string;
  ticketAvailabilityDate: string;
  ticketSaleAvailabilityDate: string;
  city: string;
}