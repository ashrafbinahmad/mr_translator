import React from 'react'
import domtoimage from 'dom-to-image';
import { Button } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import ui_functions from '../helpers/ui_functions';


// get user me from api using getServerSideProps



export default function thanks() {

  const router = useRouter()
  const [user, setUser] = React.useState(null)

  function allStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values.push( localStorage.getItem(keys[i]) );
    }

    return values;
}



  React.useEffect(() => {
    console.log(allStorage());
    ui_functions.clearLocalStorageByPrefix('q-')
    axios.post('/api/user/me', {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username')
    }).then((res) => {
      console.log(res.data.details)
      setUser(res.data.details)

      //go back to / if user status is not null
      if (res.data.details.status == null) {
        router.push('/start')
      }
      if (res.data.details.status == "0") {
        router.push('/quiz')
      }
    }).catch((err) => {
      console.log(err)
    })
  }, [])



  React.useEffect(() => {
    // draw /images/certificate.jpg on canvas
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
      <div style={{ height: '98vh', position:'relative' }}>
        <div style={{  overflow: 'auto' }} >
          <canvas id='certificate'   ></canvas>
        </div>
        <div onClick={download} style={{position:'absolute', top:'0%', left:'0%', height:'100%', width:'100%', opacity:'.5', backgroundColor:'black'}}> <DownloadIcon /> Download</div>
        <Button onClick={download} colorScheme='blue' m='auto' style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}}> <DownloadIcon /> Download</Button>
        {/* <button onClick={download}>Download</button> */}
      </div>
    </Layout>
  )
}
