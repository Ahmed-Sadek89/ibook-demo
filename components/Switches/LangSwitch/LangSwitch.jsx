import { useRouter } from "next/navigation";

import Cookies from "universal-cookie";

import dayjs from "dayjs";

// STYLES FILES
import cls from "./langSwitch.module.scss";

const cookies = new Cookies();

const LangSwitch = ({ locale, side }) => {
  const router = useRouter();

  const switchLang = (language) => {
    // if (language === locale) return;

    cookies.set("NEXT_LOCALE", language, { path: "/" });

    if (language === 'ar') {
      // document.querySelector(":root").style.setProperty('--head-font', 'kalligraaf');
      router.replace(router, null, { locale: language });
    } else {
      // document.querySelector(":root").style.setProperty('--head-font', 'Urbanist');
      router.replace(router, router.asPath, { locale: language });
    }

    dayjs.locale(language);
  };

  // LANG DROPDOWN DATA
  // const menu = [
  //   {
  //     option: "English",
  //     img: "/imgs/navbar/america.png",
  //     method: switchLang,
  //     methodParam: "en",
  //   },
  //   {
  //     option: "Arabic",
  //     img: "/imgs/navbar/suadi.png",
  //     method: switchLang,
  //     methodParam: "ar",
  //   },
  // ];

  return (
    <div className={cls.lang}>
      <select value={locale} onChange={(e) => switchLang(e.target.value)}>

        <option value="en">English</option>
        
        <option value="ar"onClick={() => switchLang('ar')}>العربية</option>

      </select>
    </div>
  );
};

export default LangSwitch;
