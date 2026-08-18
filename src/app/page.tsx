import { Metadata } from "next";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import Hero from "@/components/public/Hero";
import Tours from "@/components/public/Tours";
import Transfers from "@/components/public/Transfers";
import Testimonials from "@/components/public/Testimonials";
import Blog from "@/components/public/Blog";
import FAQ from "@/components/public/FAQ";
import Contact from "@/components/public/Contact";
import { bannerService, tourService, transferService, testimonialService, blogService, faqService } from "@/lib/firestore";

export const metadata: Metadata = {
  title: "Início",
  description: "Bem-vindo à Passeio Legal - Descubra os melhores passeios e transfers",
};

// Force dynamic rendering for real-time updates
export const dynamic = 'force-dynamic';

async function getPageData() {
  try {
    const [banners, tours, transfers, testimonials, blogPosts, faqs] = await Promise.all([
      bannerService.getAll(),
      tourService.getAll(true),
      transferService.getAll(true),
      testimonialService.getAll(),
      blogService.getAll(true),
      faqService.getAll(),
    ]);

    return {
      banners,
      tours,
      transfers,
      testimonials,
      blogPosts,
      faqs,
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
    };
  }
}

export default async function Home() {
  const { banners, tours, transfers, testimonials, blogPosts, faqs } = await getPageData();

  return (
    <main className="min-h-screen">
      <Header />
      
      <Hero banners={banners} />
      
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sobre a Passeio Legal
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Há mais de 10 anos no mercado de turismo, oferecendo experiências únicas e memoráveis para nossos clientes. Nossa missão é proporcionar momentos inesquecíveis com segurança, conforto e profissionalismo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">10+</div>
              <div className="text-gray-600">Anos de Experiência</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">5000+</div>
              <div className="text-gray-600">Clientes Satisfeitos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
              <div className="text-gray-600">Destinos</div>
            </div>
          </div>
        </div>
      </section>

      <Tours tours={tours} />
      
      <Transfers transfers={transfers} />
      
      <Testimonials testimonials={testimonials} />
      
      <Blog posts={blogPosts} />
      
      <FAQ faqs={faqs} />
      
      <Contact />
      
      <Footer />
    </main>
  );
}
