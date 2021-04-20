import Image from 'next/image';
import Link from 'next/link';
import style from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={style.Container}>
      <Link href="/">
        <a className={style.Logo}>
          <Image
            src="/images/logo.svg"
            alt="logo"
            width="239px"
            height="26px"
          />
        </a>
      </Link>
    </header>
  );
}
