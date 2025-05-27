"use server"
import { notFound } from 'next/navigation';
import { getPresentationById } from '@/features/presentations/presentation.api';
import { formateDate } from '@/shared/utils/dates';
import EventSidebar from '@/features/buy/components/EventSidebar';
import { DescriptionSection } from '@/features/presentations/components/DescriptionSection';
import { PaymentMethods } from '@/features/presentations/components/PaymentMethod';
import TicketSelector from '@/features/buy/components/TicketSelector';
import { ProtectedRoute } from '@/features/auth/login/components/ProtectedRoute';

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    try {
        const { id } = await params;
        const presentation = await getPresentationById(id);

        const startDate = formateDate(presentation.startDate);


        return (
            <ProtectedRoute requiredRoles={["client"]}>
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Contenido principal */}
                            <div className="lg:col-span-2">
                                <TicketSelector
                                    capacity={presentation.capacity}
                                    price={presentation.price} presentationId={presentation.idPresentation} />

                                <DescriptionSection description={presentation.description} />

                                <PaymentMethods />
                            </div>

                            {/* Sidebar del evento */}
                            <div className="lg:col-span-1">
                                <EventSidebar
                                    event={presentation.event}
                                    place={presentation.place}
                                    city={presentation.city}
                                    startDate={startDate}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    } catch (error) {
        console.log(error);
        notFound();
    }
}