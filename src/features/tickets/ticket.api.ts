"use server"
import axiosServer from "@/shared/lib/axiosServer";
import { Ticket } from "@/shared/types/ticket";

const prefix = "/tickets";

export async function getAllMyTickets(): Promise<Ticket[]> {
  const res = await axiosServer.get(`${prefix}`);
  return res.data;
}

export async function getAllMyTicketsHistoric(): Promise<Ticket[]> {
  const res = await axiosServer.get(`${prefix}/historic`);
  return res.data;
}

export async function reedemTicket(ticketId: string): Promise<Ticket> {
  const res = await axiosServer.put(`${prefix}/${ticketId}`, { isRedeemed: true });
  console.log(res);
  return res.data;
}
