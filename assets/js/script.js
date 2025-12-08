/**
 * ZOTTI & ZOTTI - SCRIPT PRINCIPAL
 * Versão limpa e otimizada seguindo boas práticas
 * 
 * Regras aplicadas:
 * - Responsabilidade única por função
 * - DRY (Don't Repeat Yourself)
 * - Inicialização única e segura
 * - Verificação de elementos antes de uso
 */

console.log('🚀 Zotti&Zotti Script carregado!');

// ========================================
// CONFIGURAÇÕES GLOBAIS
// ========================================
const CONFIG = {
    loaderTimeout: 2000,
    carouselDelay: 1000,
    animationDuration: 300
};

// ========================================
// UTILITÁRIOS
// ========================================
const Utils = {
    // Verificar se elemento existe antes de usar
    safeQuerySelector: (selector) => {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`⚠️ Elemento não encontrado: ${selector}`);
        }
        return element;
    },

    // Verificar se múltiplos elementos existem
    safeQuerySelectorAll: (selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn(`⚠️ Nenhum elemento encontrado: ${selector}`);
        }
        return elements;
    },

    // Debounce para otimizar eventos
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// ========================================
// LOADER MANAGEMENT - APENAS PARA VISITANTES DO GOOGLE
// ========================================
const LoaderManager = {
    initialized: false,

    init() {
        if (this.initialized) {
            console.log('🔄 Loader já inicializado, pulando...');
            return;
        }

        console.log('🎯 Inicializando Loader Manager (apenas para Google)...');
        
        // Verificar se veio do Google
        const isFromGoogle = this.checkGoogleReferrer();
        
        if (isFromGoogle) {
            console.log('🔍 Visitante veio do Google - mostrando loader');
            this.showLoader();
            // Esconder loader após timeout
            setTimeout(() => {
                this.hideLoader();
            }, CONFIG.loaderTimeout);
        } else {
            console.log('🚫 Visitante não veio do Google - escondendo loader imediatamente');
            // Esconder loader imediatamente
            this.hideLoader();
        }

        // Fallback: garantir que o loader seja escondido após 3 segundos máximo
        setTimeout(() => {
            this.hideLoader();
        }, 3000);

        // Fallback adicional: esconder quando página estiver completamente carregada
        if (document.readyState === 'complete') {
            setTimeout(() => this.forceHideLoader(), 1000);
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.forceHideLoader(), 1000);
            });
        }

        // Fallback de emergência: esconder após 5 segundos
        setTimeout(() => {
            this.forceHideLoader();
        }, 5000);

        this.initialized = true;
    },

    checkGoogleReferrer() {
        const referrer = document.referrer.toLowerCase();
        
        // Lista mais abrangente de mecanismos de busca
        const searchEngines = [
            'google.com', 'google.', 'googlebot', 'googlesyndication',
            'bing.com', 'bingbot', 'msn.com',
            'yahoo.com', 'yahoo.net',
            'duckduckgo.com', 'duckduckgo',
            'baidu.com', 'yandex.com', 'ask.com',
            'aol.com', 'search.aol.com'
        ];
        
        const isFromSearchEngine = searchEngines.some(engine => 
            referrer.includes(engine)
        );
        
        // Verificar também se é uma visita direta (sem referrer)
        const isDirectVisit = !referrer || referrer === '';
        
        console.log('🔍 Referrer detectado:', document.referrer);
        console.log('🔍 É de mecanismo de busca?', isFromSearchEngine);
        console.log('🔍 É visita direta?', isDirectVisit);
        
        // Retornar true apenas se veio de mecanismo de busca
        return isFromSearchEngine;
    },

    showLoader() {
        const loader = Utils.safeQuerySelector('#novoLoader');
        if (loader) {
            console.log('✅ Mostrando loader...');
            loader.classList.add('show');
            loader.style.opacity = '1';
        }
    },

    hideLoader() {
        const loader = Utils.safeQuerySelector('#novoLoader');
        if (loader) {
            console.log('✅ Escondendo loader...');
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            setTimeout(() => {
                loader.style.display = 'none';
                loader.classList.remove('show');
                // Forçar remoção completa
                loader.style.zIndex = '-1';
            }, CONFIG.animationDuration);
        }
    },

    // Método de emergência para esconder loader
    forceHideLoader() {
        const loader = Utils.safeQuerySelector('#novoLoader');
        if (loader) {
            console.log('🚨 Forçando esconder loader...');
            loader.classList.add('force-hide');
            loader.classList.remove('show');
            loader.style.display = 'none';
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            loader.style.zIndex = '-1';
        }
    }
};

