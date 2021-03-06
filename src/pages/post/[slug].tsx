import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient } from '../../services/prismic';
import { PostHeader } from '../../components/PostHeader';
import { Comments } from '../../components/Comments';
import Header from '../../components/Header';

import style from './post.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
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
  preview: boolean;
  prevPost?: Post;
  nextPost?: Post;
}

export default function Post({
  post,
  preview,
  prevPost,
  nextPost,
}: PostProps): JSX.Element {
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
          lastEdition={post.last_publication_date}
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
      <footer className={style.Footer}>
        <section className={style.Pages}>
          {prevPost && (
            <Link href={`/post/${encodeURIComponent(prevPost.uid)}`}>
              <a className={style.PageLinkPrev}>
                <strong className={style.PageLinkTitle}>
                  {prevPost.data.title}
                </strong>
                <span className={style.PageLinkLabel}>Post Anterior</span>
              </a>
            </Link>
          )}
          {nextPost && (
            <Link href={`/post/${encodeURIComponent(nextPost.uid)}`}>
              <a className={style.PageLinkNext}>
                <strong className={style.PageLinkTitle}>
                  {nextPost.data.title}
                </strong>
                <span className={style.PageLinkLabel}>Pr??ximo Post</span>
              </a>
            </Link>
          )}
        </section>
        <section className={style.Comments}>
          <Comments />
        </section>
        {preview && (
          <aside>
            <Link href="/api/exit-preview">
              <a className={style.ExitPreviewMode}>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </footer>
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

export const getStaticProps: GetStaticProps<PostProps> = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;
  const post = await getPrismicClient().getByUID('post', String(slug), {
    ref: previewData?.ref ?? null,
  });
  const prevPostPromise = getPrismicClient().query(
    Prismic.predicates.at('document.type', 'post'),
    {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[document.first_publication_date desc]',
      ref: previewData?.ref ?? null,
    }
  );
  const nextPostPromise = getPrismicClient().query(
    Prismic.predicates.at('document.type', 'post'),
    {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[document.first_publication_date]',
      ref: previewData?.ref ?? null,
    }
  );
  const [prevPostResponse, nextPostResponse] = await Promise.all([
    prevPostPromise,
    nextPostPromise,
  ]);
  const [prevPost = null] = prevPostResponse.results;
  const [nextPost = null] = nextPostResponse.results;
  return {
    props: {
      post,
      preview,
      prevPost,
      nextPost,
    },
  };
};
