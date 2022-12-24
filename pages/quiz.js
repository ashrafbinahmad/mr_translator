import { Box, Grid, Skeleton, Stack, Textarea } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import Layout from '../components/layout';
import ui_functions from '../helpers/ui_functions';
import Foot from '../components/foot';
import s from '../styles/quiz.module.css'
import data_questions from '../helpers/data_questions.json'
import { useRouter } from 'next/router';

export default function quiz() {
  const [question, setQuestion] = React.useState();
  const [duration, setDuration] = React.useState(0);
  const [user, setUser] = React.useState({ username: 'loading...' });
  const [answer, setAnswer] = React.useState('');

  const router = useRouter()

  const test_mode = false;
  const updated_message = 'UPDATED on 6 34 '
  const loadCurrentQuestion = () => {
    //load questions from server
    // user/me
    axios.post('/api/user/me', {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token')

    }).then((res) => {
      const current_question = data_questions[parseInt(res.data.details.status)]

      console.log("user", res.data.details);
      console.log("current question", current_question)
      setQuestion(current_question);
      setDuration(ui_functions.minToMs(current_question?.duration));
      setUser(res.data.details);
      if (parseInt(res.data.details.status) == data_questions.length) {
        router.push('/thanks')
      }
    window.document.getElementById('textareaAnswer').focus()

    }).catch((err) => {
      console.log("error while fetching user", err);
      router.reload()
    })
  }


  //test
  React.useEffect(() => {
    console.log(updated_message);
    console.log(question);
    
  }, [])

  React.useEffect(() => {
    loadCurrentQuestion()

  }, [])

  //post answer and reload current question
  React.useEffect(() => {
    if (duration <= 0 && data_questions.length >= question?.id && !test_mode) {
      axios.post('/api/user/answer', {
        username: localStorage.getItem('username'),
        token: localStorage.getItem('token'),
        questId: question.id,
        answer: answer
      }).then((res) => {
        console.log(res.data);
        // data_questions.length > question.id && loadCurrentQuestion()
        router.reload()
        setAnswer('')
      }).catch((err) => {
        console.error(err);
        // console.log("reloaded");

      })
    }
    

  }, [duration])



  // count down the duration when page loaded and when currentQuestId changes to limit currentDuration
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDuration((prev) => {
        if (prev > 0) {
          return prev - 1000;
        }
        else {
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [question]);

  return (
    <Layout name={user.username} answeredCount={user?.status}>
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.all_questions}  >
            {/* <div className={s.all_questions}  style={{ '--question_no': question?.id }}> */}

            <div className={s.quiz}>
              <h1>
                <Stack className={s.heading} mt='1rem' >
                  <Skeleton height='20px' width='2rem' m='auto' isLoaded={question?.id != undefined} >
                    {question?.id}
                  </Skeleton>
                  <Skeleton height='20px' maxWidth={'18rem'} style={{margin:'auto'}} isLoaded={question?.id != undefined}>
                    {question?.title}
                  </Skeleton>
                </Stack>
              </h1>



              {/* <Stack direction='row' spacing='1rem' margin='auto' >

                  <Skeleton height='20px' width='2rem' />
                  <Skeleton height='20px' width='10rem' />
                </Stack> */}


              <Grid className={s.quest_ans} gridTemplateRows={`minMax(min-content, 50%)  auto`} >
                <Skeleton className={s.question} width='100%' isLoaded={question?.id != undefined} >
                  <p> {question?.question}</p>
                </Skeleton>
                <Skeleton className={s.answer} width='100%' isLoaded={question?.id != undefined} >
                  {/* <p> {question?.question}</p> */}
                  <Textarea colorScheme='blue' tabIndex='0' className={s.answer} borderColor='blue.500'
                    id='textareaAnswer'
                    width='100%'
                    height='100%'
                    onPaste={(e) => {
                      e.preventDefault();

                    }}
                    onChange={(e) => {
                      setAnswer(e.target.value)
                    }} />
                </Skeleton>
              </Grid>
              <div className={s.foot}>
                <Foot currentQuestId={question?.id} duration={ui_functions.msToMin(duration)} total_questions_count={data_questions.length} />

              </div>
            </div>

            <div>
              DONE!
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
