import request_api from "./request_api";
import type { User } from "../interfaces/User";

export default async function get_user(user_id: number, session_id: string): Promise<User> {
    return await request_api(`/v1/users/${user_id}`, "include", `session_id=${session_id}`)
}