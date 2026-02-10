# Guia de Sincronização com GitHub (Novo Computador)

Este documento detalha os passos realizados para conectar os arquivos locais deste computador ao repositório oficial no GitHub, garantindo que o histórico seja preservado e as alterações possam ser enviadas.

## Passo a Passo Realizado

### 1. Configuração de Identidade
O Git precisa saber quem está fazendo as alterações. Configuramos o nome e e-mail global:
```powershell
git config user.name "fabriccioarts-pixel"
git config user.email "fabriccioarts@gmail.com"
```

### 2. Preparação do Histórico Local
Como os arquivos estavam em uma pasta mas não tinham commits locais vinculados ao histórico remoto, primeiro adicionamos os arquivos ao sistema de controle:
```powershell
# Adiciona todos os arquivos atuais para o próximo commit
git add .

# Cria um commit inicial para marcar o estado atual deste computador
git commit -m "chore: connect local files from new computer"
```

### 3. União das Histórias (Merge Unrelated Histories)
Este é o passo mais crítico. Como o GitHub tem uma história e o seu computador tinha outra (zerada), o Git normalmente proíbe a união. Forçamos a conexão com:
```powershell
# Busca as informações mais recentes do GitHub
git fetch origin

# Mescla o que está no GitHub com o seu PC, permitindo histórias diferentes
git pull origin main --allow-unrelated-histories --no-edit
```

### 4. Envio Final (Push)
Com as histórias unidas e sincronizadas, enviamos os dados de volta para o servidor:
```powershell
git push origin main
```

---

## Como usar daqui para frente?

Agora que a conexão foi estabelecida, você só precisará dos comandos básicos do dia a dia:

*   **Para baixar mudanças do GitHub:** `git pull origin main`
*   **Para salvar novas mudanças:**
    1. `git add .`
    2. `git commit -m "descrição da mudança"`
    3. `git push origin main`

---
*Gerado automaticamente em 07/02/2026 para documentar a configuração do ambiente.*
