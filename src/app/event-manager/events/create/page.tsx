"use client"
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { createEvent } from '@/features/events/events.client.api';
import { useRouter } from 'next/navigation';

interface CreateEventProps {
    name: string;
    bannerPhotoUrl: string;
    isPublic: boolean;
}


export async function uploadImageToCloudinary(base64Image: string): Promise<string> {
    const response = await fetch('/api/cloudinary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
        throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
}

export default function CreateEventCard() {
    const [eventData, setEventData] = useState<CreateEventProps>({
        name: '',
        bannerPhotoUrl: '',
        isPublic: true
    });

    const [previewImage, setPreviewImage] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    // Función para convertir archivo a base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Manejar selección de imagen
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);

            // Crear preview local
            const base64String = await fileToBase64(file);
            setPreviewImage(base64String);

            // Subir a Cloudinary
            const cloudinaryUrl = await uploadImageToCloudinary(base64String);

            // Actualizar el estado con la URL de Cloudinary
            setEventData(prev => ({
                ...prev,
                bannerPhotoUrl: cloudinaryUrl
            }));

        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error al subir la imagen. Inténtalo de nuevo.');
        } finally {
            setIsUploading(false);
        }
    };

    // Manejar creación del evento
    const handleCreateEvent = async () => {
        if (!eventData.name.trim()) {
            alert('Por favor ingresa un nombre para el evento');
            return;
        }

        if (!eventData.bannerPhotoUrl) {
            alert('Por favor selecciona una imagen para el evento');
            return;
        }

        try {
            setIsCreating(true);
            await createEvent(eventData);
            router.push("/event-manager/events")
            setEventData({
                name: '',
                bannerPhotoUrl: '',
                isPublic: true
            });
            setPreviewImage('');

        } catch (error: any) {
            console.error('Error creating event:', error.response.data.message || "No se pudo crear el evento");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-full flex flex-col">
                {/* Event Banner - Editable */}
                <div className="relative h-48 overflow-hidden flex-shrink-0 bg-gray-100">
                    {previewImage || eventData.bannerPhotoUrl ? (
                        <Image
                            src={previewImage || eventData.bannerPhotoUrl}
                            alt="Preview del evento"
                            className="w-full h-full object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm text-gray-500">Haz clic para subir imagen</p>
                            </div>
                        </div>
                    )}

                    {/* Overlay para cambiar imagen */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="text-white text-center">
                            <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <p className="text-sm">{previewImage ? 'Cambiar' : 'Subir'} imagen</p>
                        </div>
                    </div>

                    {/* Input file oculto */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    {/* Status Badge - Editable */}
                    <div className="absolute top-3 right-3">
                        <button
                            onClick={() => setEventData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${eventData.isPublic
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {eventData.isPublic ? 'Público' : 'Privado'}
                        </button>
                    </div>

                    {/* Loading overlay para upload */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-white text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                <p className="text-sm">Subiendo imagen...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Event Content */}
                <div className="p-6 flex flex-col flex-grow">
                    {/* Title - Editable */}
                    <input
                        type="text"
                        value={eventData.name}
                        onChange={(e) => setEventData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nombre del evento"
                        className="text-xl font-bold text-gray-900 mb-3 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1 transition-colors"
                    />

                    {/* Organizer Info - Static for now */}
                    <div className="flex items-center space-x-3 mb-4 flex-grow">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-medium">
                                Tu
                            </span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                Tú
                            </p>
                            <p className="text-xs text-gray-500">Organizador</p>
                        </div>
                    </div>

                    {/* Create Button */}
                    <div className="mt-auto">
                        <button
                            onClick={handleCreateEvent}
                            disabled={isCreating || isUploading || !eventData.name.trim()}
                            className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {isCreating ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creando evento...
                                </div>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Crear Evento
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}