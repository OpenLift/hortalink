import type { Schedule } from "@interfaces/Schedule";
import { dayNumberToName } from "@utils/weekDays";

export default function SellerSchedule(props: { schedule: Schedule }) {
    const { schedule } = props

    return (
        <div className="seller_schedule">
            <h2>{dayNumberToName[schedule.day_of_week]}</h2>
            <p className="address">{schedule.address}</p>
            <p>{schedule.start_time} às {schedule.end_time}</p>
        </div>
    )
}