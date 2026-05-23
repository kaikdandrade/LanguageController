/**
 * Controlador de internacionalização (i18n) para gerenciar e aplicar
 * traduções dinâmicas na interface do usuário.
 * 
 * OBJETIVO: Facilitar a implementação de suporte a múltiplos idiomas em aplicações web.
 * 
 * OBRIGATÓRIO:
 * 1. Mantenha a mesma estrutura do dicionário para cada idioma por consistência
 * 2. Use 'lang' obrigatoriamente em cada idioma do dicionário
 * 
 * FLUXO DE USO RECOMENDADO:
 * 1. Defina seus dicionários em um arquivo separado (ex: dictionary.js) e instancie: const controller = new LanguageController(DICTIONARY)
 * 2. Use nomes descritivos para as chaves (ex: 'controls', 'messages', 'buttons')
 * 
 * RECURSOS PRINCIPAIS:
 *
 * ✓ Fallback automático para idioma padrão
 * 
 * ✓ Navegação em objetos aninhados com notação '/'
 * 
 * ✓ Atualização dinâmica de todos os elementos com data-lang
 * 
 * ✓ Suporte a objetos de tradução completamente flexíveis
 * 
 * ✓ Gerenciamento automático do atributo lang na tag <html>
 * 
 * @class
 * @example
 * 
 * const DICTIONARY = {
 *  config: {
 *      dataset: 'lang', // Atributo opcional. DEFAULT lang='data-lang'
 *      separator: '/' // Atrbuto opicional. DEFAULT '/' 
 *  },
 * 
 *  // Abaixo será a contrução do dicionário realmente
 *  languages: {
 *      en: {
 *         lang: 'en-US',
 *         title: 'My App',
 *         buttons: { save: 'Save', cancel: 'Cancel' }
 *        },
 *      pt: {
 *          lang: 'pt-BR',
 *          title: 'Meu App',
 *          buttons: { save: 'Salvar', cancel: 'Cancelar' }
 *       },
 *    },
 * };
 *
 * const language = new LanguageController(DICTIONARY);
 * language.setlanguage('en');
 */
class LanguageController {
    /** @type {HTMLElement} Elemento raiz (HTML) do documento */
    #html = document.documentElement;

    /** @type {object} Dicionário contendo as frases das traduções disponíveis */
    #dict;

    /** @type {string} Código da linguagem atualmente selecionada (ex: 'pt-BR', 'en-US') */
    #selectedLanguage = '';

