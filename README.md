# Cantor Cristão Digital

Aplicação original em React + TypeScript + Vite, preparada como PWA e para empacotamento Android via Capacitor.

## Requisitos
- Node.js 20+
- npm
- Para Android: Android Studio, Android SDK e JDK compatível com a versão do Gradle/Capacitor.

## Executar localmente
```bash
npm install
npm run dev
```

## Gerar versão web/PWA
```bash
npm run build
npm run preview
```
A saída de produção fica em `dist/`. A PWA pode ser instalada pelo navegador quando servida via HTTPS ou localhost. O service worker faz cache da aplicação para acesso offline.

## Preparar Android
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Cantor Cristão Digital" "br.com.cantorcristao.digital" --web-dir dist
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
No Android Studio: aguarde a sincronização Gradle e use **Build > Build Bundle(s) / APK(s) > Build APK(s)**. O APK de debug costuma ser gerado em `android/app/build/outputs/apk/debug/app-debug.apk`. Para distribuição, gere uma versão assinada em **Build > Generate Signed Bundle / APK**.

## Importação de catálogo
A tela Ajustes aceita JSON no formato:
```json
[
  {
    "id": "hino-001",
    "number": 1,
    "title": "Título",
    "author": "Autor",
    "composer": "Compositor",
    "theme": "Tema",
    "verses": ["Primeira estrofe", "Segunda estrofe"],
    "chorus": "Refrão opcional",
    "sample": false,
    "licenseStatus": "licensed"
  }
]
```
`licenseStatus` precisa ser `licensed` ou `public-domain-verified`. A marcação é uma declaração do responsável pelo arquivo, não uma verificação jurídica automática. Mantenha documentação da fonte, licença e autorização. Não importe letras protegidas sem permissão.

## Escopo e direitos autorais
Este projeto não copia o código, o design proprietário nem as letras do site de referência. Os cinco textos incluídos são amostras originais para validar interface e recursos. O catálogo integral do Cantor Cristão depende de fonte legalmente utilizável, confirmação de domínio público por edição/obra, licença ou autorização dos titulares. Metadados de autor, compositor, métrica e fonte devem ser preenchidos apenas quando confirmados.

## Estrutura
- `src/App.tsx`: navegação, leitor, favoritos, pesquisa e importação
- `src/data.ts`: dados de demonstração
- `src/style.css`: identidade visual responsiva
- `vite.config.ts`: configuração PWA
- `capacitor.config.ts`: configuração inicial Android


## Gerar APK sem Android Studio (GitHub Actions)

O projeto inclui o workflow `.github/workflows/android.yml`. Ele compila um APK de depuracao na infraestrutura do GitHub, sem exigir Android Studio no computador local.

1. Crie um repositorio no GitHub e envie todos os arquivos deste projeto para a branch `main` (ou `master`).
2. No repositorio, abra a aba **Actions** e habilite os workflows, se o GitHub solicitar.
3. O workflow sera executado automaticamente no primeiro `push` para `main`/`master`. Tambem pode ser iniciado em **Actions > Gerar APK Android > Run workflow**.
4. Quando a execucao terminar com sucesso, abra a execucao e baixe o artefato **cantor-cristao-digital-apk** na secao **Artifacts**.
5. Extraia o ZIP baixado. O arquivo de instalacao sera `app-debug.apk`. Transfira-o para o Android e autorize a instalacao de aplicativos dessa origem, se solicitado.

**Importante:** este e um APK de depuracao para testes e instalacao direta. Para publicar na Google Play, sera necessario gerar um Android App Bundle (AAB) assinado e configurar a chave de assinatura. O workflow gera o APK na nuvem; nao instala nem publica o aplicativo automaticamente no celular.
