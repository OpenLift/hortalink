import { dayNumberToName }from "@utils/weekDays";
import { useState } from "react";

const dayNames = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"]

function getLastDay(month: number, year: number): number {
    if (month === 2) {
        return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(month)) {
        return 30;
    } else {
    
        return 31;
    }
}

export default function CreateSchedule() {
    const date = new Date()

    const currentDayOfWeek = date.getDay() // day of week
    const currentDay = date.getDate()
    
    const days: number[] = new Array(dayNames.length)
    days[currentDayOfWeek] = currentDay
    const lastDay = getLastDay(date.getMonth() + 1, date.getFullYear())
    
    const [selectedDay, setSelectedDay] = useState(currentDay)

    let dayMove = 1
    for (let d = currentDayOfWeek + 1; d < dayNames.length; d++) {
        let newDay = currentDay + dayMove
        if(newDay > lastDay) {
            newDay -= lastDay
        }
        days[d] = newDay
        dayMove += 1
    }

    dayMove = 1

    for(let d = currentDayOfWeek - 1; d > -1; d--) {
        let newDay = currentDay - dayMove

        if(newDay < 1) {
            newDay = lastDay - (newDay)
        }
        days[d] = newDay
        dayMove += 1
    }

    return (
        <section className="create_schedule">
            <div className="create_schedule_header">
                <img
                    src="/assets/chevron.svg"
                    alt="Seta para esquerda, clique para mudar para o mês anterior."
                    width={27}
                    height={27}
                    style={{ marginRight: "auto" }}
                />
                <h2>Junho</h2>
                <img
                    src="/assets/chevron.svg"
                    alt="Seta para direita, clique para mudar para o próximo mês."
                    width={27}
                    height={27}
                    style={{ transform: "rotate(-180deg)", marginLeft: "auto" }}
                />
            </div>
            <div className="create_schedule_days_selector">
                {
                    days.map((day, i) => (
                        <button key={`create_schedule_day-${day}`} className={`day ${selectedDay === day ? 'selected': ''}`} onClick={() => setSelectedDay(day)} aria-label={`Selecionar a data`}>
                            {dayNames[i].slice(0, 3)}<br />
                            {days[i]}
                        </button>    
                    ))
                }
            </div>
            <button className="create_schedule_button">
                Criar Agendamento
            </button>
        </section>
    )
}