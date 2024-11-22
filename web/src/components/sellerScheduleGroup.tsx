import type { Schedule } from "@interfaces/Schedule";
import { dayNumberToName } from "@utils/weekDays";
import { Fragment } from "react/jsx-runtime";

export default function SellerScheduleGroup(props: { schedules: Schedule[] }) {
    const { schedules } = props

    const day_of_week = schedules[0].day_of_week

    return (
        <div className={`seller_schedule ${[6,7].includes(day_of_week) ? "end_week" : ''}`}>
            <h2>{dayNumberToName[day_of_week]}</h2>
            {
                schedules.map(schedule => {
                    return (
                        <Fragment key={`seller-schedule-item-${schedule.id}`}>
                            <p className="address">{schedule.address}</p>
                            <p>{schedule.start_time} às {schedule.end_time}</p>
                        </Fragment>
                    )
                })
            }
        </div>
    )
}