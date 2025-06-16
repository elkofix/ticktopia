"use client"
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { updateEvent, deleteEvent, UpdateEventProps } from '@/features/events/events.client.api';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Event } from '@/shared/types/event';
import { uploadImageToCloudinary } from '@/shared/utils/image';

interface EditEventCardProps {
    event: Event;
}

export default function EditEventCard({ event }: EditEventCardProps) {
    const [eventData, setEventData] = useState<UpdateEventProps>({
        name: event.name,
        bannerPhotoUrl: event.bannerPhotoUrl,
        isPublic: event.isPublic
    });

    const [previewImage, setPreviewImage] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setError('');

            const base64String = await fileToBase64(file);
            setPreviewImage(base64String);

            const cloudinaryUrl = await uploadImageToCloudinary(base64String);

            setEventData(prev => ({
                ...prev,
                bannerPhotoUrl: cloudinaryUrl
            }));

        } catch (error: any) {
            console.error('Error uploading image:', error);
            setError(error?.response?.data?.message ?? 'Error al subir la imagen. Inténtalo de nuevo.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdateEvent = async () => {
        if (!eventData.name?.trim()) {
            setError('Por favor ingresa un nombre para el evento');
            return;
        }

        try {
            setIsUpdating(true);
            setError('');

            const updatedFields: UpdateEventProps = {};
            if (eventData.name !== event.name) updatedFields.name = eventData.name;
            if (eventData.bannerPhotoUrl !== event.bannerPhotoUrl) updatedFields.bannerPhotoUrl = eventData.bannerPhotoUrl;
            if (eventData.isPublic !== event.isPublic) updatedFields.isPublic = eventData.isPublic;

            await updateEvent(event.id, updatedFields);
            setSuccess('Evento actualizado correctamente');
            setPreviewImage('');

        } catch (error: any) {
            console.error('Error updating event:', error);
            setError(error?.response?.data?.message ?? 'Error al actualizar el evento. Inténtalo de nuevo.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteEvent = async () => {
        try {
            setIsDeleting(true);
            setError('');

            await deleteEvent(event.id);
            setShowDeleteModal(false);
            router.push("/event-manager/events");

        } catch (error: any) {
            console.error('Error deleting event:', error);
            setError(error?.response?.data?.message ?? 'Error al eliminar el evento. Inténtalo de nuevo.');
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const hasChanges = () => {
        return (
            eventData.name !== event.name ||
            eventData.bannerPhotoUrl !== event.bannerPhotoUrl ||
            eventData.isPublic !== event.isPublic
        );
    };

    return (
        <>
            <div className="max-w-md mx-auto mt-12" data-testid="edit-event-card">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg" data-testid="error-message">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg" data-testid="success-message">
                        {success}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden flex-shrink-0 bg-gray-100" data-testid="banner-container">
                        <Image
                            src={previewImage || eventData.bannerPhotoUrl || ''}
                            alt="Preview del evento"
                            className="w-full h-full object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            data-testid="event-banner-image"
                        />

                        <div
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                            data-testid="image-upload-overlay"
                        >
                            <div className="text-white text-center">
                                <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <p className="text-sm">Cambiar imagen</p>
                            </div>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            data-testid="file-input"
                        />

                        <div className="absolute top-3 right-3">
                            <button
                                onClick={() => setEventData(prev => ({ ...prev, isPublic: !prev.isPublic }))}
                                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${eventData.isPublic
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                data-testid="visibility-toggle"
                            >
                                {eventData.isPublic ? 'Público' : 'Privado'}
                            </button>
                        </div>

                        <div className="absolute top-3 left-3">
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                                title="Eliminar evento"
                                data-testid="delete-button"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>

                        {isUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center" data-testid="uploading-overlay">
                                <div className="text-white text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                    <p className="text-sm">Subiendo imagen...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                        <input
                            type="text"
                            value={eventData.name || ''}
                            onChange={(e) => setEventData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nombre del evento"
                            className="text-xl font-bold text-gray-900 mb-3 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1 transition-colors"
                            data-testid="event-name-input"
                        />

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

                        <div className="mt-auto">
                            <button
                                onClick={handleUpdateEvent}
                                disabled={isUpdating || isUploading || !eventData.name?.trim() || !hasChanges()}
                                className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-purple-600 hover:bg-purple-700 text-white"
                                data-testid="update-button"
                            >
                                {isUpdating ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Actualizando evento...
                                    </div>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        {hasChanges() ? 'Guardar Cambios' : 'Sin Cambios'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Transition appear show={showDeleteModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => !isDeleting && setShowDeleteModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" data-testid="delete-modal">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Confirmar eliminación
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            ¿Estás seguro de que quieres eliminar el evento &quot;{event.name}&quot;? Esta acción no se puede deshacer.
                                        </p>
                                    </div>

                                    <div className="mt-4 flex space-x-3">
                                        <button
                                            type="button"
                                            className="flex-1 justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
                                            onClick={handleDeleteEvent}
                                            disabled={isDeleting}
                                            data-testid="confirm-delete-button"
                                        >
                                            {isDeleting ? (
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Eliminando...
                                                </div>
                                            ) : (
                                                'Eliminar'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={() => setShowDeleteModal(false)}
                                            disabled={isDeleting}
                                            data-testid="cancel-delete-button"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}