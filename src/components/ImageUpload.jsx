import React, { useState } from 'react';
import Unicon from './Unicon';

const ImageUpload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [altText, setAltText] = useState('');

    const handleFileUpload = async (file) => {
        if (!file) return;

        try {
            setUploading(true);

            // Send via FormData (most compatible with browsers)
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('https://natuclinic-api.fabriccioarts.workers.dev/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `Erro ${response.status}`);
            }

            const data = await response.json();

            if (onUploadSuccess) {
                onUploadSuccess(data.url);
            }

            setPreview(data.url);

        } catch (error) {
            console.error('Error uploading image:', error.message);
            alert('Falha ao subir imagem: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) handleFileUpload(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div
                className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] ${dragActive ? 'border-natu-pink bg-natu-pink/5 scale-[1.02]' : 'border-gray-200 bg-gray-50'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Unicon name="spinner" size={32} className="text-natu-pink animate-spin" />
                        <p className="text-xs font-bold text-natu-brown/40 uppercase tracking-widest">Enviando para Cloudflare...</p>
                    </div>
                ) : preview ? (
                    <div className="relative group w-full aspect-video rounded-xl overflow-hidden shadow-inner bg-white">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(preview);
                                    alert('Link copiado!');
                                }}
                                className="p-3 bg-white rounded-full text-natu-brown hover:scale-110 transition-transform shadow-lg"
                                title="Copiar Link"
                            >
                                <Unicon name="check" size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    setPreview(null);
                                    setAltText('');
                                }}
                                className="p-3 bg-white text-red-500 rounded-full hover:scale-110 transition-transform shadow-lg"
                                title="Remover"
                            >
                                <Unicon name="trash" size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Unicon name="upload" size={32} className="text-natu-brown/20 mb-4" />
                        <p className="text-sm font-sans text-natu-brown/60 mb-2">
                            Arraste ou <span className="text-natu-pink font-bold cursor-pointer">escolha uma imagem</span>
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-natu-brown/30 font-bold">Cloudflare R2 (Mais rápido & Melhor SEO)</p>
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={onFileChange}
                            accept="image/*"
                        />
                    </>
                )}
            </div>

            {preview && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div>
                        <label className="block text-[10px] font-bold text-natu-brown uppercase tracking-widest mb-2 flex items-center gap-2">
                            Texto Alternativo (SEO)
                            <span className="text-natu-pink font-normal lowercase opacity-60">Recomendado</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Dra. fulana realizando procedimento de endolaser"
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-natu-pink/10 outline-none transition-all"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                        />
                    </div>

                    <div className="p-4 bg-natu-brown/5 rounded-xl border border-natu-brown/10">
                        <p className="text-[10px] font-bold text-natu-brown uppercase tracking-widest mb-2">Código para colar no Blog:</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 text-[10px] block p-2 bg-white rounded border border-gray-100 overflow-x-auto whitespace-nowrap font-mono">
                                {`![${altText || 'Descrição da imagem'}]( ${preview} )`}
                            </code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`![${altText || 'Descrição da imagem'}](${preview})`);
                                    alert('Markdown copiado!');
                                }}
                                className="p-2 bg-natu-brown text-white rounded-lg hover:opacity-90 transition-all"
                            >
                                <Unicon name="copy" size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
