-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Handle new user signup automatically
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- MODULES (Zusammenfassungen)
create table modules (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  user_id uuid references auth.users not null
);

alter table modules enable row level security;

create policy "Modules are viewable by everyone." on modules
  for select using (true);

create policy "Users can insert their own modules." on modules
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own modules." on modules
  for update using (auth.uid() = user_id);

create policy "Users can delete their own modules." on modules
  for delete using (auth.uid() = user_id);


-- MODULE SECTIONS (Inhalte der Zusammenfassungen)
create type section_type as enum ('schwerpunkte', 'begriffe', 'beispiele', 'fragen', 'fazit');

create table module_sections (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references modules on delete cascade not null,
  type section_type not null,
  title text not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table module_sections enable row level security;

create policy "Sections are viewable by everyone." on module_sections
  for select using (true);

create policy "Users can manage sections of their modules." on module_sections
  for all using (
    exists ( select 1 from modules where id = module_sections.module_id and user_id = auth.uid() )
  );


-- MODULE PDFS
create table module_pdfs (
  id uuid default uuid_generate_v4() primary key,
  module_id uuid references modules on delete cascade not null,
  name text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table module_pdfs enable row level security;

create policy "PDFs are viewable by everyone." on module_pdfs
  for select using (true);

create policy "Users can manage PDFs of their modules." on module_pdfs
  for all using (
    exists ( select 1 from modules where id = module_pdfs.module_id and user_id = auth.uid() )
  );


-- DECKS (Karteikarten-Stapel)
create table decks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  user_id uuid references auth.users not null
);

alter table decks enable row level security;

create policy "Decks are viewable by everyone." on decks
  for select using (true);

create policy "Users can insert their own decks." on decks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own decks." on decks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own decks." on decks
  for delete using (auth.uid() = user_id);


-- FLASHCARDS
create table flashcards (
  id uuid default uuid_generate_v4() primary key,
  deck_id uuid references decks on delete cascade not null,
  front text not null,
  back text not null,
  status text default 'new', -- 'new', 'known', 'unknown'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table flashcards enable row level security;

create policy "Flashcards are viewable by everyone." on flashcards
  for select using (true);

create policy "Users can manage flashcards of their decks." on flashcards
  for all using (
    exists ( select 1 from decks where id = flashcards.deck_id and user_id = auth.uid() )
  );