// ========================================
// NAVEGAÇÃO MOBILE
// ========================================
const MobileNavigation = {
    initialized: false,

    init() {
        if (this.initialized) {
            console.log('🔄 Mobile Navigation já inicializada, pulando...');
            return;
        }

        const hamburger = Utils.safeQuerySelector('.hamburger');
        const navMenu = Utils.safeQuerySelector('.nav-menu');
        
        if (!hamburger || !navMenu) {
            console.warn('⚠️ Elementos de navegação mobile não encontrados');
            return;
        }

        // Toggle menu
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Fechar menu ao clicar em links
        const navLinks = Utils.safeQuerySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        this.initialized = true;
        console.log('✅ Mobile Navigation inicializada');
    }
};

// ========================================
// NAVEGAÇÃO SUAVE
// ========================================
const SmoothScrolling = {
    initialized: false,

    init() {
        if (this.initialized) {
            console.log('🔄 Smooth Scrolling já inicializado, pulando...');
            return;
        }

        const anchors = Utils.safeQuerySelectorAll('a[href^="#"]');
        
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = Utils.safeQuerySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        this.initialized = true;
        console.log('✅ Smooth Scrolling inicializado');
    }
};

// ========================================
// HEADER SCROLL EFFECT
// ========================================
const HeaderScrollEffect = {
    initialized: false,

    init() {
        if (this.initialized) {
            console.log('🔄 Header Scroll Effect já inicializado, pulando...');
            return;
        }

        const header = Utils.safeQuerySelector('.header');
        if (!header) {
            console.warn('⚠️ Header não encontrado');
            return;
        }

        const handleScroll = Utils.debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(39, 174, 96, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(39, 174, 96, 0.1)';
            }
        }, 10);

        window.addEventListener('scroll', handleScroll);

        this.initialized = true;
        console.log('✅ Header Scroll Effect inicializado');
    }
};

// ========================================
// ANIMAÇÕES DE SCROLL
// ========================================
const ScrollAnimations = {
    initialized: false,
    observer: null,

    init() {
        if (this.initialized) {
            console.log('🔄 Scroll Animations já inicializadas, pulando...');
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observar elementos com animação
        const animateItems = Utils.safeQuerySelectorAll('.animate-item');
        animateItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.8s ease-out';
            this.observer.observe(item);
        });

        this.initialized = true;
        console.log('✅ Scroll Animations inicializadas');
    }
};

// ========================================
// HOVER EFFECTS
// ========================================
const HoverEffects = {
    initialized: false,

    init() {
        if (this.initialized) {
            console.log('🔄 Hover Effects já inicializados, pulando...');
            return;
        }

        // Cards dos empreendimentos
        const empreendimentoCards = Utils.safeQuerySelectorAll('.empreendimento-card');
        empreendimentoCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Itens da galeria e plantas
        const galeriaItems = Utils.safeQuerySelectorAll('.galeria-item, .planta-item');
        galeriaItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        this.initialized = true;
        console.log('✅ Hover Effects inicializados');
    }
};

