import { Avatar, Tooltip } from '@chakra-ui/react'
import React from 'react'
import s from '../styles/layout.module.css'

export default function layout({ children, name = 'Un Known' }) {
    return (
        <div className={s.page}>
            <nav className={s.nav}>
                <div className="flex-grow"></div>
                <h2>Mr. translator</h2>
                <div className="flex-grow"></div>
                <Tooltip hasArrow label={name} borderRadius='2px' >
                    <Avatar name={name} size='sm' src='https://bit.ly/broken-link' mr='2rem'/>
                </Tooltip>
            </nav>
            <div className={s.children}>

            {children}
            </div>
        </div>
    )
}
