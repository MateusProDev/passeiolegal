import { adminDb } from '../src/lib/firebase-admin';

// Banners para a página inicial
const banners = [
  {
    title: 'Passeio Legal',
    subtitle: 'Os Melhores Passeios em Fortaleza',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/banner-hero',
    imageAlt: 'Passeios em Fortaleza - Passeio Legal',
    buttonText: 'Ver Passeios',
    buttonLink: '#tours',
    order: 1,
    active: true,
  },
  {
    title: 'Aqui você encontra TUDO que precisa',
    subtitle: 'Para planejar seu roteiro de passeios',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/banner-roteiro',
    imageAlt: 'Planeje seu roteiro de passeios',
    buttonText: 'Consulte opções',
    buttonLink: '#contact',
    order: 2,
    active: true,
  },
];

// Configurações do site
const siteSettings = {
  headerLogo: 'https://res.cloudinary.com/demo/image/upload/v1/logo-passeio-legal',
  headerLogoAlt: 'Logo Passeio Legal',
  menuLinks: [
    { id: '1', label: 'Home', url: '/', order: 1, active: true },
    { id: '2', label: 'Passeios', url: '/tours', order: 2, active: true },
    { id: '3', label: 'Quem Somos', url: '/about', order: 3, active: true },
    { id: '4', label: 'Contato', url: '/contact', order: 4, active: true },
  ],
  footerLogo: 'https://res.cloudinary.com/demo/image/upload/v1/logo-passeio-legal',
  footerLogoAlt: 'Logo Passeio Legal',
  socialLinks: [
    { id: '1', platform: 'instagram' as const, url: 'https://instagram.com/passeiolegalfortaleza' },
    { id: '2', platform: 'whatsapp' as const, url: 'https://wa.me/5585997314093' },
  ],
  contactInfo: {
    email: 'passeiolegalfortaleza@gmail.com',
    phone: '(85) 99731-4093',
    whatsapp: '(85) 99731-4093',
    address: 'Avenida Oceano Atlântico, 683-685 – Porto das Dunas, Aquiraz – CE',
    city: 'Aquiraz',
    state: 'CE',
    zipCode: '61700-000',
  },
  seoSettings: {
    siteTitle: 'Passeio Legal - Tours e Transfers em Fortaleza',
    siteDescription: 'A sua satisfação é o nosso compromisso. Os melhores passeios em Fortaleza e região.',
    keywords: ['passeios fortaleza', 'tours fortaleza', 'transfer fortaleza', 'turismo ceará', 'passeio legal', 'passeios praias', 'transfer aeroporto fortaleza', 'turismo nordeste', 'excursões fortaleza', 'viagens ceará'],
    ogImage: 'https://res.cloudinary.com/demo/image/upload/v1/og-image',
  },
  whatsappConfig: {
    number: '5585997314093',
    defaultMessage: 'Olá! Gostaria de saber mais sobre os passeios.',
  },
  primaryColor: '#3b82f6',
  secondaryColor: '#8b5cf6',
};

// FAQs
const faqs = [
  {
    question: 'Como faço uma reserva?',
    answer: 'Você pode fazer uma reserva através do nosso site, entrando em contato pelo WhatsApp no número (85) 99731-4093 ou pelo email passeiolegalfortaleza@gmail.com. Nossa equipe irá confirmar a disponibilidade e enviar os detalhes do pagamento.',
    order: 1,
    active: true,
    category: 'Reservas',
  },
  {
    question: 'Qual é a política de cancelamento?',
    answer: 'Cancelamentos feitos com até 48 horas de antecedência recebem reembolso integral. Cancelamentos entre 24 e 48 horas recebem 50% de reembolso. Cancelamentos com menos de 24 horas não são reembolsáveis.',
    order: 2,
    active: true,
    category: 'Reservas',
  },
  {
    question: 'Os passeios incluem seguro?',
    answer: 'Sim, todos os nossos passeios incluem seguro básico. Também oferecemos opções de seguro adicional para maior tranquilidade.',
    order: 3,
    active: true,
    category: 'Segurança',
  },
  {
    question: 'Vocês aceitam cartão de crédito?',
    answer: 'Sim! Aceitamos todos os cartões de crédito e você pode parcelar nossos passeios. Entre em contato para verificar as condições.',
    order: 4,
    active: true,
    category: 'Pagamento',
  },
  {
    question: 'Como funciona o transporte?',
    answer: 'Buscamos no seu hotel em pontos de embarque definidos. Consulte os pontos de embarque disponíveis para sua região.',
    order: 5,
    active: true,
    category: 'Transporte',
  },
];

