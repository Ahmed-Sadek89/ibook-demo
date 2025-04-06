import cls from './wrongAnswer.module.scss'

const WrongAnswer = () => {
  return (
    <div className={cls.dropLayer}>

      <div className={cls.inside}>

        <audio autoPlay src="/audios/wrong.mp3"></audio>

        <img src="/imgs/sad.png" alt="wrongImage" />

      </div>

    </div>
  )
}

export default WrongAnswer;