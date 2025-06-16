"use client"
import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default axiosClient;
