import { FiUser, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import { format } from 'date-fns';
import { useMemo } from 'react';
import classNames from 'classnames';
import locale from 'date-fns/locale/pt-BR';

import { Info } from '../Info';

import style from './post-item.module.scss';

interface PostItemProps {
  title: string;
  subtitle: string;
  date: string;
  author: string;
  className?: string;
  slug: string;
}

export function PostItem({
  title,
  subtitle,
  date,
  author,
  className,
  slug,
}: PostItemProps): JSX.Element {
  const classes = classNames([style.Container, className]);

  const formattedDate = useMemo(() => {
    return format(new Date(date), 'dd MMM yyyy', { locale });
  }, [date]);

  return (
    <li className={classes}>
      <Link href={`/post/${encodeURIComponent(slug)}`}>
        <a className={style.Link}>
          <strong className={style.Title}>{title}</strong>
          <p className={style.Subtitle}>{subtitle}</p>
          <footer className={style.Footer}>
            <Info tag="time" value={formattedDate} Icon={FiCalendar} />
            <Info
              tag="address"
              value={author}
              Icon={FiUser}
              className={style.Author}
            />
          </footer>
        </a>
      </Link>
    </li>
  );
}
