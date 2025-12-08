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
    touchStartX: 0,
    touchEndX: 0,

    init() {
        if (this.initialized) {
            console.log('🔄 Modal System já inicializado, pulando...');
            return;
        }

        this.modal = Utils.safeQuerySelector('#imageModal');
        this.modalImg = Utils.safeQuerySelector('#modalImage');
        this.modalTitle = Utils.safeQuerySelector('#modalTitle');
        this.closeModal = Utils.safeQuerySelector('.close-modal');
        const modalContent = Utils.safeQuerySelector('.modal-content');

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

        // Navegação por clique na área expandida (modal-content) e na imagem
        const clickableAreas = [modalContent, this.modalImg].filter(Boolean);
        clickableAreas.forEach(area => {
            area.addEventListener('click', (e) => {
                const rect = area.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const half = rect.width / 2;
                if (clickX < half) {
                    this.navigate(-1);
                } else {
                    this.navigate(1);
                }
            });
        });

        // Swipe no modal (em qualquer lugar do conteúdo)
        if (modalContent) {
            modalContent.addEventListener('touchstart', (e) => {
                if (!e.touches || e.touches.length === 0) return;
                this.touchStartX = e.touches[0].clientX;
            }, { passive: true });

            modalContent.addEventListener('touchend', (e) => {
                const threshold = 40; // px
                this.touchEndX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : this.touchStartX;
                const deltaX = this.touchEndX - this.touchStartX;
                if (Math.abs(deltaX) > threshold) {
                    if (deltaX < 0) {
                        this.navigate(1); // esquerda -> próxima
                    } else {
                        this.navigate(-1); // direita -> anterior
                    }
                }
            }, { passive: true });
        }

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
        // Pausar autoplay enquanto modal estiver aberto
        if (window.ObraGallerySystem) {
            ObraGallerySystem.stopAutoPlay();
        }
    },

    updateFromObraGallery() {
        if (!this.modal || !this.modalImg || !this.modalTitle) return;
        if (!window.ObraGallerySystem || !ObraGallerySystem.images || ObraGallerySystem.images.length === 0) return;
        const currentImage = ObraGallerySystem.images[ObraGallerySystem.currentIndex];
        const imageTitle = `Acompanhe a Obra - Imagem ${ObraGallerySystem.currentIndex + 1}`;
        this.modalImg.src = currentImage;
        this.modalTitle.textContent = imageTitle;
    },

    navigate(direction) {
        if (window.ObraGallerySystem && typeof ObraGallerySystem.changeImage === 'function') {
            ObraGallerySystem.changeImage(direction);
            this.updateFromObraGallery();
        }
    },

    close() {
        if (!this.modal) return;

        this.modal.classList.remove('show');
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, CONFIG.animationDuration);
        // Retomar autoplay ao fechar modal
        if (window.ObraGallerySystem) {
            ObraGallerySystem.startAutoPlay();
        }
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
            console.warn(`⚠️ Carrossel ${carouselId} não possui imagens ou o atributo data-images está ausente`);
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
        const carouselElement = document.getElementById(carouselId);
        if (!carouselElement) {
            console.warn(`Carrossel "${carouselId}" não encontrado`);
            return [];
        }
        
        const imagesAttr = carouselElement.getAttribute('data-images');
        if (!imagesAttr) {
            console.warn(`Carrossel "${carouselId}" não possui atributo data-images`);
            return [];
        }

        // .trim() remove espaços em branco caso a formatação seja "img1, img2"
        const images = imagesAttr.split(',').map(img => img.trim());
        console.log(`🔍 Imagens para ${carouselId}:`, images);
        return images;
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

        // Fallback de CSS em produção (mobile ou caminhos diferentes)
        setTimeout(() => {
            try {
                const sheets = Array.from(document.styleSheets || []);
                const hasPublicCss = sheets.some(s => (s.href || '').includes('/public/css/styles.css'));
                if (!hasPublicCss) {
                    const head = document.head || document.getElementsByTagName('head')[0];
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/assets/css/styles.css';
                    head.appendChild(link);
                    // Fallback adicional relativo
                    const link2 = document.createElement('link');
                    link2.rel = 'stylesheet';
                    link2.href = './assets/css/styles.css';
                    head.appendChild(link2);
                    console.log('🧷 CSS fallback injetado');
                }
            } catch (e) {
                console.warn('⚠️ Verificação de CSS falhou', e);
            }
        }, 400);

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


