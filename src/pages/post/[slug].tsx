import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';
import { PostHeader } from '../../components/PostHeader';

import commonStyles from '../../styles/common.module.scss';
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
    return <div>Loading...</div>;
  }

  return (
    <main>
      <PostHeader
        bannerUrl={post.data.banner.url}
        title={post.data.title}
        date={post.first_publication_date}
        author={post.data.author}
        timeToRead="4 min"
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
  const content = response.data.content.map(({ heading, body }) => ({
    heading,
    body: RichText.asHtml(body),
  }));
  const post = {
    first_publication_date: response.first_publication_date,
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
