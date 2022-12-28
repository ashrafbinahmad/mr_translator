import { Box, Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import React from 'react'
import s from '../styles/login.module.css'

export default function login() {
  const router = useRouter()
  const [error, setError] = React.useState(' ')
  const [Username, setUsername] = React.useState('')
  const [Password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e) => {
    setError('_')

    e.preventDefault()
    setLoading(true)
    if (Username === '' || Password === '') {
      setError('Username or Password is empty')
    } else {
      setError('')
      axios.post('/api/login', { username: Username, password: Password }).then((res) => {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', res.data.username)
        if (res.data.username === 'admin') {
          router.push('/admin')
        } else {
          router.push('/start')
        }
      })
        .catch((err) => {
          setError(err.response.data.message)
        }).finally(()=>{
          setLoading(false)
        })


    }
  }

  return (
    <div>
      <div className={s.container}>
        <div className={s.left}>
          {/* <img src="images/loginbg.jpg" alt="" /> */}
        </div>
        <Box p={8}>
          <Heading className={s.heading} size='lg'>LOGIN</Heading>
          <FormControl isRequired isInvalid>
            <FormLabel >Username</FormLabel>
            <Input placeholder=" " value={Username} onChange={(e) => setUsername(e.target.value)} />
            <FormLabel >Password</FormLabel>
            <Input placeholder=" " type='password' value={Password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => { if (e.key == 'Enter')  handleSubmit(e) }} />
            <Button className={s.btnLogin} colorScheme='blue' onClick={(e) => handleSubmit(e)} >{loading ? 'LOGING IN...' : 'LOG IN'}</Button>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        </Box>
      </div>
    </div>
  )
}
