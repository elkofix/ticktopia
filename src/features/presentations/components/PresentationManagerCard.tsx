"use client"
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import { Presentation } from '@/shared/types/presentation';
import { formateDate } from '@/shared/utils/dates';
import { CheckCircleIcon, TrashIcon, TriangleAlert } from 'lucide-react';
import { deletePresentation } from '../presentation.client.api';

interface PresentationManagerCardProps {
  presentation: Presentation;
  bannerPhotoUrl: string;
  eventName: string;
  onPresentationDeleted?: (presentationId: string) => void;
}

export function PresentationManagerCard({
  presentation,
  bannerPhotoUrl,
  eventName,
  onPresentationDeleted
}: PresentationManagerCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deletePresentation(presentation.idPresentation);

      if ('error' in result) {
        setErrorMessage(result.error);
        setIsErrorModalOpen(true);
      } else {
        setIsSuccessModalOpen(true);
        onPresentationDeleted?.(presentation.idPresentation);
      }
    } catch (error) {
      setErrorMessage('Error inesperado al eliminar la presentación');
      setIsErrorModalOpen(true);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className="group flex flex-col md:flex-row bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
        {/* Presentation Banner */}
        <div className="relative w-full h-40 md:w-48 md:h-32 lg:w-56 lg:h-36 flex-shrink-0">
          <Image
            src={bannerPhotoUrl}
            alt={eventName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 200px, 250px"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-presentation.jpg';
            }}
          />

          {/* Delete Button - Top Right Corner */}
          <button
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
            title="Eliminar presentación"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Presentation Info */}
        <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
              {eventName}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m3 0V6a2 2 0 00-2-2H7a2 2 0 00-2 2v1m16 0v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7h16z" />
                </svg>
                <span className="font-medium">{formateDate(presentation.startDate)}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{presentation.city}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{presentation.capacity} asientos</span>
              </div>

              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span className="font-semibold text-green-600">${presentation.price?.toLocaleString()}</span>
              </div>
            </div>

            {presentation.description && (
              <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                {presentation.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 flex-shrink-0 self-end md:self-center min-w-[150px]">
            <Link
              href={`/presentation/${presentation.idPresentation}`}
              className="inline-block"
            >
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 w-full text-center text-sm">
                Ver Presentación
              </button>
            </Link>

            <Link
              href={`/event-manager/presentation/manage/${presentation.event.id}?editId=${presentation.idPresentation}`}
              className="inline-block"
            >
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 w-full text-center text-sm border border-gray-300">
                Editar
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDeleteModalOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                      <TriangleAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Eliminar Presentación
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        ¿Estás seguro de que deseas eliminar la presentación "{eventName}"?
                        Esta acción no se puede deshacer.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      onClick={() => setIsDeleteModalOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de Éxito */}
      <Transition appear show={isSuccessModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsSuccessModalOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Presentación Eliminada
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        La presentación "{eventName}" ha sido eliminada exitosamente.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      onClick={() => {
                        setIsSuccessModalOpen(false);
                        window.location.reload();
                      }}                    >
                      Aceptar
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal de Error */}
      <Transition appear show={isErrorModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsErrorModalOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all transition-all">
                  <div className="flex items-center">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                      <TriangleAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Error al Eliminar
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {errorMessage}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={() => setIsErrorModalOpen(false)}
                    >
                      Entendido
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}