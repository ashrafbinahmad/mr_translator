import React from 'react'
import s from '../styles/foot.module.css'
import data from '../helpers/data.json'
import ui_functions from '../helpers/ui_functions'

export default function foot({ duration, currentQuestId, total_questions_count }) {
  return (
    <div className={s.container}>
      <h2>Ends @ {ui_functions.dateTimeTo12hTime( data.end_time)}</h2>
      <div className="flex-grow"></div>
      <h2>{currentQuestId??'-'}/{total_questions_count}</h2>
      <div className="flex-grow"></div>
      <h2>{/[0-9]{2}\:[0-9]{2}/g.test(duration)? duration : '-:-' }</h2>
      {/* <div className="flex-grow"></div>
      
      <h2>{duration }</h2> */}
    </div>
  )
}
