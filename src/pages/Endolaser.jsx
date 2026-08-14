import React from 'react';
import BlogPostGeneric from './BlogPostGeneric';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';

const Endolaser = ({ goBack }) => {
    const navigate = useNavigate();
    const { articles } = useArticles();

    const post = {
        id: "endolaser",
        title: "Endolaser em Brasília: Laser Subdérmico para Flacidez, Papada e Contorno",
        image: "/images/blog-images/Blog-image-endolaser.jpg",
        author_name: "Natuclinic",
        excerpt: "Conheça o Endolaser (Laserlipólise 1470nm) na Natuclinic. Tratamento inovador para flacidez, papada, jowl e gordura localizada em Brasília e Taguatinga.",
        content: `
O Cenário
## Você fez tudo certo. Mas algo ainda incomoda.

Seja com canetas emagrecedoras, cirurgia bariátrica ou após a gestação, o resultado na balança veio. Mas, ao se olhar no espelho, a flacidez, a **papada** e aquele contorno (jowl) que parece não “assentar” persistem.

> **Isso não é falha sua. É uma resposta fisiológica. O corpo emagrece, mas a pele e o tecido de sustentação nem sempre acompanham esse ritmo.**

<br/>

A Solução Tecnológica
## O que é o Endolaser (Laser Subdérmico)?

O **Endolaser**, também conhecido como Laserlipólise ou *Endolift*, é uma tecnologia minimamente invasiva que utiliza uma fibra óptica ultrafina introduzida sob a pele (na hipoderme superficial). Na Natuclinic (Brasília e Taguatinga), utilizamos a tecnologia de laser com comprimento de onda específico (1470nm) que foca na fototermólise seletiva. 

O que isso significa? A energia do laser tem atração dupla: **água e gordura**. O resultado é o derretimento da gordura localizada (lipólise) e a **contração imediata da pele** (retração cutânea) com forte estímulo de novo colágeno.

### Benefícios Exclusivos do Endolaser
* **Ação Dupla:** Elimina gordura e trata a flacidez na mesma sessão.
* **Retração de Pele (Skin Tightening):** Estímulo intenso de colágeno novo e contração imediata das fibras existentes.
* **Minimamente Invasivo:** Realizado com anestesia local tumescente, sem necessidade de centro cirúrgico ou anestesia geral.
* **Resultados Duradouros:** A gordura destruída não retorna àquelas células, e o colágeno continua sendo produzido por meses.

---

## Para quem é especialmente indicado?

**Rosto, Papada e Jowl (Contorno da Mandíbula)**
Ideal para redefinir o contorno facial, eliminar o "queixo duplo" e tratar a flacidez do pescoço, devolvendo o aspecto jovem ao rosto.

**Pós-Emagrecimento e Pós-Bariátrica**
Pessoas que usaram canetas emagrecedoras (como Ozempic/Mounjaro) e notaram flacidez abdominal ou corporal resistente.

**Pós-Gestação**
Mulheres buscando recuperar a firmeza abdominal e tratar a diástase associada à flacidez cutânea.

**Gordura Resistente (Flancos, Braços e Interno de Coxa)**
Para quem tem áreas de gordura localizada que não desaparecem nem com dieta e treino, precisando de definição inteligente.

---

## O Diferencial Natuclinic em Brasília e Taguatinga

Nós não tratamos apenas a flacidez de forma isolada. Avaliamos a sua saúde metabólica e nutricional para garantir que o seu tecido tenha **capacidade real de regeneração**. Combinamos o Endolaser com protocolos injetáveis e ortomoleculares quando necessário, entregando resultados superiores.

---

<details>
<summary>O que é o Endolaser e como ele é diferente de outros tratamentos?</summary>
<div className="faq-content">
O Endolaser (Laser Subdérmico) introduz uma fibra óptica diretamente sob a pele. Diferente de ultrassom ou radiofrequência externa, a energia age <em>dentro</em> do tecido, derretendo a gordura e causando uma retração real e profunda da pele na mesma sessão.
</div>
</details>

<details>
<summary>O Endolaser dói? Precisa de anestesia?</summary>
<div className="faq-content">
O procedimento é super tolerável. Utilizamos <strong>anestesia local tumescente</strong> na área tratada, o que torna o processo praticamente indolor. Você fica acordado e confortável durante toda a sessão. Não há necessidade de anestesia geral.
</div>
</details>

<details>
<summary>Qual a diferença entre Endolaser e Endolift?</summary>
<div className="faq-content">
<em>Endolift®</em> é o nome comercial de um equipamento/marca específica pioneira nessa técnica na Itália. <em>Endolaser</em> ou <em>Laser Subdérmico</em> é o nome do procedimento (a tecnologia a laser por fibra óptica). O princípio de ação (lipólise e retração cutânea via laser de diodo) é exatamente o mesmo.
</div>
</details>

<details>
<summary>Quantas sessões são necessárias?</summary>
<div className="faq-content">
Na imensa maioria dos casos de papada, contorno facial e áreas corporais localizadas, <strong>apenas 1 sessão</strong> é necessária para atingir o resultado esperado. O resultado final se consolida entre 3 a 6 meses.
</div>
</details>

<details>
<summary>Qual o tempo de recuperação (downtime)?</summary>
<div className="faq-content">
A recuperação é rápida. Há inchaço (edema) nos primeiros dias e, dependendo da área, o uso de malha compressiva pode ser indicado por 15 a 30 dias. A maioria dos pacientes retorna às suas atividades de trabalho normais em 24 a 48 horas.
</div>
</details>
`
    };

    return (
        <BlogPostGeneric 
            goBack={goBack || (() => navigate(-1))} 
            post={post} 
            articles={articles} 
            setCurrentPage={(id) => navigate(`/blog/${id}`)} 
        />
    );
};

export default Endolaser;
