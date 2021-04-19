import classNames from 'classnames';
import { FiUser } from 'react-icons/fi';
import style from './base-author.module.scss';

interface BaseAuthorProps {
  name: string;
  className?: string;
}

export function BaseAuthor({ name, className }: BaseAuthorProps): JSX.Element {
  const classes = classNames([style.Container, className]);

  return (
    <address className={classes}>
      <FiUser className={style.Icon} />
      <span className={style.Name}>{name}</span>
    </address>
  );
}
