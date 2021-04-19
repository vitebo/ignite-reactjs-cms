import classNames from 'classnames';
import { useMemo } from 'react';
import { IconType } from 'react-icons';
import style from './info.module.scss';

interface BaseInfoProps {
  value: string;
  className?: string;
  Icon: IconType;
  tag: keyof JSX.IntrinsicElements;
}

export function Info({
  value,
  Icon,
  className,
  tag,
}: BaseInfoProps): JSX.Element {
  const TagName = useMemo(() => tag ?? 'div', [tag]);

  const classes = classNames([style.Container, className]);

  return (
    <TagName className={classes}>
      <Icon className={style.Icon} />
      <span className={style.Value}>{value}</span>
    </TagName>
  );
}