// Blog posts
const blogPosts = [
  {
    title: 'Top 3 Passeio Legal - Os Imperdíveis',
    slug: 'top-3-passeio-legal-os-imperdiveis',
    summary: 'Descubra os 3 passeios mais imperdíveis de Fortaleza e região que você não pode perder!',
    content: '<p>Confira nossa seleção dos 3 passeios mais imperdíveis de Fortaleza e região...</p><p>1. Jericoacoara - A praia mais bela do Ceará</p><p>2. Canoa Quebrada - Mar verde e dunas fascinantes</p><p>3. Beach Park - O maior parque aquático da América Latina</p>',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/blog-top3',
    imageAlt: 'Top 3 Passeios Imperdíveis',
    author: 'Equipe Passeio Legal',
    published: true,
    publishedAt: new Date('2024-01-20'),
  },
  {
    title: 'Consulte nossas promoções de hospedagem',
    slug: 'consulte-nossas-promocoes-de-hospedagem',
    summary: 'Encontre as melhores ofertas de hospedagem para complementar seu passeio em Fortaleza.',
    content: '<p>Oferecemos parcerias com os melhores hotéis e pousadas da região...</p><p>Entre em contato para saber mais sobre nossas promoções exclusivas de hospedagem.</p>',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/blog-hospedagem',
    imageAlt: 'Promoções de Hospedagem',
    author: 'Equipe Passeio Legal',
    published: true,
    publishedAt: new Date('2024-01-18'),
  },
  {
    title: 'Consulte opção de parcelamento no cartão',
    slug: 'consulte-opcao-de-parcelamento-no-cartao',
    summary: 'Facilite seu pagamento parcelando os passeios no cartão de crédito.',
    content: '<p>Para sua maior comodidade aceitamos todos os cartões de crédito...</p><p>Você pode parcelar nossos passeios em até 12x. Fale conosco e verifique as condições.</p>',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/blog-parcelamento',
    imageAlt: 'Parcelamento no Cartão',
    author: 'Equipe Passeio Legal',
    published: true,
    publishedAt: new Date('2024-01-15'),
  },
];

// Testimonials
const testimonials = [
  {
    clientName: 'Maria Santos',
    clientPhoto: 'https://res.cloudinary.com/demo/image/upload/v1/client-maria',
    clientPhotoAlt: 'Foto de Maria Santos',
    text: 'Conforto, Qualidade, Pontualidade e Compromisso! Os Melhores Passeios em Fortaleza. A sua satisfação é o nosso compromisso.',
    rating: 5,
    active: true,
  },
  {
    clientName: 'João Silva',
    clientPhoto: 'https://res.cloudinary.com/demo/image/upload/v1/client-joao',
    clientPhotoAlt: 'Foto de João Silva',
    text: 'Excelente serviço! Passeios de buggy incríveis e transfer muito confortável. Recomendo muito!',
    rating: 5,
    active: true,
  },
  {
    clientName: 'Ana Oliveira',
    clientPhoto: 'https://res.cloudinary.com/demo/image/upload/v1/client-ana',
    clientPhotoAlt: 'Foto de Ana Oliveira',
    text: 'Atendimento personalizado através do WhatsApp. Tudo muito organizado e pontual. Voltarei com certeza!',
    rating: 5,
    active: true,
  },
];

