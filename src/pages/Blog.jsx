import React from 'react';
import Unicon from '../components/Unicon';
// import { useArticles } from '../hooks/useArticles';

const Blog = ({ goBack, setCurrentPage, articles, loading }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [visibleCount, setVisibleCount] = React.useState(6);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-[#FAFAFA] flex justify-center items-center">
                <Unicon name="spinner" className="w-10 h-10 text-natu-brown animate-spin" />
            </div>
        );
    }

    const filteredArticles = articles.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const featuredPost = filteredArticles[0];
    const otherPosts = filteredArticles.slice(1);
    const visiblePosts = otherPosts.slice(0, visibleCount - 1);

    return (
        <div className="pt-32 pb-24 min-h-screen bg-white">
            <div className="desktop-container">
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/40 block mb-4">
                        Blog Natuclinic
                    </span>
                    <h1 className="text-5xl md:text-7xl font-sans font-bold text-natu-brown mb-8">

                    </h1>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <input
                            type="text"
                            placeholder="Buscar artigos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-full font-sans text-sm focus:outline-none focus:ring-2 focus:ring-natu-brown/20 focus:bg-white transition-all"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-natu-brown/30">
                            <Unicon name="search" size={18} />
                        </div>
                    </div>
                </div>

                {/* Featured Post */}
                {featuredPost && !searchTerm && (
                    <article
                        onClick={() => setCurrentPage(featuredPost.slug || featuredPost.id)}
                        className="group cursor-pointer grid lg:grid-cols-2 gap-0 mb-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100/50 max-w-5xl mx-auto lg:h-[450px]"
                    >
                        <div className="aspect-video lg:aspect-auto overflow-hidden h-full">
                            <img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                            />
                        </div>
                        <div className="p-8 md:p-10 flex flex-col justify-center">
                            <div className="flex items-center gap-4 text-xs font-sans tracking-wider text-natu-brown/60 mb-6">
                                <span className="uppercase text-natu-pink font-bold">Destaque • {featuredPost.category}</span>
                                <span>•</span>
                                <span>{featuredPost.date}</span>
                            </div>
                            <h2 className="text-[22px] md:text-[28px] font-sans font-bold text-black mb-4 group-hover:text-natu-pink transition-colors leading-[1.2]">
                                {featuredPost.title}
                            </h2>
                            <p className="font-sans font-light text-gray-500 mb-6 text-base leading-relaxed line-clamp-3">
                                {featuredPost.excerpt}
                            </p>
                            <div>
                                <span className="inline-flex items-center gap-2 px-6 py-2.5 border border-black rounded-full text-[11px] font-bold uppercase tracking-[0.1em] text-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                                    Ler Artigo Completo <Unicon name="arrow-right" size={14} />
                                </span>
                            </div>
                        </div>
                    </article>
                )}

                {/* Grid Header */}
                <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
                    <h2 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-natu-brown/40">
                        {searchTerm ? `Resultados para "${searchTerm}"` : 'Artigos Recentes'}
                    </h2>
                </div>

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {(searchTerm ? filteredArticles : visiblePosts).map((post, i) => (
                        <article
                            key={i}
                            onClick={() => setCurrentPage(post.slug || post.id)}
                            className="group cursor-pointer flex flex-col h-full animate-in fade-in zoom-in duration-700"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="aspect-video overflow-hidden rounded-xl mb-8 relative border border-natu-brown/5">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>

                            <div className="flex flex-col flex-grow px-2">
                                <div className="flex items-center gap-4 text-[10px] font-sans tracking-[0.2em] font-bold text-natu-brown/40 mb-4 uppercase">
                                    <span className="text-natu-pink">{post.category}</span>
                                    <span>•</span>
                                    <span>{post.date}</span>
                                </div>

                                <h3 className="text-2xl font-sans font-bold text-black mb-4 group-hover:text-natu-pink transition-colors leading-tight">
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
                {!searchTerm && otherPosts.length > visibleCount - 1 && (
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
