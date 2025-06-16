export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  isActive: boolean;
  roles: Role[];
}

export interface Event {
  id: string;
  name: string;
  bannerPhotoUrl: string;
  isPublic: boolean;
  user: User;
}

export interface GetEventsParams {
  limit?: number;
  offset?: number;
}
