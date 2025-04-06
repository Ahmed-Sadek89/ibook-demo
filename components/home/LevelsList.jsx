"use client"
import Link from "next/link";
import cls from "./home.module.scss";
import Image from "next/image";
import Loader from "../Loader/Loader";
import { useState } from "react";

const LevelsList = ({ levels }) => {
  if (!Array.isArray(levels)) {
    return <p>No levels available</p>;
  }
  const [loading, setLoading] = useState(false);
  return (
    <div className={`${cls.wrapper} container`}>
      {loading && <Loader />}
      {levels.map((level, idx) => (
        <Link
          style={{ textDecoration: "none" }}
          className={cls.one}
          key={level.id}
          href={{
            pathname: "/levels",
            query: { level: level.id },
          }}
          onClick={() => setLoading(true)}
        >
          <Image
            src={`/imgs/number${idx + 1}.png`}
            alt={level.title}
            width={60}
            height={60}
          />
          <h4>{level.title}</h4>
        </Link>
      ))}
    </div>
  );
};

export default LevelsList;
