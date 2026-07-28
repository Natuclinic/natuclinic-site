import React from 'react';
import Unicon from '../components/Unicon';
import SEO from '../components/SEO';
// import { useArticles } from '../hooks/useArticles';

const Blog = ({ goBack, setCurrentPage, articles, loading }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [visibleCount, setVisibleCount] = React.useState(6);

    const safeArticles = articles || [];

    const categories = React.useMemo(() => {
        const seen = new Set();
        return safeArticles
            .map(a => a.category)
            .filter(c => c && !seen.has(c) && seen.add(c));
    }, [safeArticles]);

    const filteredArticles = safeArticles.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const featuredPost = filteredArticles[0];
    const otherPosts = filteredArticles.slice(1);
    const visiblePosts = otherPosts.slice(0, visibleCount);

    return (
        <div className="pt-36 pb-24 min-h-screen bg-white">
            <SEO
                title="Blog de Saúde e Estética — Natuclinic Brasília"
                description="Artigos sobre nutrição ortomolecular, estética, emagrecimento saudável e bem-estar. Conteúdo produzido pela equipe especialista da Natuclinic em Brasília."
                url="https://www.natuclinic.com.br/blog"
                canonical="https://www.natuclinic.com.br/blog"
                keywords="blog saúde brasília, nutrição ortomolecular, estética corporal, emagrecimento saudável"
            />
            <div className="desktop-container">

                {/* Header — título + busca na mesma linha */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-end gap-6 pb-8 border-b border-natu-brown/10">
                        {/* Title removed */}

                        <div className="lg:w-72 flex-shrink-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar artigos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-full font-sans text-sm focus:outline-none focus:ring-2 focus:ring-natu-brown/20 focus:bg-white transition-all"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-natu-brown/30">
                                    <Unicon name="search" size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtros de categoria */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-5 pb-12">
                            <button
                                onClick={() => setSearchTerm('')}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 ${
                                    !searchTerm
                                        ? 'bg-natu-brown text-white border-natu-brown'
                                        : 'border-natu-brown/20 text-natu-brown/50 hover:border-natu-brown/50 hover:text-natu-brown'
                                }`}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSearchTerm(searchTerm === cat ? '' : cat)}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-200 ${
                                        searchTerm === cat
                                            ? 'bg-natu-brown text-white border-natu-brown'
                                            : 'border-natu-brown/20 text-natu-brown/50 hover:border-natu-brown/50 hover:text-natu-brown'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Featured Post — editorial */}
                {featuredPost && !searchTerm && (
                    <article
                        onClick={() => setCurrentPage(featuredPost.slug || featuredPost.id)}
                        className="group cursor-pointer grid lg:grid-cols-[3fr_2fr] mb-20 rounded-2xl overflow-hidden lg:h-[480px]"
                    >
                        {/* Imagem */}
                        <div className="aspect-[16/9] lg:aspect-auto overflow-hidden">
                            <img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                        </div>

                        {/* Texto — cream bg */}
                        <div className="bg-white p-8 lg:p-10 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-[12px] font-medium text-natu-pink">
                                        Destaque
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-natu-brown/20" />
                                    <span className="text-[12px] font-medium text-natu-brown/40">
                                        {featuredPost.category}
                                    </span>
                                </div>

                                <h2 className="text-2xl lg:text-[28px] font-sans font-bold text-natu-brown leading-[1.2] mb-5">
                                    {featuredPost.title}
                                </h2>

                                <p className="font-sans font-light text-natu-brown/60 text-sm leading-relaxed line-clamp-4">
                                    {featuredPost.excerpt}
                                </p>
                            </div>

                            <div className="mt-10 flex items-center justify-between">
                                <span className="text-[12px] font-sans font-medium text-natu-brown/40">
                                    {featuredPost.date}
                                </span>
                                <span className="inline-flex items-center gap-2 px-6 py-3 bg-natu-brown text-white rounded-full text-[10px] font-bold uppercase tracking-[0.15em] group-hover:bg-black transition-colors duration-300">
                                    Ler artigo <Unicon name="arrow-right" size={12} />
                                </span>
                            </div>
                        </div>
                    </article>
                )}

                {/* Grid Header */}
                <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
                    <h2 className="text-base font-sans font-medium text-natu-brown/50">
                        {searchTerm ? `Resultados para "${searchTerm}"` : 'Artigos Recentes'}
                    </h2>
                </div>

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {(searchTerm ? filteredArticles.slice(0, visibleCount) : visiblePosts).map((post, i) => (
                        <article
                            key={i}
                            onClick={() => setCurrentPage(post.slug || post.id)}
                            className="group cursor-pointer flex flex-col h-full animate-in fade-in zoom-in duration-700"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="aspect-video overflow-hidden rounded-xl mb-8 relative">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            <div className="flex flex-col flex-grow px-2">
                                <div className="flex items-center gap-3 text-[11px] font-sans tracking-normal font-bold text-natu-brown/40 mb-4">
                                    <span className="text-natu-pink">{post.category}</span>
                                    <span>•</span>
                                    <span>{post.date}</span>
                                </div>

                                <h3 className="blog-title text-2xl text-black mb-4 group-hover:text-natu-pink transition-colors leading-tight">
                                    {post.title}
                                </h3>

                                <p className="font-sans font-light text-gray-500 mb-8 flex-grow line-clamp-3 text-sm leading-relaxed">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto">
                                    <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-natu-brown group-hover:gap-4 transition-all border-b border-natu-brown/20 pb-1">
                                        Ler Artigo <Unicon name="arrow-right" size={12} />
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Load More Button */}
                {(searchTerm ? filteredArticles.length : otherPosts.length) > visibleCount && (
                    <div className="mt-24 text-center">
                        <button
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="px-10 py-4 bg-white border-2 border-natu-brown text-natu-brown rounded-full font-sans font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-natu-brown hover:text-white transition-all duration-500"
                        >
                            Ver Mais Artigos
                        </button>
                    </div>
                )}

                {/* No Results */}
                {filteredArticles.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-gray-400 font-sans italic text-lg">Nenhum artigo encontrado com esses termos.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
