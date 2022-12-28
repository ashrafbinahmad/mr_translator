import { Button, Table } from '@chakra-ui/react'
import React from 'react'
import { DownloadIcon } from '@chakra-ui/icons'
import axios from 'axios'
import Layout from '../components/layout'
import s from '../styles/admin.module.css'

export default function admin() {
  const [users, setUsers] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const downloadUserAnswers = async (username) => {
    setLoading(true)

    axios.post(`/api/admin/download/${username}`,
      {
        username: localStorage.getItem('username'),
        token: localStorage.getItem('token')
      },
      {
        responseType: 'blob'
      }
    ).then((res) => {
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${username}_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }).catch((err) => {
      
    }).finally(() => {
      setLoading(false)
    })
  }

  const downloadAllAnswers = async () => {
    setLoading(true)
    axios.post('/api/admin/download', {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token')
    },
      {
        responseType: 'blob'
      }
    ).then((res) => {
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `All answers_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    }).catch((err) => {
      
    }).finally(() => {
      setLoading(false)
    })

  }

  React.useEffect(() => {
    axios.post('/api/admin/users', {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token')
    }).then((res) => {
      
      setUsers(res.data.users)
    }).catch((err) => {
      
    })
  }, [null])


  return (
    <Layout name='ADMIN' answeredCount=''>

      <div className={s.container} style={{cursor: loading ? 'progress' : 'default'}} >
        <Button className={s.btnDnAll}  onClick={downloadAllAnswers}> <DownloadIcon /> Download all results  </Button>
        <div className={s.tableContainer}>
          <Table className={s.table}>
            <tbody>
              <tr>
                <th>SI No.</th>
                <th>Username</th>
                <th>Answered count</th>
                <th>Action</th>
              </tr>
              {users.filter(usr => usr.username != 'admin').map((user, index) => {
                return (
                  <tr key={index}>
                    <td >{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.status}</td>
                    <td style={{width:'10px'}}>
                      <Button onClick={() => downloadUserAnswers(user.username)} > <DownloadIcon /> Download </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>

        </div>


      </div>
    </Layout>
  )
}