// ========================================
// MODAL SYSTEM
// ========================================
const ModalSystem = {
    initialized: false,
    modal: null,
    modalImg: null,
    modalTitle: null,
    closeModal: null,

    init() {
        if (this.initialized) {
            console.log('🔄 Modal System já inicializado, pulando...');
            return;
        }

        this.modal = Utils.safeQuerySelector('#imageModal');
        this.modalImg = Utils.safeQuerySelector('#modalImage');
        this.modalTitle = Utils.safeQuerySelector('#modalTitle');
        this.closeModal = Utils.safeQuerySelector('.close-modal');

        if (!this.modal || !this.modalImg || !this.modalTitle || !this.closeModal) {
            console.warn('⚠️ Elementos do modal não encontrados');
            return;
        }

        // Event listeners
        this.closeModal.addEventListener('click', () => this.close());
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.close();
            }
        });

        this.initialized = true;
        console.log('✅ Modal System inicializado');
    },

    open(imageSrc, imageTitle) {
        if (!this.modal || !this.modalImg || !this.modalTitle) return;

        this.modalImg.src = imageSrc;
        this.modalTitle.textContent = imageTitle;
        this.modal.style.display = 'block';
        
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);
        
        document.body.style.overflow = 'hidden';
    },

    close() {
        if (!this.modal) return;

        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, CONFIG.animationDuration);
    }
};

// ========================================
// CARROSSEL SYSTEM - VERSÃO ELEGANTE
// ========================================
const CarouselSystem = {
    initialized: false,
    carousels: new Map(),

    init() {
        if (this.initialized) return;
        
        console.log('✅ CarouselSystem elegante inicializado');
        this.initCarousels();
        this.initialized = true;
    },

    initCarousels() {
        const carouselElements = Utils.safeQuerySelectorAll('.obra-carousel');
        
        carouselElements.forEach(carousel => {
            const carouselId = carousel.id;
            if (carouselId) {
                this.setupCarousel(carouselId);
            }
        });
    },

    setupCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) {
            console.warn(`⚠️ Carrossel ${carouselId} não encontrado`);
            return;
        }

        const images = this.getCarouselImages(carouselId);
        if (images.length === 0) {
            console.warn(`⚠️ Nenhuma imagem encontrada para ${carouselId}`);
            return;
        }

        let currentIndex = 0;
        
        // Criar indicadores se não existirem
        this.createIndicators(carousel, images.length);
        
        // Configurar navegação
        this.setupNavigation(carousel, carouselId, images, currentIndex);
        
        // Salvar referência
        this.carousels.set(carouselId, {
            images,
            currentIndex,
            carousel
        });

        // Verificar se a primeira imagem carrega
        const firstImage = carousel.querySelector('.obra-slide');
        if (firstImage) {
            firstImage.onload = () => {
                console.log(`✅ Primeira imagem do carrossel ${carouselId} carregada`);
            };
            firstImage.onerror = () => {
                console.error(`❌ Erro ao carregar primeira imagem do carrossel ${carouselId}`);
            };
        }

        console.log(`✅ Carrossel ${carouselId} configurado com ${images.length} imagens`);
    },

    getCarouselImages(carouselId) {
        // Mapear IDs para arrays de imagens com caminhos absolutos
        const imageMap = {
            'obraCarouselJF': [
                './public/images/obra-jardim-flores/obra-jardim-flores-01.jpg',
                './public/images/obra-jardim-flores/obra-jardim-flores-02.jpg',
                './public/images/obra-jardim-flores/obra-jardim-flores-03.jpg',
                './public/images/obra-jardim-flores/obra-jardim-flores-04.jpg',
                './public/images/obra-jardim-flores/obra-jardim-flores-05.jpg'
            ]
        };
        
        return imageMap[carouselId] || [];
    },

    createIndicators(carousel, totalImages) {
        // Verificar se já existem indicadores
        if (carousel.querySelector('.carousel-indicators')) return;

        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'carousel-indicators';
        
        for (let i = 0; i < totalImages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(carousel.id, i));
            indicatorsContainer.appendChild(indicator);
        }
        
        carousel.appendChild(indicatorsContainer);
    },

    setupNavigation(carousel, carouselId, images, currentIndex) {
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.changeSlide(carouselId, -1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.changeSlide(carouselId, 1));
        }

        // Tornar função global para compatibilidade
        window.changeSlide = (id, direction) => this.changeSlide(id, direction);
    },

    changeSlide(carouselId, direction) {
        const carouselData = this.carousels.get(carouselId);
        if (!carouselData) return;

        const { images, currentIndex } = carouselData;
        const newIndex = (currentIndex + direction + images.length) % images.length;
        
        this.goToSlide(carouselId, newIndex);
    },

    goToSlide(carouselId, index) {
        const carouselData = this.carousels.get(carouselId);
        if (!carouselData) return;

        const { images, carousel } = carouselData;
        const imgEl = carousel.querySelector('.obra-slide');
        const indexEl = carousel.querySelector('.carousel-index');
        const indicators = carousel.querySelectorAll('.carousel-indicator');

        if (!imgEl) return;

        // Atualizar imagem com transição suave
        imgEl.style.opacity = '0';
        setTimeout(() => {
            imgEl.src = images[index];
            imgEl.style.opacity = '1';
        }, 150);

        // Atualizar contador
        if (indexEl) {
            indexEl.textContent = index + 1;
        }

        // Atualizar indicadores
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        // Atualizar dados
        carouselData.currentIndex = index;
        this.carousels.set(carouselId, carouselData);

        console.log(`🔄 Slide alterado para: ${index + 1} de ${images.length}`);
    }
};