    /** 
     * @type {object} config - Configurações internas
     * @type {string} config.separator - Separação usada no pathLang de data-lang para encontrar o caminho de tradução dentro do dicionário.
     * @type {string} config.dataset - Regra usada para buscar os elementos que precisam de tradução no HTML. DEFAULT 'lang'='data-lang'.
     * @type {string} config.errorPlaceholder - Texto padão exibido ao não encontrar a tradução no dicionário com o caminho especificado.
     */
    #config = {
        separator: '/',
        dataset: 'lang',
        errorPlaceholder: '<span style="color: red;">&tritime; [Translation missing]</span>',
    };

    /**
     * Cria uma instância do controlador de linguagem.
     * @param {object} dictionary Objeto pai que guarda as informações necessárias
     * @param {object} dicionary.config Dicionário filho contendo as informações de configuração da classe
     * @param {object} dicionary.languages Dicionário filho contendo todas as informações de idioma
     */
    constructor(dictionary = {}) {
        if (!Object.hasOwn(dictionary, 'languages'))
            throw new Error("LanguageController Error: 'languages' not found in the dictionary.");

        this.#dict = dictionary.languages;
        this.#config.separator = dictionary?.config?.separator || '/';
        this.#config.dataset = dictionary?.config?.dataset || 'lang';
    }

    /**
     * Varre o DOM em busca dos elementos com o dataset configurado e atualiza o conteúdo de acordo com o idioma
     * @param {HTMLElement} container Elemento pai usado na busca dos elementos. Default document (DOM)
     */
    #loadLanguage(container = document) {
        const selector = `[data-${this.#config.dataset}]`;
        const elements = container.querySelectorAll(selector);

        elements.forEach((el) => {
            const path = el.getAttribute(`data-${this.#config.dataset}`);
            if (!path) return;

            // Suporte para passar dados via atributo extra (opcional)
            const vars = el.getAttribute(`data-${this.#config.dataset}-vars`)
                ? JSON.parse(el.getAttribute(`data-${this.#config.dataset}-vars`))
                : {};
            el.innerHTML = this.getTextLanguage(path, vars);
        });
    }

    /**
     * Responsável por interpolar variaveis dentro do texto de tradução. 
     * Ao encontrar {chave} tenta interpolar com os valores passados em {params} 
     * e depois retorna a variável interpolada.
     * 
     * @param {string} text Texto de tradução a ser interpolado.
     * @param {Object|Array} params Variaveis a ser interpolada dentro do texto de tradução. Os dados, ex: { nome: "João", status: "bem", year: "2026", old: 25 }
     * @returns {string} Retorna o texto de tradução interpolada com a variavel. 
     */
    #interpolate(text, params) {
        // Trasnforma os valores de 'params' em uma lista sequencial (Array)
        const values = Object.values(params);
        let index = 0;

        // O replace vai encontrar cada ocorrência de {algo}
        return text.replace(/{(\w+)}/g, (match) => {
            // Pegar o valor na posição atual do contador
            const replacement = values[index];
            index++; // Proximo..

            // Se o valor existir, usamos ele. 
            // Se houver mais chaves no texto do que dados no params, mantém a {chave} original.
            return replacement !== undefined ? String(replacement) : match;
        });
    }

    /**
     * Altera a linguagem ativa, atualiza o atributo 'lang' na tag <html> e recarrega todos os elementos do HTML
     *  
     * COMPORTAMENTO COM FALLBACK:
     * - Se o idioma existe: Ativa esse idioma
     * - Se não existe emite um aviso e para o método
     * 
     * @param {string} langCode Código do idioma a ativar (ex: 'en', 'pt', 'es')
     */
    setLanguage(langCode) {
        if (this.isValidLanguage(langCode))
            this.#selectedLanguage = langCode;
        else {
            console.warn(`LanguageController Warning: '${langCode}' not found.`);
            return;
        }

        const locale = this.#dict[this.#selectedLanguage].lang ?? 'en-US';
        this.#html.setAttribute('lang', locale);
        this.#loadLanguage();
    }

    /**
     * Verifica se o código do idioma existe no dicionário.
     * @param {string} lang 
     */
    isValidLanguage(lang) {
        return lang && typeof lang === 'string' && this.#dict[lang];
    }

    /**
     * Navega pelos dados de tradução atual para encontrar o texto baseado no caminho especificado.
     * 
     * @param {string} pathLang - Caminho para acessar o texto no objeto de idioma.
     * @returns {string} O texto traduzido iterpolado ou placeholder de erro
     * 
     * @example
     * getTextLanguage('title') // retorna "My App"
     * getTextLanguage('messages/welcome', [User.name]) // "Welcome {name}" retorna "Welcome Fulano"
     */
    getTextLanguage(pathLang, params = {}) {
        if (!this.#selectedLanguage) return this.#config.errorPlaceholder;

        const keys = pathLang.split(this.#config.separator);
        let result = this.#dict[this.#selectedLanguage];

        for (const key of keys)
            if (result && Object.prototype.hasOwnProperty.call(result, key))
                result = result[key];
            else
                return this.#config.errorPlaceholder;

        if (typeof result !== 'string' && typeof result !== 'number')
            return this.#config.errorPlaceholder;

        return this.#interpolate(String(result), params);
    }

    /**
     * Obtém o código da linguagem atualmente selecionada
     * @returns {string} Código da linguagem (ex: 'pt', 'en', 'es')
     */
    getCurrentLanguage() {
        return this.#selectedLanguage;
    }

     /**
     * Obtém o código HTML da linguagem atualmente selecionada
     * @returns {string} Código da linguagem (ex: 'pt-BR', 'en-US')
     */
    getCurrentLanguageHTML() {
        return this.#dict[this.#selectedLanguage].lang;
    }

    /**
     * Obtém qual linguagem atualmente em uso e retorna a lang de HTML. 
     * @returns {string[]} Array de códigos HTML de idiomas (ex: ['en-US', 'pt-BR'])
     */
    getLanguagesHTML() {
        return Object.keys(this.#dict).map(mp => this.#dict[mp]['lang']);
    }

    /**
     * Obtém a lista de códigos de idiomas disponíveis no dicionário
     * @returns {string[]} Array de códigos de idiomas (ex: ['pt', 'en', 'es'])
     */
    getLanguages() {
        return Object.keys(this.#dict);
    }

    /**
     * @returns {string} Retorna a indentificação do idioma atualmente selecionado
     */
    getSelectedLanguage() {
        return this.#selectedLanguage;
    }
}
