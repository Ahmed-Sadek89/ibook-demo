import { useState } from 'react';


import cls from './textSection.module.scss';
import { useEffect } from 'react';

import {apiClient} from '../../Utils/axios';

import Cookies from 'universal-cookie';

import { format } from 'date-fns';

const cookie = new Cookies()

const TextSection = ({ title, details, sectionId, direction }) => {
  const [mounted, setMounted] = useState(false)
  const [startTime, setStartTime] = useState()
  const [readingTimer, setReadingTimer] = useState(0)

  useEffect(() => {
    if(direction) setMounted(true)
  }, [])

  let interval;

  const startHoverHandler = () => {
    let timer = 0;

    setStartTime(Date.now())

    interval = setInterval(() => {
      timer += 1
      setReadingTimer(timer)
    }, 1000)
  }

  const endHoverHandler = async () => {
    clearInterval(interval)

    const trackData = {
      page_section_id: sectionId,
      event_category: 'text',
      event_action: 'reading',
      session_start_time: format(new Date(startTime).getTime(), 'yyyy-MM-dd hh:mm'),
      session_end_time: format(new Date(Date.now()).getTime(), 'yyyy-MM-dd hh:mm'),
      total_time: readingTimer
    }

    const response = await apiClient.post('/crm/students/book_reports', trackData, {
      headers: {
        Authorization: `Bearer ${cookie.get('ibook-auth')}`
      }
    }).catch(err => console.log(err));

    if(!response) return;

  }

  if (!mounted) return null;

  return (
    <div className={`${cls.textSection}`}>

      {/* <h5>{ title }</h5> */}

      {direction === 'rtl' ?

        <mark className={`${cls.arabic} ${details && details.length > 500 && details.length < 1000 && cls.medium} ${details && details.length > 1000 && cls.long}`} onMouseEnter={startHoverHandler} onMouseLeave={endHoverHandler}>{details}</mark>

        :

        <mark className={`${cls.english} ${details && details.length > 500 && details.length < 1000 && cls.medium} ${details && details.length > 1000 && cls.long}`} onMouseEnter={startHoverHandler} onMouseLeave={endHoverHandler}>{details}</mark>
      
      }

      {/* <mark dangerouslySetInnerHTML={{ __html: details}} className={cls[i18n.language]} onMouseEnter={startHoverHandler} onMouseLeave={endHoverHandler}></mark> */}

      {/* <mark className={cls[i18n.language]} dangerouslySetInnerHTML={{ __html: details }}></mark> */}

    </div>
  )
}

export default TextSection;