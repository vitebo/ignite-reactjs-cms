import Image from 'next/image';
import { useMemo } from 'react';
import { format } from 'date-fns';
import locale from 'date-fns/locale/pt-BR';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

import { Info } from '../Info';

import style from './post-header.module.scss';

interface PostHeaderProps {
  bannerUrl: string;
  title: string;
  date: string;
  author: string;
  timeToRead: string;
  lastEdition?: string;
}

export function PostHeader({
  bannerUrl,
  title,
  date,
  author,
  timeToRead,
  lastEdition,
}: PostHeaderProps): JSX.Element {
  const formattedDate = useMemo(() => {
    return format(new Date(date), 'dd MMM yyyy', { locale });
  }, [date]);

  const formattedLastEdition = useMemo(() => {
    if (!lastEdition) return '';
    return format(new Date(lastEdition), "dd MMM yyyy, à's' HH:mm", { locale });
  }, [lastEdition]);

  return (
    <header>
      <figure className={style.Figure}>
        <Image
          src={bannerUrl}
          alt={title}
          width={1440}
          height={400}
          objectFit="cover"
          objectPosition="center"
        />
      </figure>
      <section className={style.Container}>
        <h1 className={style.Title}>{title}</h1>
        <ul className={style.InfoList}>
          <li className={style.InfoItem}>
            <Info tag="time" value={formattedDate} Icon={FiCalendar} />
          </li>
          <li className={style.InfoItem}>
            <Info tag="address" value={author} Icon={FiUser} />
          </li>
          <li className={style.InfoItem}>
            <Info tag="span" value={timeToRead} Icon={FiClock} />
          </li>
        </ul>
        {lastEdition && (
          <span className={style.LastEdition}>
            * editado em {formattedLastEdition}
          </span>
        )}
      </section>
    </header>
  );
}
