-- Initial Schema for B-Healthcare

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Medicines Table
create table if not exists medicines (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text,
  unit text,
  quantity integer default 0,
  reorder_level integer default 10,
  expiry_date date,
  created_at timestamptz default now()
);

-- 2. Health Programs Table
create table if not exists health_programs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  date date,
  status text check (status in ('upcoming', 'ongoing', 'completed')),
  participants integer default 0,
  created_at timestamptz default now()
);

-- 3. Program Medicines Join Table
create table if not exists program_medicines (
  id uuid primary key default uuid_generate_v4(),
  program_id uuid references health_programs(id) on delete cascade,
  medicine_id uuid references medicines(id) on delete cascade,
  quantity_needed integer not null,
  created_at timestamptz default now(),
  unique(program_id, medicine_id)
);

-- 4. Stock Transactions Table
create table if not exists stock_transactions (
  id uuid primary key default uuid_generate_v4(),
  medicine_id uuid references medicines(id) on delete cascade,
  type text not null, -- 'Stock In', 'Used for Program', 'Dispensed', 'Expired'
  quantity integer not null,
  notes text,
  created_at timestamptz default now()
);

-- 5. User Profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'Health Worker',
  created_at timestamptz default now()
);

-- RPC for SQL Editor (Executes arbitrary SQL and returns JSON)
-- WARNING: Only use this for development/setup. In production, use standard Supabase API/RPCs.
create or replace function exec_sql(sql_query text)
returns json
language plpgsql
security definer
as $$
declare
    result json;
begin
    execute 'select json_agg(t) from (' || sql_query || ') t' into result;
    return result;
exception when others then
    return json_build_object('error', sqlerrm);
end;
$$;
