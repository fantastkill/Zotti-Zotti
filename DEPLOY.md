# 🚀 Guia de Deploy - GitHub Pages

## 📋 Pré-requisitos

- Conta no GitHub
- Git instalado no seu computador
- Repositório criado: `https://github.com/fantastkill/zotti-zotti.git`

## 🔧 Passo a Passo

### 1. Preparar o Repositório Local

```bash
# Navegar até a pasta do projeto
cd "c:\Users\conta\OneDrive\Desktop\Projetos\zotti zotti"

# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos (exceto os ignorados pelo .gitignore)
git add .

# Fazer o primeiro commit
git commit -m "Preparar projeto Zotti Zotti para GitHub Pages"
```

### 2. Conectar ao Repositório Remoto

```bash
# Renomear branch para main (padrão do GitHub)
git branch -M main

# Adicionar o repositório remoto
git remote add origin https://github.com/fantastkill/zotti-zotti.git

# Verificar se foi adicionado corretamente
git remote -v
```

### 3. Fazer Push para o GitHub

```bash
# Enviar código para o GitHub
git push -u origin main
```

**Nota:** Se o repositório já existir e tiver conteúdo, você pode precisar fazer:
```bash
git pull origin main --allow-unrelated-histories
# Resolver conflitos se houver
git push -u origin main
```

### 4. Ativar GitHub Pages

1. Acesse o repositório no GitHub: `https://github.com/fantastkill/zotti-zotti`
2. Vá em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**
4. Em **Source**, selecione:
   - **Branch:** `main`
   - **Folder:** `/ (root)` ou `/public_html` (dependendo de onde está o index.html)
5. Clique em **Save**

### 5. Acessar o Site

Após alguns minutos, o site estará disponível em:

**🌐 https://fantastkill.github.io/zotti-zotti/**

## 📁 Estrutura para GitHub Pages

**Opção 1: Usar pasta `public_html` como raiz**
- Configure GitHub Pages para usar a pasta `/public_html`
- URL: `https://fantastkill.github.io/zotti-zotti/`

**Opção 2: Mover arquivos para raiz (Recomendado)**
- Mova o conteúdo de `public_html/` para a raiz do repositório
- Configure GitHub Pages para usar `/ (root)`
- URL: `https://fantastkill.github.io/zotti-zotti/`

## ⚠️ Importante

- **Caminhos relativos:** Todos os caminhos já estão configurados como relativos (`assets/`, `public/`, etc.)
- **Arquivo `.nojekyll`:** Já foi criado na raiz para desabilitar Jekyll
- **Cache:** Após o deploy, pode levar alguns minutos para as mudanças aparecerem

## 🔄 Atualizações Futuras

Para atualizar o site após fazer mudanças:

```bash
git add .
git commit -m "Descrição das alterações"
git push origin main
```

O GitHub Pages atualiza automaticamente em alguns minutos.

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o repositório está público
2. Confirme que a branch `main` está selecionada
3. Verifique os logs em Settings > Pages
4. Aguarde alguns minutos para o deploy completar

