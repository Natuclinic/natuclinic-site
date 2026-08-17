import React from 'react';
import Unicon from '../components/Unicon';
import SEO from '../components/SEO';
import CarouselAd from '../components/CarouselAd';
// import { useArticles } from '../hooks/useArticles';

const Blog = ({ goBack, setCurrentPage, articles, adConfig, loading }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [page, setPage] = React.useState(1);
    const POSTS_PER_PAGE = 6;

    const safeArticles = (articles || []).filter(post => post.category !== 'Internal_Config');

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

    const totalPages = Math.ceil(filteredArticles.length / POSTS_PER_PAGE);
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const visiblePosts = filteredArticles.slice(startIndex, startIndex + POSTS_PER_PAGE);

    React.useEffect(() => {
        setPage(1);
    }, [searchTerm]);

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
                </div>

                {/* Espaço para Anúncio Principal (Topo) */}
                {adConfig?.ads && adConfig.ads['ad-blog-top'] && adConfig.ads['ad-blog-top'].length > 0 && (
                    <div className="w-full rounded-2xl mt-8 mb-12 animate-in fade-in duration-700">
                        <CarouselAd ads={adConfig.ads['ad-blog-top']} rotationInterval={adConfig.settings?.rotationInterval} className="rounded-2xl" layout="horizontal" />
                    </div>
                )}

                {/* Main 12-col Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Left Column - Articles */}
                    <div className="lg:col-span-8 flex flex-col">
                        <div className="flex flex-col">
                            {visiblePosts.map((post, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <hr className="border-gray-100 my-8" />}
                                    <article
                                        onClick={() => setCurrentPage(post.slug || post.id)}
                                        className="group cursor-pointer flex flex-col sm:flex-row gap-6 lg:gap-8 animate-in fade-in zoom-in duration-700 items-start transition-colors pt-2"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <div className="w-full sm:w-[40%] aspect-[4/3] overflow-hidden rounded-xl relative shrink-0">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </div>
                                        
                                        <div className="w-full sm:w-[60%] flex flex-col py-1">
                                            <h3 className="blog-title text-xl lg:text-2xl text-natu-brown mb-3 group-hover:text-natu-pink transition-colors leading-tight font-bold">
                                                {post.title}
                                            </h3>
                                            
                                            {post.excerpt && (
                                                <p className="font-sans font-light text-gray-500 line-clamp-3 text-[13px] leading-relaxed mb-4">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                            
                                            <div className="flex items-center gap-1.5 text-[11px] font-sans text-gray-400 mt-auto">
                                                <span>{post.date}</span>
                                                <span>•</span>
                                                <span>Em {post.category}</span>
                                            </div>
                                        </div>
                                    </article>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Pagination UI */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex items-center justify-center gap-2">
                                <button 
                                    onClick={() => {
                                        setPage(prev => Math.max(1, prev - 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={page === 1}
                                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:border-natu-brown hover:text-natu-brown transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Unicon name="angle-left" size={20} />
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => {
                                            setPage(p);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${page === p ? 'bg-natu-brown text-white' : 'border border-gray-200 text-gray-500 hover:border-natu-brown hover:text-natu-brown'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                
                                <button 
                                    onClick={() => {
                                        setPage(prev => Math.min(totalPages, prev + 1));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    disabled={page === totalPages}
                                    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:border-natu-brown hover:text-natu-brown transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <Unicon name="angle-right" size={20} />
                                </button>
                            </div>
                        )}

                        {/* No Results */}
                        {filteredArticles.length === 0 && (
                            <div className="py-20 text-center border-t border-gray-100 mt-8">
                                <p className="text-gray-400 font-sans italic text-lg">Nenhum artigo encontrado com esses termos.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-10">
                        {/* Espaço Publicitário Lateral */}
                        {adConfig?.ads && adConfig.ads['ad-blog-sidebar'] && adConfig.ads['ad-blog-sidebar'].length > 0 && (
                            <div className="mt-8 animate-in fade-in duration-700 w-full">
                                <CarouselAd ads={adConfig.ads['ad-blog-sidebar']} rotationInterval={adConfig.settings?.rotationInterval} className="rounded-2xl border border-gray-100" />
                            </div>
                        )}

                        {/* Mais Lidas Widget */}
                        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-natu-brown/10">
                            <h3 className="font-sans font-bold text-natu-brown text-lg mb-6">Mais lidas</h3>
                            <div className="flex flex-col">
                                {[...safeArticles].sort((a, b) => {
                                    const viewsDiff = (b.views || 0) - (a.views || 0);
                                    if (viewsDiff !== 0) return viewsDiff;
                                    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                                }).slice(0, 4).map((post, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setCurrentPage(post.slug || post.id)}
                                        className="flex items-start gap-4 py-4 cursor-pointer group border-b border-natu-brown/10 last:border-0 last:pb-0 first:pt-0"
                                    >
                                        <span className="text-3xl font-sans font-light text-natu-brown/20 group-hover:text-natu-pink transition-colors">
                                            {idx + 1}
                                        </span>
                                        <h4 className="font-sans font-bold text-natu-brown text-[13px] leading-snug group-hover:text-natu-pink transition-colors pt-1.5">
                                            {post.title}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
