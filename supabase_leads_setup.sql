-- Script SQL para criar a tabela de leads no Supabase
-- Execute este script no SQL Editor do seu dashboard Supabase

-- 1. Criar a tabela
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    source TEXT DEFAULT 'website'
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Criar política para permitir inserções públicas (qualquer um pode se cadastrar)
CREATE POLICY "Permitir inserção pública de leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- 4. Impedir leitura pública (apenas o admin vê os dados pelo dashboard)
-- Por padrão, sem política de SELECT, ninguém tem acesso de leitura via API.
