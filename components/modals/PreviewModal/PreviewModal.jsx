import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import Cookies from "universal-cookie";
import { format } from "date-fns";
import cls from "./previewModal.module.scss";
import { apiClient } from "../../../Utils/axios";
import { Icon } from "@iconify/react/dist/iconify.js";
const cookie = new Cookies();

const PreviewModal = ({
  setOpenPreview,
  imgSrc,
  previewType,
  sectionId,
  direction,
}) => {
  // COMPONENT HOOKS
  const [playedSeconds, setPlayedSeconds] = useState();
  const [userPauses, setUserPauses] = useState();
  const [startTime, setStartTime] = useState();
  const overlay = useRef();

  // COMPONENT HANDLERS
  const closeModal = (e) => {
    if (overlay.current === e.target) setOpenPreview(false);
  };

  const close = async () => {
    setOpenPreview(false);

    if (playedSeconds) {
      const trackData = {
        page_section_id: sectionId,
        event_category: "video",
        event_action: "pause",
        session_start_time: format(Date.now(), "yyyy-MM-dd hh:mm"),
        session_end_time: format(Date.now(), "yyyy-MM-dd hh:mm"),
        total_time: 0,
      };

      const response = await apiClient
        .post("/crm/students/book_reports", trackData, {
          headers: {
            Authorization: `Bearer ${cookie.get("ibook-auth")}`,
          },
        })
        .catch((err) => console.log(err));

      if (!response) return;
    }
  };

  const videoProgrssHandler = async (played) => {
    setPlayedSeconds(played.playedSeconds);
    setStartTime(Date.now());
  };

  const videoPauseHanlder = async () => {
    // Check if startTime and playedSeconds are valid
    if (!startTime || !playedSeconds) {
      console.warn("startTime or playedSeconds is not set. Aborting pause handler.");
      return;
    }

    // Increment user pause count
    setUserPauses((prev) => (prev ? prev + 1 : 1));

    // Track 'play' event
    const trackData = {
      page_section_id: sectionId,
      event_category: "video",
      event_action: "play",
      session_start_time: format(startTime, "yyyy-MM-dd HH:mm"), // Ensure the time format is correct
      session_end_time: format(Date.now(), "yyyy-MM-dd HH:mm"),
      total_time: playedSeconds,
    };

    try {
      await apiClient.post("/crm/students/book_reports", trackData, {
        headers: {
          Authorization: `Bearer ${cookie.get("ibook-auth")}`,
        },
      });

      // Track 'pause' event
      const trackData2 = {
        page_section_id: sectionId,
        event_category: "video",
        event_action: "pause",
        session_start_time: format(Date.now(), "yyyy-MM-dd HH:mm"),
        session_end_time: format(Date.now(), "yyyy-MM-dd HH:mm"),
        total_time: 0,
      };

      await apiClient.post("/crm/students/book_reports", trackData2, {
        headers: {
          Authorization: `Bearer ${cookie.get("ibook-auth")}`,
        },
      });
    } catch (err) {
      console.log("Error during video tracking:", err);
    }
  };

  const renderView = () => {
    // console.log({previewType})
    if (previewType === "image") {
      return <img src={imgSrc} alt="Image" />;
    } else if (previewType === "video") {
      return (
        <ReactPlayer
          url={imgSrc}
          width="100%"
          onProgress={videoProgrssHandler}
          onPause={videoPauseHanlder}
          playing={true}
          controls={true}
        />
      );
    } else if (previewType === "activity") {
      console.log({imgSrc})
      return (
        <iframe
          src={imgSrc}
          width="100%"
          title="YouTube video player"
          // frameBorder="0"
          // allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    }
  };

  return (
    <div className={cls.overlay} ref={overlay} onClick={(e) => closeModal(e)}>
      <div className={cls.area}>
        <div className={cls.area__wrapper}>
          <div className={`${cls.close} `} onClick={close}>
            <Icon icon="material-symbols:close-rounded" width="24" height="24" />
          </div>

          <div
            // container
            className={`${cls.area__content} ${direction === "rtl" ? cls.arabic : cls.english
              }`}
            // spacing={3}
          >
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
