'use client';

import { Fragment, useState } from 'react';
import { QrCode } from 'lucide-react';
import { Ticket } from '@/shared/types/ticket';
import { QRCodeSVG } from 'qrcode.react';
import { formatDateYMD, formateDate, getDaysBetween, isLaterDate } from '@/shared/utils/dates';
import { getLastSixChars } from '@/shared/utils/string';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import Image from 'next/image';

interface TicketsListProps {
    tickets: Ticket[];
    historic: boolean
}

export default function TicketsList({ tickets, historic }: TicketsListProps) {
    const [showQR, setShowQR] = useState<string | null>(null);

    const toggleQR = (ticketId: string) => {
        setShowQR(showQR === ticketId ? null : ticketId);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6" data-testid="tickets-list-container">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2" data-testid="tickets-title">
                    {historic ? 'Historial de Tickets' : 'Mis Tickets'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600" data-testid="tickets-subtitle">
                    {historic
                        ? 'Este es tu historial de compras y eventos a los cuales has asistido.'
                        : 'Aquí encontrarás los boletos para tus próximos eventos'
                    }
                </p>
            </div>

            {tickets.length === 0 ? (
                <div className="text-center py-8 sm:py-12" data-testid="empty-state">
                    <p className="text-gray-500 text-base sm:text-lg">
                        {historic ? 'No tienes historial de tickets' : 'No tienes tickets disponibles'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4 sm:space-y-6">
                    {tickets.map((ticket) => {
                        const ticketAvailable = isLaterDate(ticket.presentation.ticketAvailabilityDate);
                        const daysUntilAvailable = getDaysBetween(
                            ticket.presentation.ticketAvailabilityDate,
                            ticket.presentation.openDate
                        );

                        return (
                            <div
                                key={ticket.id}
                                className="bg-white rounded-lg shadow-sm sm:shadow-md border border-gray-200 overflow-hidden"
                                data-testid="ticket-item"
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                        {/* Folio Section */}
                                        <div className="flex-shrink-0 sm:text-center">
                                            <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                                <span className="font-bold">Folio:</span>
                                            </p>
                                            <p className="text-base sm:text-lg font-mono font-semibold text-gray-900" data-testid="ticket-folio">
                                                {getLastSixChars(ticket.id)}
                                            </p>
                                        </div>

                                        {/* Event Image */}
                                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                                            <Image
                                                src={ticket.presentation.event.bannerPhotoUrl || '/placeholder-event.jpg'}
                                                alt={ticket.presentation.event.name}
                                                width={128}
                                                height={96}
                                                className="w-24 h-18 sm:w-32 sm:h-24 object-cover rounded-lg"
                                                onError={(e) => {
                                                    const target = e.currentTarget as HTMLImageElement;
                                                    target.src = '/placeholder-event.jpg';
                                                }}
                                                data-testid="event-image"
                                            />
                                        </div>

                                        {/* Event Details */}
                                        <div className="flex-grow">
                                            <div className="space-y-1 sm:space-y-2">
                                                <p className="text-xs sm:text-sm line-clamp-2" data-testid="event-name">
                                                    <span className="font-bold">Nombre:</span>{' '}
                                                    {ticket.presentation.event.name} - {ticket.presentation.city} -{' '}
                                                    {formateDate(ticket.presentation.startDate)}
                                                </p>
                                                <p className="text-xs sm:text-sm" data-testid="purchase-date">
                                                    <span className="font-bold">Comprado el:</span>{' '}
                                                    {formatDateYMD(ticket.buyDate)}
                                                </p>
                                                <p className="text-xs sm:text-sm" data-testid="ticket-quantity">
                                                    <span className="font-bold">Cantidad:</span> {ticket.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        {/* QR Section - Solo se muestra si no es historic */}
                                        {!historic && (
                                            <div className="flex-shrink-0 flex flex-col items-center justify-center">
                                                {ticketAvailable ? (
                                                    <div className="text-center">
                                                        <button
                                                            onClick={() => toggleQR(ticket.id)}
                                                            className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                            data-testid="qr-button"
                                                        >
                                                            <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" data-testid="qr-icon" />
                                                            <span className="text-xs text-blue-600 font-medium">
                                                                {showQR === ticket.id ? 'Ocultar QR' : 'Ver QR'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg max-w-xs" data-testid="availability-message">
                                                        <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mx-auto mb-1 sm:mb-2" />
                                                        <p className="text-xs text-yellow-700">
                                                            Los tickets solo serán accesibles {daysUntilAvailable} días antes del evento
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                                    <div className="flex gap-2">
                                        {ticket.isRedeemed && (
                                            <span 
                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                                data-testid="redeemed-badge"
                                            >
                                                Canjeado
                                            </span>
                                        )}
                                        {!ticket.isActive && (
                                            <span 
                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                                                data-testid="inactive-badge"
                                            >
                                                Inactivo
                                            </span>
                                        )}
                                        {ticket.isActive && !ticket.isRedeemed && (
                                            <span 
                                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                                data-testid="active-badge"
                                            >
                                                Activo
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal QR - Solo se muestra si no es historic */}
            {!historic && (
                <Transition appear show={!!showQR} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50"
                        onClose={() => setShowQR(null)}
                        data-testid="qr-modal"
                    >
                        {/* Fondo oscuro */}
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" data-testid="modal-backdrop" />
                        </TransitionChild>

                        {/* Contenedor del modal centrado */}
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
                                    <DialogPanel 
                                        className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                                        data-testid="modal-content"
                                    >
                                        <DialogTitle
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                            data-testid="modal-title"
                                        >
                                            Tu código QR
                                        </DialogTitle>

                                        <div className="flex justify-center mb-4" data-testid="qr-code-container">
                                            <QRCodeSVG
                                                value={showQR || ''}
                                                size={200}
                                                level="M"
                                                includeMargin={true}
                                                data-testid="qr-code"
                                            />
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm text-gray-500 mb-2" data-testid="modal-folio">
                                                Folio: {showQR && getLastSixChars(showQR)}
                                            </p>
                                            <p className="text-xs text-gray-400" data-testid="modal-instructions">
                                                Muestra este código en la entrada del evento
                                            </p>
                                        </div>
                                    </DialogPanel>
                                </TransitionChild>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            )}
        </div>
    );
}