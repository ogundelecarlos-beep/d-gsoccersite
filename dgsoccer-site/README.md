# Site D&GSOCCER

Site institucional da D&GSOCCER, escola de futebol em Caieiras, SP.
HTML, CSS e JavaScript puros, sem build, sem dependências e sem internet externa.

## Estrutura

```
d&gsoccer/
├── index.html                    página completa
├── css/style.css                 todo o estilo
├── js/main.js                    todas as interações
├── fonts/                        Anton e Sora (Google Fonts, licença OFL)
├── img/                          fotos, logo, ícones e capas dos vídeos
├── favicon.ico                   ícone da aba, gerado a partir da logo
└── dgsoccer-arquivo-unico.html   a mesma página em um único arquivo
```

## Como abrir

No VS Code, instale a extensão **Live Server**, clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Abrir o `index.html` com dois cliques também funciona, porque não existe nenhuma chamada externa.

## Onde mexer no conteúdo

Tudo no `index.html`, procurando por estes trechos:

| O que mudar | Onde procurar |
| --- | --- |
| Número do WhatsApp | `5511940368331` (aparece em vários links) |
| Endereço e horário | seção `id="contato"`, bloco `class="info"` |
| Textos dos professores | seção `id="equipe"`, blocos `class="prof"` |
| Pilares da metodologia | seção `id="metodologia"`, blocos `class="pane"` |
| Perguntas do FAQ | seção `id="faq"` |
| Vídeos do Instagram | seção `id="videos"`, cada `class="vid"` tem o link do reel |

## Trocar as fotos

Substitua o arquivo dentro de `img/` mantendo o mesmo nome, ou troque o `src` no `index.html`.

| Arquivo | Onde aparece | Proporção ideal |
| --- | --- | --- |
| `gabriel.jpg`, `dener.jpg` | cards da equipe | quadrada, 600x600 ou maior |
| `capa-dener-gabriel.jpg` | foto principal da abertura | vertical, 2x3 |
| `hero-treino.jpg` | primeiro item do carrossel de vídeos | vertical, 9x16 |
| `logo-dgsoccer.png` | logo oficial (abertura animada e seção de confiança) | quadrada, 150x150 |
| `logo-dgsoccer-escudo.png` | cabeçalho e rodapé (mesma logo, sem a borda preta) | 99x109 |
| `favicon-32.png`, `apple-touch-icon.png`, `../favicon.ico` | ícones do navegador e do celular | gerados da logo |
| `video-*.jpg` | carrossel de vídeos | vertical, 9x16 |

## Cores e fontes

Ficam no topo do `css/style.css`, no bloco `:root`. Mudando `--gold`, `--gold-lt` e `--grad` o site inteiro muda de cor.

## Interações do js/main.js

Abertura animada, cursor personalizado, barra de progresso, revelação dos textos ao rolar, contadores, botões magnéticos, abas da metodologia, carrossel arrastável, FAQ sanfona e partículas da capa.

Depois de mudar `index.html`, `css/style.css`, `js/main.js` ou `img/`, gere de novo o arquivo único:

```
python ferramentas/gerar-arquivo-unico.py
```

Tudo tem proteção: se o JavaScript falhar ou estiver desligado, o site continua aparecendo normalmente.

## Publicar

Como não há build, basta subir a pasta inteira em qualquer hospedagem estática: Netlify, Vercel, GitHub Pages, Hostinger ou a hospedagem do domínio da KCM SITES. Para testar rápido, o arquivo `dgsoccer-arquivo-unico.html` sozinho já é o site inteiro.
