"use server";
import axios from 'axios';
import { cookies } from 'next/headers';

const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});


axiosServer.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    console.log("token", token)
    if (token) {
      config.headers?.set('Cookie', `token=${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosServer;
