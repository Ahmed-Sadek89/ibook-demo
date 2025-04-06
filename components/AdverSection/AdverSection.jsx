/* eslint-disable @next/next/no-img-element */
import cls from "./AdverSection.module.scss";

const AdverSection = ({ data }) => {
  return (
    <div className={cls.adverSection}>
      <a href={data.link} rel="noreferrer" target="_blank">
        <img src={data.photo_file} alt={data.title} />
      </a>
    </div>
  );
};

export default AdverSection;
