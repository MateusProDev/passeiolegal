import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  publishedAt: Date;
}

interface BlogProps {
  posts: BlogPost[];
}

export default function Blog({ posts }: BlogProps) {
  const displayPosts = posts.slice(0, 3);

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nosso Blog
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dicas de viagem, destinos e muito mais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={post.imageUrl}
                  alt={post.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <Calendar size={16} />
                  <time dateTime={post.publishedAt.toISOString()}>
                    {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                  </time>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
                  aria-label={`Ler artigo: ${post.title}`}
                >
                  Ler mais
                </Link>
              </div>
            </article>
          ))}
        </div>

        {posts.length > 3 && (
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="inline-block bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
            >
              Ver Todos os Artigos
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
