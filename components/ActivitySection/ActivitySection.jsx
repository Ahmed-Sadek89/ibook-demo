import { Icon } from "@iconify/react/dist/iconify.js";
import cls from "./activitySection.module.scss";
import Image from "next/image";

const ActivitySection = ({ activity, openModal, data }) => {
  const openPreview = (state, data, type) => {
    openModal(state, data, type);
  };

  return (
    <div className={cls.activitySection}>
      {/* <span>{data.title}</span> */}
      {data.photo_file ? (
        <div
          className={cls.activityImagePreview}
          onClick={() => openPreview(true, activity, "activity")}
        >
          <Image width={1000} height={1000} src={data.photo_file} alt="activity_image" />

          <div className={cls.questionIcon}>
            <Icon icon="bxs:network-chart" width="100" height="100" color="rgb(255 64 4 / 30%)" />
          </div>
        </div>
      ) : (
        <button
          className="wrapper"
          onClick={() => openPreview(true, activity, "activity")}
        >
          <Image width={200} height={200} src="/imgs/activity.png" alt="image" />
        </button>
      )}
    </div>
  );
};

export default ActivitySection;
