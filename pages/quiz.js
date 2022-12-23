import { Box, Grid, Textarea } from '@chakra-ui/react';
import axios from 'axios';
import React from 'react'
import Layout from '../components/layout';
import ui_functions from '../helpers/ui_functions';
import Foot from '../components/foot';
import s from '../styles/quiz.module.css'

export default function quiz() {
  const [questions, setQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [currentQuestId, setCurrentQuestId] = React.useState(null);
  const [currentDuration, setCurrentDuration] = React.useState(1);
  const [total_questions_count, setTotalQuestionsCount] = React.useState(1);
  const [user, setUser] = React.useState({})
  const [currentQuestion, setCurrentQuestion] = React.useState({});

  const test_mode = false;
  const updated_message = 'UPDATED on 3.36'


  React.useEffect(() => {
    console.log(updated_message);
    axios.post('/api/user/me', {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token')
    }).then((res) => {
      loadQuestions(res.data.details)
      setUser(res.data.details)
      // console.log(res.data.details);
    })
  }, [currentQuestId]);

  // load questions when user is loaded

  React.useEffect(() => {
    if (user) {
      loadQuestions(user)
    }
  }, []);

  

  React.useEffect(() => {
    console.log("changed currentQuestId");
    setCurrentDuration(ui_functions.minToMs(questions[parseInt(user.status)]?.duration));

  }, [currentQuestId]);

  // change currentQuestId when currentDuration is 0
  React.useEffect(() => {
    if (currentQuestId != null && total_questions_count >= currentQuestId && !test_mode) {
      if (currentDuration == 0) {
        //post answers to server
        answers && console.log(answers.answer);
        axios.post('/api/user/answer', {
          username: localStorage.getItem('username'),
          token: localStorage.getItem('token'),
          answer: answers.answer,
          questId: currentQuestId
        }).then((res) => {
          console.log(res.data);
          // loadQuestions(user)
          console.log(user.status);
          setCurrentQuestId(parseInt(user.status) + 2);

        }).catch((err) => {
          console.log(err);
        });

      }
    }
  }, [currentDuration]);

  const loadQuestions = (user) => {
    axios.post('/api/user/questions', {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token')
    }).then((res) => {
      setQuestions(res.data.questions);
      // setCurrentQuestion(res.data.questions[parseInt(user.status)]);

      console.log(res.data);
      console.log('user status: ' + user.status);
      setTotalQuestionsCount(res.data.total_questions_count);
      setCurrentQuestId(parseInt(user.status) + 1);
      // setCurrentDuration(res.data.questions.find(quest => quest.id = res.data.answeredQuesCount + 1).duration * 1000.0 * 60.0);
    }).catch((err) => {
      console.log(err);
    });
  }


  // count down the duration when page loaded and when currentQuestId changes to limit currentDuration
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDuration((prev) => {
        if (prev > 0) {
          return prev - 1000;
        }
        else {
          return 0;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestId]);

  return (
    <Layout name={user.username}>
      <div className={s.page}>
        <div className={s.container}>
          <div className={s.all_questions} style={{ '--question_no': currentQuestId }}>
            {questions.map((question, index) => {
              return (
                <div className={s.quiz} key={index}>
                  <h2 className={s.heading}>Q: {question.id} - {question.title}</h2>
                  <Grid className={s.quest_ans} gridTemplateRows={`minMax(min-content, 50%)  auto`} >

                    <p className={s.question}> {question.question}</p>
                    <Textarea colorScheme='blue' tabIndex='0' className={s.answer} borderColor='blue.500'
                      width='100%'
                      height='100%'
                      onPaste={(e) => {
                        e.preventDefault();

                      }}
                      onChange={(e) => {
                        setAnswers((prev) => {
                          return {
                            ...prev,
                            answer: e.target.value,
                            questId: question.id
                          }
                        })
                      }} />
                  </Grid>
                  <div className={s.foot}>
                    <Foot currentQuestId={currentQuestId} duration={ui_functions.msToMin(currentDuration)} total_questions_count={total_questions_count} />

                  </div>
                </div>
              )
            })}
            <div>
              DONE!
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
