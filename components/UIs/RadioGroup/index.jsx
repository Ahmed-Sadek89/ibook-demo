//== Styles
import styles from './radioGroup.module.scss';

const RadioGroup = ({ name, checked }) => {
  return (
    <div className={styles.radio_input}>
      <div className={styles.field}>
        <input name={name} type="radio" className={styles.input} checked={checked} onChange={() => { }} />
      </div>
    </div>
  )
}

export default RadioGroup;