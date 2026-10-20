import { useEffect, useMemo, useState } from 'react'

const storageKey = 'shopdesk-products'
const emptyProduct = { name: '', category: '', price: '', stock: '', image: '', description: '' }

function readProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

const buttonPrimary = 'inline-flex h-10 items-center justify-center rounded-lg bg-violet-600 px-4 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-700'
const inputStyle = 'mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100'

export default function Home() {
  const [products, setProducts] = useState(readProducts)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [dialog, setDialog] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [formError, setFormError] = useState('')

  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(products)), [products])

  const categories = useMemo(() => [...new Set(products.map((product) => product.category).filter(Boolean))], [products])
  const visibleProducts = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (categoryFilter === 'All categories' || product.category === categoryFilter)
  })

  function openCreate() {
    setForm(emptyProduct)
    setFormError('')
    setDialog({ type: 'form' })
  }

  function openEdit(product) {
    setForm({ ...product })
    setFormError('')
    setDialog({ type: 'form', product })
  }

  function saveProduct(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.category.trim() || form.price === '' || form.stock === '') {
      setFormError('Add a name, category, price, and stock quantity.')
      return
    }
    const product = {
      ...form,
      id: dialog.product?.id ?? crypto.randomUUID(),
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    }
    setProducts((current) => dialog.product
      ? current.map((item) => item.id === product.id ? product : item)
      : [product, ...current])
    setDialog(null)
  }

  function deleteProduct(id) {
    setProducts((current) => current.filter((product) => product.id !== id))
    setDialog(null)
  }

  const currency = (price) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
  const closeOnBackdrop = (event) => { if (event.target === event.currentTarget) setDialog(null) }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="flex min-h-screen">
        <aside className="flex w-16 shrink-0 flex-col border-r border-slate-200 bg-white px-2 py-5 sm:w-60 sm:px-4 sm:py-6">
          <a className="mb-9 flex items-center justify-center gap-2.5 px-1 text-xl font-extrabold tracking-tight text-slate-800 sm:justify-start sm:px-2" href="/home" aria-label="Shopdesk home"><span className="grid size-8 place-items-center rounded-lg bg-violet-600 text-base text-white">S</span><span className="hidden sm:inline">shopdesk</span></a>
          <div className="hidden px-3 pb-2 text-[10px] font-bold tracking-widest text-slate-400 sm:block">WORKSPACE</div>
          <a className="flex h-10 items-center justify-center gap-3 rounded-lg bg-violet-50 px-3 text-violet-700 sm:justify-start" href="/home"><span className="text-lg">▦</span><span className="hidden text-xs font-semibold sm:inline">Products</span></a>
          <div className="mt-auto flex items-center justify-center gap-2.5 border-t border-slate-100 px-1 pt-4 sm:justify-start sm:px-2"><div className="grid size-8 shrink-0 place-items-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700">JD</div><div className="hidden sm:block"><strong className="block text-xs">Store admin</strong><small className="mt-0.5 block text-[10px] text-slate-400">Product catalog</small></div></div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex h-[68px] items-center justify-between border-b border-slate-200 bg-white px-4 text-xs text-slate-500 sm:px-8 lg:px-12"><span>Workspace <span className="mx-2 text-slate-300">/</span> Products</span><span className="text-[9px] font-bold tracking-widest text-slate-400">YOUR CATALOG</span></header>
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-7 lg:px-10">
            <div className="mb-7 flex items-end justify-between gap-3">
              <div><div className="text-[10px] font-bold tracking-[.15em] text-slate-400">INVENTORY</div><h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-800">Products</h1><p className="mt-1 text-xs text-slate-500">Manage your store’s product catalog in one place.</p></div>
              <button className={`${buttonPrimary} shrink-0`} onClick={openCreate}><span className="mr-1 text-base">＋</span> Add product</button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Summary icon="▦" label="Total products" value={products.length} color="violet" />
              <Summary icon="◉" label="In stock" value={products.filter((product) => product.stock > 0).length} color="emerald" />
              <Summary icon="▤" label="Categories" value={categories.length} color="amber" />
            </div>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="px-5 py-4"><h2 className="text-sm font-bold">All products</h2><p className="mt-1 text-[11px] text-slate-500">{visibleProducts.length} {visibleProducts.length === 1 ? 'item' : 'items'} in your catalog</p></div>
              <div className="flex gap-2 border-y border-slate-100 px-4 py-2.5">
                <label className="flex h-9 max-w-sm flex-1 items-center gap-2 rounded-lg border border-slate-200 px-2.5 text-slate-400"><span className="text-lg">⌕</span><input className="min-w-0 flex-1 border-0 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." /></label>
                <select className="h-9 max-w-[46%] rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none focus:border-violet-400" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category"><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select>
              </div>
              {visibleProducts.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50 text-[9px] font-bold tracking-wider text-slate-400"><tr><th className="px-5 py-3">PRODUCT</th><th className="px-4 py-3">CATEGORY</th><th className="px-4 py-3">PRICE</th><th className="px-4 py-3">STOCK</th><th className="px-4 py-3">STATUS</th><th className="px-4 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody>
                {visibleProducts.map((product) => <tr className="border-t border-slate-100 text-[11px] text-slate-600" key={product.id}>
                  <td className="px-5 py-3"><button className="flex items-center gap-2.5 text-left" onClick={() => setDialog({ type: 'view', product })}><span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-lg bg-violet-50 text-lg text-violet-500">{product.image ? <img className="size-full object-cover" src={product.image} alt="" /> : '✧'}</span><span className="min-w-0"><strong className="block max-w-52 truncate text-[11px] text-slate-800">{product.name}</strong><small className="mt-1 block max-w-52 truncate text-[9px] text-slate-400">{product.description || 'View product details'}</small></span></button></td>
                  <td className="px-4 py-3"><span className="rounded-md bg-slate-100 px-2 py-1 text-[9px]">{product.category}</span></td><td className="px-4 py-3 font-bold text-slate-800">{currency(product.price)}</td><td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9px] ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}><i className="size-1 rounded-full bg-current" />{product.stock > 0 ? 'In stock' : 'Out of stock'}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><IconButton label={`View ${product.name}`} onClick={() => setDialog({ type: 'view', product })}>◉</IconButton><IconButton label={`Edit ${product.name}`} onClick={() => openEdit(product)}>✎</IconButton><IconButton label={`Delete ${product.name}`} danger onClick={() => setDialog({ type: 'delete', product })}>⌫</IconButton></div></td>
                </tr>)}
                </tbody></table></div> : <div className="px-4 py-14 text-center"><div className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-violet-50 text-xl text-violet-600">▦</div><h3 className="text-sm font-bold">{products.length ? 'No products found' : 'Your catalog is ready'}</h3><p className="mx-auto mb-4 mt-1 max-w-xs text-xs leading-relaxed text-slate-500">{products.length ? 'Try a different search or category.' : 'Add your first product to start building your store catalog.'}</p>{!products.length && <button className={buttonPrimary} onClick={openCreate}>＋ Add your first product</button>}</div>}
            </section>
            <footer className="px-1 py-4 text-[10px] text-slate-400">Product catalog <span className="px-1">•</span> Changes are saved on this device</footer>
          </div>
        </section>
      </div>

      {dialog && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-[2px]" onMouseDown={closeOnBackdrop}>
        {dialog.type === 'form' && <section className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="mb-5 flex items-start justify-between"><div><div className="text-[10px] font-bold tracking-widest text-slate-400">PRODUCT DETAILS</div><h2 className="mt-1 text-xl font-extrabold">{dialog.product ? 'Edit product' : 'Add product'}</h2></div><CloseButton onClick={() => setDialog(null)} /></div>
          <form onSubmit={saveProduct}><div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <label className="col-span-full text-[11px] font-semibold text-slate-600">Product name<input autoFocus className={inputStyle} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Everyday tote bag" /></label>
            <label className="text-[11px] font-semibold text-slate-600">Category<input className={inputStyle} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="e.g. Accessories" /></label>
            <label className="text-[11px] font-semibold text-slate-600">Price<input className={inputStyle} type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="0.00" /></label>
            <label className="text-[11px] font-semibold text-slate-600">Stock quantity<input className={inputStyle} type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} placeholder="0" /></label>
            <label className="text-[11px] font-semibold text-slate-600">Image URL <span className="font-normal text-slate-400">Optional</span><input className={inputStyle} type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://example.com/image.jpg" /></label>
            <label className="col-span-full text-[11px] font-semibold text-slate-600">Description <span className="font-normal text-slate-400">Optional</span><textarea className={inputStyle} rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="A short description of your product" /></label>
          </div>{formError && <p className="mt-3 text-xs text-red-600">{formError}</p>}<div className="mt-5 flex justify-end gap-2"><SecondaryButton onClick={() => setDialog(null)}>Cancel</SecondaryButton><button className={buttonPrimary} type="submit">{dialog.product ? 'Save changes' : 'Add product'}</button></div></form>
        </section>}
        {dialog.type === 'view' && <section className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><CloseButton className="absolute right-4 top-4" onClick={() => setDialog(null)} /><div className="mb-5 grid h-44 place-items-center overflow-hidden rounded-lg bg-violet-50 text-4xl text-violet-500">{dialog.product.image ? <img className="size-full object-cover" src={dialog.product.image} alt={dialog.product.name} /> : '✧'}</div><div className="text-[10px] font-bold tracking-widest text-slate-400">{dialog.product.category}</div><h2 className="mt-1 text-xl font-extrabold" id="dialog-title">{dialog.product.name}</h2><p className="mt-2 text-xs leading-relaxed text-slate-500">{dialog.product.description || 'No description provided.'}</p><div className="mt-4 flex gap-12 border-t border-slate-100 pt-4"><div><small className="block text-[9px] font-bold tracking-wider text-slate-400">PRICE</small><strong className="mt-1 block text-sm">{currency(dialog.product.price)}</strong></div><div><small className="block text-[9px] font-bold tracking-wider text-slate-400">STOCK</small><strong className="mt-1 block text-sm">{dialog.product.stock} units</strong></div></div><div className="mt-5 flex justify-end gap-2"><SecondaryButton onClick={() => openEdit(dialog.product)}>Edit product</SecondaryButton><button className={buttonPrimary} onClick={() => setDialog(null)}>Done</button></div></section>}
        {dialog.type === 'delete' && <section className="w-full max-w-sm rounded-xl bg-white p-7 text-center shadow-2xl" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title"><div className="mx-auto mb-3 grid size-11 place-items-center rounded-full bg-red-50 font-bold text-red-600">!</div><h2 className="text-lg font-extrabold" id="dialog-title">Delete this product?</h2><p className="mt-2 text-xs leading-relaxed text-slate-500"><strong className="text-slate-700">{dialog.product.name}</strong> will be removed from your catalog. This can’t be undone.</p><div className="mt-5 flex justify-end gap-2"><SecondaryButton onClick={() => setDialog(null)}>Cancel</SecondaryButton><button className="h-10 rounded-lg bg-red-600 px-4 text-xs font-bold text-white hover:bg-red-700" onClick={() => deleteProduct(dialog.product.id)}>Delete product</button></div></section>}
      </div>}
    </main>
  )
}

function Summary({ icon, label, value, color }) {
  const colors = { violet: 'bg-violet-50 text-violet-600', emerald: 'bg-emerald-50 text-emerald-600', amber: 'bg-amber-50 text-amber-600' }
  return <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><span className={`grid size-9 place-items-center rounded-lg text-lg ${colors[color]}`}>{icon}</span><span><small className="block text-[10px] text-slate-500">{label}</small><strong className="mt-0.5 block text-xl font-bold">{value}</strong></span></div>
}

function IconButton({ label, onClick, danger, children }) {
  return <button className={`grid size-7 place-items-center rounded-md text-slate-500 hover:bg-violet-50 hover:text-violet-700 ${danger ? 'hover:bg-red-50 hover:text-red-600' : ''}`} aria-label={label} title={label} onClick={onClick}>{children}</button>
}

function CloseButton({ onClick, className = '' }) {
  return <button className={`grid size-7 place-items-center rounded-md bg-slate-100 text-lg leading-none text-slate-500 hover:bg-slate-200 ${className}`} onClick={onClick} aria-label="Close">×</button>
}

function SecondaryButton({ onClick, children }) {
  return <button type="button" className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 hover:bg-slate-50" onClick={onClick}>{children}</button>
}
