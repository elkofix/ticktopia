"use server"
import axiosServer from "@/shared/lib/axiosServer";
import { User } from "@/shared/types/event";

const prefix = "/auth"

export async function getAllUsers(): Promise<Omit<User, "password">[] | { error: string }> {
    try {   
    const res = await axiosServer.get(`${prefix}/users`);
    console.log("lo usuario", res.data);
    return res.data;
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return { error: error.response?.data?.message || "Error al obtener los usuarios" };
    }
}
