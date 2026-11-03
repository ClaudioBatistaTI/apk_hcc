export type Hymn = {
  id: string; number: number; title: string; author: string; composer: string;
  theme: string; verses: string[]; chorus?: string; sample: boolean;
  licenseStatus: 'sample' | 'public-domain-verified' | 'licensed' | 'pending';
}

export const hymns: Hymn[] = [
  { id:'sample-001', number:1, title:'Luz para o Caminho', author:'Texto demonstrativo', composer:'Melodia demonstrativa', theme:'Esperança',
    verses:['Quando a noite vem chegando,\\nUma luz nos faz seguir;\\nCom coragem caminhamos,\\nHá um novo porvir.','Cada passo é uma escolha,\\nCada gesto, uma oração;\\nQue a bondade nos conduza,\\nCom amor no coração.'], chorus:'Luz que guia a caminhada,\\nPaz que acalma o coração;\\nNossa vida renovada\\nSegue em fé e gratidão.', sample:true, licenseStatus:'sample' },
  { id:'sample-002', number:2, title:'Canção de Gratidão', author:'Texto demonstrativo', composer:'Melodia demonstrativa', theme:'Gratidão',
    verses:['Pelo dia que floresce,\\nPela força ao despertar;\\nPela mesa repartida,\\nTemos sempre a agradecer.','Pela mão que nos ampara,\\nPela paz em comunhão;\\nNossa voz se faz sincera,\\nEm humilde gratidão.'], sample:true, licenseStatus:'sample' },
  { id:'sample-003', number:3, title:'Caminho de Paz', author:'Texto demonstrativo', composer:'Melodia demonstrativa', theme:'Paz',
    verses:['Que a paz habite a casa,\\nQue a esperança venha entrar;\\nQue o respeito seja ponte,\\nPara o mundo transformar.','Onde houver uma tristeza,\\nSeja o cuidado um clarão;\\nOnde houver distância e medo,\\nSeja encontro e união.'], sample:true, licenseStatus:'sample' },
  { id:'sample-004', number:4, title:'Fé em Cada Manhã', author:'Texto demonstrativo', composer:'Melodia demonstrativa', theme:'Fé',
    verses:['Toda manhã traz consigo\\nA promessa de recomeçar;\\nCom firmeza e confiança,\\nVamos juntos caminhar.','Mesmo em dias de incerteza,\\nNão deixemos de servir;\\nA esperança nos inspira\\nA construir e prosseguir.'], sample:true, licenseStatus:'sample' },
  { id:'sample-005', number:5, title:'Servir com Amor', author:'Texto demonstrativo', composer:'Melodia demonstrativa', theme:'Serviço',
    verses:['Mãos abertas para o próximo,\\nOlhos prontos para ver;\\nNo serviço feito em amor,\\nHá beleza em florescer.','Que a palavra seja simples,\\nQue o cuidado seja ação;\\nE que a vida testemunhe\\nA força da compaixão.'], sample:true, licenseStatus:'sample' }
]