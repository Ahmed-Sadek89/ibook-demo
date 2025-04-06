import { useRef } from "react";
import AudioSection from "../../AudioSection/AudioSection";
import VideoSection from "../../VideoSection/VideoSection";
import cls from "./sectionPreview.module.scss";
import { Icon } from "@iconify/react/dist/iconify.js";

const SectionPreview = ({
  setOpenPreview,
  sectionPreviewData,
  setOpenModalPreview,
  direction,
}) => {
  // COMPONENT HOOKS
  const overlay = useRef(null)

  // COMPONENT HANDLERS
  const closeModal = (e) => {
    if (overlay.current === e.target) setOpenPreview(false);
  };

  const close = async () => {
    setOpenPreview(false);
  };

  return (
    <div className={cls.overlay} ref={overlay} onClick={(e) => closeModal(e)}>
      <div className={cls.area}>
        <div className={cls.area__wrapper}>
          <div className={`${cls.close}       `} onClick={close}>
            <Icon icon="material-symbols:close-rounded" width="24" height="24" />
          </div>

          <div
            // container
            className={`${cls.area__content} ${direction === "rtl" ? cls.arabic : cls.english
              }`}
            // spacing={3}
          >
            <h5>{sectionPreviewData.title}</h5>
            <p>{sectionPreviewData.details}</p>

            {sectionPreviewData.type === 'big_image_with_audio' ?
              <AudioSection audio={sectionPreviewData.audio_link} data={sectionPreviewData} />
              :
              <VideoSection audio={sectionPreviewData.video_link} data={sectionPreviewData} openModal={setOpenModalPreview} />
            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionPreview;
