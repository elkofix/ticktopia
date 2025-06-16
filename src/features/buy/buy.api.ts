"use client"
import axiosClient from "@/shared/lib/axiosClient";
import { Event } from "@/shared/types/event";

const prefix = "/tickets"

export async function getTicketsCheckout(presentationId: string, quantity: number): Promise<{checkoutSession: string}> {
  const res = await axiosClient.post(`${prefix}/buy`, {
    presentationId,
    quantity
  });
  console.log(res);
  return res.data;
}

