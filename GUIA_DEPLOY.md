# Guia de Deploy na Vercel

Este guia descreve o passo a passo para colocar o site Natuclinic no ar usando a Vercel.

## 1. Pré-requisitos
Como o comando `git` não foi reconhecido no seu terminal, você precisará instalá-lo primeiro.

1.  **Baixar e Instalar o Git**:
    *   Acesse [git-scm.com/downloads](https://git-scm.com/downloads).
    *   Baixe a versão para Windows e instale (pode aceitar as opções padrão clicando em "Next").
    *   **Importante**: Após instalar, reinicie o VS Code ou o terminal para que o comando funcione.

2.  **Conta no GitHub**: Crie uma conta em [github.com](https://github.com) se não tiver.
3.  **Conta na Vercel**: Crie uma conta em [vercel.com](https://vercel.com) (pode fazer login com o GitHub).

## 2. Preparar o Projeto

No seu terminal (dentro da pasta do projeto), execute os seguintes comandos um por um:

```bash
# 1. Inicializar o repositório (apenas se ainda não fez)
git init

# 2. Adicionar os arquivos
git add .

# 3. Salvar a versão atual
git commit -m "Versão para deploy na Vercel"
```

## 3. Enviar para o GitHub

1.  Crie um **novo repositório** no GitHub (pode chamar de `natuclinic-site`).
2.  Não marque a opção "Initialize with README".
3.  Copie os comandos que o GitHub mostrar na seção "...or push an existing repository from the command line". Eles serão parecidos com isso:

```bash
git remote add origin https://github.com/SEU_USUARIO/natuclinic-site.git
git branch -M main
git push -u origin main
```

## 4. Conectar na Vercel

1.  Acesse seu painel na Vercel ("Dashboard").
2.  Clique em **"Add New..."** > **"Project"**.
3.  Selecione "Import" ao lado do repositório `natuclinic-site` que você acabou de criar.

## 5. Configuração Crítica (Variáveis de Ambiente)

Essa é a parte mais importante para o site funcionar.

1.  Na tela de configuração da Vercel (Configure Project), abra a aba **"Environment Variables"**.
2.  Adicione as chaves que estão no seu arquivo `.env` local:

    *   **Nome**: `VITE_SUPABASE_URL`
        *   **Valor**: (Copie do seu arquivo .env)
    *   **Nome**: `VITE_SUPABASE_ANON_KEY`
        *   **Valor**: (Copie do seu arquivo .env)

3.  Clique em **Deploy**.

## 6. Atualização Automática
Sempre que quiser atualizar o site via GitHub, basta rodar:
```bash
git add .
git commit -m "Nova atualização"
git push
```
A Vercel detectará a mudança e atualizará o site automaticamente.

## 7. Deploy Manual (Caso o GitHub falhe)
Se o GitHub estiver com erro de permissão ou você quiser subir os arquivos direto do seu PC:

1.  **Instalar a Vercel**: No terminal, digite `npm install -g vercel` (só na primeira vez).
2.  **Entrar na Conta**: Digite `vercel login` e siga o link no navegador.
3.  **Subir o Site**: Vá na pasta do projeto e digite:
    ```bash
    vercel --prod
    ```
    *   Siga as instruções (pode dar Enter para as opções padrão).
    *   Isso sobe o que está no seu computador agora direto para o ar.

---

### Notas
*   O arquivo `vercel.json` já foi criado para garantir que a navegação funcione.
