-- SQL Schema for Sharktank DSM
-- Run these commands in your Supabase SQL Editor

-- 1. Editions Table
CREATE TABLE public.st_editions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year TEXT NOT NULL,
    semester TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    theme_primary_color TEXT DEFAULT '#ef4444',
    theme_secondary_color TEXT DEFAULT '#fecaca',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. About Table (Stats and description for an edition)
CREATE TABLE public.st_about (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    edition_id UUID REFERENCES public.st_editions(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    highlighted_text TEXT,
    stats JSONB DEFAULT '[]'::jsonb, -- Array of objects: {value: "30+", label: "Projetos", icon: "Rocket"}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.1 Hero Table
CREATE TABLE public.st_hero (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    edition_id UUID REFERENCES public.st_editions(id) ON DELETE CASCADE,
    title_part1 TEXT DEFAULT 'SHARK',
    title_part2 TEXT DEFAULT 'TANK',
    title_part3 TEXT DEFAULT 'DSM',
    subtitle_line1 TEXT DEFAULT 'ONDE',
    subtitle_highlighted1 TEXT DEFAULT 'TUBARÕES DA PROGRAMAÇÃO',
    subtitle_line2 TEXT DEFAULT 'SE ENCONTRAM',
    subtitle_line3 TEXT DEFAULT 'COM A',
    subtitle_highlighted2 TEXT DEFAULT 'TECNOLOGIA DO FUTURO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2 Future Table
CREATE TABLE public.st_future (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    edition_id UUID REFERENCES public.st_editions(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'O FUTURO É',
    highlighted_title TEXT DEFAULT 'AGORA',
    description TEXT DEFAULT 'O SharkTank DSM é apenas o começo de uma jornada épica. Prepare-se para as próximas edições ainda mais impressionantes!',
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Phases Table
CREATE TABLE public.st_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    edition_id UUID REFERENCES public.st_editions(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    highlighted_subtitle TEXT,
    description TEXT,
    overview_title TEXT,
    overview_description TEXT,
    overview_tag TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Winners Table (Linked to Phase)
CREATE TABLE public.st_winners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phase_id UUID REFERENCES public.st_phases(id) ON DELETE CASCADE,
    position INTEGER NOT NULL, -- 1 = Champion, 2 = Vice, etc.
    medal TEXT NOT NULL,
    name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    votes INTEGER DEFAULT 0,
    video_url TEXT,
    members JSONB DEFAULT '[]'::jsonb, -- Array of {name: "...", role: "..."}
    differentials JSONB DEFAULT '[]'::jsonb, -- Array of strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Awards Table
CREATE TABLE public.st_awards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    edition_id UUID REFERENCES public.st_editions(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    title TEXT NOT NULL,
    prize TEXT NOT NULL,
    icon TEXT NOT NULL,
    emoji TEXT NOT NULL,
    image_url TEXT,
    extras JSONB DEFAULT '[]'::jsonb, -- Array of strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Workshops Table
CREATE TABLE public.st_workshops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    edition_id UUID REFERENCES public.st_editions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    speaker TEXT NOT NULL,
    speaker_role TEXT NOT NULL,
    speaker_image TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'upcoming', -- 'upcoming', 'live', 'recorded'
    video_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Gallery Table
CREATE TABLE public.st_gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    edition_id UUID REFERENCES public.st_editions(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    category TEXT DEFAULT 'Geral',
    span_cols INTEGER DEFAULT 1,
    span_rows INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security
ALTER TABLE public.st_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.st_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.st_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.st_future ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.st_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.st_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.st_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.st_workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.st_gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on st_editions" ON public.st_editions FOR SELECT USING (true);
CREATE POLICY "Allow public read access on st_about" ON public.st_about FOR SELECT USING (true);
CREATE POLICY "Allow public read access on st_hero" ON public.st_hero FOR SELECT USING (true);
CREATE POLICY "Allow public read access on st_future" ON public.st_future FOR SELECT USING (true);
CREATE POLICY "Allow public read access on st_phases" ON public.st_phases FOR SELECT USING (true);
CREATE POLICY "Allow public read access on st_winners" ON public.st_winners FOR SELECT USING (true);
CREATE POLICY "Allow public read access on st_awards" ON public.st_awards FOR SELECT USING (true);
CREATE POLICY "Allow public read access on st_workshops" ON public.st_workshops FOR SELECT USING (true);
CREATE POLICY "Allow public read access on st_gallery" ON public.st_gallery FOR SELECT USING (true);

-- Allow authenticated full access
CREATE POLICY "Allow authenticated full access on st_editions" ON public.st_editions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on st_about" ON public.st_about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on st_hero" ON public.st_hero FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on st_future" ON public.st_future FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on st_phases" ON public.st_phases FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on st_winners" ON public.st_winners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on st_awards" ON public.st_awards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on st_workshops" ON public.st_workshops FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on st_gallery" ON public.st_gallery FOR ALL USING (auth.role() = 'authenticated');
