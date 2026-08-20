import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { blogService } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await blogService.getAll(false).then(posts => 
    posts.find(p => p.slug === params.slug && p.published)
  );

  if (!post) {
    return {
      title: 'Post não encontrado',
    };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const posts = await blogService.getAll(false);
  const post = posts.find(p => p.slug === params.slug && p.published);

  if (!post) {
    notFound();
  }

  const formatDate = (date: any) => {
    if (!date) return 'Data não disponível';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Data não disponível';
    }
  };

  const readTime = (content: string) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const formatContent = (content: string) => {
    if (!content) return '';
    // Convert line breaks to paragraphs
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.trim()) {
        return `<p key=${index} class="mb-4 text-gray-700 leading-relaxed">${paragraph}</p>`;
      }
      return null;
    }).join('');
  };

  return (
    <main className="min-h-screen pt-32">
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-primary-600 text-white py-16">
          <div className="container mx-auto px-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar ao Blog
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <Calendar size={18} />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={18} />
                <span>{readTime(post.content || '')} min de leitura</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.imageUrl && (
              <div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.imageAlt || post.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Article Content */}
            <article className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
              />

              {/* Share */}
              <div className="mt-12 pt-8 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 size={20} className="text-gray-600" />
                  <span className="text-gray-600 font-medium">Compartilhar</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
                      }
                    }}
                    className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${window.location.href}`)}`, '_blank');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </article>

            {/* Back to Blog */}
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <ArrowLeft size={20} />
                Voltar ao Blog
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
