import Image from 'next/image';
import styles from './header.module.scss';

export function Header(): JSX.Element {
  return (
    <header className={styles.Container}>
      <Image src="/images/logo.svg" alt="logo" width="auto" height="auto" />
    </header>
  );
}
