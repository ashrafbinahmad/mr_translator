import { Button } from '@chakra-ui/react'
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import React from 'react'
import s from '../styles/start.module.css'

export default function start() {
  const router = useRouter()
  const handleStart = async() => {
    axios.post('/api/user/start', {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username')
    }).then((res) => {
      console.log(res.data)
      router.push('/quiz')
    }).catch((err) => {
      router.push('/')
      console.log(err)
    })
    console.log('start')
  }
  return (
    <main className={s.main}>
      <h1>Let us get started.</h1>
      <p>Once the button clicked you can not attend again.</p>
      <div className="space"></div>
      <Button colorScheme='green' onClick={handleStart}>START THE QUIZ</Button>
    </main>
  )
}
