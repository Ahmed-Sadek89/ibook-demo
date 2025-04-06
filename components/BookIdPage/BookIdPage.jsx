"use client"
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Page,
  BookFrontCover,
  BookBackCover,
} from "../../components";
import PreviewModal from "../modals/PreviewModal/PreviewModal";
import QuizModal from "../modals/QuizModal/QuizModal";
import Flippy from "../Flippy/Flippy";
import SectionPreview from "../modals/SectionPreview/SectionPreview";
import BookIndex from '../BookIndex/BookIndex';
import BookReferences from '../BookReferences/BookReferences';
import AdverSection from "../AdverSection/AdverSection";
import { apiClient } from "../../Utils/axios";
import { Icon } from "@iconify/react";

export default function BookIdPage({
  locale,
  book,
  pages,
  ALL_PAGES,
  pagesLinks,
  bookIndex,
  bookReferences
}) {
  const [allBookPages, setAllBookPages] = useState(ALL_PAGES);
  const [bookDetails, setBookDetails] = useState(book);
  const [openPreview, setOpenPreview] = useState(false);
  const [openSectionPreview, setOpenSectionPreview] = useState(false);
  const [sectionPreviewData, setSectionPreviewData] = useState({});
  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [previewData, setPreviewData] = useState();
  const [previewType, setPreviewType] = useState();
  const [sectionId, setSectionId] = useState(null);
  const [quizData, setQuizData] = useState();
  const [isLoad, setIsLoad] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [navLinks, setNavLinks] = useState(pagesLinks);
  const [bookWidth, setBookWidth] = useState(550);
  const [bookHeight, setBookHeight] = useState(620);

  const handleSectionId = (value) => setSectionId(value)
  useEffect(() => {
    setIsLoad(true);
    document.querySelector(':root').style.setProperty('--main-color', bookDetails.color);

    return () => {
      document.querySelector(':root').style.setProperty('--main-color', "#00a0d7");
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 550) {
      setBookWidth(window.innerWidth - 50);
      setBookHeight(500);
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1300) {
        setBookWidth(550);
        setBookHeight(620);
      } else if (window.innerWidth <= 550) {
        setBookWidth(window.innerWidth - 10);
        setBookHeight(450);
      } else if (window.innerWidth > 992 && window.innerWidth < 1300) {
        setBookWidth(window.innerWidth / 2 - 50);
        setBookHeight((window.innerWidth - 50) * 1.35);
      } else if (window.innerWidth > 550 && window.innerWidth < 992) {
        setBookWidth(500);
        setBookHeight((window.innerWidth - 50) * 1.35);
      }
    });
  }, [bookWidth, bookHeight]);

  useEffect(() => {
    document
      .querySelector(":root")
      .style.setProperty("--book-color", bookDetails.color);
  }, []);


  const openModal = (state, data, type) => {
    setOpenPreview(state);
    setPreviewData(data);
    setPreviewType(type);
  };

  const openSectionPreviewModal = (state, data, type) => {
    setPreviewData(data.video_link);
    setSectionPreviewData(data);
    setOpenSectionPreview(state);
    setPreviewType(type);
  };

  const openQuiz = (state, data, type) => {
    setOpenQuizModal(state);
    setQuizData(data);
  };

  let flippy = useRef(null);



  const goToNextPage = async (pageNum) => {
    if (flippy.getCurrentPageNumber() % 30 === 0) {
      setPageNumber(prev => prev + 1);

      let allPages = [...allBookPages];

      if (navLinks && navLinks?.next) {
        const response = await apiClient
          .get(navLinks.next)
          .catch((err) => console.log(err));

        if (!response) return;

        setNavLinks(response.data.data.links);

        bookPages = response.data.data.pages;
        // bookPages.sort((a, b) => a.id - b.id);
        bookPages.forEach(async (page) => {
          const unitFound = allPages.findIndex(
            (pa) =>
              pa.title === page.lesson.unit.title && !pa.unit && !pa.lesson
          );
          if (unitFound === -1) allPages.push({ ...page.lesson.unit });

          const lessonFound = allPages.findIndex(
            (pa) =>
              pa.title === page.lesson.title &&
              pa.unit &&
              pa.unit.id === page.lesson.unit.id
          );
          if (lessonFound <= -1) allPages.push({ ...page.lesson });

          const pageFound = allPages.findIndex(
            (pa) =>
              pa.title === page.title &&
              pa.lesson &&
              pa.lesson.id === page.lesson.id
          );
          if (pageFound <= -1) {
            allPages.push({ ...page });
          }
        });

        setAllBookPages([...allPages]);
      }
    }
  };

  const goToPrevPage = () => { };

  const goToPage = (pageNum) => {
    // let pageNumber = +pageNum / 2;
    flippy.goToPage(+pageNum + 1);
  };

  const enterToGoToPage = async (e, pageNum) => {
    if (e.keyCode === 13) {
      setPageNumber(+pageNum);
      flippy.goToPage(+pageNum + Math.ceil(bookIndex.length / 20) + 1);
      if (pageNum > 30) {
        if (navLinks && navLinks.next) {
          let allPages = [];
          const response = await apiClient
            .get(navLinks.next)
            .catch((err) => console.log(err));

          if (!response) return;

          setNavLinks(response.data.data.links);

          bookPages = response.data.data.pages;
          bookPages.forEach(async (page) => {
            const unitFound = allPages.findIndex(
              (pa) =>
                pa.title === page.lesson.unit.title && !pa.unit && !pa.lesson
            );
            if (unitFound <= -1) allPages.push({ ...page.lesson.unit });

            const lessonFound = allPages.findIndex(
              (pa) =>
                pa.title === page.lesson.title &&
                pa.unit &&
                pa.unit.id === page.lesson.unit.id
            );
            if (lessonFound <= -1) allPages.push({ ...page.lesson });

            const pageFound = allPages.findIndex(
              (pa) =>
                pa.title === page.title &&
                pa.lesson &&
                pa.lesson.id === page.lesson.id
            );
            if (pageFound <= -1) {
              allPages.push({ ...page });
            }
          });

          setAllBookPages((prev) => [...prev, ...allPages]);
        }
      }
    }
  };

  const bookCover = (
    <div className="cover">
      <BookFrontCover
        logo={bookDetails.logo_file}
        title={bookDetails.title}
        level={bookDetails.level}
      />
    </div>
  );

  const bookEnd = (
    <div className="cover">
      <BookBackCover direction={bookDetails.direction} />
    </div>
  );

  const bookPages = [
    bookCover,

    ...bookIndex.map((_, index) => {
      if (index % 17 === 0 && index !== 0) {
        return (
          <div className="bookIndex" key={index}>
            <BookIndex
              data={bookIndex.slice(index - 17, index)}
              goToPage={goToPage}
              indexNum={Math.ceil(bookIndex.length / 17)}
              bookDetails={bookDetails}
            />
          </div>
        );
      }
    }).concat(bookIndex.length % 17 === 0 ?
      <div className="bookIndex" key={bookIndex.length}>
        <BookIndex
          data={bookIndex.slice(-17)}
          goToPage={goToPage}
          indexNum={Math.ceil(bookIndex.length / 17)}
          bookDetails={bookDetails}
        />
      </div>
      :
      <div className="bookIndex" key={bookIndex.length}>
        <BookIndex
          data={bookIndex.slice(-17)}
          goToPage={goToPage}
          indexNum={Math.ceil(bookIndex.length / 17)}
          bookDetails={bookDetails}
        />
      </div>
    ).filter(item => item),

    ...allBookPages.map((page, idx) => (
      <div
        key={page.id}
        className={`${page.title.split(" ")[0] === "Unit" ? "unit" : ""} ${page.title.split(" ")[0] === "Lesson" ? "lesson" : ""
          } demoPage`}
      >
        <Page
          openModal={openModal}
          data={
            page.page_sections
              ? page.page_sections
              : {
                title: page.title,
                details: page.details,
                photo: page.photo_file,
              }
          }
          openQuiz={openQuiz}
          index={idx}
          setSectionId={handleSectionId}
          direction={bookDetails.direction}
          footerLogo={bookDetails.footer_logo}
          footerNumLogo={bookDetails.footer_number_logo}
          page={page}
          openSectionPreviewModal={openSectionPreviewModal}
          sectionPreviewData={sectionPreviewData}
        />
      </div>
    )),

    ...bookReferences.map((_, index) => {
      if ((index + 1) % 17 === 0) {
        return (
          <div className="bookIndex">
            <BookReferences data={bookReferences.slice((index + 1) - 17, index)} bookDetails={bookDetails} />
          </div>
        )
      }
    }).filter(item => item),

    <BookReferences data={bookReferences.slice(((bookReferences.length) - (bookReferences.length % 17)), bookReferences.length)} key={''} bookDetails={bookDetails} />,

    bookEnd,
  ];
  // console.log({ book, bookDetails })
  if (!isLoad) return null


  return (
    <>
      {/* <Head>
        <link href={bookDetails.font_url} rel="stylesheet"></link>
      </Head> */}

      <div
        className="flipBook mainPage"
        id={locale}
        style={{
          fontFamily: bookDetails.font_name,
          direction: `${bookDetails.direction} !important`,
          textAlign:
            `${bookDetails.direction}` === "rtl"
              ? "rtl !important"
              : "ltr !important",
        }}

      >

        {isLoad && bookDetails && book && (
          <>
            <button
              className="next"
              onClick={() => (book.title === "اللغة الانجليزية" ? flippy.flipNext() : flippy.flipPrev())}
            >
              <Icon
                icon={`meteor-icons:angles-${book.direction === 'ltr' ? (book.title === "اللغة الانجليزية" ? 'right' : 'left') : (book.title === "اللغة الانجليزية" ? 'left' : 'right')}`}
                width="24"
                height="24"
              />
            </button>

            <Flippy
              pageWidth={bookWidth}
              pageHeight={bookHeight}
              rtl={bookDetails.direction === "rtl" ? true : false}
              backSkin={bookDetails.color}
              pageSkin="#fff"
              breakpoint={992}
              flippingTime={500}
              disableSound={false}
              flipNext={(pageNum) => goToNextPage(pageNum)}
              flipPrev={goToPrevPage}
              ref={flippy}
            >
              {bookPages.map((page, index) => (
                <div key={page.id || index}>{page}</div> // Provide a unique key
              ))}
            </Flippy>
            <button
              className="next"
              onClick={() => (book.title === "اللغة الانجليزية" ? flippy.flipPrev() : flippy.flipNext())}
            >
              <Icon
                icon={`meteor-icons:angles-${book.direction === 'ltr' ?
                  (book.title === "اللغة الانجليزية" ? 'left' : 'right') :
                  (book.title === "اللغة الانجليزية" ? 'right' : 'left')}`}
                width="24"
                height="24"
              />
            </button>
          </>
        )}

        {/* AVERTISMENT SECTION */}
        {book?.ads?.map((one) => (
          <AdverSection key={one.id} data={one} />
        ))}

        {openPreview && (
          <PreviewModal
            setOpenPreview={setOpenPreview}
            imgSrc={previewData}
            previewType={previewType}
            sectionId={sectionId}
            direction={bookDetails.direction}
          />
        )}

        {openSectionPreview && (
          <SectionPreview
            setOpenPreview={setOpenSectionPreview}
            sectionPreviewData={sectionPreviewData}
            direction={bookDetails.direction}
            setOpenModalPreview={setOpenPreview}
          />
        )}

        {openQuizModal && (
          <QuizModal
            setOpenPreview={openModal}
            setOpenQuizModal={setOpenQuizModal}
            quizData={quizData}
            sectionId={sectionId}
            direction={bookDetails.direction}
          />
        )}
      </div>

      <div className="bookPageFooter" style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse" }}>
        <div className="insider" style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse" }}>
          <button
            className="next"
            onClick={() => (book.title === "اللغة الانجليزية" ? flippy.flipPrev() : flippy.flipNext())}
          >
            <Icon
              icon={`meteor-icons:angles-left`}
              width="18"
              height="18"
            />
          </button>
          <input
            type="number"
            onKeyUp={(e) => enterToGoToPage(e, e.target.value)}
          />

          {bookDetails.direction === "rtl" ? (
            <span>إذهب إلي الصفحة</span>
          ) : (
            <span>Go to page</span>
          )}
          <button
            className="next"
            onClick={() => (book.title === "اللغة الانجليزية" ? flippy.flipNext() : flippy.flipPrev())}
          >
            <Icon
              icon={`meteor-icons:angles-right`}
              width="18"
              height="18"
            />
          </button>
        </div>

        <Link href="/home" style={{ textDecoration: "none", color: "inherit" }}>
          <span className="link">
            <Icon icon="fa6-solid:arrow-rotate-left" />
            العودة للصفحة الرئيسية
          </span>
        </Link>
      </div>
    </>
  );
}
