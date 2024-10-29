import type { Schedule } from "@interfaces/Schedule";
import { atom } from "nanostores";

export default {
    schedules: atom<Schedule[]>([])
}