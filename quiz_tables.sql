-- Create quizzes table
create table quizzes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  module_id uuid references modules(id) on delete set null,
  difficulty text check (difficulty in ('Grundlagen', 'Vertiefung', 'Prüfungsvorbereitung')),
  time_limit_seconds integer, -- null means no time limit
  user_id uuid references auth.users(id) not null
);

-- Create quiz_questions table
create table quiz_questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references quizzes(id) on delete cascade not null,
  type text check (type in ('multiple_choice', 'single_choice', 'short_answer')) not null,
  question text not null,
  options jsonb, -- Array of strings for options
  correct_answer jsonb, -- Array of indices for MC/SC, or string for short_answer
  feedback text,
  "order" integer default 0
);

-- Create quiz_attempts table
create table quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  quiz_id uuid references quizzes(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  score integer default 0,
  max_score integer default 0,
  status text check (status in ('in_progress', 'completed')) default 'in_progress'
);

-- Enable RLS
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_attempts enable row level security;

-- Policies for Quizzes
create policy "Public quizzes are viewable by everyone"
  on quizzes for select
  using (true);

create policy "Users can insert their own quizzes"
  on quizzes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own quizzes"
  on quizzes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own quizzes"
  on quizzes for delete
  using (auth.uid() = user_id);

-- Policies for Questions
create policy "Questions are viewable by everyone"
  on quiz_questions for select
  using (true);

create policy "Users can manage questions for their quizzes"
  on quiz_questions for all
  using (
    exists (
      select 1 from quizzes
      where quizzes.id = quiz_questions.quiz_id
      and quizzes.user_id = auth.uid()
    )
  );

-- Policies for Attempts
create policy "Users can view their own attempts"
  on quiz_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own attempts"
  on quiz_attempts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own attempts"
  on quiz_attempts for update
  using (auth.uid() = user_id);
