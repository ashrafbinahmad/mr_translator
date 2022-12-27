import { Button, Table } from '@chakra-ui/react'
import React from 'react'
import { DownloadIcon } from '@chakra-ui/icons'
import axios from 'axios'
import jsPDF from 'jspdf'

export default function admin() {
  const [users, setUsers] = React.useState([])

  const downloadUserAnswers = async (username) => {
    const userAnswers = await axios.post(`/api/admin/download/${username}`, {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token')
    })

    // allAnswers.filter((answer) => answer.username === username)
    console.log(userAnswers.data.answers)

    // download userAnswers as pdf with jspdf

    const headers = [
      "answer",
      "id",
      "questId",
      "res_code",
      "username"
    ]
  const doc = new jsPDF();
  // doc.addFont('fonts/times new roman.ttf', 'times', 'normal');
  // doc.addFont('fonts/trado.ttf', 'trado', 'normal');
 
  // doc.table(10, 10, userAnswers.data.answers, headers, { autoSize: false, printHeaders: true, theme: 'grid', margin: { top: 10, left: 10, bottom: 10, right: 10 } });
  

  // show pdf in new tab
  doc.output('dataurlnewwindow');
  
  
  
  // doc.save(`${username}.pdf`);
}

const downloadAllAnswers = async () => {
  const allAnswers = await axios.post(`/api/admin/download`, {
    username: localStorage.getItem('username'),
    token: localStorage.getItem('token')
  })
  console.log(allAnswers)
  const doc = new jsPDF();
  doc.text('All Answers', 10, 10);

  doc.save('allAnswers.pdf');
}




// get users 
React.useEffect(() => {
  axios.post('/api/admin/users', {
    username: localStorage.getItem('username'),
    token: localStorage.getItem('token')
  }).then((res) => {
    console.log(res.data)
    setUsers(res.data.users)
  }).catch((err) => {
    console.log(err)
  })
}, [])
return (
  <div>


    <Table>
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
              <td><Button colorScheme='blue' onClick={() => downloadUserAnswers(user.username)} > <DownloadIcon />  </Button></td>
            </tr>
          )
        })}
      </tbody>
    </Table>




    <Button colorScheme='blue' onClick={downloadAllAnswers}> <DownloadIcon />  </Button>
  </div>
)
}
