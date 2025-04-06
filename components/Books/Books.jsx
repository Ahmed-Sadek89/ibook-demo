"use client"
import Link from "next/link";
import cls from "./books.module.scss";
import Navbar from "../Navbar/Navbar";
import Image from "next/image";
import Loader from "../Loader/Loader";
import { useState } from "react";

const Books = ({ books }) => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Loader />}

      <Navbar />
      <div className={cls.books}>
        <div className={`container`}>
          <div className={cls.wrapper}>
            {books.map((book) => (
              <div key={book.id}>
                {book.status && (
                  <Link
                    style={{ textDecoration: "none" }}
                    href={`/book/${book.id}?title=${book.title}`}
                    className={cls.book}
                    onClick={() => setLoading(true)}
                  >
                    {
                      book.logo_file &&
                      <Image src={book.logo_file} alt="Book Cover" width={250} height={250} />
                    }
                    <h5>{book.title}</h5>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Books;
