import React from 'react'
import s from '../styles/foot.module.css'

export default function foot({duration, currentQuestId, total_questions_count}) {
  return (
    <div className={s.container}>
        <div className="flex-grow"></div>
        <h2>{currentQuestId}/{total_questions_count}</h2>
        <div className="flex-grow"></div>
        <h2>{duration}</h2>

    </div>
  )
}
