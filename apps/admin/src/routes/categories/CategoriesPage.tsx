import { useEffect, useMemo, useState } from 'react';
import { AdmCard } from '@/components/primitives/AdmCard';
import { AdmInput } from '@/components/primitives/AdmInput';
import { AdmSelect } from '@/components/primitives/AdmSelect';
import { AdmButton } from '@/components/primitives/AdmButton';
import { AdmEmptyState } from '@/components/primitives/AdmEmptyState';
import { pushToast } from '@/components/primitives/toast-bus';
import { useAdminCategories } from '@/lib/api/queries';
import {
  useCreateCategory,
  useUpdateCategory,
  type UpdateCategoryBody,
  type CreateCategoryBody,
} from '@/lib/api/mutations';
import { ApiClientError } from '@/lib/api/client';
import { useTopbarTitle } from '@/lib/state/topbar-store';
import { usePrefsStore } from '@/lib/state/prefs-store';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { AdminCategoryNode } from '@/lib/api/types';

interface TreeNode extends AdminCategoryNode {
  children: TreeNode[];
  depth: number;
}

function buildTree(rows: AdminCategoryNode[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  for (const row of rows) {
    byId.set(row.id, { ...row, children: [], depth: 0 });
  }
  const roots: TreeNode[] = [];
  for (const node of byId.values()) {
    if (node.parent_id && byId.has(node.parent_id)) {
      const parent = byId.get(node.parent_id)!;
      node.depth = parent.depth + 1;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  const sort = (list: TreeNode[]) => {
    list.sort((a, b) => a.sort_order - b.sort_order || a.name_en.localeCompare(b.name_en));
    list.forEach((n) => sort(n.children));
  };
  sort(roots);
  return roots;
}

function descendantIds(node: AdminCategoryNode, rows: AdminCategoryNode[]): Set<string> {
  const ids = new Set<string>();
  const children = rows.filter((r) => r.parent_id === node.id);
  for (const c of children) {
    ids.add(c.id);
    for (const sub of descendantIds(c, rows)) ids.add(sub);
  }
  return ids;
}

interface FormState {
  name_ar: string;
  name_en: string;
  slug: string;
  parent_id: string;
  sort_order: string;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  name_ar: '',
  name_en: '',
  slug: '',
  parent_id: '',
  sort_order: '0',
  is_active: true,
};

export function CategoriesPage() {
  const locale = usePrefsStore((s) => s.locale);
  const dict = getDictionary(locale);
  useTopbarTitle(dict.categories.title);

  const { data: rows = [], isLoading } = useAdminCategories();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [mode, setMode] = useState<'create' | 'edit'>('edit');
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory(selectedId ?? '');

  const tree = useMemo(() => buildTree(rows), [rows]);

  useEffect(() => {
    if (mode !== 'edit' || !selectedId) return;
    const node = rows.find((r) => r.id === selectedId);
    if (!node) return;
    setForm({
      name_ar: node.name_ar,
      name_en: node.name_en,
      slug: node.slug,
      parent_id: node.parent_id ?? '',
      sort_order: String(node.sort_order),
      is_active: node.is_active,
    });
  }, [mode, selectedId, rows]);

  const startCreate = () => {
    setMode('create');
    setSelectedId(null);
    setForm(EMPTY_FORM);
  };

  const startEdit = (id: string) => {
    setMode('edit');
    setSelectedId(id);
  };

  const toggle = (id: string) =>
    setExpanded((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const submit = async () => {
    const body: CreateCategoryBody | UpdateCategoryBody = {
      name_ar: form.name_ar.trim(),
      name_en: form.name_en.trim(),
      slug: form.slug.trim(),
      parent_id: form.parent_id ? form.parent_id : null,
      sort_order: Number(form.sort_order) || 0,
    };
    (body as UpdateCategoryBody).is_active = form.is_active;
    if (!body.name_ar || !body.name_en || !body.slug) {
      pushToast('error', dict.productForm.validation.required);
      return;
    }
    try {
      if (mode === 'create') {
        const created = await createMutation.mutateAsync(body as CreateCategoryBody);
        pushToast('success', dict.categories.saved);
        setMode('edit');
        setSelectedId(created.id);
      } else if (selectedId) {
        await updateMutation.mutateAsync(body);
        pushToast('success', dict.categories.saved);
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        pushToast('error', locale === 'ar' ? err.message_ar : err.message_en);
      } else {
        pushToast('error', dict.common.error);
      }
    }
  };

  const renderRow = (node: TreeNode) => {
    const hasChildren = node.children.length > 0;
    const isOpen = expanded.has(node.id);
    return (
      <li key={node.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-bartal cursor-pointer hover:bg-sand/60 dark:hover:bg-d-raised/40 ${
            selectedId === node.id ? 'bg-amber-tint dark:bg-d-raised' : ''
          }`}
          style={{ paddingInlineStart: 12 + node.depth * 16 }}
          onClick={() => startEdit(node.id)}
        >
          {hasChildren ? (
            <button
              type="button"
              className="w-4 text-ink-mute dark:text-d-textMute"
              onClick={(e) => {
                e.stopPropagation();
                toggle(node.id);
              }}
              aria-label={isOpen ? 'Collapse' : 'Expand'}
            >
              {isOpen ? '▾' : '▸'}
            </button>
          ) : (
            <span className="w-4" />
          )}
          <span className="flex-1 text-small font-semibold text-ink dark:text-d-text truncate">
            {locale === 'ar' ? node.name_ar : node.name_en}
          </span>
          <span className="text-micro text-ink-mute dark:text-d-textMute font-mono">
            {dict.categories.productCount.replace('{count}', String(node.product_count))}
          </span>
          <span
            className={`text-micro font-semibold px-1.5 py-0.5 rounded-full ${
              node.is_active ? 'bg-ok/15 text-ok' : 'bg-line text-ink-mute'
            }`}
          >
            {node.is_active ? dict.categories.live : dict.categories.hidden}
          </span>
        </div>
        {hasChildren && isOpen && (
          <ul>{node.children.map((c) => renderRow(c))}</ul>
        )}
      </li>
    );
  };

  const excluded = useMemo(() => {
    if (mode !== 'edit' || !selectedId) return new Set<string>();
    const node = rows.find((r) => r.id === selectedId);
    if (!node) return new Set<string>();
    const set = descendantIds(node, rows);
    set.add(node.id); // can't be self
    return set;
  }, [mode, selectedId, rows]);

  const parentOptions = rows.filter((r) => !excluded.has(r.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
      <AdmCard padded={false}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-line dark:border-d-line">
          <div className="text-h3 font-semibold text-ink dark:text-d-text">
            {dict.categories.sectionTree}
          </div>
          <AdmButton size="sm" onClick={startCreate}>
            {dict.categories.newCategory}
          </AdmButton>
        </div>
        {isLoading ? (
          <div className="p-4 text-small text-ink-mute dark:text-d-textMute">{dict.common.loading}</div>
        ) : tree.length === 0 ? (
          <AdmEmptyState title={dict.products.empty} />
        ) : (
          <ul className="py-2">{tree.map((node) => renderRow(node))}</ul>
        )}
      </AdmCard>

      <AdmCard>
        <div className="text-h3 font-semibold text-ink dark:text-d-text mb-3">
          {mode === 'create' ? dict.categories.sectionCreate : dict.categories.sectionEdit}
        </div>
        {mode === 'edit' && !selectedId ? (
          <div className="text-small text-ink-mute dark:text-d-textMute">
            {dict.categories.selectToEdit}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                {dict.categories.fields.nameAr}
              </label>
              <AdmInput
                dir="rtl"
                value={form.name_ar}
                onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                {dict.categories.fields.nameEn}
              </label>
              <AdmInput
                dir="ltr"
                value={form.name_en}
                onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                {dict.categories.fields.slug}
              </label>
              <AdmInput
                dir="ltr"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                {dict.categories.fields.parent}
              </label>
              <AdmSelect
                value={form.parent_id}
                onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value }))}
              >
                <option value="">{dict.categories.fields.noParent}</option>
                {parentOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {locale === 'ar' ? c.name_ar : c.name_en}
                  </option>
                ))}
              </AdmSelect>
            </div>
            <div>
              <label className="block text-small font-semibold text-ink dark:text-d-text mb-1.5">
                {dict.categories.fields.sortOrder}
              </label>
              <AdmInput
                inputMode="numeric"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
              />
            </div>
            <label className="flex items-center gap-2 text-small text-ink dark:text-d-text">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              />
              <span>{dict.categories.fields.isActive}</span>
            </label>
            <div className="pt-2">
              <AdmButton
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? dict.categories.saving
                  : mode === 'create'
                    ? dict.categories.create
                    : dict.categories.save}
              </AdmButton>
            </div>
          </form>
        )}
      </AdmCard>
    </div>
  );
}
