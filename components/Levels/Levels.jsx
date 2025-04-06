"use client"
import Image from "next/image";
import cls from "./levels.module.scss";
import Link from "next/link";
import Navbar from "../Navbar/Navbar";
import Loader from "../Loader/Loader";
import { useState } from "react";

export default function Levels({ semesters, levelId }) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <div className={cls.levels}>
        <div className={`${cls.wrapper} container`}>
          {semesters.map((semester, idx) => (
            <Link
              style={{ textDecoration: "none" }}
              key={semester.id}
              className={cls.one}
              href={`/levels/books?level=${levelId}&semester=${semester.id}`}
              onClick={() => setLoading(true)}
            >
              {idx === 0 ? (
                <Image
                  src="/imgs/num1.png"
                  alt="bookCover"
                  width={100}
                  height={100}
                />
              ) : (
                <Image
                  src="/imgs/num2.png"
                  alt="bookCover"
                  width={100}
                  height={100}
                />
              )}
              <h4>{semester.title}</h4>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
