"use client"
import axiosClient from "@/shared/lib/axiosClient";
import { User } from "@/shared/types/event";

const prefix = "/auth"

export async function updateRolesToUser(userId: string, roles: Role[]): Promise<Omit<User, "password">> {
    const res = await axiosClient.put(`${prefix}/users/roles/${userId}`, {roles});
    console.log("lo usuario", res.data);
    return res.data;
}

