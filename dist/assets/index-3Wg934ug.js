(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}})();const g="/data/catalogo.json",d=document.querySelector("#app"),v=a=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(a);async function b(){const a=await fetch(g);if(!a.ok)throw new Error("Não foi possível carregar o catálogo.");return a.json()}function h(a){var i;const r=a.collections.flatMap(t=>t.arcs.flatMap(e=>e.books.map(o=>({...o,collectionTitle:t.title,arcTitle:e.title}))));return`
    <header class="topbar">
      <div class="container navbar">
        <div class="brand">FanVerse</div>
        <nav class="nav-links">
          <a href="#">Início</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#editor">Editar catálogo</a>
        </nav>
      </div>
    </header>

    <main class="container">
      <section class="hero">
        <div>
          <span class="tag">Coleções em crescimento</span>
          <h1>${((i=r[0])==null?void 0:i.title)||"FanVerse"}</h1>
          <p>Biblioteca digital, coleção de fanfics e uma base pronta para expandir em Vite e Vercel.</p>
          <div class="hero-actions">
            <a class="button" href="#catalogo">Ver catálogo</a>
            <a class="button button-secondary" href="#editor">Atualizar catálogo</a>
          </div>
        </div>
      </section>

      <section id="catalogo" class="section">
        <h2>Catálogo</h2>
        <div class="grid-3">
          ${r.map(t=>`
            <article class="card">
              <img class="cover" src="${t.cover}" alt="${t.title}" />
              <div class="card-body">
                <div class="meta-row">
                  <span>${t.collectionTitle}</span>
                  <span>${t.year}</span>
                </div>
                <h3>${t.title}</h3>
                <p>${t.description}</p>
                <div class="meta-row">
                  <span class="status available">${t.status}</span>
                  <span class="price">${v(t.price)}</span>
                </div>
              </div>
            </article>
          `).join("")}
        </div>
      </section>

      <section id="editor" class="section editor-block">
        <h2>Editar catálogo no site</h2>
        <p>Essa edição fica no JSON do catálogo e não mexe no código Java original em <strong>src/</strong>.</p>

        <form id="catalog-form">
          <label>
            Título do livro
            <input type="text" id="book-title" placeholder="Ex.: Novo livro" required />
          </label>
          <label>
            Coleção
            <input type="text" id="book-collection" placeholder="Ex.: Crônicas da Baluarte" required />
          </label>
          <label>
            Descrição
            <textarea id="book-description" rows="4" required></textarea>
          </label>
          <label>
            Preço
            <input type="number" id="book-price" min="0" step="0.01" value="19.99" required />
          </label>
          <button type="submit" class="button">Salvar no catálogo</button>
        </form>
      </section>
    </main>
  `}async function y(){try{const a=await b();d.innerHTML=h(a),document.querySelector("#catalog-form").addEventListener("submit",async i=>{i.preventDefault();const t=document.querySelector("#book-title").value.trim(),e=document.querySelector("#book-collection").value.trim(),o=document.querySelector("#book-description").value.trim(),s=Number(document.querySelector("#book-price").value),u={id:`novo-${Date.now()}`,title:t,description:o,type:"digital",price:s,status:"Ler agora",availability:"DIGITAL_DISPONIVEL",year:new Date().getFullYear(),chapters:1,cover:"https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",content:"Conteúdo adicionado diretamente pelo site. Este texto foi escrito no catálogo dinâmico e não altera a lógica Java original."},p={...a,collections:a.collections.map(c=>c.title.toLowerCase()===e.toLowerCase()?{...c,arcs:c.arcs.map((n,f)=>f===0?{...n,books:[...n.books,u]}:n)}:c)},l=await fetch("/api/catalogo",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)});if(!l.ok)throw new Error("Erro ao salvar o catálogo.");const m=await l.json();alert(m.message||"Catálogo atualizado com sucesso!"),window.location.reload()})}catch(a){d.innerHTML=`
      <main class="container">
        <section class="section">
          <div class="card error-box">
            <h2>Erro ao carregar o catálogo</h2>
            <p>${a.message}</p>
          </div>
        </section>
      </main>
    `}}y();
