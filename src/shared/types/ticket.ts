import { Presentation } from "./presentation";
import { AuthUser } from "./user";

export interface Ticket {
    id: string;
    buyDate: string;
    isRedeemed: boolean;
    isActive: boolean;
    quantity: number;
    user: AuthUser;
    presentation: Presentation

}