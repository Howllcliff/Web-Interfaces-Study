# Portfólio Pessoal & Projetos - Rodrigo S. Vieira

Bem-vindo ao repositório do meu site pessoal e portfólio! Este projeto não apenas apresenta quem eu sou, minhas habilidades e meu background multidisciplinar (Relações Internacionais, Enfermagem e Tecnologia), mas também serve como base para hospedar meus projetos práticos e ferramentas úteis que desenvolvo.

##  Objetivo do Repositório

O objetivo principal deste repositório é ser a minha vitrine profissional na web, demonstrando minhas habilidades em desenvolvimento Front-end (HTML, CSS, JavaScript) e lógica de programação. Além da página de apresentação, o repositório contém subprojetos funcionais, como uma **Calculadora de CMV para Drinks**.

---

##  Funcionalidades

### 1. Portfólio Pessoal (`index.html`)
* **Design Responsivo:** Adaptável para desktops, tablets e smartphones.
* **Modo Escuro (Dark Mode):** Alternância de tema claro/escuro com salvamento de preferência no `localStorage` do navegador.
* **Navegação Suave:** Scroll animado entre as seções (Sobre, Projetos, Contato).
* **Menu Hambúrguer:** Navegação otimizada para dispositivos móveis.

### 2. Sistema de Precificação de Drinks (`cmv_drink_index.html`)
Uma ferramenta completa e isolada para bartenders e donos de bares calcularem custos e preços de venda.
* **Cálculo Dinâmico:** Adicione bebidas base (destilados, licores) e insumos extras para calcular o custo exato da receita.
* **Cálculo de CMV:** Defina a porcentagem de Custo da Mercadoria Vendida (CMV) desejada para obter o **Preço Sugerido de Venda**.
* **Gestão de Inventário:** As bebidas adicionadas ficam salvas no navegador (`localStorage`), criando um autocompletar para receitas futuras (trazendo preço e volume automaticamente).
* **CRUD Local:** Permite cadastrar, visualizar, editar e excluir receitas salvas diretamente no navegador, sem necessidade de banco de dados externo.

### 3. Páginas Auxiliares
* **Página "Em Construção" (`opss.html`):** Uma interface amigável para links em desenvolvimento (como Blog e Loja), com um formulário de captura de e-mail (Newsletter).

---

##  Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias web fundamentais (Vanilla), sem o uso de frameworks pesados, para focar na performance e consolidação de conhecimentos:

* **HTML5:** Semântica e estruturação das páginas.
* **CSS3:** Estilização, animações (keyframes), Flexbox, Grid Layout e variáveis CSS (Custom Properties) para o Dark Mode.
* **JavaScript (ES6+):** Lógica de manipulação do DOM, cálculos matemáticos, gerenciamento de estado da interface e persistência de dados via `Web Storage API` (`localStorage`).
* **FontAwesome:** Ícones vetoriais.

---

## 📂 Estrutura de Arquivos

```text
📁 Repositorio/
│
├── index.html                 # Página principal (Portfólio)
├── opss.html                  # Página de "Em construção"
│
├── 📁 CSS/
│   ├── stylesheet.css         # Estilos globais do portfólio e dark mode
│   └── cmv_drink_styles.css   # Estilos específicos do Sistema de Drinks
│
├── 📁 Scripts/
│   ├── script.js              # Lógica do portfólio (menu, scroll, dark mode)
│   └── cmv_drink_scripts.js   # Lógica da calculadora e armazenamento de drinks
│
├── 📁 Links/
│   └── cmv_drink_index.html   # Interface do Sistema de Precificação de Drinks
│
└── 📁 Imagens/                # (Diretório para assets visuais, favicons e prints)
```

Versao 2.3.6