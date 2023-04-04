import React from 'react'
import styles from './style.module.scss'
import { ArrowYellow } from 'pages/test/images/arrowYellow'
import { useAppSelector } from 'app/redux/hooks'
import VideoRecorder from './VideoRecorder/VideoRecorder'

interface IAnswerExampleProps {
  onClose: () => void
  index: string
}

export const AnswerExample = ({ onClose, index }: IAnswerExampleProps) => {
  const qusetionId = useAppSelector((state) => state?.qusetion[0]?.id)
  const question = useAppSelector((state) => state?.qusetion[0]?.text)

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.wrap_arrow}>
          <span className={styles.id_text}>{qusetionId}</span>
          <ArrowYellow />
        </div>
        <div className={styles.content}>
          <p className={styles.question}>{question}</p>
        </div>
      </div>
      <div className={styles.right}>
        <VideoRecorder onClose={onClose} index={index} />
      </div>
    </div>
  )
}
