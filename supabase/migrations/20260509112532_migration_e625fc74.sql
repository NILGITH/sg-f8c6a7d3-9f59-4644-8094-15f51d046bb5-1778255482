-- Table slider (hero slides)
CREATE TABLE slider (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  order_position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table editions (villes du festival)
CREATE TABLE editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'past')),
  description TEXT,
  image TEXT,
  is_origin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table programs (programmes par ville)
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id TEXT NOT NULL,
  city TEXT NOT NULL,
  dates TEXT NOT NULL,
  events JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table gallery (photos)
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  caption TEXT,
  category TEXT,
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table reservations (billetterie)
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  ticket_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table blog (articles)
CREATE TABLE blog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  category TEXT,
  author TEXT DEFAULT 'Festival des Grillades',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table partners (partenaires)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  website TEXT,
  category TEXT NOT NULL CHECK (category IN ('principal', 'support')),
  order_position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE slider ENABLE ROW LEVEL SECURITY;
ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- RLS Policies - T2 (Public read, auth write) for admin tables
CREATE POLICY "public_read_slider" ON slider FOR SELECT USING (true);
CREATE POLICY "auth_insert_slider" ON slider FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update_slider" ON slider FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_delete_slider" ON slider FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "public_read_editions" ON editions FOR SELECT USING (true);
CREATE POLICY "auth_insert_editions" ON editions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update_editions" ON editions FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_delete_editions" ON editions FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "public_read_programs" ON programs FOR SELECT USING (true);
CREATE POLICY "auth_insert_programs" ON programs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update_programs" ON programs FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_delete_programs" ON programs FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "public_read_gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "auth_insert_gallery" ON gallery FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update_gallery" ON gallery FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_delete_gallery" ON gallery FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "public_read_blog" ON blog FOR SELECT USING (true);
CREATE POLICY "auth_insert_blog" ON blog FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update_blog" ON blog FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_delete_blog" ON blog FOR DELETE USING (auth.uid() IS NOT NULL);

CREATE POLICY "public_read_partners" ON partners FOR SELECT USING (true);
CREATE POLICY "auth_insert_partners" ON partners FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "auth_update_partners" ON partners FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_delete_partners" ON partners FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies - T3 (Public insert/read) for reservations
CREATE POLICY "public_read_reservations" ON reservations FOR SELECT USING (true);
CREATE POLICY "anon_insert_reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_update_reservations" ON reservations FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "auth_delete_reservations" ON reservations FOR DELETE USING (auth.uid() IS NOT NULL);