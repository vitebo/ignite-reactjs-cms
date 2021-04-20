import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';
import { PostHeader } from '../../components/PostHeader';

import style from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  timeToRead: string;
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
    return <div>Loading...</div>;
  }

  return (
    <main>
      <PostHeader
        bannerUrl={post.data.banner.url}
        title={post.data.title}
        date={post.first_publication_date}
        author={post.data.author}
        timeToRead={post.timeToRead}
      />
      <article className={style.Content}>
        {post.data.content.map(({ heading, body }) => (
          <section key={String(body)} className={style.Section}>
            <h2>{heading}</h2>
            <div dangerouslySetInnerHTML={{ __html: body }} />
          </section>
        ))}
      </article>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const { slug } = params;
  const response = await getPrismicClient().getByUID('post', String(slug), {});

  const timeToRead = (() => {
    const AVERAGE_WORDS_A_HUMAN_READ_PER_MINUTE = 200;
    const wordsCountOfThePost = response.data.content.reduce(
      (totalWordsCount, section) => {
        const headingWordsCount = section.heading?.split(' ').length || 0;
        const bodyWordsCount = RichText.asText(section.body).split(' ').length;
        return totalWordsCount + headingWordsCount + bodyWordsCount;
      },
      0
    );
    const minutes = Math.round(
      wordsCountOfThePost / AVERAGE_WORDS_A_HUMAN_READ_PER_MINUTE
    );
    return `${minutes} min`;
  })();

  const content = response.data.content.map(({ heading, body }) => ({
    heading,
    body: RichText.asHtml(body),
  }));

  const post = {
    first_publication_date: response.first_publication_date,
    timeToRead,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content,
    },
  };
  return {
    props: { post },
  };
};
