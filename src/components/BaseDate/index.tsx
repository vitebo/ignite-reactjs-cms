import { FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { useMemo } from 'react';
import classNames from 'classnames';
import locale from 'date-fns/locale/pt-BR';

import style from './base-date.module.scss';

interface BaseDateProps {
  date: string;
  className?: string;
}

export function BaseDate({ date, className }: BaseDateProps): JSX.Element {
  const classes = classNames([style.Container, className]);

  const formattedDate = useMemo(() => {
    return format(new Date(date), 'dd MMM yyyy', { locale });
  }, [date]);

  return (
    <time className={classes}>
      <FiCalendar className={style.Icon} />
      <span className={style.Value}>{formattedDate}</span>
    </time>
  );
}
