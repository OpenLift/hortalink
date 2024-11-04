import type { Order } from "./Orders";
import type { User } from "./User";
import type { Profile } from "./Profile";

interface Session {
    profile: Profile,
    orders: Order[]
}

export type {
    Session
}