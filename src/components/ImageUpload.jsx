import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import Unicon from './Unicon';

const ImageUpload = ({ onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileUpload = async (file) => {
        if (!file) return;

        try {
            setUploading(true);

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `blog-images/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('articles') // Ensure this bucket exists in Supabase
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data } = supabase.storage
                .from('articles')
                .getPublicUrl(filePath);

            if (onUploadSuccess) {
                onUploadSuccess(data.publicUrl);
            }

            // Success vibration/effect
            setPreview(data.publicUrl);

        } catch (error) {
            console.error('Error uploading image:', error.message);
            alert('Falha ao subir imagem. Verifique o Supabase Storage.');
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
        <div className="w-full">
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
                        <p className="text-xs font-bold text-natu-brown/40 uppercase tracking-widest">Enviando...</p>
                    </div>
                ) : preview ? (
                    <div className="relative group w-full aspect-video rounded-xl overflow-hidden shadow-inner">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(preview);
                                    alert('Link copiado!');
                                }}
                                className="p-3 bg-white rounded-full text-natu-brown hover:scale-110 transition-transform"
                                title="Copiar Link"
                            >
                                <Unicon name="check" size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    setPreview(null);
                                }}
                                className="p-3 bg-white text-red-500 rounded-full hover:scale-110 transition-transform"
                                title="Remover"
                            >
                                <Unicon name="times" size={20} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Unicon name="upload" size={32} className="text-natu-brown/20 mb-4" />
                        <p className="text-sm font-sans text-natu-brown/60 mb-2">
                            Arraste ou <span className="text-natu-pink font-bold cursor-pointer">escolha uma imagem</span>
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-natu-brown/30 font-bold">PNG, JPG ou WEBP até 2MB</p>
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
                <div className="mt-4 p-4 bg-natu-brown/5 rounded-xl border border-natu-brown/10">
                    <p className="text-[10px] font-bold text-natu-brown uppercase tracking-widest mb-2">Link gerado para o Markdown:</p>
                    <code className="text-[10px] block p-2 bg-white rounded border border-gray-100 overflow-x-auto whitespace-nowrap">
                        {`![Descrição]( ${preview} )`}
                    </code>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
