import dynamicImport from "next/dynamic";
import Header from "@/components/public/Header";
import { settingsService, tourService, transferService } from "@/lib/firestore";
import type { Tour, Transfer } from "@/types";
import Footer from "@/components/public/Footer";

const Tours = dynamicImport(() => import("@/components/public/Tours"), {
  loading: () => <div className="h-[420px] w-full" />,
});

const Transfers = dynamicImport(() => import("@/components/public/Transfers"), {
  loading: () => <div className="h-[420px] w-full" />,
});

export const revalidate = 86400;

async function getPageData(): Promise<{
  tours: Tour[];
  transfers: Transfer[];
  toursEnabled: boolean;
  transfersEnabled: boolean;
  content: Awaited<ReturnType<typeof settingsService.get>>["sectionContent"];
}> {
  try {
    const [tours, transfers, settings] = await Promise.all([
      tourService.getAll(false),
      transferService.getAll(true),
      settingsService.get(),
    ]);

    return {
      tours,
      transfers,
      toursEnabled: settings?.sections?.toursEnabled !== false,
      transfersEnabled: settings?.sections?.transfersEnabled !== false,
      content: settings?.sectionContent,
    };
  } catch (error) {
    console.error("Error fetching packages page data:", error);
    return {
      tours: [],
      transfers: [],
      toursEnabled: true,
      transfersEnabled: true,
      content: undefined,
    };
  }
}

export default async function PacotesPage() {
  const { tours, transfers, toursEnabled, transfersEnabled, content } = await getPageData();

  return (
    <main className="min-h-screen pt-20 sm:pt-24">
      <Header />
      <section className="bg-primary-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Passeios e Transfers</h1>
          <p className="mb-6 max-w-2xl text-xl">
            Encontre passeios para conhecer Fortaleza e região, além de transfers para viajar com conforto.
          </p>
          <div className="flex flex-wrap gap-3">
            {toursEnabled && (
              <a href="#passeios" className="inline-block rounded-lg bg-white px-6 py-3 font-semibold text-primary-700 transition-colors hover:bg-gray-100">
                Ver passeios
              </a>
            )}
            {transfersEnabled && (
              <a href="#transfers" className="inline-block rounded-lg border border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
                Ver transfers
              </a>
            )}
          </div>
        </div>
      </section>

      {toursEnabled && (
        <div id="passeios" className="scroll-mt-24">
          <Tours
            tours={tours}
            titleEnabled={content?.homeToursTitle !== false}
            descriptionEnabled={content?.homeToursDescription !== false}
          />
        </div>
      )}
      {transfersEnabled && (
        <Transfers
          transfers={transfers}
          titleEnabled={content?.homeTransfersTitle !== false}
          descriptionEnabled={content?.homeTransfersDescription !== false}
        />
      )}
      <Footer />
    </main>
  );
}
