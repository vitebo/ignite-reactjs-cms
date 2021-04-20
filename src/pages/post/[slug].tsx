import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import Head from 'next/head';

import { getPrismicClient } from '../../services/prismic';
import { PostHeader } from '../../components/PostHeader';
import Header from '../../components/Header';

import style from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  const timeToRead = (() => {
    const AVERAGE_WORDS_A_HUMAN_READ_PER_MINUTE = 200;
    const wordsCountOfThePost = post.data.content.reduce(
      (totalWordsCount, section) => {
        const headingWordsCount = section.heading?.split(' ').length || 0;
        const bodyWordsCount = RichText.asText(section.body).split(' ').length;
        return totalWordsCount + headingWordsCount + bodyWordsCount;
      },
      0
    );
    const minutes = Math.ceil(
      wordsCountOfThePost / AVERAGE_WORDS_A_HUMAN_READ_PER_MINUTE
    );
    return `${minutes} min`;
  })();

  return (
    <>
      <Head>
        <title>spacetraveling. | {post.data.title}</title>
      </Head>
      <Header />
      <main>
        <PostHeader
          bannerUrl={post.data.banner.url}
          title={post.data.title}
          date={post.first_publication_date}
          author={post.data.author}
          timeToRead={timeToRead}
        />
        <article className={style.Content}>
          {post.data.content.map(({ heading, body }, index) => (
            <section key={String(index)} className={style.Section}>
              <h2>{heading}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(body) }}
              />
            </section>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { results } = await getPrismicClient().query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      page: 1,
      pageSize: 2,
    }
  );
  const paths = results.map(post => ({
    params: { slug: post.uid },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const { slug } = params;
  const post = await getPrismicClient().getByUID('post', String(slug), {});
  return {
    props: { post },
  };
};
