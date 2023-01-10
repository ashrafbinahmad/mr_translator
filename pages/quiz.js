import { Box, Grid, Skeleton, Stack, Textarea } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import Layout from '../components/layout';
import ui_functions from '../helpers/ui_functions';
import Foot from '../components/foot';
import s from '../styles/quiz.module.css'
import data_questions from '../helpers/data_questions.json'
import { useRouter } from 'next/router';
import data from '../helpers/data.json';

export default function quiz() {
  const [question, setQuestion] = React.useState();
  const [duration, setDuration] = React.useState(0);
  const [user, setUser] = React.useState({ username: 'loading...' });
  const [answer, setAnswer] = React.useState('');

  const ending_datetime = new Date(data.end_time);

  // '2021-07-30T23:59:59.999Z' in am pm format


  const router = useRouter()

  const test_mode = data.test_mode;
  const updated_message = 'UPDATED on 7 30'
  const loadCurrentQuestion = () => {
    //load questions from server
    // user/me
    axios.post('/api/user/question', {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token')
    }).then((res) => {

      if (res.data.answeredQuesCount == null) {
        router.push('/start')
      }
      const current_question = res.data.questions[0]

      console.log(current_question)

      setQuestion(current_question);
      localStorage.setItem(`duration`, ui_functions.minToMs(current_question?.duration))
      if (localStorage.getItem(`q-${current_question?.id}`) == null || localStorage.getItem(`q-${current_question?.id}`) == 'undefined') {
        localStorage.setItem(`q-${current_question?.id}`, ui_functions.minToMs(current_question?.duration))
        setDuration(ui_functions.minToMs(localStorage.getItem(`q-${current_question?.id}`)));
      } else {
        setDuration(ui_functions.minToMs(localStorage.getItem(`q-${current_question?.id}`)));
      }
      setUser(res.data.user);
      if (parseInt(res.data.answeredQuesCount) == data_questions.length) {
        router.push('/thanks')
      }

    }).catch((err) => {
      console.log(err)
      router.reload()
    })
  }

  const saveAnswer = (reload) => {
    if (answer != null && answer != undefined && duration <= 0 && data_questions.length >= question?.id && !test_mode) {
      axios.post('/api/user/answer', {
        username: localStorage.getItem('username'),
        token: localStorage.getItem('token'),
        questId: question.id,
        answer: answer
      }).then((res) => {

        // data_questions.length > question.id && loadCurrentQuestion()
        alert('Time over, Answer submitted. Tap OK to continue.')
        reload && router.reload()
        setAnswer('')
      }).catch((err) => {
        console.error(err);
      })
    }
  }


  //test
  React.useEffect(() => {

    // 
    // 

  }, [])

  React.useEffect(() => {
    window.document.getElementById('textareaAnswer').focus()

    loadCurrentQuestion()

  }, [])

  React.useEffect(() => {
    saveAnswer(true)
  }, [duration])



  // count down the duration when page loaded and when currentQuestId changes to limit currentDuration
  React.useEffect(() => {
    const interval = setInterval(() => {

      if (duration >= 0) localStorage.setItem(`q-${question?.id}`, parseInt(localStorage.getItem(`q-${question?.id}`)) - 1000)
      if (duration >= 0) setDuration(localStorage.getItem(`q-${question?.id}`));

      let current_time;
      axios.get('http://worldtimeapi.org/api/timezone/Asia/Kolkata').then((res) => {
        current_time = new Date(res.data.datetime)
        let showedAlert = false;
        if (current_time >= ending_datetime) {
          !showedAlert && alert("Time's up. Thanks for participating.")
          axios.post('/api/user/answer', {
            username: localStorage.getItem('username'),
            token: localStorage.getItem('token'),
            questId: question.id,
            answer: answer
          }).then((res) => {

            // data_questions.length > question.id && loadCurrentQuestion()
            alert('Time over, Answer submitted. Tap OK to continue.')
            reload && router.reload()
            setAnswer('')
          }).catch((err) => {
            console.error(err);
          })
          clearInterval(interval)
          showedAlert = true;
          router.push('/thanks')
        }
      })

    }, 1000);
    return () => clearInterval(interval);
  }, [question]);

  const handleAnswerOnChange = (e) => {

    // setAnswer(e.target.value)
    setAnswer(prev => {
      const answer = e.target.value.slice(0, prev.length + 1)
      return answer
    })
  }

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
                  <Skeleton height='20px' maxWidth={'18rem'} style={{ margin: 'auto' }} isLoaded={question?.id != undefined}>
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
                  <p style={{ textAlign: ui_functions.isArabic(question?.question) ? 'right' : 'left' }}
                    dir={ui_functions.isArabic(question?.question) ? 'rtl' : 'ltr'}
                    lang={ui_functions.isArabic(question?.question) ? 'arb' : 'en'}

                  > {question?.question}</p>
                </Skeleton>
                {
                  data.test_mode && <p>{answer}</p>
                }
                <Skeleton className={s.answer} width='100%' isLoaded={question?.id != undefined} >
                  {/* <p> {question?.question}</p> */}
                  <Textarea colorScheme='blue' tabIndex='0' className={s.answer} borderColor='blue.500'
                    dir={ui_functions.isArabic(question?.question) ? 'ltr' : 'rtl'}
                    //  style={{textAlign: ui_functions.isArabic(question?.question) ? 'left' : 'right'}}
                    id='textareaAnswer'
                    width='100%'
                    height='100%'
                    onPaste={(e) => {
                      data.pastable || e.preventDefault();

                    }}
                    value={answer}
                    onChange={(e) => {
                      handleAnswerOnChange(e)

                    }} />
                </Skeleton>
              </Grid>
              <div className={s.foot}>
                <Foot currentQuestId={question?.id} duration={ui_functions.msToMin(duration)} total_questions_count={data_questions.length} />

              </div>
            </div>

            <div>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