// Packages/Tours
const packages = [
  {
    titulo: "3 Praias em 1 Dia",
    slug: "3-praias-em-1-dia",
    descricaoCurta: "O melhor passeio de buggy do Ceará! Venha conhecer e se encantar com essas 3 lindas praias do litoral leste do Ceará.",
    descricao: "O melhor passeio de buggy do Ceará! Venha conhecer e se encantar com essas 3 lindas praias do litoral leste do Ceará. Seja no modo privativo ou excursão, você vai adorar esse roteiro, que tem tudo o que um bom aventureiro procura.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: true,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "3 Praias VIP em 1 Dia",
    slug: "3-praias-vip-em-1-dia",
    descricaoCurta: "Este passeio junta o melhor do passeio de 3 Praias em 1 Dia com o exuberante Caribe do Ceará.",
    descricao: "Este passeio junta o melhor do passeio de 3 Praias em 1 Dia com o exuberante Caribe do Ceará. Você vai conhecer uma paisagem incrível de encontro do rio com o mar, formando piscinas naturais de águas quentes e tranquilas.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: true,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Águas Belas",
    slug: "aguas-belas",
    descricaoCurta: "Águas Belas é uma praia muito apreciada do litoral leste, com águas claras e quentinhas.",
    descricao: "Águas Belas é uma praia muito apreciada do litoral leste, com águas claras e quentinhas. Você vai aproveitar as piscinas naturais na praia, ou ainda desfrutar do Rio Malcozinhado se optar pelo passeio opcional de buggy no nosso ponto de apoio, que possui uma excelente estrutura e gastronomia muito elogiada.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Beach Park",
    slug: "beach-park",
    descricaoCurta: "O Beach Park é o maior parque aquático da América Latina, localizado em Aquiraz no Ceará.",
    descricao: "Este passeio tem na modalidade privativo e excursão com saída de Fortaleza as 09:00 e regresso as 17:00 horas. O Beach Park é o maior parque aquático da América Latina e está localizado na cidade de Aquiraz no Ceará, na praia do Porto das Dunas, muito apreciada por sua beleza, segurança, limpeza e tranquilidade.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: true,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Caribe do Ceará",
    slug: "caribe-do-ceara",
    descricaoCurta: "O passeio oferece paradas no Centro de Artesanato de Aquiraz e na Estação Nordestina.",
    descricao: "O passeio oferece paradas no Centro de Artesanato de Aquiraz, onde você poderá ver a maior Renda de Bilro sendo elaborada, e também na Estação Nordestina, onde você encontra a Maior Rapadura do mundo, inclusive com degustação de rapaduras com até 50 sabores variados e cachaças artesanais.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: true,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Canoa Quebrada",
    slug: "canoa-quebrada",
    descricaoCurta: "Um lugar mágico e de mar verde, Canoa Quebrada é um dos pontos mais visitados do Ceará.",
    descricao: "Um lugar mágico e de mar verde, Canoa Quebrada é um dos pontos mais visitados do Ceará. A sua beleza que conquistou os europeus é um dos destaques desse passeio. Possui um excelente ponto de apoio, com ótima estrutura e o melhor da culinária regional.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: true,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "City Tour",
    slug: "city-tour",
    descricaoCurta: "Nosso City Tour privativo tem uma duração média de 5h, com horário flexível.",
    descricao: "Nosso City Tour privativo tem uma duração média de 5h, com horário flexível e ajustado de acordo com os seus pontos de interesse. Entre os principais destaques temos a Praia do Futuro e a sua impressionante estrutura que recebe e acolhe o turista, a imponente Catedral Metropolitana, o Centro Cultural Dragão do Mar, o Museu da Cultura Cearense, o lindíssimo Teatro José de Alencar, a Estátua de Iracema, o Mercado dos Peixes, a belíssima orla de Fortaleza, formada pelas praias de Iracema, Meireles e Mucuripe.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Cumbuco",
    slug: "cumbuco",
    descricaoCurta: "Point do kitesurf e do surf, Cumbuco também ostenta o título de passeio de buggy mais radical do Ceará.",
    descricao: "Point do kitesurf e do surf, Cumbuco também ostenta o título de passeio de buggy mais radical do Ceará, com suas dunas e lagoas fascinantes, onde você poderá curtir atrações como tirolesa, skibunda, jet-ski, banana boat, jangada, quadriciclo e passeio à cavalo pela praia (opcionais).",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: true,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Flechaú",
    slug: "flechau",
    descricaoCurta: "Esse passeio combina o que há de melhor entre Flecheiras (Piscinas Naturais) e Mundaú (Passeio de Catamarã).",
    descricao: "Esse passeio está disponível no modo privativo, com saída sugerida entre 7h e 8h da manhã e combina o que há de melhor entre Flecheiras (Piscinas Naturais) e Mundaú (Passeio de Catamarã pelo Rio Mundaú).",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Flecheiras",
    slug: "flecheiras",
    descricaoCurta: "Flecheiras é uma praia do litoral oeste do Ceará de beleza sem igual, com águas claras e piscinas naturais.",
    descricao: "Flecheiras é uma praia do litoral oeste do Ceará de beleza sem igual, tem águas claras e piscinas naturais que formam uma paisagem incrível. Você vem a Flecheiras e fica encantado com a beleza do lugar, sem dúvida é um cartão postal, onde você pode se desligar de tudo.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Guaramiranga",
    slug: "guaramiranga",
    descricaoCurta: "Conheça Guaramiranga, a Cidade das Flores! Um roteiro explorando a região do Maciço de Baturité.",
    descricao: "Conheça Guaramiranga, a Cidade das Flores! Um roteiro explorando a região do Maciço de Baturité, e essa charmosa cidade, que apresenta um clima agradável, com temperaturas amenas e diversos cenários encantadores, sendo também conhecida como a Suíça Cearense.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Icaraí de Amontada",
    slug: "icarai-de-amontada",
    descricaoCurta: "Icaraizinho é uma praia linda e tranquila no litoral oeste do Ceará, conhecida mundialmente por ser um point dos esportes de vento.",
    descricao: "Icaraizinho, ou Icaraí de Amontada é uma praia linda e tranquila no litoral oeste do Ceará, com localização privilegiada e é conhecida mundialmente por ser um point dos esportes de vento, especialmente do kitesurf e do windsurf.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Icapuí",
    slug: "icapui",
    descricaoCurta: "Um dos destinos mais charmosos e exclusivos do litoral Cearense, conhecida como a Terra da Lagosta.",
    descricao: "Um dos destinos mais charmosos e exclusivos do litoral Cearense. Que tal aquele mergulho rodeado pelos mais belos e coloridos peixinhos? Encante-se com Icapuí e seus verdes coqueiros, praias, dunas e, LAGOSTAS, sim, Icapuí é conhecida como a Terra da Lagosta, devido à sua abundante presença, essa iguaria tem aqui o melhor preço do Ceará.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Jericoacoara",
    slug: "jericoacoara",
    descricaoCurta: "Jericoacoara é simplesmente a praia mais visitada e mais bela do Ceará.",
    descricao: "Este passeio está disponível na modalidade privativo, com saída à combinar, e excursão com saída às 03:00 da manhã e retorno às 18:00h. Jericoacoara é simplesmente a praia mais visitada e mais bela do Ceará.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: true,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Lagoinha",
    slug: "lagoinha",
    descricaoCurta: "Você que vem para Lagoinha pode curtir esse passeio que é muito apreciado, o 3 em 1.",
    descricao: "Você que vem para Lagoinha pode curtir esse passeio que é muito apreciado, o 3 em 1, sendo um trajeto percorrido de buggy pelas dunas, nascentes de água doce, mirante central da praia, além das lagoas do Jegue e das Almécegas, onde começa a etapa no catamarã que tem parada para banho.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Morro Branco",
    slug: "morro-branco",
    descricaoCurta: "Morro Branco tem a sua beleza natural nas falésias que a cerca, sendo lar das areias coloridas e artesanatos locais.",
    descricao: "Morro Branco tem a sua beleza natural nas falésias que a cerca, sendo lar das areias coloridas e artesanatos locais. Morro Branco é ideal para você que procura descanso e um pouco de natureza. Temos como opcional no local o mais elogiado passeio de buggy, no qual você poderá conhecer mais 2 praias e uma linda lagoa, sempre com parada para aquele banho refrescante e divertir-se também no famoso Skibunda.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Mundaú",
    slug: "mundau",
    descricaoCurta: "Mundaú fica no litoral oeste do Ceará e é um lugar incrível para se conhecer, é diversão garantida.",
    descricao: "Mundaú fica no litoral oeste do Ceará e é um lugar incrível para se conhecer, é diversão garantida para você, com belas paisagens e um passeio de catamarã pelo Rio Mundaú, com duração de 1:30h, paradas para banho e comtemplação desse paraíso natural.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Paracuru",
    slug: "paracuru",
    descricaoCurta: "A praia central de Paracuru é um dos principais pontos turísticos da região e é um verdadeiro cartão postal.",
    descricao: "A praia central de Paracuru é um dos principais pontos turísticos da região e é um verdadeiro cartão postal, descrita como linda, deserta e paradisíaca. Com o famoso farol em frente ao mar verde-esmeralda, ao seu lado fica um deck de onde você pode apreciar esta vista exuberante.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Praia das Fontes",
    slug: "praia-das-fontes",
    descricaoCurta: "Este passeio está disponível para quem vai conhecer Morro Branco. Essa é uma das mais belas praias do Ceará.",
    descricao: "Este passeio está disponível para quem vai conhecer Morro Branco. Essa é uma das mais belas praias do Ceará, possuindo grutas, fontes naturais de água doce e uma praia de águas quentes e areia fofa.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
  {
    titulo: "Prainha",
    slug: "prainha",
    descricaoCurta: "Prainha está localizada na primeira capital do Ceará, em Aquiraz. Tem seu artesanato forte e dunas perfeitas.",
    descricao: "Prainha está localizada na primeira capital do Ceará, em Aquiraz. Tem seu artesanato forte e dunas perfeitas para o passeio de buggy, onde você pode explorar as dunas e uma descida radical no chamado insano natural.",
    tipo: "passeio",
    categoria: "passeio",
    categorias: ["passeio"],
    preco: 0,
    mostrarPreco: false,
    destaque: false,
    imagens: [],
    pacotesRecomendados: [],
    comodidades: [],
    vantagens: [],
    faq: []
  },
];

async function initializeSiteContent() {
  if (!adminDb) {
    console.error('Firebase Admin not initialized');
    process.exit(1);
  }

  console.log('Starting site content initialization...');

  try {
    // Initialize Banners
    console.log('Initializing banners...');
    const bannersRef = adminDb.collection('banners');
    let bannerAdded = 0;
    let bannerUpdated = 0;

    for (const banner of banners) {
      const existingBanner = await bannersRef.where('title', '==', banner.title).get();
      
      if (existingBanner.empty) {
        await bannersRef.add({
          ...banner,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        bannerAdded++;
        console.log(`✓ Added banner: ${banner.title}`);
      } else {
        const docId = existingBanner.docs[0].id;
        await bannersRef.doc(docId).update({
          ...banner,
          updatedAt: new Date(),
        });
        bannerUpdated++;
        console.log(`✓ Updated banner: ${banner.title}`);
      }
    }

    // Initialize Settings
    console.log('\nInitializing settings...');
    const settingsRef = adminDb.collection('settings');
    const existingSettings = await settingsRef.limit(1).get();
    
    if (existingSettings.empty) {
      await settingsRef.add({
        ...siteSettings,
        updatedAt: new Date(),
      });
      console.log('✓ Added settings');
    } else {
      const docId = existingSettings.docs[0].id;
      await settingsRef.doc(docId).update({
        ...siteSettings,
        updatedAt: new Date(),
      });
      console.log('✓ Updated settings');
    }

    // Initialize FAQs
    console.log('\nInitializing FAQs...');
    const faqRef = adminDb.collection('faq');
    let faqAdded = 0;
    let faqUpdated = 0;

    for (const faq of faqs) {
      const existingFaq = await faqRef.where('question', '==', faq.question).get();
      
      if (existingFaq.empty) {
        await faqRef.add({
          ...faq,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        faqAdded++;
        console.log(`✓ Added FAQ: ${faq.question.substring(0, 30)}...`);
      } else {
        const docId = existingFaq.docs[0].id;
        await faqRef.doc(docId).update({
          ...faq,
          updatedAt: new Date(),
        });
        faqUpdated++;
        console.log(`✓ Updated FAQ: ${faq.question.substring(0, 30)}...`);
      }
    }

    // Initialize Blog Posts
    console.log('\nInitializing blog posts...');
    const blogRef = adminDb.collection('blog');
    let blogAdded = 0;
    let blogUpdated = 0;

    for (const post of blogPosts) {
      const existingPost = await blogRef.where('slug', '==', post.slug).get();
      
      if (existingPost.empty) {
        await blogRef.add({
          ...post,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        blogAdded++;
        console.log(`✓ Added blog post: ${post.title}`);
      } else {
        const docId = existingPost.docs[0].id;
        await blogRef.doc(docId).update({
          ...post,
          updatedAt: new Date(),
        });
        blogUpdated++;
        console.log(`✓ Updated blog post: ${post.title}`);
      }
    }

    // Initialize Testimonials
    console.log('\nInitializing testimonials...');
    const testimonialsRef = adminDb.collection('testimonials');
    let testimonialAdded = 0;
    let testimonialUpdated = 0;

    for (const testimonial of testimonials) {
      const existingTestimonial = await testimonialsRef.where('clientName', '==', testimonial.clientName).get();
      
      if (existingTestimonial.empty) {
        await testimonialsRef.add({
          ...testimonial,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        testimonialAdded++;
        console.log(`✓ Added testimonial: ${testimonial.clientName}`);
      } else {
        const docId = existingTestimonial.docs[0].id;
        await testimonialsRef.doc(docId).update({
          ...testimonial,
          updatedAt: new Date(),
        });
        testimonialUpdated++;
        console.log(`✓ Updated testimonial: ${testimonial.clientName}`);
      }
    }

    // Initialize Packages
    console.log('\nInitializing packages...');
    const packagesRef = adminDb.collection('packages');
    let packageAdded = 0;
    let packageUpdated = 0;

    for (const pkg of packages) {
      const existingPackage = await packagesRef.where('slug', '==', pkg.slug).get();
      
      if (existingPackage.empty) {
        await packagesRef.add({
          ...pkg,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        packageAdded++;
        console.log(`✓ Added package: ${pkg.titulo}`);
      } else {
        const docId = existingPackage.docs[0].id;
        await packagesRef.doc(docId).update({
          ...pkg,
          updatedAt: new Date(),
        });
        packageUpdated++;
        console.log(`✓ Updated package: ${pkg.titulo}`);
      }
    }

    console.log('\n✅ Site content initialization completed!');
    console.log(`   Banners: ${bannerAdded} added, ${bannerUpdated} updated`);
    console.log(`   Settings: Updated`);
    console.log(`   FAQs: ${faqAdded} added, ${faqUpdated} updated`);
    console.log(`   Blog Posts: ${blogAdded} added, ${blogUpdated} updated`);
    console.log(`   Testimonials: ${testimonialAdded} added, ${testimonialUpdated} updated`);
    console.log(`   Packages: ${packageAdded} added, ${packageUpdated} updated`);
  } catch (error) {
    console.error('Error initializing site content:', error);
    process.exit(1);
  }
}

// Run initialization if executed directly
if (require.main === module) {
  initializeSiteContent()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { initializeSiteContent };