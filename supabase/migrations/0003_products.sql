create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  description text null,
  price numeric(12,2) not null check (price >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_organization_id
  on public.products (organization_id);

alter table public.products enable row level security;

drop policy if exists "products_select_member" on public.products;
create policy "products_select_member"
  on public.products
  for select
  using (
    exists (
      select 1
      from public.organization_members om
      where om.organization_id = products.organization_id
        and om.user_id = auth.uid()
    )
  );

drop policy if exists "products_insert_member" on public.products;
create policy "products_insert_member"
  on public.products
  for insert
  with check (
    exists (
      select 1
      from public.organization_members om
      where om.organization_id = products.organization_id
        and om.user_id = auth.uid()
    )
  );

drop policy if exists "products_update_member" on public.products;
create policy "products_update_member"
  on public.products
  for update
  using (
    exists (
      select 1
      from public.organization_members om
      where om.organization_id = products.organization_id
        and om.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.organization_members om
      where om.organization_id = products.organization_id
        and om.user_id = auth.uid()
    )
  );

drop policy if exists "products_delete_member" on public.products;
create policy "products_delete_member"
  on public.products
  for delete
  using (
    exists (
      select 1
      from public.organization_members om
      where om.organization_id = products.organization_id
        and om.user_id = auth.uid()
    )
  );

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();
