import { Button } from '@chakra-ui/react'
import axios from 'axios'
import Router, { useRouter } from 'next/router'
import React from 'react'
import s from '../styles/start.module.css'
import Layout from '../components/layout'

export default function start() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [alreadyAttended, setAlreadyAttended] = React.useState(false)
  const [fullname, setFullname] = React.useState('')

  React.useEffect(() => {
    setFullname(localStorage.getItem('fullname'))
    axios.post('/api/user/status', {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username')
    }).then((res) => {
      if (res.data.status == null) {
        setAlreadyAttended(false)
      } else {
        setAlreadyAttended(true)
      }
    }).catch((err) => {
      
      console.log(err, 'error while getting status')
    })
  }, [])


  const handleStart = async () => {
    setLoading(true)

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
    setLoading(false)

  }
  return (
    <Layout name={fullname}>
      <main className={s.main}>
          <div>
            <h1>Let us get started.</h1>
            {/* <p>Once the button clicked you can not attend again.</p> */}
            <div className="space"></div>
            <Button colorScheme='green' onClick={handleStart}>
        {!alreadyAttended ?
              'START THE QUIZ' :
              'CONTINUE THE QUIZ'
        }
              </Button>
          </div>
          
          <div>
          </div>

        
      </main>
    </Layout>
  )
}
