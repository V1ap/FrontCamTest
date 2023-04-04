import React, { useEffect, useState } from 'react'
import { useAppSelector } from 'app/redux/hooks'
import { useDispatch } from 'react-redux'
import { QuestionExample } from './components/QuestionExample/QuestionExample'
import styles from './style.module.scss'
import question, { addQuestion } from 'pages/test/redux/question'
import { AnswerExample } from './components/AnswerExample/AnswerExample'

export const View = () => {
  const dispatch = useDispatch()

  const textQusetion = useAppSelector((state) => state?.qusetion[0]?.text)
  const qusetionId = useAppSelector((state) => state?.qusetion[0]?.id)
  const qusetions = useAppSelector((state) => state.test)

  const qusetionIndex = qusetions.findIndex((i) => i.id === qusetionId)

  const [isAnswer, setIsAnswer] = useState(false)

  useEffect(() => {
    dispatch(addQuestion(qusetions[0]))
  }, [])

  return (
    <div className={styles.content}>
      <div className={`${styles.wrapper} ${isAnswer ? styles.answer : ''}`}>
        <div className={`${styles.strip} ${isAnswer ? styles.answer : ''}`} />
        <div className={`${styles.wrap} ${isAnswer ? styles.answer : ''}`}>
          {isAnswer && <AnswerExample onClose={() => setIsAnswer(false)} index={String(qusetionIndex)} />}
          {!isAnswer && (
            <QuestionExample
              index={qusetionIndex === -1 ? '0' : String(qusetionIndex)}
              textQusetion={textQusetion}
              onAnswer={() => setIsAnswer(true)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
