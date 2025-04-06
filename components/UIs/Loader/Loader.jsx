import cls from './loader.module.scss'

const Loader = () => {
  return (
    <div className={cls.wrapper}>
      <div className={cls.lds_spinner}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loader