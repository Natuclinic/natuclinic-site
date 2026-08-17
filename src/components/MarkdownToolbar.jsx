import React from 'react';
import Unicon from './Unicon';

const MarkdownToolbar = ({ textAreaRef, content, setContent, onOpenGallery }) => {

    const insertText = (before, after = '') => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
        
        setContent(newText);

        // Reset focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 0);
    };

    const tools = [
        { icon: 'bold', label: 'Negrito', action: () => insertText('**', '**') },
        { icon: 'italic', label: 'Itálico', action: () => insertText('*', '*') },
        { divider: true },
        { icon: 'text-size', label: 'Título H2', action: () => insertText('## ', '') },
        { icon: 'text', label: 'Título H3', action: () => insertText('### ', '') },
        { divider: true },
        { icon: 'list-ul', label: 'Lista', action: () => insertText('- ', '') },
        { icon: 'list-ol', label: 'Lista Numerada', action: () => insertText('1. ', '') },
        { divider: true },
        { icon: 'link', label: 'Link', action: () => insertText('[', '](https://)') },
    ];

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border border-gray-200 border-b-0 rounded-t-2xl">
            {tools.map((tool, idx) => {
                if (tool.divider) {
                    return <div key={`div-${idx}`} className="w-[1px] h-6 bg-gray-200 mx-1"></div>;
                }
                return (
                    <button
                        key={idx}
                        type="button"
                        onClick={tool.action}
                        className="p-2 text-gray-500 hover:text-natu-brown hover:bg-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-natu-brown/20"
                        title={tool.label}
                    >
                        <Unicon name={tool.icon} size={16} />
                    </button>
                );
            })}
            
            <div className="flex-1"></div>

            <button
                type="button"
                onClick={onOpenGallery}
                className="flex items-center gap-2 px-3 py-1.5 bg-natu-pink/10 text-natu-pink hover:bg-natu-pink hover:text-white rounded-lg transition-colors text-xs font-bold uppercase tracking-widest"
                title="Inserir Mídia da Galeria"
            >
                <Unicon name="image-plus" size={16} />
                <span className="hidden sm:inline">Adicionar Mídia</span>
            </button>
        </div>
    );
};

export default MarkdownToolbar;
