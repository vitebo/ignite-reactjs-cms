import classNames from 'classnames';
import { BaseAuthor } from '../BaseAuthor';
import { BaseDate } from '../BaseDate';
import style from './post-item.module.scss';

interface PostItemProps {
  title: string;
  subtitle: string;
  date: string;
  author: string;
  className?: string;
}

export function PostItem({
  title,
  subtitle,
  date,
  author,
  className,
}: PostItemProps): JSX.Element {
  const classes = classNames([style.Container, className]);

  return (
    <li className={classes}>
      <strong className={style.Title}>{title}</strong>
      <p className={style.Subtitle}>{subtitle}</p>
      <footer className={style.Footer}>
        <BaseDate date={date} />
        <BaseAuthor className={style.Author} name={author} />
      </footer>
    </li>
  );
}
