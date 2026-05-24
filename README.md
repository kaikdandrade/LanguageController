<h1 align="center">🌐 LanguageController</h1>

<p align="center">
  <em>Um controlador de internacionalização (i18n) leve e em Vanilla JS para traduções dinâmicas no DOM com suporte a objetos aninhados e interpolação de variáveis.</em>
</p>

<p align="center">
  <a href="https://kaikdandrade.github.io/LanguageController/" target="_blank"><strong>🔗 Acesse a Demonstração ao Vivo no GitHub Pages</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-yellow" alt="Vanilla JS" />
  <img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-green" alt="Licença MIT" />
  <img src="https://img.shields.io/github/issues/kaikdandrade/LanguageController" alt="Issues" />
  <img src="https://img.shields.io/github/stars/kaikdandrade/LanguageController" alt="Stars" />
</p>

## 📖 Sobre o Projeto

O **LanguageController** é um controlador de internacionalização (i18n) em JavaScript puro (Vanilla JS), leve e sem dependências externas. Ele foi desenvolvido para gerenciar e aplicar traduções dinâmicas diretamente na interface do usuário (UI) de aplicações web, garantindo flexibilidade e fallbacks seguros.

## ✨ Funcionalidades

* **Atualização Dinâmica:** Varre o DOM e traduz todos os elementos com o atributo configurado em tempo real.
* **Navegação Aninhada:** Permite acessar chaves profundas em objetos usando a notação `/`  **(CONFIGURÁVEL)**.
* **Sincronização com o HTML:** Altera automaticamente o atributo `lang` da tag `<html>` de acordo com o idioma ativo.
* **Altamente Customizável:** Permite configurar o separador de caminhos e o nome do atributo `data-*` usado no HTML.
* **Interpolação de Variáveis:** Suporte para passar variáveis dinâmicas tanto via JavaScript quanto diretamente pelo HTML através de atributos `data-*-vars`.
* **Fallback Seguro:** Exibe um aviso visual customizável caso uma chave de tradução esteja ausente, evitando quebras silenciosas na UI.

## 🛠️ Como Funciona o Dicionário

Para utilizar o controlador, você deve passar um objeto de dicionário seguindo estas regras obrigatórias:
1. Deve conter a propriedade raiz `languages`.
2. Cada idioma dentro de `languages` deve **obrigatoriamente** possuir a propriedade interna `lang` (que define o código padrão do HTML, ex: `pt-BR` ou `en-US`).

### Exemplo de Estrutura (`dictionary.js`)
```javascript
export const DICTIONARY = {
    config: {
        dataset: 'lang',    // Opcional. Padrão: 'lang' (resulta em data-lang)
        separator: '/'      // Opcional. Padrão: '/'
    },
    languages: {
        en: {
            lang: 'en-US',
            title: 'My Application',
            messages: {
                welcome: 'Welcome, {name}!'
            },
            buttons: {
                save: 'Save',
                cancel: 'Cancel'
            }
        },
        pt: {
            lang: 'pt-BR',
            title: 'Meu Aplicativo',
            messages: {
                welcome: 'Bem-vindo, {name}!'
            },
            buttons: {
                save: 'Salvar',
                cancel: 'Cancelar'
            }
        }
    }
};
```

## 💻 Como Usar

**1. No HTML**
Adicione o atributo correspondente (`data-lang`) com o caminho da chave do dicionário. Se precisar injetar variáveis dinâmicas, utilize o atributo complementar no formato JSON:

```html
<h1 data-lang="title"></h1>
<button data-lang="buttons/save"></button>
<p data-lang="messages/welcome" data-lang-vars='{"name": "Kaik"}'></p>
```

**2. Carregue o script do *LanguageController*:**
```html
<script src="https://languagecontroller.pages.dev/LanguageController.js"></script>
```

**3. No JavaScript (Instanciando e Aplicando)**
```javascript
// O dicionário com os idiomas estruturados
const DICTIONARY = {
    languages: {
        pt: {
            lang: 'pt-BR', // Obrigatório
            title: "Título",
            buttons: { save: "Salvar" },
            messages: { welcome: "Bem-vindo(a) {nome}" }
        },
        en: {
            lang: 'en-US', // Obrigatório
            title: "Title",
            buttons: { save: "Save" },
            messages: { welcome: "Welcome {nome}" }
        }
    }
};

// Inicializa o controlador
const controller = new LanguageController(DICTIONARY);

// Define o idioma ativo (Isso traduz o HTML automaticamente)
controller.setLanguage('pt');

// Verifica idioma atual
console.log(controller.getSelectedLanguage()); // Retorna: 'pt'
```

## ⚙️ Métodos Disponíveis

A instância da classe `LanguageController` fornece os seguintes métodos públicos para manipulação das traduções:

| Método | Descrição | Exemplo de Uso |
| :--- | :--- | :--- |
| `setLanguage(langCode)` | Altera o idioma ativo, atualiza a tag `<html>` e recarrega os elementos do DOM. Se o idioma não existir, exibe um *warning* no console. | `controller.setLanguage('en')` |
| `getTextLanguage(pathLang, params)` | Retorna o texto traduzido baseado no caminho. Aceita um objeto `params` (opcional) para interpolar variáveis. | `controller.getTextLanguage('messages/welcome', { nome: 'João' })` |
| `isValidLanguage(lang)` | Verifica se o código de um determinado idioma (ex: `'pt'`) existe e está devidamente configurado no dicionário. | `controller.isValidLanguage('es') // false` |
| `getCurrentLanguage()` | Retorna a chave do idioma que está atualmente em uso. | `controller.getCurrentLanguage() // 'pt'` |
| `getSelectedLanguage()` | Alias para `getCurrentLanguage()`. Retorna a mesma identificação do idioma selecionado. | `controller.getSelectedLanguage() // 'pt'` |
| `getLanguages()` | Retorna um array com todas as chaves de idiomas disponíveis no dicionário. | `controller.getLanguages() // ['pt', 'en']` |
| `getLanguagesHTML()` | Retorna um array com as tags de identificação HTML (`lang`) disponíveis em cada dicionário. | `controller.getLanguagesHTML() // ['pt-BR', 'en-US']` |

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Se você tiver sugestões de melhorias, encontrar bugs ou quiser adicionar novas funcionalidades:

1. Faça um *Fork* do projeto.
2. Crie uma *Branch* para sua feature (`git checkout -b feature/MinhaNovaFeature`).
3. Faça o *Commit* de suas alterações (`git commit -m 'Add: nova funcionalidade incrível'`).
4. Faça o *Push* para a Branch (`git push origin feature/MinhaNovaFeature`).
5. Abra um *Pull Request*.

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE). Veja o arquivo `LICENSE` para mais detalhes.

---
<p align="center">
  Desenvolvido com dedicação por <a href="https://github.com/kaikdandrade/">Kaik D' Andrade</a>
</p>
