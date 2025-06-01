"use client"
import axiosClient from "@/shared/lib/axiosClient";
import { Ticket } from "@/shared/types/ticket";

const prefix = "/tickets";

export async function getAllMyTickets(): Promise<Ticket[]> {
  const res = await axiosClient.get(`${prefix}`);
  return res.data;
}

export async function getAllMyTicketsHistoric(): Promise<Ticket[]> {
  const res = await axiosClient.get(`${prefix}/historic`);
  return res.data;
}

export async function reedemTicket(ticketId: string): Promise<Ticket> {
  const res = await axiosClient.put(`${prefix}/${ticketId}`, { isRedeemed: true });
  console.log(res);
  return res.data;
}
