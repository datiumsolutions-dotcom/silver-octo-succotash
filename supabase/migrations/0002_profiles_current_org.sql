create table if not exists public.profiles (
  user_id uuid primary key,
  current_organization_id uuid null references public.organizations(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.set_current_organization(org_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_membership_exists boolean;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if org_id is null then
    raise exception 'Organization is required';
  end if;

  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = org_id
      and om.user_id = v_user_id
  ) into v_membership_exists;

  if not v_membership_exists then
    raise exception 'You are not a member of this organization';
  end if;

  insert into public.profiles (user_id, current_organization_id)
  values (v_user_id, org_id)
  on conflict (user_id)
  do update
    set current_organization_id = excluded.current_organization_id,
        updated_at = now();

  return org_id;
end;
$$;

revoke all on function public.set_current_organization(uuid) from public;
grant execute on function public.set_current_organization(uuid) to authenticated;
