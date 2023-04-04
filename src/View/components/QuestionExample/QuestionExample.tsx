import { BigButton } from 'pages/test/components/components/BigButton/BigButton'
import { Video } from 'pages/test/images/video'
import { Text } from 'pages/test/images/text'
import { ArrowYellow } from 'pages/test/images/arrowYellow'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'
import { Button } from 'pages/test/components/components/Button/Button'
import { questionTextChanged } from 'pages/test/redux/testSlise'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'app/redux/hooks'
import { changedTextQuestion } from 'pages/test/redux/question'

interface IId {
  index: string
  textQusetion: string
  onAnswer: () => void
}

export const QuestionExample = ({ index, textQusetion, onAnswer }: IId) => {
  const refText = useRef(null)
  const refArea = useRef(null)
  const [description, setDescription] = useState('')
  const dispatch = useDispatch()
  const qusetionId = useAppSelector((state) => state?.qusetion[0]?.id)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(questionTextChanged({ index, value: e.target.value }))
    dispatch(changedTextQuestion({ value: e.target.value }))
  }

  const onChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrap_arrow}>
        <span className={styles.id_text}>{qusetionId}</span>
        <ArrowYellow />
      </div>
      <div className={styles.content}>
        <div className={styles.textWrapper}>
          <input
            type='text'
            ref={refText}
            value={textQusetion ?? ''}
            onChange={onChange}
            placeholder='Текст вопроса'
            className={styles.text}
          />
          <textarea
            ref={refArea}
            value={description}
            onChange={onChangeDescription}
            placeholder='Описание вопроса (Не обязательно)'
            className={styles.description}
          />
        </div>
        <div>
          <span className={styles.inscription}>Как вы хотите ответить ?</span>
          <div className={styles.btnWrapper}>
            <BigButton onclick={onAnswer} img={<Video />} text='Видео' />
            <BigButton onclick={() => {}} img={<Text />} text='Текст' />
          </div>
          <p className={styles.bottomInscription}>Вы можете попрактиковаться перед отправкой</p>
        </div>
        <Button onclick={() => {}} text='Далее' />
      </div>
    </div>
  )
}
