import React from 'react'
import domtoimage from 'dom-to-image';
import { Button } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Layout from '../components/layout';
import { useRouter } from 'next/router';
import ui_functions from '../helpers/ui_functions';
import s from '../styles/thanks.module.css'
import data from '../helpers/data.json'






export default function thanks() {

  const [completed, setCompleted] = React.useState(false)

  const router = useRouter()
  const [user, setUser] = React.useState(null)





  React.useEffect(() => {
    
    ui_functions.clearLocalStorageByPrefix('q-')
    axios.post('/api/user/me', {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username')
    }).then((res) => {
      
      setUser(res.data.details)

      
      if (res.data.details.status == null) {
        router.push('/start')
      }
      if (res.data.details.status == "0") {
        setCompleted(false)
      } else {
        setCompleted(true)
      }
    }).catch((err) => {
      
    })
  }, [])



  React.useEffect(() => {
    
    const canvas = document.getElementById('certificate');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = '/images/certificate.jpg';
    img.onload = () => {

      canvas.height = img.height;
      canvas.width = img.width;


      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(user?.username, 200, 450);
    }
  }, [user])

  const download = () => {
    const node = document.getElementById('certificate');
    domtoimage.toPng(node)
      .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.setAttribute('href', dataUrl);
        link.click();
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
  }

  return (
    <Layout name={user?.username} answeredCount={user?.status} >
      <div className={s.container} style={{ height: '98vh', position: 'relative' }}>
        <div className={s.can_container} style={{ overflow: 'auto' }}  >
          <canvas id='certificate'   ></canvas>
        </div>


        <div className={s.contents}
          
        >
          {completed &&
            <div>
              <img src="/images/done.gif" width='100px' alt="" style={{marginBottom:'2rem'}} />
              <Button onClick={download} colorScheme='blue'>
                <DownloadIcon /> Download Certificate
              </Button>
            </div>
          }
        </div>

      </div>
    </Layout>
  )
}
