export interface Presentation {
  idPresentation: string;
  place: string;
  event: {
    id: string;
    name: string;
    bannerPhotoUrl: string;
    isPublic: boolean;
    user: {
      id: string;
      email: string;
      name: string;
      lastname: string;
      isActive: boolean;
      roles: string[];
    };
  };
  capacity: number;
  price: number;
  openDate: string;
  startDate: string;
  latitude: number;
  longitude: number;
  description: string;
  ticketAvailabilityDate: string;
  ticketSaleAvailabilityDate: string;
  city: string;
}