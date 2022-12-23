import { Box, Grid, Textarea } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import Layout from '../components/layout';
import ui_functions from '../helpers/ui_functions';
import Foot from '../components/foot';
import s from '../styles/quiz.module.css'
import data_questions from '../helpers/data_questions.json'
import { useRouter } from 'next/router';

export default function quiz() {
  const [question, setQuestion] = React.useState([]);
  const [duration, setDuration] = React.useState(0);
  const [user, setUser] = React.useState({ username: 'loading...' });
  const [answer, setAnswer] = React.useState('');

const router = useRouter()

  const test_mode = false;
  const updated_message = 'UPDATED on 7 41'
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
      setDuration(ui_functions.minToMs(current_question.duration));
      setUser(res.data.details);
    }).catch((err) => {
      console.log("error while fetching user",err);
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
    if (duration <= 0 && data_questions.length >= question.id) {
      axios.post('/api/user/answer', {
        username: localStorage.getItem('username'),
        token: localStorage.getItem('token'),
        questId: question.id,
        answer: answer
      }).then((res) => {
        console.log(res.data);
        data_questions.length > question.id && loadCurrentQuestion()
        setAnswer('')
      }).catch((err) => {
        console.error(err);
        router.reload()
        console.log("reloaded");

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
    <Layout name={user.username}>
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.all_questions}  >
            {/* <div className={s.all_questions}  style={{ '--question_no': question?.id }}> */}

            <div className={s.quiz}>
              <h2 className={s.heading}>Q: {question?.id} - {question?.title}</h2>
              <Grid className={s.quest_ans} gridTemplateRows={`minMax(min-content, 50%)  auto`} >

                <p className={s.question}> {question?.question}</p>
                <Textarea colorScheme='blue' tabIndex='0' className={s.answer} borderColor='blue.500'
                  width='100%'
                  height='100%'
                  onPaste={(e) => {
                    e.preventDefault();

                  }}
                  onChange={(e) => {
                    setAnswer(e.target.value)
                  }} />
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
