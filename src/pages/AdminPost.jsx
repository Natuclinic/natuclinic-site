import React, { useState, useEffect } from 'react';
import Unicon from '../components/Unicon';
import ImageUpload from '../components/ImageUpload';

const AdminPost = ({ goBack }) => {
    const [accessCode, setAccessCode] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [view, setView] = useState('list'); // 'list', 'edit', 'create', 'ad-config'
    const [articles, setArticles] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const initialForm = {
        id: '',
        title: '',
        category: 'Saúde Integrativa',
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        image: '',
        excerpt: '',
        content: '',
        author_name: 'Equipe Natuclinic',
        author_avatar: 'https://ui-avatars.com/api/?name=Natu+Clinic&background=4C261A&color=fff',
        meta_description: '',
        meta_keywords: '',
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        if (isAuthenticated) {
            fetchArticles();
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

    const handleLogin = (e) => {
        e.preventDefault();
        if (accessCode === 'natuclinic2026') {
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

        if (name === 'title' && !formData.id && view === 'create') {
            const slug = value.toLowerCase()
                .replace(/ /g, '-')
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w-]+/g, '');
            setFormData(prev => ({ ...prev, id: slug, slug: slug }));
        }
    };

    const triggerDeployHook = async () => {
        try {
            await fetch('https://api.vercel.com/v1/integrations/deploy/prj_cBqi949okdukHX34r5MAnvD5fHcx/OPesSy3UMD', {
                method: 'POST'
            });
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
                : `https://natuclinic-api.fabriccioarts.workers.dev/articles/${editingId}`;

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
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
            const response = await fetch(`https://natuclinic-api.fabriccioarts.workers.dev/articles/${id}`, {
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

    const openAdConfig = () => {
        const adArticle = articles.find(a => a.id === 'sidebar-ad-global');
        if (adArticle) {
            setFormData(adArticle);
            setEditingId('sidebar-ad-global');
            setView('ad-config-edit'); // Alterado para distinguir de criação
        } else {
            setFormData({
                ...initialForm,
                id: 'sidebar-ad-global',
                title: 'Global Sidebar Ad',
                category: 'Internal_Config',
                slug: 'sidebar-ad-global',
                excerpt: '', // Link
                image: '',   // Image
                content: 'active'
            });
            setEditingId('sidebar-ad-global');
            setView('ad-config-create'); // Alterado para distinguir
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl w-full max-w-sm text-center border border-gray-100">
                    <Unicon name="lock" size={48} className="text-natu-brown mx-auto mb-4 opacity-30" />
                    <h2 className="text-xl font-bold text-natu-brown mb-6">Acesso Restrito</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Código de Acesso"
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
        <div className="pt-32 pb-20 min-h-screen bg-gray-50 px-4">
            <div className="container max-w-4xl mx-auto p-4 md:p-10 bg-white rounded-3xl border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif text-natu-brown">
                            {view === 'list' ? 'Gerenciar Blog' :
                                view === 'edit' ? 'Editar Artigo' :
                                    view.startsWith('ad-config') ? 'Configurar Anúncio' : 'Novo Artigo'}
                        </h1>
                        <p className="text-xs text-natu-brown/40 uppercase tracking-widest font-bold mt-1">Painel Administrativo</p>
                    </div>

                    <div className="flex gap-2">
                        {view === 'list' ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setFormData(initialForm); setView('create'); }}
                                    className="bg-natu-brown text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all font-sans"
                                >
                                    <Unicon name="plus" size={14} /> Novo Post
                                </button>
                                <button
                                    onClick={openAdConfig}
                                    className="bg-natu-pink text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-all font-sans"
                                >
                                    <Unicon name="image" size={14} /> Anúncio Lateral
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setView('list')}
                                className="bg-gray-100 text-gray-500 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Cancelar
                            </button>
                        )}
                        <button onClick={goBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-natu-pink transition-colors ml-4">Voltar ao Site</button>
                    </div>
                </div>

                {status.message && view !== 'list' && (
                    <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                        {status.type === 'success' ? <Unicon name="check-circle" size={20} className="text-green-500" /> : <Unicon name="exclamation-circle" size={20} className="text-red-500" />}
                        <span className="text-sm font-sans">{status.message}</span>
                    </div>
                )}

                {view === 'list' ? (
                    <div className="overflow-hidden">
                        {loading && articles.length === 0 ? (
                            <div className="py-20 text-center text-gray-400">Carregando artigos...</div>
                        ) : articles.length === 0 ? (
                            <div className="py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">Nenhum artigo encontrado.</div>
                        ) : (
                            <div className="grid gap-4">
                                {articles.map(article => (
                                    <div key={article.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200/50 hover:border-natu-brown/20 transition-all group">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                                <img src={article.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className="font-bold text-natu-brown text-sm truncate max-w-xs">
                                                    {article.id === 'sidebar-ad-global' ? <span className="text-natu-pink font-bold">[ANÚNCIO] </span> : ''}
                                                    {article.title}
                                                </h3>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                                                    {article.id === 'sidebar-ad-global' ? (article.content === 'active' ? '🟢 ATIVO' : '🔴 INATIVO') : article.category} • {article.date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto">
                                            <button
                                                onClick={() => article.id === 'sidebar-ad-global' ? openAdConfig() : startEdit(article)}
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
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {view.startsWith('ad-config') ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="p-6 bg-natu-pink/5 border border-natu-pink/10 rounded-2xl">
                                    <h3 className="text-sm font-bold text-natu-pink uppercase tracking-widest mb-2">Configuração do Anúncio</h3>
                                    <p className="text-xs text-natu-brown/60 leading-relaxed">Este anúncio aparecerá na lateral direita de todos os artigos, abaixo do sumário. Mantenha a proporção de 3:4 para melhores resultados.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Botão de On/Off</label>
                                    <select
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none"
                                    >
                                        <option value="active">Ativado</option>
                                        <option value="inactive">Desativado</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Link do Anúncio (URL)</label>
                                    <input
                                        required
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none"
                                        placeholder="https://wa.me/... ou /procedimentos/..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Banner do Anúncio (Proporção 3:4)</label>
                                    <ImageUpload onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} />
                                    <input
                                        required
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-mono"
                                        placeholder="URL da imagem (será preenchida automaticamente após o upload)"
                                    />
                                    {formData.image && (
                                        <div className="mt-4 w-48 aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                                            <img src={formData.image} alt="Preview do Anúncio" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-gray-100 italic text-[10px] text-gray-400">
                                    * Nota: Ao salvar, o site passará por um novo deploy para atualizar o banner globalmente.
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
                                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-natu-brown/10 outline-none transition-all font-serif text-xl"
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
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Conteúdo (Markdown)</label>
                                        <span className="text-[9px] bg-natu-pink/10 text-natu-pink px-2 py-0.5 rounded font-bold">EDITOR ATIVO</span>
                                    </div>
                                    <textarea
                                        required
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        rows="12"
                                        className="w-full p-6 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-natu-brown/10 outline-none font-mono text-sm leading-relaxed"
                                        placeholder="# Título\n\nSeu texto aqui...\n\n![Imagem](link-da-imagem)"
                                    />
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

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.01] active:scale-95 transition-all flex justify-center items-center gap-3 ${view === 'edit' || view.startsWith('ad-config') ? 'bg-natu-pink text-white' : 'bg-natu-brown text-white'}`}
                        >
                            {loading ? <Unicon name="spinner" className="animate-spin" size={16} /> : (
                                <>
                                    {view.startsWith('ad-config') ? 'Salvar Configurações do Anúncio' : view === 'edit' ? 'Atualizar Artigo' : 'Publicar Agora'}
                                    <Unicon name="check" size={14} />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminPost;