// ========================================
// NAVEGAÇÃO ATIVA
// ========================================
const ActiveNavigation = {
    initialized: false,

    init() {
        if (this.initialized) {
            console.log('🔄 Active Navigation já inicializada, pulando...');
            return;
        }

        const sections = Utils.safeQuerySelectorAll('section[id]');
        const navLinks = Utils.safeQuerySelectorAll('.nav-link');
        
        if (sections.length === 0 || navLinks.length === 0) {
            console.warn('⚠️ Seções ou links de navegação não encontrados');
            return;
        }

        const handleScroll = Utils.debounce(() => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100);

        window.addEventListener('scroll', handleScroll);

        this.initialized = true;
        console.log('✅ Active Navigation inicializada');
    }
};

// ========================================
// INICIALIZAÇÃO PRINCIPAL
// ========================================
const App = {
    initialized: false,

    init() {
        if (this.initialized) {
            console.log('🔄 App já inicializada, pulando...');
            return;
        }

        console.log('🚀 Inicializando Zotti&Zotti App...');

        // Inicializar todos os módulos
        LoaderManager.init();
        MobileNavigation.init();
        SmoothScrolling.init();
        HeaderScrollEffect.init();
        ScrollAnimations.init();
        HoverEffects.init();
        ModalSystem.init();
        CarouselSystem.init();
        ActiveNavigation.init();

        // Tornar funções globais para compatibilidade
        window.openModal = ModalSystem.open.bind(ModalSystem);
        window.hideLoader = LoaderManager.forceHideLoader.bind(LoaderManager);
        window.debugCarousel = () => {
            console.log('🔍 Debug do Carrossel:');
            console.log('Carrosséis encontrados:', CarouselSystem.carousels.size);
            CarouselSystem.carousels.forEach((data, id) => {
                console.log(`- ${id}: ${data.images.length} imagens, índice atual: ${data.currentIndex}`);
            });
        };

        this.initialized = true;
        console.log('✅ Zotti&Zotti App inicializada com sucesso!');
    }
};

// ========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ========================================
// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    // DOM já está pronto
    App.init();
}

        // Backup: inicializar após delay para garantir que tudo carregou
        setTimeout(() => {
            if (!App.initialized) {
                console.log('🔄 Inicialização tardia...');
                App.init();
            }
        }, CONFIG.carouselDelay);

        // Fallback adicional para carrossel
        setTimeout(() => {
            if (CarouselSystem.carousels.size === 0) {
                console.log('🔄 Tentando inicializar carrossel novamente...');
                CarouselSystem.initCarousels();
            }
        }, 2000);


console.log('📄 Script Zotti&Zotti carregado completamente!');