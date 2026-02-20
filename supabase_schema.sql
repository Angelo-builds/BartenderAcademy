
-- 1. PULIZIA E RESET POLICIES (Non cancella i dati, solo i permessi)
ALTER TABLE IF EXISTS cocktails ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS theory ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Cocktails" ON cocktails;
DROP POLICY IF EXISTS "Admin Write Cocktails" ON cocktails;
DROP POLICY IF EXISTS "Public Read Theory" ON theory;
DROP POLICY IF EXISTS "Admin Write Theory" ON theory;
DROP POLICY IF EXISTS "Public Read Certificates" ON certificates;
DROP POLICY IF EXISTS "Admin Write Certificates" ON certificates;
DROP POLICY IF EXISTS "Public Read Config" ON site_config;
DROP POLICY IF EXISTS "Admin Write Config" ON site_config;

-- 2. CREAZIONE TABELLE (Idempotente: crea solo se non esistono)
CREATE TABLE IF NOT EXISTS site_config (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "homeHeroImage" text,
  "homeTitle" text,
  "homeSubtitle" text,
  "homeSubtitleEn" text,
  "homeQuote" text,
  "theoryHeroImage" text,
  "theoryTitle" text,
  "theorySubtitle" text,
  "distillatesHeroImage" text,
  "distillatesTitle" text,
  "distillatesSubtitle" text,
  "ollamaUrl" text -- NEW: Dynamic URL for Ollama LXC
);

CREATE TABLE IF NOT EXISTS cocktails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  image text,
  method text,
  glass text,
  ingredients jsonb, -- IMPORTANTE: JSONB
  garnish text,
  category text,
  era text,
  notes text,
  status text DEFAULT 'published',
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS theory (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  content text,
  category text,
  image text,
  status text DEFAULT 'published',
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  section text,
  date text,
  description text,
  image text,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. CORREZIONE TIPI (Forza ingredients a JSONB se è stato creato come text)
DO $$
BEGIN
  BEGIN
    ALTER TABLE cocktails ALTER COLUMN ingredients TYPE jsonb USING ingredients::jsonb;
  EXCEPTION
    WHEN OTHERS THEN NULL; -- Ignora se fallisce (es. se è già corretto)
  END;
END $$;

-- 4. APPLICAZIONE POLICIES (Lettura pubblica, Scrittura solo admin loggato)
CREATE POLICY "Public Read Cocktails" ON cocktails FOR SELECT USING (true);
CREATE POLICY "Public Read Theory" ON theory FOR SELECT USING (true);
CREATE POLICY "Public Read Certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public Read Config" ON site_config FOR SELECT USING (true);

CREATE POLICY "Admin Write Cocktails" ON cocktails FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Theory" ON theory FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Certificates" ON certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Write Config" ON site_config FOR ALL USING (auth.role() = 'authenticated');

-- FINE SCRIPT
