/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import ImageSection from "../ImageSection/ImageSection";
import TextSection from "../TextSection/TextSection";
import VideoSection from "../VideoSection/VideoSection";
import AudioSection from "./../AudioSection/AudioSection";
import QuizSection from "./../QuizSection/QuizSection";
import ImageWithAudio from "../ImageWithAudio/ImageWithAudio";
import ImageWithVideo from "../ImageWithVideo/ImageWithVideo";
import ActivitySection from "../ActivitySection/ActivitySection";

import cls from "./page.module.scss";

const BookPage = ({
  data,
  openModal,
  openSectionPreview,
  openQuiz,
  index,
  setSectionId,
  footerLogo,
  footerNumLogo,
  direction,
  page,
  openSectionPreviewModal,
  sectionPreviewData,
}) => {
  const renderSection = (type, section) => {
    switch (type) {
      case "text":
        return (
          <TextSection
            title={section.title}
            details={section.details}
            sectionId={section.id}
            direction={direction}
          />
        );
      case "image":
        return <ImageSection image={section.photo_file} page={page} />;
      case "video":
        return (
          <VideoSection
            video={section.video_link}
            openModal={openModal}
            data={section}
          />
        );
      case "audio":
        return (
          <AudioSection
            audio={section.audio_link}
            openModal={openModal}
            data={section}
          />
        );
      case "activity":
        return (
          <ActivitySection
            activity={section.iframe}
            openModal={openModal}
            data={section}
          />
        );
      case "quiz":
        return <QuizSection section={section} openQuiz={openQuiz} />;
      case "big_image_with_audio":
        return (
          <ImageWithAudio
            section={section}
            openQuiz={openQuiz}
            page={page}
            openModal={openSectionPreview}
            openSectionPreviewModal={openSectionPreviewModal}
            sectionPreviewData={sectionPreviewData}
          />
        );
      case "big_image_with_video":
        return (
          <ImageWithVideo
            section={section}
            openQuiz={openQuiz}
            page={page}
            openModal={openSectionPreview}
            openSectionPreviewModal={openSectionPreviewModal}
            sectionPreviewData={sectionPreviewData}
            openVideoModal={openModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cls.page}>
      {data.length > 0 ? (
        <>
          {data.map((section) => (
            <div
              key={section.id}
              onMouseEnter={() => setSectionId(section.id)} // Handle state updates here
            >
              {renderSection(section.type, section)}
            </div>
          ))}
        </>
      ) : (
        <div className={cls.headPages}>
          {data.photo && <img src={data.photo} alt="Img" />}
        </div>
      )}

      <div className={cls.footer}>
        {footerLogo && <img src={footerLogo} alt="footerLogo" />}

        <div
          className={`${cls.pageNum} ${direction === "rtl" ? cls.arabic : cls.english
            }`}
        >
          {footerNumLogo ? (
            <>
              <p>{index + 1}</p>
              <img src={footerNumLogo} alt="footerImage" />
            </>
          ) : (
            <p className={cls.numWithNoImg}>{index + 1}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookPage;