// ========================================
// GALERIA DE OBRAS - SISTEMA INTERATIVO
// ========================================
const ObraGallerySystem = {
    initialized: false,
    currentIndex: 0,
    images: [],
    currentMonthKey: null,
    monthToFolder: {
        // Nomes exatamente como estão no servidor (título/padrão)
        'Julho 2023': 'assets/images/obra-jardim-flores/Julho 2023',
        'Novembro 2024': 'assets/images/obra-jardim-flores/Novembro 2024',
        'Dezembro 2024': 'assets/images/obra-jardim-flores/Dezembro 2024',
        'Janeiro 2025': 'assets/images/obra-jardim-flores/Janeiro 2025',
        'Fevereiro 2025': 'assets/images/obra-jardim-flores/Fevereiro 2025',
        'Março 2025': 'assets/images/obra-jardim-flores/Março 2025',
        'Abril 2025': 'assets/images/obra-jardim-flores/Abril 2025',
        'Maio 2025': 'assets/images/obra-jardim-flores/Maio 2025',
        'Junho 2025': 'assets/images/obra-jardim-flores/Junho 2025',
        'Julho 2025': 'assets/images/obra-jardim-flores/Julho 2025',
        'Agosto 2025': 'assets/images/obra-jardim-flores/Agosto 2025',
        'Setembro 2025': 'assets/images/obra-jardim-flores/Setembro 2025'
    },
    
    /**
     * Convenção de diretórios de imagens por mês:
     * assets/images/obra-jardim-flores/<MÊS ANO>/
     *  - 01.jpg, 02.jpg, 03.jpg ... (numeração sequencial com 2 dígitos)
     * Basta subir as fotos com esse padrão que a galeria carrega automaticamente.
     */
    autoPlayTimer: null,
    autoPlayDelay: 4000, // 4 segundos
    isMobile() {
        try {
            if (window.matchMedia) {
                return window.matchMedia('(max-width: 768px)').matches;
            }
            return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        } catch (_) {
            return false;
        }
    },

    init() {
        if (this.initialized) return;
        
        console.log('✅ Obra Gallery System inicializado');
        this.setupGallery();
        // Selecionar mês inicial pelo primeiro botão ativo (ou NOVEMBRO 2024)
        const buttons = Array.from(document.querySelectorAll('.obra-month-btn'));
        // Ordenar visualmente por ano/mês se necessário (já está em HTML, mas garantimos)
        // Definir mês inicial pelo primeiro com classe active, senão o primeiro da lista
        const activeBtn = document.querySelector('.obra-month-btn.active') || buttons[0];
        const initialMonth = activeBtn ? activeBtn.getAttribute('data-month') : 'NOVEMBRO 2024';
        // Atualizar legenda imediatamente antes do carregamento assíncrono
        this.currentMonthKey = initialMonth;
        this.updateMonthBadge();
        this.loadMonth(initialMonth);
        // Se não houver imagens carregadas (1/1 placeholder), forçar mês com fotos (Julho 2023)
        setTimeout(() => {
            if (this.images.length <= 1) {
                const fallback = 'Julho 2023';
                const btn = buttons.find(b => b.getAttribute('data-month') === fallback);
                if (btn) {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }
                this.currentMonthKey = fallback;
                this.updateMonthBadge();
                this.loadMonth(fallback);
            }
        }, 300);
        this.startAutoPlay();
        this.initialized = true;
    },

    setupGallery() {
        const mainImg = document.getElementById('obraGalleryImg');
        const totalElement = document.getElementById('obraGalleryTotal');
        const galleryContainer = document.querySelector('.obra-gallery-container');
        
        if (!mainImg) {
            console.warn('⚠️ Elemento da galeria de obras não encontrado');
            return;
        }

        if (totalElement) {
            totalElement.textContent = this.images.length;
        }

        // Tornar função global
        window.changeObraImage = (direction) => this.changeImage(direction);

        // Pausar timer quando mouse passar sobre a galeria ou imagem principal
        const pauseHandlers = (el) => {
            if (!el) return;
            el.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
                console.log('⏸️ Timer pausado - hover');
            });
            el.addEventListener('mouseleave', (e) => {
                // Retomar somente quando sair completamente da área principal da galeria
                const related = e.relatedTarget;
                const wrapper = document.querySelector('.obra-gallery-main');
                if (wrapper && wrapper.contains(related)) {
                    return;
                }
                this.startAutoPlay();
                console.log('▶️ Timer retomado - mouse saiu');
            });
        };
        const galleryMain = document.querySelector('.obra-gallery-main');
        pauseHandlers(galleryContainer);
        pauseHandlers(mainImg);
        pauseHandlers(galleryMain);

        // Abrir modal ao clicar na imagem
        mainImg.addEventListener('click', () => {
            this.openModal();
        });

        // Swipe na imagem principal (mobile)
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 40;
        mainImg.addEventListener('touchstart', (e) => {
            if (!e.touches || e.touches.length === 0) return;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        mainImg.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : touchStartX;
            const deltaX = touchEndX - touchStartX;
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX < 0) {
                    this.changeImage(1); // esquerda -> próxima
                } else {
                    this.changeImage(-1); // direita -> anterior
                }
            }
        }, { passive: true });
        
        // Click nos botões de mês
        const monthButtons = document.querySelectorAll('.obra-month-btn');
        monthButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Pausar autoplay durante troca manual
                this.stopAutoPlay();
                monthButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const monthKey = btn.getAttribute('data-month');
                // Atualizar legenda imediatamente
                this.currentMonthKey = monthKey;
                this.updateMonthBadge();
                this.loadMonth(monthKey);
                // Reiniciar autoplay somente no desktop
                if (!this.isMobile()) {
                    setTimeout(() => this.startAutoPlay(), 200);
                }
            });
        });
        
        console.log('✅ Galeria de obras configurada com', this.images.length, 'imagens');
    },

    loadMonth(monthKey) {
        const folder = this.monthToFolder[monthKey];
        if (!folder) return;
        this.currentMonthKey = monthKey;

        // Mapeia prefixos por mês para suportar novos padrões (abr1.jpg, fev1.JPG, etc.)
        const monthPrefix = {
            'Julho 2023': 'obra-jardim-flores-',
            'Novembro 2024': 'nov',
            'Dezembro 2024': 'dez',
            'Janeiro 2025': 'jan',
            'Fevereiro 2025': 'fev',
            'Março 2025': 'mar',
            'Abril 2025': 'abr',
            'Maio 2025': 'mai',
            'Junho 2025': 'jun',
            'Julho 2025': 'jul',
            'Agosto 2025': 'ago',
            'Setembro 2025': 'set',
        };

        // Para cada índice, tentar variantes em ordem e aceitar só a primeira que existir
        // Evita duplicação entre esquemas de nomes diferentes
        const maxCandidates = 20; // reduzir tentativas para performance
        const prefix = monthPrefix[monthKey] || '';
        const base = folder.startsWith('./') || folder.startsWith('/') ? folder : `./${folder}`;

        const resolvedImages = [];
        let processed = 0;

        const finalize = () => {
            this.images = resolvedImages;
            if (this.images.length === 0) {
                // fallback: placeholder inexistente para manter estrutura
                this.images = [`${folder}/01.jpg`];
            }
            this.currentIndex = 0;
            const totalElement = document.getElementById('obraGalleryTotal');
            if (totalElement) totalElement.textContent = this.images.length;
            this.updateGallery();
            this.updateMonthBadge();
        };

        const tryVariants = (n) => {
            const nn = String(n).padStart(2, '0');
            const variants = [
                `${base}/${prefix}${n}.jpg`,
                `${base}/${prefix}${n}.JPG`,
                `${base}/${nn}.jpg`,
                `${base}/obra-jardim-flores-${nn}.jpg`
            ];

            let vIndex = 0;
            const tryNext = () => {
                if (vIndex >= variants.length) {
                    processed++;
                    if (processed === maxCandidates) finalize();
                    return;
                }
                const src = variants[vIndex++];
                const img = new Image();
                img.onload = () => {
                    resolvedImages.push(src);
                    processed++;
                    if (processed === maxCandidates) finalize();
                };
                img.onerror = () => {
                    tryNext();
                };
                // Normalizar espaços e caracteres especiais
                img.src = encodeURI(src).replace(/\s/g, '%20');
            };
            tryNext();
        };

        for (let i = 1; i <= maxCandidates; i++) {
            tryVariants(i);
        }
        this.stopAutoPlay();
        this.startAutoPlay();
    },

    changeImage(direction) {
        this.currentIndex += direction;
        
        if (this.currentIndex >= this.images.length) {
            // Passou da última imagem, ir para o próximo mês
            this.goToNextMonth();
            return;
        } else if (this.currentIndex < 0) {
            // Passou da primeira imagem, ir para o mês anterior
            this.goToPreviousMonth();
            return;
        }
        
        this.updateGallery();
        // Não resetar autoPlay aqui para não interferir com hover
    },

    updateGallery() {
        const mainImg = document.getElementById('obraGalleryImg');
        const indexElement = document.getElementById('obraGalleryIndex');
        
        if (!mainImg) return;

        // Atualizar imagem principal
        mainImg.src = this.images[this.currentIndex];
        
        // Atualizar contador
        if (indexElement) {
            indexElement.textContent = this.currentIndex + 1;
        }
        this.updateMonthBadge();
        
        console.log(`🏗️ Galeria de obras atualizada para imagem ${this.currentIndex + 1}/${this.images.length}`);
    },

    updateMonthBadge() {
        const badge = document.querySelector('.obra-gallery-date');
        if (!badge) return;
        const key = this.currentMonthKey || '';
        if (!key) return;
        // Converter "Julho 2025" -> "Jul. 2025"
        const parts = key.split(' ');
        const mes = parts[0];
        const ano = parts[1] || '';
        const mapa = {
            'Julho': 'Jul.',
            'Novembro': 'Nov.',
            'Dezembro': 'Dez.',
            'Janeiro': 'Jan.',
            'Fevereiro': 'Fev.',
            'Março': 'Mar.',
            'Abril': 'Abr.',
            'Maio': 'Mai.',
            'Junho': 'Jun.',
            'Agosto': 'Ago.',
            'Setembro': 'Set.'
        };
        const abreviado = mapa[mes] || ((mes || '').slice(0, 3) + '.');
        badge.textContent = `${abreviado} ${ano}`.trim();
    },

    startAutoPlay() {
        // No mobile não usamos autoplay
        if (this.isMobile()) {
            this.stopAutoPlay();
            console.log('📵 AutoPlay desativado no mobile');
            return;
        }
        // Limpar timer existente antes de criar novo
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.changeImage(1);
        }, this.autoPlayDelay);
        console.log('▶️ AutoPlay iniciado');
    },

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
            console.log('⏸️ AutoPlay pausado');
        }
    },

    resetAutoPlay() {
        // Só reinicia se não estiver pausado por hover
        if (this.autoPlayTimer) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    },

    goToNextMonth() {
        const monthKeys = Object.keys(this.monthToFolder);
        const currentMonthIndex = monthKeys.findIndex(month => {
            const btn = document.querySelector(`.obra-month-btn[data-month="${month}"]`);
            return btn && btn.classList.contains('active');
        });
        
        if (currentMonthIndex >= 0 && currentMonthIndex < monthKeys.length - 1) {
            const nextMonth = monthKeys[currentMonthIndex + 1];
            this.switchToMonth(nextMonth);
        } else {
            // Se estiver no último mês, voltar para o primeiro
            this.currentIndex = 0;
            this.updateGallery();
        }
    },

    goToPreviousMonth() {
        const monthKeys = Object.keys(this.monthToFolder);
        const currentMonthIndex = monthKeys.findIndex(month => {
            const btn = document.querySelector(`.obra-month-btn[data-month="${month}"]`);
            return btn && btn.classList.contains('active');
        });
        
        if (currentMonthIndex > 0) {
            const prevMonth = monthKeys[currentMonthIndex - 1];
            this.switchToMonth(prevMonth);
        } else {
            // Se estiver no primeiro mês, ir para a última imagem
            this.currentIndex = this.images.length - 1;
            this.updateGallery();
        }
    },

    switchToMonth(monthKey) {
        // Atualizar botão ativo
        const monthButtons = document.querySelectorAll('.obra-month-btn');
        monthButtons.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.obra-month-btn[data-month="${monthKey}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Carregar mês
        this.loadMonth(monthKey);
    },

    openModal() {
        // Usar o sistema de modal existente
        if (window.openModal) {
            const currentImage = this.images[this.currentIndex];
            const imageTitle = `Acompanhe a Obra - Imagem ${this.currentIndex + 1}`;
            window.openModal(currentImage, imageTitle);
        }
    }
};

// Inicializar galeria de obras quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    ObraGallerySystem.init();
});

console.log('📄 Script Zotti&Zotti carregado completamente!');