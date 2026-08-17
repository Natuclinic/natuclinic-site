import React, { useState, useEffect, useMemo } from 'react';
import Unicon from './Unicon';
import ImageUpload from './ImageUpload';

const MediaGalleryModal = ({ isOpen, onClose, articles, onSelectImage, onRefresh, currentFormData, onRemoveImage }) => {
    const [view, setView] = useState('gallery'); // 'gallery' or 'upload'
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e, url) => {
        e.stopPropagation();
        const confirmDelete = window.confirm('ATENÇÃO: Apagar esta imagem a removerá do servidor permanentemente. Ela ficará quebrada no site se ainda estiver no texto de algum artigo. Tem certeza?');
        if (!confirmDelete) return;

        setIsDeleting(true);
        try {
            let filename = '';
            
            // Tenta fazer parse como URL absoluta (ex: https://dominio.com/images/nome.jpg)
            try {
                const urlObj = new URL(url);
                const pathParts = urlObj.pathname.split('/');
                filename = pathParts[pathParts.length - 1];
            } catch (e) {
                // Se não for URL válida (ex: "x" ou "/images/nome.jpg"), tenta pegar a última parte separada por barra
                const pathParts = url.split('/');
                filename = pathParts[pathParts.length - 1];
            }
            
            if (!filename || filename === url) {
                // Se filename for igual ao url e não tem '/', provavelmente é um erro de digitação como "x" no markdown
                if (onRemoveImage) {
                    onRemoveImage(url);
                    alert('O link inválido foi removido do texto do artigo que você está editando!');
                    return;
                }
                throw new Error("O link desta imagem é inválido ou ela não está hospedada no servidor da clínica.");
            }

            try {
                const response = await fetch(`https://natuclinic-api.fabriccioarts.workers.dev/images/${filename}`, {
                    method: 'DELETE'
                });
                
                // Mesmo se o servidor retornar erro (ex: 404 não encontrado), tentamos remover do texto localmente
                if (onRemoveImage) {
                    onRemoveImage(url);
                }

                if (!response.ok) {
                    console.warn('Falha ao apagar do servidor, possivelmente já não existia.');
                }
                
                alert('Imagem apagada do servidor e removida do texto deste artigo (se estivesse nele). Lembre-se de salvar o artigo!');
            } catch (serverError) {
                console.error('Erro na requisição de deleção:', serverError);
                if (onRemoveImage) {
                    onRemoveImage(url);
                    alert('Imagem removida do texto do artigo. Erro ao contatar servidor: ' + serverError.message);
                } else {
                    throw serverError;
                }
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao apagar imagem: ' + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    // Extract all unique images from articles
    const images = useMemo(() => {
        const urlSet = new Set();
        const imageList = [];

        // Helper function to extract from a post object
        const extractImages = (post, isCurrent = false) => {
            if (!post) return;
            
            // 1. Extract cover image
            if (post.image && !urlSet.has(post.image)) {
                urlSet.add(post.image);
                imageList.push({ url: post.image, alt: post.title || 'Capa', source: isCurrent ? 'Editando Agora (Capa)' : 'Capa do Artigo', articleTitle: post.title });
            }

            // 2. Extract images from content (Markdown syntax: ![alt](url))
            if (post.content) {
                const regex = /!\[([^\]]*)\]\(([^)]+)\)/g;
                let match;
                while ((match = regex.exec(post.content)) !== null) {
                    const alt = match[1];
                    const url = match[2];
                    if (url && !urlSet.has(url)) {
                        urlSet.add(url);
                        imageList.push({ url, alt: alt || 'Imagem do texto', source: isCurrent ? 'Editando Agora' : 'Conteúdo do Artigo', articleTitle: post.title });
                    }
                }
            }
        };

        // Extract from currently editing post first (so they appear at the top/are prioritized)
        if (currentFormData) {
            extractImages(currentFormData, true);
        }

        if (articles) {
            articles.forEach(article => {
                // Ignore the saved version of the currently edited article so we don't pull deleted images from it
                if (currentFormData && article.id === currentFormData.id) return;
                
                extractImages(article);
            });
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return imageList.filter(img => img.url.toLowerCase().includes(term) || img.alt.toLowerCase().includes(term));
        }

        return imageList;
    }, [articles, currentFormData, searchTerm]);

    const handleRefresh = async () => {
        if (!onRefresh) return;
        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setIsRefreshing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <Unicon name="images" size={24} className="text-natu-pink" />
                        <div>
                            <h2 className="text-lg font-bold text-natu-brown">Biblioteca de Mídia</h2>
                            <p className="text-xs text-gray-500 font-sans">Selecione ou faça upload de imagens para o post.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-200 hover:text-natu-brown rounded-full transition-colors">
                        <Unicon name="times" size={20} />
                    </button>
                </div>

                {/* Tabs & Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-100 gap-4">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            onClick={() => setView('gallery')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex-1 sm:flex-none ${view === 'gallery' ? 'bg-natu-brown text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            Galeria ({images.length})
                        </button>
                        <button
                            onClick={() => setView('upload')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex-1 sm:flex-none ${view === 'upload' ? 'bg-natu-pink text-white' : 'bg-pink-50 text-natu-pink hover:bg-pink-100'}`}
                        >
                            Novo Upload
                        </button>
                    </div>

                    {view === 'gallery' && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="h-[38px] w-[38px] flex items-center justify-center shrink-0 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-natu-brown hover:bg-white transition-colors disabled:opacity-50"
                                title="Recarregar imagens"
                            >
                                <Unicon name="sync" size={16} className={isRefreshing ? 'animate-spin' : ''} />
                            </button>
                            <div className="relative flex-1 sm:w-64">
                                <Unicon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar imagem..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-natu-pink/20 outline-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    {view === 'upload' ? (
                        <div className="max-w-xl mx-auto py-8">
                            <div className="text-center mb-6">
                                <h3 className="font-bold text-natu-brown mb-2">Fazer Upload de Nova Imagem</h3>
                                <p className="text-xs text-gray-500">Ao finalizar o upload, a imagem será inserida automaticamente no texto.</p>
                            </div>
                            <ImageUpload 
                                onUploadSuccess={(url) => {
                                    onSelectImage(url, 'Imagem inserida');
                                    onClose();
                                }} 
                            />
                        </div>
                    ) : (
                        images.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <Unicon name="image-broken" size={48} className="mb-4 opacity-50" />
                                <p className="font-bold">Nenhuma imagem encontrada</p>
                                <p className="text-xs mt-1">Faça um novo upload para começar.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => {
                                            onSelectImage(img.url, img.alt);
                                            onClose();
                                        }}
                                        className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200 cursor-pointer hover:border-natu-pink hover:shadow-lg hover:shadow-natu-pink/10 transition-all"
                                    >
                                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                        
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-natu-brown/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                                            <Unicon name="plus-circle" size={32} className="text-white mb-2" />
                                            <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center mb-2">Inserir no Post</span>
                                            {img.articleTitle && (
                                                <span className="text-[10px] text-gray-300 text-center leading-tight">
                                                    Usada em:<br/> <b className="text-white">{img.articleTitle}</b>
                                                </span>
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(e, img.url)}
                                            disabled={isDeleting}
                                            className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all z-10 disabled:opacity-50"
                                            title="Apagar imagem do servidor"
                                        >
                                            <Unicon name={isDeleting ? 'spinner' : 'trash'} size={14} className={isDeleting ? 'animate-spin' : ''} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>

            </div>
        </div>
    );
};

export default MediaGalleryModal;
