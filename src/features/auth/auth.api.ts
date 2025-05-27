"use client"
import axiosClient from "@/shared/lib/axiosClient";
import { AuthUser } from "@/shared/types/user";

const prefix = "/auth"


export async function login(email: string, password: string): Promise<{ user: AuthUser }> {
  const res = await axiosClient.post(`${prefix}/login`, {
    email,
    password,
  });

  console.log("el usuario",res.data);
  return res.data;
}

export async function register(email: string, password: string, name: string, lastname: string): Promise<{ user: AuthUser }> {
  const res = await axiosClient.post(`${prefix}/register`, {
    name,
    lastname,
    email,
    password,
  });

  console.log("el usuario",res.data);
  return res.data;
}