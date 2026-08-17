import React, { useState, useEffect, useRef } from 'react';
import Unicon from '../components/Unicon';
import ImageUpload from '../components/ImageUpload';
import BlogPostGeneric from './BlogPostGeneric';
import MediaGalleryModal from '../components/MediaGalleryModal';
import MDEditor from '@uiw/react-md-editor';

const AdminPost = ({ goBack }) => {
    const [accessCode, setAccessCode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [view, setView] = useState('list'); // 'list', 'edit', 'create', 'ad-config', 'settings'
    const [articles, setArticles] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [leads, setLeads] = useState([]);
    const [loadingLeads, setLoadingLeads] = useState(false);
    
    // Novas variáveis de estado
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [submitAction, setSubmitAction] = useState('publish');
    const textAreaRef = useRef(null);
    const articlesPerPage = 10;


    const initialForm = {
        id: '',
        title: '',
        category: 'Saúde Integrativa',
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        image: '',
        excerpt: '',
        content: '',
        author_name: 'Equipe Natuclinic',
        author_avatar: '/images/blog-images/avatar-natuclinic-blog.jpg',
        meta_description: '',
        meta_keywords: '',
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (isAuthenticated) {
            fetchArticles();
            fetchLeads();
        }
    }, [isAuthenticated]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://natuclinic-api.fabriccioarts.workers.dev/articles');
            if (!response.ok) throw new Error('Falha ao buscar artigos do Cloudflare');
            const data = await response.json();
            setArticles(data || []);
        } catch (err) {
            console.error('Erro ao buscar artigos:', err);
            setStatus({ type: 'error', message: 'Erro ao carregar artigos do Cloudflare D1.' });
        } finally {
            setLoading(false);
        }
    };

    const fetchLeads = async () => {
        setLoadingLeads(true);
        try {
            const response = await fetch('https://natuclinic-api.fabriccioarts.workers.dev/leads');
            if (!response.ok) throw new Error('Falha ao buscar leads do Cloudflare');
            const data = await response.json();
            setLeads(data || []);
        } catch (err) {
            console.error('Erro ao buscar leads:', err);
        } finally {
            setLoadingLeads(false);
        }
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm('Tem certeza que deseja apagar este lead?')) return;
        setLoadingLeads(true);
        try {
            const response = await fetch(`https://natuclinic-api.fabriccioarts.workers.dev/leads/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Falha ao deletar lead');
            fetchLeads();
            alert('Lead removido com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar lead:', err);
            alert('Erro ao deletar lead: ' + err.message);
        } finally {
            setLoadingLeads(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const adminCode = import.meta.env.VITE_ADMIN_CODE;
        if (adminCode && accessCode === adminCode) {
            setIsAuthenticated(true);
        } else {
            alert('Código incorreto');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'title' && view === 'create') {
            const slug = value.toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w-]+/g, '');
            setFormData(prev => ({ ...prev, id: slug, slug: slug }));
        }
    };

    const triggerDeployHook = async () => {
        try {
            const hookSetting = articles.find(a => a.id === 'deploy-settings');
            const hookUrl = (hookSetting && hookSetting.content !== 'undefined') ? hookSetting.content : import.meta.env.VITE_VERCEL_HOOK;
            
            if (!hookUrl || hookUrl === 'undefined' || hookUrl.trim() === '') {
                console.warn('Nenhum Deploy Hook configurado.');
                return;
            }

            await fetch(hookUrl, { method: 'POST' });
            console.log('Deploy hook triggered successfully');
        } catch (err) {
            console.error('Failed to trigger deploy hook:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const isAdCreate = view === 'ad-config-create';
            const method = (view === 'create' || isAdCreate) ? 'POST' : 'PUT';
            const url = (view === 'create' || isAdCreate)
                ? 'https://natuclinic-api.fabriccioarts.workers.dev/articles'
                : `https://natuclinic-api.fabriccioarts.workers.dev/articles/${encodeURIComponent(editingId)}`;

            const payload = { ...formData };
            
            // Handle Drafts for articles
            if (!view.startsWith('ad-config')) {
                if (submitAction === 'draft') {
                    if (!payload.category.startsWith('Draft_')) {
                        payload.category = `Draft_${payload.category}`;
                    }
                } else if (submitAction === 'publish') {
                    if (payload.category.startsWith('Draft_')) {
                        payload.category = payload.category.replace('Draft_', '');
                    }
                }
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao salvar artigo');
            }

            setStatus({
                type: 'success',
                message: view === 'create' ? 'Artigo publicado com sucesso!' : 'Artigo atualizado com sucesso!'
            });

            // Trigger Vercel Deploy Hook to update static fallback if needed
            triggerDeployHook();

            setFormData(initialForm);
            setEditingId(null);
            setView('list');
            fetchArticles();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Erro ao salvar:', error);
            setStatus({ type: 'error', message: `Erro: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja apagar este artigo?')) return;

        setLoading(true);
        try {
            const response = await fetch(`https://natuclinic-api.fabriccioarts.workers.dev/articles/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Falha ao deletar artigo');

            // Trigger Vercel Deploy Hook
            triggerDeployHook();

            fetchArticles();
            alert('Artigo removido com sucesso!');
        } catch (err) {
            console.error('Erro ao deletar:', err);
            alert('Erro ao deletar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (article) => {
        setFormData(article);
        setEditingId(article.id);
        setView('edit');
    };
    const switchAdConfig = (adId = null) => {
        if (adId && adId !== 'new') {
            const adArticle = articles.find(a => a.id === adId);
            if (adArticle) {
                setFormData(adArticle);
                setEditingId(adId);
                setView('ad-config-edit');
                return;
            }
        }
        
        // New Ad
        const newId = `ad-${Date.now()}`;
        setFormData({
            ...initialForm,
            id: newId,
            title: '',
            meta_description: '',
            meta_keywords: '',
            author_name: 'black', // Store color theme here
            category: 'Internal_Ad',
            slug: 'ad-blog-top', // Default placement
            image: '',
            excerpt: '',
            content: 'active'
        });
        setEditingId(newId);
        setView('ad-config-create');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl w-full max-w-sm text-center border border-gray-100">
                    <Unicon name="lock" size={48} className="text-natu-brown mx-auto mb-4 opacity-30" />
                    <h2 className="text-xl font-bold text-natu-brown mb-6">Acesso Restrito</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <label htmlFor="admin-access-code" className="sr-only">Código de Acesso</label>
                        <input
                            id="admin-access-code"
                            name="access-code"
                            type="password"
                            placeholder="Código de Acesso"
                            autoComplete="current-password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-natu-brown/20 text-center"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value)}
                        />
                        <button type="submit" className="w-full bg-natu-brown text-white py-3 rounded-lg font-bold hover:opacity-90 transition-all">
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar (Desktop) */}
            <aside className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 z-20 shrink-0 hidden md:flex ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>
                {/* Logo / Toggle */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
                    {isSidebarExpanded && <span className="font-bold text-natu-brown text-lg tracking-tight">Natuclinic</span>}
                    <button 
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} 
                        className={`p-1.5 rounded-md text-gray-400 hover:text-natu-brown hover:bg-gray-100 transition-colors ${!isSidebarExpanded && 'mx-auto'}`}
                        title={isSidebarExpanded ? "Encolher menu" : "Expandir menu"}
                    >
                        <Unicon name={isSidebarExpanded ? "angle-left" : "bars"} size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
                    <button 
                        onClick={() => setView('list')} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${view === 'list' ? 'bg-natu-brown/5 text-natu-brown font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} ${!isSidebarExpanded && 'justify-center'}`}
                        title="Artigos"
                    >
                        <Unicon name="file-alt" size={20} className={view === 'list' ? 'text-natu-brown' : 'text-gray-400'} />
                        {isSidebarExpanded && <span className="text-sm">Artigos</span>}
                    </button>
                    <button 
                        onClick={() => setView('leads')} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${view === 'leads' ? 'bg-natu-brown/5 text-natu-brown font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} ${!isSidebarExpanded && 'justify-center'}`}
                        title="Leads"
                    >
                        <Unicon name="users-alt" size={20} className={view === 'leads' ? 'text-natu-brown' : 'text-gray-400'} />
                        {isSidebarExpanded && <span className="text-sm">Leads</span>}
                    </button>
                    <button 
                        onClick={() => setView('ads-list')} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${view === 'ads-list' ? 'bg-natu-brown/5 text-natu-brown font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} ${!isSidebarExpanded && 'justify-center'}`}
                        title="Banners"
                    >
                        <Unicon name="megaphone" size={20} className={view === 'ads-list' ? 'text-natu-brown' : 'text-gray-400'} />
                        {isSidebarExpanded && <span className="text-sm">Banners</span>}
                    </button>
                    <button 
                        onClick={() => setIsGalleryOpen(true)} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${!isSidebarExpanded && 'justify-center'}`}
                        title="Galeria de Mídia"
                    >
                        <Unicon name="image" size={20} className="text-gray-400" />
                        {isSidebarExpanded && <span className="text-sm">Galeria</span>}
                    </button>
                    <button 
                        onClick={() => setView('settings')} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${view === 'settings' ? 'bg-natu-brown/5 text-natu-brown font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'} ${!isSidebarExpanded && 'justify-center'}`}
                        title="Configurações"
                    >
                        <Unicon name="setting" size={20} className={view === 'settings' ? 'text-natu-brown' : 'text-gray-400'} />
                        {isSidebarExpanded && <span className="text-sm">Configurações</span>}
                    </button>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-100 shrink-0">
                    <button 
                        onClick={goBack} 
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors text-gray-500 hover:text-red-600 hover:bg-red-50 ${!isSidebarExpanded && 'justify-center'}`}
                        title="Sair do Painel"
                    >
                        <Unicon name="sign-out-alt" size={20} />
                        {isSidebarExpanded && <span className="text-sm font-medium">Sair</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Header (Only visible on small screens) */}
            <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-30 flex items-center justify-between px-4">
                <span className="font-bold text-natu-brown text-lg">Natuclinic</span>
                <div className="flex gap-2">
                    <button onClick={() => setView('list')} className="p-2 text-gray-500"><Unicon name="file-alt" size={20} /></button>
                    <button onClick={() => setView('leads')} className="p-2 text-gray-500"><Unicon name="users-alt" size={20} /></button>
                    <button onClick={() => setView('ads-list')} className="p-2 text-gray-500"><Unicon name="megaphone" size={20} /></button>
                    <button onClick={() => setIsGalleryOpen(true)} className="p-2 text-gray-500"><Unicon name="image" size={20} /></button>
                    <button onClick={() => setView('settings')} className="p-2 text-gray-500"><Unicon name="setting" size={20} /></button>
                    <button onClick={goBack} className="p-2 text-red-500"><Unicon name="sign-out-alt" size={20} /></button>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto pt-16 md:pt-0">
                <div className="p-4 md:p-8 lg:p-10 w-full max-w-6xl mx-auto">
                    
                    {/* Content Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                                {view === 'list' ? 'Artigos do Blog' :
                                    view === 'leads' ? 'Leads Capturados' :
                                    view === 'ads-list' ? 'Banners de Anúncios' :
                                    view === 'preview' ? 'Preview' :
                                    view === 'edit' ? 'Editar Artigo' :
                                    view.startsWith('ad-config') ? 'Configurar Anúncio' : 
                                    view === 'settings' ? 'Configurações' : 'Novo Artigo'}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">Gerencie os conteúdos do seu site</p>
                        </div>

                        {/* Top Right Action Buttons */}
                        <div className="flex items-center gap-3">
                            {['list', 'leads', 'ads-list', 'settings'].includes(view) ? (
                                <button
                                    onClick={() => { setFormData(initialForm); setView('create'); }}
                                    className="bg-natu-brown text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#6c4b3a] transition-all shadow-sm"
                                >
                                    <Unicon name="plus" size={18} /> Novo Post
                                </button>
                            ) : view === 'preview' ? (
                                <button
                                    onClick={() => setView(editingId ? 'edit' : 'create')}
                                    className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <Unicon name="arrow-left" size={18} /> Voltar para Edição
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setView('preview')}
                                        className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm hidden sm:flex"
                                    >
                                        <Unicon name="eye" size={18} /> Preview
                                    </button>
                                    <button
                                        onClick={() => setView('list')}
                                        className="bg-white border border-gray-200 text-red-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-50 transition-all shadow-sm"
                                    >
                                        Cancelar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {status.message && view !== 'list' && (
                    <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                        {status.type === 'success' ? <Unicon name="check-circle" size={20} className="text-green-500" /> : <Unicon name="exclamation-circle" size={20} className="text-red-500" />}
                        <span className="text-sm font-sans">{status.message}</span>
                    </div>
                )}

                {view === 'ads-list' ? (
                    <div className="overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-natu-brown text-lg">Campanhas Ativas</h2>
                            <button onClick={() => switchAdConfig('new')} className="bg-natu-pink text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90">
                                <Unicon name="plus" size={14} /> Criar Anúncio
                            </button>
                        </div>

                        {/* Tempo de Rotação Global */}
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-8 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-sm text-natu-brown">Tempo de Rotação (Carrossel)</h3>
                                <p className="text-xs text-gray-500">O intervalo em segundos para trocar de banner nos espaços com mais de um anúncio ativo.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    min="1"
                                    className="w-16 p-2 text-center rounded-lg border border-gray-200 text-sm font-bold"
                                    defaultValue={articles.find(a => a.id === 'ad-settings')?.content ? parseInt(articles.find(a => a.id === 'ad-settings').content) / 1000 : 5}
                                    onBlur={async (e) => {
                                        const secs = parseInt(e.target.value) || 5;
                                        try {
                                            await fetch('https://natuclinic-api.fabriccioarts.workers.dev/articles/ad-settings', {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ id: 'ad-settings', category: 'Internal_Config', content: String(secs * 1000), title: 'Settings', slug: 'settings', excerpt: 'time' })
                                            });
                                            alert('Tempo de rotação atualizado!');
                                        } catch (error) {}
                                    }}
                                />
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Segundos</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {articles.filter(a => a.category === 'Internal_Ad' || a.id.includes('ad-global') || (a.id.startsWith('ad-') && a.id !== 'ad-settings')).map(ad => (
                                <div 
                                    key={ad.id} 
                                    onClick={() => switchAdConfig(ad.id)}
                                    className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:border-natu-pink/30 hover:shadow-sm transition-all cursor-pointer group"
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                                        {ad.image ? <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center"><Unicon name="image" className="text-gray-300" /></div>}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-natu-brown text-sm group-hover:text-natu-pink transition-colors">{ad.title || 'Anúncio Sem Título'}</h3>
                                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Posição: {ad.slug === 'sidebar-ad-global' ? 'Global Lateral' : ad.slug === 'ad-blog-top' ? 'Blog Topo' : 'Blog Lateral'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${ad.content === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {ad.content === 'active' ? 'Ligado' : 'Desligado'}
                                        </span>
                                        <div className="p-2 text-natu-pink bg-natu-pink/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Unicon name="edit" size={16} />
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(ad.id); }} 
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Excluir Anúncio"
                                        >
                                            <Unicon name="trash" size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : view === 'leads' ? (
                    <div className="overflow-hidden bg-white border border-gray-100 rounded-3xl">
                        <div className="p-6 bg-blue-50/50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="font-bold text-natu-brown text-lg">Últimos Contatos</h2>
                                <p className="text-xs text-gray-500">Lista completa de leads capturados pelo site.</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Data</th>
                                        <th className="px-6 py-4">Nome</th>
                                        <th className="px-6 py-4">Contato</th>
                                        <th className="px-6 py-4">Origem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {leads.length === 0 && !loadingLeads ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-400">Nenhum lead encontrado no banco de dados.</td>
                                        </tr>
                                    ) : (
                                        leads.map(lead => {
                                            const formattedDate = new Date(lead.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                                            return (
                                                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">{formattedDate}</td>
                                                    <td className="px-6 py-4 font-bold text-natu-brown">{lead.name}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-900 font-medium">{lead.phone}</span>
                                                            <span className="text-gray-400 text-xs">{lead.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                            {lead.source}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => handleDeleteLead(lead.id)}
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Excluir Lead"
                                                        >
                                                            <Unicon name="trash" size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : view === 'settings' ? (
                    <div className="overflow-hidden bg-white border border-gray-100 rounded-3xl p-6">
                        <div className="mb-6 flex items-center gap-3 text-natu-brown">
                            <Unicon name="setting" size={24} />
                            <div>
                                <h2 className="font-bold text-lg">Configurações do Sistema</h2>
                                <p className="text-xs text-gray-500">Ajustes globais e integrações.</p>
                            </div>
                        </div>

                        <div className="space-y-6 max-w-xl">
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                                <h3 className="font-bold text-sm text-natu-brown mb-2 flex items-center gap-2">
                                    <Unicon name="server" size={16} /> Vercel Deploy Hook
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">
                                    Cole a URL do seu Deploy Hook da Vercel. Isso permite que o site se atualize sozinho automaticamente quando você salvar ou apagar um artigo.
                                </p>
                                
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="https://api.vercel.com/v1/integrations/deploy/..."
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-xs font-mono"
                                        defaultValue={articles.find(a => a.id === 'deploy-settings')?.content || ''}
                                        onBlur={async (e) => {
                                            const url = e.target.value;
                                            try {
                                                await fetch('https://natuclinic-api.fabriccioarts.workers.dev/articles/deploy-settings', {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ id: 'deploy-settings', category: 'Internal_Config', content: url, title: 'Deploy', slug: 'deploy', excerpt: 'webhook' })
                                                });
                                                alert('Webhook Vercel salvo!');
                                            } catch (error) {}
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : view === 'list' ? (
                    <div className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <div className="relative w-full sm:w-64">
                                <Unicon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar artigo..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-natu-pink/20 outline-none"
                                />
                            </div>
                        </div>
                        
                        {loading && articles.length === 0 ? (
                            <div className="py-20 text-center text-gray-400">Carregando artigos...</div>
                        ) : articles.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">Nenhum artigo encontrado.</div>
                        ) : (
                            <div className="grid gap-4">
                                {(() => {
                                    const listArticles = articles.filter(a => a.category !== 'Internal_Ad' && a.category !== 'Internal_Config' && a.id !== '/preenchimento-acido-hialuronico/');
                                    const filtered = listArticles.filter(a => (a.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
                                    const totalPages = Math.ceil(filtered.length / articlesPerPage) || 1;
                                    const paginated = filtered.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage);
                                    
                                    if (filtered.length === 0) return <div className="py-10 text-center text-gray-400">Nenhum artigo corresponde à busca.</div>;

                                    return (
                                        <>
                                            {paginated.map(article => {
                                                const isDraft = (article.category || '').startsWith('Draft_');
                                                const displayCategory = isDraft ? article.category.replace('Draft_', '') : article.category;
                                                return (
                                                    <div key={article.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-natu-brown/30 hover:bg-gray-50/50 transition-all duration-300 group">
                                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0 relative">
                                                                <img src={article.image} alt="" className="w-full h-full object-cover" />
                                                                {isDraft && <div className="absolute inset-0 bg-orange-500/20 mix-blend-multiply"></div>}
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-medium text-natu-brown text-sm truncate max-w-xs">
                                                                        {article.title}
                                                                    </h3>
                                                                    {isDraft && <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">Rascunho</span>}
                                                                </div>
                                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                                                                    {displayCategory} • {article.date}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto">
                                                            <button
                                                                onClick={() => startEdit(article)}
                                                                className="flex-1 md:flex-none p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-natu-brown hover:border-natu-brown transition-all"
                                                                title="Editar"
                                                            >
                                                                <Unicon name="edit" size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(article.id)}
                                                                className="flex-1 md:flex-none p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 transition-all"
                                                                title="Apagar"
                                                            >
                                                                <Unicon name="trash" size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            
                                            {/* Pagination Controls */}
                                            {totalPages > 1 && (
                                                <div className="flex justify-center items-center gap-4 mt-6">
                                                    <button 
                                                        disabled={currentPage === 1}
                                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                                        className="p-2 text-gray-500 hover:text-natu-brown disabled:opacity-30 transition-colors"
                                                    >
                                                        <Unicon name="angle-left" size={24} />
                                                    </button>
                                                    <span className="text-xs font-bold text-gray-400">Página {currentPage} de {totalPages}</span>
                                                    <button 
                                                        disabled={currentPage === totalPages}
                                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                                        className="p-2 text-gray-500 hover:text-natu-brown disabled:opacity-30 transition-colors"
                                                    >
                                                        <Unicon name="angle-right" size={24} />
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                ) : view === 'preview' ? (
                    <div className="-mx-4 md:-mx-10 mt-8 rounded-3xl overflow-hidden border border-gray-200 relative bg-white" style={{ minHeight: '80vh' }}>
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[999] shadow-[inset_0_0_0_4px_rgba(236,72,153,0.5)]"></div>
                        <BlogPostGeneric 
                            post={formData} 
                            articles={articles}
                            adConfig={articles.find(a => a.id === 'sidebar-ad-global')}
                            goBack={() => setView(editingId ? 'edit' : 'create')}
                            setCurrentPage={() => {}}
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {view.startsWith('ad-config') ? (
                            <div className="bg-natu-pink/5 rounded-2xl p-6 border border-natu-pink/20">
                                <div className="mb-6 flex items-center gap-3 text-natu-pink">
                                    <Unicon name="bullseye" size={24} />
                                    <div>
                                        <h3 className="font-bold text-lg">Gerenciador de Banners</h3>
                                        <p className="text-xs text-gray-500 font-sans">Configure os anúncios exibidos no blog e nos artigos.</p>
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nome do Anúncio (Controle Interno)</label>
                                    <input
                                        required
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold text-natu-brown"
                                        placeholder="Ex: Campanha Dia das Mães"
                                    />
                                </div>
                                
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Posicionamento</label>
                                    <select
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold text-natu-brown"
                                    >
                                        <option value="ad-blog-top">Banner Principal do Topo (Blog) - 1200x250</option>
                                        <option value="ad-blog-sidebar">Banner Lateral Menor (Blog) - 300x250</option>
                                        <option value="sidebar-ad-global">Banner Lateral Global (Artigos) - 300x400</option>
                                    </select>
                                    <p className="text-[10px] text-gray-400 mt-2 font-sans">
                                        *Respeite as dimensões sugeridas (L x A) para garantir que a imagem não fique distorcida ou cortada.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Imagem do Banner</label>
                                        <ImageUpload onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} />
                                        <input
                                            required
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            className="w-full p-3 mt-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-[10px] font-mono"
                                            placeholder="URL da imagem (faça o upload acima)"
                                        />
                                        {formData.image && (
                                            <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 max-w-sm">
                                                <img src={formData.image} alt="Preview do Ad" className="w-full h-auto" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Link de Destino</label>
                                        <input
                                            required
                                            type="text"
                                            name="excerpt"
                                            value={formData.excerpt}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-mono"
                                            placeholder="Ex: https://wa.me/556199999999"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">A URL que o usuário será direcionado ao clicar.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cor de Fundo do Texto</label>
                                        <select
                                            name="author_name"
                                            value={formData.author_name === 'brown' ? 'brown' : 'black'}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold text-natu-brown"
                                        >
                                            <option value="black">Preto (Padrão)</option>
                                            <option value="brown">Marrom (Natuclinic)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Copy (Texto Principal)</label>
                                        <input
                                            type="text"
                                            name="meta_description"
                                            value={formData.meta_description || ''}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold text-natu-brown"
                                            placeholder="Ex: Injetáveis devem responder a uma necessidade real."
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">Texto que vai aparecer por cima da imagem (opcional).</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Texto do Botão (CTA)</label>
                                        <input
                                            type="text"
                                            name="meta_keywords"
                                            value={formData.meta_keywords || ''}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold text-natu-brown"
                                            placeholder="Ex: Conhecer soroterapia"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">Texto do link de ação (opcional).</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status de Exibição</label>
                                        <select
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-pink/20 outline-none text-sm font-bold"
                                        >
                                            <option value="active">🟢 Ligado (Exibir no site)</option>
                                            <option value="inactive">🔴 Desligado (Ocultar)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Título do Artigo</label>
                                        <input
                                            required
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none transition-all font-sans font-bold text-natu-brown text-xl"
                                            placeholder="Ex: Tudo sobre Endolaser"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Slug (URL)</label>
                                        <input
                                            required
                                            name="id"
                                            value={formData.id}
                                            onChange={handleChange}
                                            disabled={view === 'edit'}
                                            className={`w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none font-mono text-xs ${view === 'edit' ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'}`}
                                            placeholder="slug-do-artigo"
                                        />
                                        {view === 'edit' && <p className="text-[9px] text-gray-400 mt-1">* Slugs não podem ser editados para manter SEO.</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Categoria</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none cursor-pointer text-sm"
                                        >
                                            <option>Saúde Integrativa</option>
                                            <option>Estética Avançada</option>
                                            <option>Nutrição</option>
                                            <option>Tratamentos</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Mídia e Imagens</label>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-bold text-natu-pink uppercase block">1. Imagem de Capa</span>
                                            <ImageUpload onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} />
                                            <input
                                                required
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-mono"
                                                placeholder="URL da imagem..."
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase block">2. Upload para Conteúdo</span>
                                            <ImageUpload />
                                            <p className="text-[9px] text-gray-400 italic">Use este campo para gerar links de imagens secundárias.</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Resumo (Excerpt)</label>
                                    <textarea
                                        required
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        rows="2"
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none text-sm"
                                        placeholder="Breve descrição para o card do blog..."
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-col">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Conteúdo (Markdown)</label>
                                            <p className="text-[9px] text-natu-brown/40 mt-1 uppercase font-bold tracking-wider">
                                                💡 FAQ Premium: Use <code className="bg-gray-100 px-1">&lt;details&gt;&lt;summary&gt;Pergunta?&lt;/summary&gt;Resposta&lt;/details&gt;</code>
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsGalleryOpen(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-natu-pink/10 text-natu-pink hover:bg-natu-pink hover:text-white rounded-xl transition-colors text-xs font-bold uppercase tracking-widest"
                                        >
                                            <Unicon name="image" size={16} />
                                            <span>Adicionar Mídia</span>
                                        </button>
                                    </div>
                                    <div data-color-mode="light" className="border border-gray-200 rounded-2xl overflow-hidden">
                                        <MDEditor
                                            value={formData.content}
                                            onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                                            height={500}
                                            textareaProps={{
                                                placeholder: "# Título\n\nSeu texto aqui...",
                                                id: "md-editor-textarea"
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Meta Description (SEO)</label>
                                        <textarea
                                            name="meta_description"
                                            value={formData.meta_description}
                                            onChange={handleChange}
                                            rows="2"
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none text-xs"
                                            placeholder="Descrição para o Google..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Keywords (SEO)</label>
                                        <textarea
                                            name="meta_keywords"
                                            value={formData.meta_keywords}
                                            onChange={handleChange}
                                            rows="2"
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none text-xs"
                                            placeholder="tags, separadas, por, virgula"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-gray-100">
                            {!view.startsWith('ad-config') && (
                                <button
                                    type="submit"
                                    onClick={() => setSubmitAction('draft')}
                                    disabled={loading}
                                    className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-[1.01] active:scale-95 transition-all flex justify-center items-center gap-2 border-2 border-natu-brown text-natu-brown bg-transparent`}
                                >
                                    <Unicon name="file-alt" size={14} />
                                    Salvar Rascunho
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={() => setSubmitAction('publish')}
                                disabled={loading}
                                className={`flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:scale-[1.01] active:scale-95 transition-all flex justify-center items-center gap-2 ${view === 'edit' || view.startsWith('ad-config') ? 'bg-natu-pink text-white' : 'bg-natu-brown text-white'}`}
                            >
                                {loading ? <Unicon name="spinner" className="animate-spin" size={16} /> : (
                                    <>
                                        <Unicon name="check" size={14} />
                                        {view.startsWith('ad-config') ? 'Salvar Anúncio' : view === 'edit' ? 'Publicar Atualização' : 'Publicar Agora'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
                </div>
            </main>

            <MediaGalleryModal 
                isOpen={isGalleryOpen} 
                onClose={() => setIsGalleryOpen(false)} 
                articles={articles} 
                onSelectImage={(url, alt) => {
                    const textarea = document.getElementById('md-editor-textarea');
                    const markdown = `![${alt}](${url})`;

                    if (textarea) {
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const newText = formData.content.substring(0, start) + markdown + formData.content.substring(end);
                        setFormData(prev => ({ ...prev, content: newText }));
                        setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(start + markdown.length, start + markdown.length);
                        }, 0);
                    } else {
                        // Fallback if textarea not found
                        setFormData(prev => ({ ...prev, content: prev.content + '\n' + markdown }));
                    }
                }} 
            />
        </div>
    );
};

export default AdminPost;
