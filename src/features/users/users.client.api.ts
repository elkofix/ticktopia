"use client"
import axiosClient from "@/shared/lib/axiosClient";
import { User } from "@/shared/types/event";

interface UpdateUserDto {
    name?: string;
    email?: string;
    lastname?: string;
}

const prefix = "/auth"

export async function getAllUsers(): Promise<Omit<User, "password">[] | { error: string }> {
    try {
        const res = await axiosClient.get(`${prefix}/users`);
        console.log("lo usuario", res.data);
        return res.data;
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return { error: error?.response?.data?.message || "Error al obtener los usuarios" };
    }
}

export async function updateProfile(updateUser: UpdateUserDto, userId: string): Promise<Omit<User, "password">> {
    const res = await axiosClient.put(`${prefix}/users/${userId}`, { ...updateUser });
    console.log("lo usuario", res.data);
    return res.data;
}

export async function closeProfile(userId: string): Promise<Omit<User, "password">> {
    const res = await axiosClient.delete(`${prefix}/users/${userId}`);
    console.log("lo usuario", res.data);
    return res.data;
}

