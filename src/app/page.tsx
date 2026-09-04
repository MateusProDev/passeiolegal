import { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Hero from "@/components/public/Hero";
import Tours from "@/components/public/Tours";
import Transfers from "@/components/public/Transfers";
import Testimonials from "@/components/public/Testimonials";
import Blog from "@/components/public/Blog";
import FAQ from "@/components/public/FAQ";
import AnimatedCounter from "@/components/public/AnimatedCounter";
import { bannerService, tourService, transferService, testimonialService, blogService, faqService, settingsService } from "@/lib/firestore";
import { getSiteUrl } from "@/lib/site-url";

// Force dynamic rendering for real-time updates
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getSiteUrl();

  return {
    title: "Passeio Legal - Tours e Transfers em Fortaleza e Região",
    description: "Descubra os melhores passeios turísticos e serviços de transfer em Fortaleza e região. Experiências únicas de turismo com conforto, segurança e profissionalismo. Passeios para praias, dunas, cachoeiras e muito mais.",
    keywords: ["passeios fortaleza", "tours fortaleza", "transfer fortaleza", "turismo ceará", "passeio legal", "passeios praias", "transfer aeroporto fortaleza", "turismo nordeste", "excursões fortaleza", "viagens ceará"],
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: baseUrl,
      title: "Passeio Legal - Tours e Transfers em Fortaleza",
      description: "Descubra os melhores passeios turísticos e serviços de transfer em Fortaleza e região com a Passeio Legal.",
      siteName: "Passeio Legal",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Passeio Legal - Tours e Transfers",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Passeio Legal - Tours e Transfers",
      description: "Descubra os melhores passeios turísticos e serviços de transfer em Fortaleza",
      images: [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

async function getPageData() {
  try {
    const [banners, tours, transfers, testimonials, blogPosts, faqs, settings] = await Promise.all([
      bannerService.getAll(),
      tourService.getAll(false),
      transferService.getAll(false),
      testimonialService.getAll(),
      blogService.getAll(false),
      faqService.getAll(),
      settingsService.get(),
    ]);

    return {
      banners,
      tours,
      transfers,
      testimonials,
      blogPosts,
      faqs,
      settings,
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    return {
      banners: [],
      tours: [],
      transfers: [],
      testimonials: [],
      blogPosts: [],
      faqs: [],
      settings: null,
    };
  }
}

export default async function Home() {
  const { banners, tours, transfers, testimonials, blogPosts, faqs, settings } = await getPageData();
  
  const toursEnabled = settings?.sections?.toursEnabled ?? true;
  const transfersEnabled = settings?.sections?.transfersEnabled ?? true;
  const aboutSection = settings?.aboutSection;
  const aboutStats = aboutSection?.stats || [
    { value: 10, label: "Anos de Experiência" },
    { value: 5000, label: "Clientes Satisfeitos" },
    { value: 100, label: "Destinos" },
  ];

  return (
    <main className="min-h-screen pt-24">
      <Header />
      
      <Hero banners={banners} />
      
      <section id="about" className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {aboutSection?.title || "Sobre a Passeio Legal"}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              {aboutSection?.description || "Há mais de 10 anos no mercado de turismo, oferecendo experiências únicas e memoráveis para nossos clientes. Nossa missão é proporcionar momentos inesquecíveis com segurança, conforto e profissionalismo."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {aboutStats.map((stat) => (
              <div className="text-center" key={stat.label}>
                <AnimatedCounter target={stat.value} suffix="+" />
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {toursEnabled && <Tours tours={tours} />}
      
      {transfersEnabled && <Transfers transfers={transfers} />}
      
      <Testimonials testimonials={testimonials} />
      
      <Blog posts={blogPosts} />
      
      <FAQ faqs={faqs} />
      
      <Footer />
    </main>
  );
}
