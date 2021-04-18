import { GetStaticProps } from 'next';
import { useState } from 'react';

import Prismic from '@prismicio/client';
import { fromUnixTime } from 'date-fns/esm';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { getPrismicClient } from '../services/prismic';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination,
}: HomeProps): React.ReactElement {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleLoadMorePosts(): Promise<void> {
    if (!nextPage) return;
    const response = await fetch(nextPage);
    const data = await response.json();
    setNextPage(data.next_page);
    setPosts([...posts, ...data.results]);
  }

  return (
    <main>
      <ul>
        {posts.map(post => (
          <li key={post.uid}>
            <strong>{post.data.title}</strong>
          </li>
        ))}
      </ul>
      {nextPage && (
        <button type="button" onClick={handleLoadMorePosts}>
          carregar mais
        </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { next_page, results } = await getPrismicClient().query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      orderings: '[post.first_publication_date]',
      page: 1,
      pageSize: 2,
    }
  );
  return {
    props: {
      postsPagination: { next_page, results },
    },
  };
};
