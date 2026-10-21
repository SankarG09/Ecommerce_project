import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Headphones,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';

const categories = [
  'All gear', 'Audio', 'Phones', 'Computers', 'Wearables', 'Cameras',
  'Gaming', 'Home tech', 'Accessories', 'TV & video', 'Storage',
];

const productSeed = [
  ['Studio Wireless Headphones', 'Audio', 249, 299, 'BEST SELLER', 4.9],
  ['Pocket Bluetooth Speaker', 'Audio', 89, 109, '', 4.8],
  ['Noise-Canceling Earbuds', 'Audio', 169, 199, 'JUST IN', 4.7],
  ['Vinyl Turntable', 'Audio', 329, 379, '', 4.8],
  ['Desktop Soundbar', 'Audio', 139, 159, '', 4.6],
  ['Everyday Smartphone', 'Phones', 799, 899, 'BEST SELLER', 4.8],
  ['Compact 5G Phone', 'Phones', 649, 699, '', 4.6],
  ['Rugged Travel Phone', 'Phones', 589, 649, '', 4.5],
  ['Wireless Charging Phone', 'Phones', 729, 799, 'JUST IN', 4.7],
  ['Creator Smartphone Pro', 'Phones', 999, 1099, '', 4.9],
  ['Ultralight Laptop 14”', 'Computers', 1299, 1399, 'STAFF PICK', 4.9],
  ['Everyday Laptop 15”', 'Computers', 999, 1099, '', 4.7],
  ['Mechanical Keyboard', 'Computers', 149, 179, '', 4.8],
  ['Precision Wireless Mouse', 'Computers', 79, 89, '', 4.6],
  ['4K USB-C Monitor', 'Computers', 549, 599, 'JUST IN', 4.8],
  ['Minimal Smartwatch', 'Wearables', 279, 329, 'BEST SELLER', 4.7],
  ['Fitness Band 2', 'Wearables', 99, 119, '', 4.5],
  ['Classic Hybrid Watch', 'Wearables', 219, 249, '', 4.6],
  ['GPS Adventure Watch', 'Wearables', 399, 449, 'STAFF PICK', 4.8],
  ['Smart Ring', 'Wearables', 299, 349, 'JUST IN', 4.4],
  ['Mirrorless Camera', 'Cameras', 1199, 1299, 'STAFF PICK', 4.9],
  ['Instant Film Camera', 'Cameras', 129, 149, '', 4.7],
  ['Pocket Action Camera', 'Cameras', 349, 399, '', 4.8],
  ['Portrait Lens 50mm', 'Cameras', 429, 479, '', 4.9],
  ['Compact Tripod Kit', 'Cameras', 89, 99, 'JUST IN', 4.6],
  ['Wireless Game Controller', 'Gaming', 69, 79, 'BEST SELLER', 4.8],
  ['Handheld Game Console', 'Gaming', 399, 449, '', 4.7],
  ['Gaming Headset', 'Gaming', 129, 149, '', 4.6],
  ['RGB Gaming Keyboard', 'Gaming', 159, 179, 'JUST IN', 4.7],
  ['Portable Gaming Monitor', 'Gaming', 289, 329, '', 4.5],
  ['Smart Home Hub', 'Home tech', 119, 139, '', 4.6],
  ['Indoor Security Camera', 'Home tech', 89, 99, 'BEST SELLER', 4.8],
  ['Smart LED Light Kit', 'Home tech', 59, 69, '', 4.5],
  ['Wi-Fi 7 Router', 'Home tech', 249, 279, 'JUST IN', 4.7],
  ['Digital Air Quality Monitor', 'Home tech', 139, 159, '', 4.4],
  ['USB-C Power Bank', 'Accessories', 49, 59, 'BEST SELLER', 4.8],
  ['65W GaN Wall Charger', 'Accessories', 39, 49, '', 4.7],
  ['Braided USB-C Cable 2m', 'Accessories', 19, 24, '', 4.6],
  ['Magnetic Desk Stand', 'Accessories', 55, 65, 'JUST IN', 4.7],
  ['Travel Adapter Kit', 'Accessories', 35, 42, '', 4.5],
  ['4K Streaming Projector', 'TV & video', 699, 799, 'STAFF PICK', 4.7],
  ['OLED Smart TV 48”', 'TV & video', 1099, 1299, '', 4.9],
  ['Streaming Stick 4K', 'TV & video', 49, 59, 'BEST SELLER', 4.6],
  ['Wireless HDMI Transmitter', 'TV & video', 129, 149, '', 4.4],
  ['Compact Blu-ray Player', 'TV & video', 159, 179, '', 4.5],
  ['Portable SSD 1TB', 'Storage', 119, 139, 'BEST SELLER', 4.9],
  ['USB-C Flash Drive 256GB', 'Storage', 39, 49, '', 4.6],
  ['Desktop SSD 2TB', 'Storage', 219, 249, 'JUST IN', 4.8],
  ['NAS Drive 8TB', 'Storage', 249, 279, '', 4.7],
  ['MicroSD Card 512GB', 'Storage', 59, 69, '', 4.8],
];

const categoryPhotos = {
  Audio: ['photo-1505740420928-5e560c06d30e', 'photo-1608043152269-423dbba4e7e1', 'photo-1590658268037-6bf12165a8df', 'photo-1608156639585-b3a032ef9689', 'photo-1607082349566-187342175e2f'],
  Phones: ['photo-1598327105666-5b89351aff97', 'photo-1511707171634-5f897ff02aa9', 'photo-1592899677977-9c10ca588bbd', 'photo-1512499617640-c74ae3a79d37', 'photo-1511707171634-5f897ff02aa9'],
  Computers: ['photo-1517336714731-489689fd1ca8', 'photo-1496181133206-80ce9b88a853', 'photo-1587829741301-dc798b83add3', 'photo-1527864550417-7fd91fc51a46', 'photo-1527443224154-c4a3942d3acf'],
  Wearables: ['photo-1523275335684-37898b6baf30', 'photo-1526738549149-8e07eca6c147', 'photo-1546868871-7041f2a55e12', 'photo-1508685096489-7aacd43bd3b1', 'photo-1575311373937-040b8e1fd5b6'],
  Cameras: ['photo-1516035069371-29a1b244cc32', 'photo-1510127034890-3c2bb6c7c3b4', 'photo-1502920917128-1aa500764cbd', 'photo-1519183071298-a2962be90b8e', 'photo-1516035069371-29a1b244cc32'],
  Gaming: ['photo-1593305841991-05c297ba4575', 'photo-1606144042614-b2417e99c4e3', 'photo-1592840496694-26d035b52b48', 'photo-1603481546238-487240415921', 'photo-1593113598332-cd288d649433'],
  'Home tech': ['photo-1558002038-1055907df827', 'photo-1558089687-f282ffcbc126', 'photo-1558618666-fcd25c85cd64', 'photo-1558008258-3256797b43f3', 'photo-1558089687-f282ffcbc126'],
  Accessories: ['photo-1609692814858-f7cd2f0afa4f', 'photo-1583394838336-acd977736f90', 'photo-1625842268584-8f3296236761', 'photo-1615526675159-e248c3021d3f', 'photo-1609592806596-b43bada95b76'],
  'TV & video': ['photo-1593359677879-a4bb92f829d1', 'photo-1593784991095-a205069470b6', 'photo-1522869635100-9f4c5e86aa37', 'photo-1574375927938-d5a98e8ffe85', 'photo-1593359677879-a4bb92f829d1'],
  Storage: ['photo-1531492746076-161ca9bcad58', 'photo-1597872200969-2b65d56bd16b', 'photo-1628557044797-f21a177c37ec', 'photo-1531492746076-161ca9bcad58', 'photo-1597872200969-2b65d56bd16b'],
};

const products = productSeed.map(([name, category, price, oldPrice, badge, rating], index) => {
  const categoryIndex = productSeed.slice(0, index).filter((item) => item[1] === category).length;
  const photo = categoryPhotos[category][categoryIndex];
  return {
    id: index + 1,
    name,
    category,
    price,
    oldPrice,
    badge,
    rating,
    reviews: 28 + ((index * 37) % 420),
    image: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=85`,
    description: `Thoughtfully designed ${category.toLowerCase()} for the way you live and work. Carefully selected for excellent everyday performance, easy setup, and a longer useful life.`,
  };
});

const formatPrice = (price) => `$${price.toLocaleString('en-US')}`;

function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('volt-cart') || '{}');
    } catch {
      return {};
    }
  });
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All gear');
  const [sort, setSort] = useState('featured');
  const [favorites, setFavorites] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    localStorage.setItem('volt-cart', JSON.stringify(cart));
  }, [cart]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let filtered = products.filter((product) => {
      const categoryMatch = activeCategory === 'All gear' || product.category === activeCategory;
      const queryMatch = !normalizedQuery || `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery);
      const favoriteMatch = !favoritesOnly || favorites.includes(product.id);
      return categoryMatch && queryMatch && favoriteMatch;
    });
    if (sort === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sort === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [activeCategory, favorites, favoritesOnly, query, sort]);

  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = cartItems.reduce((count, product) => count + cart[product.id], 0);
  const subtotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8;

  const addToCart = (productId, amount = 1) => {
    setCart((current) => ({ ...current, [productId]: (current[productId] || 0) + amount }));
  };

  const changeQuantity = (productId, amount) => {
    setCart((current) => {
      const nextQuantity = (current[productId] || 0) + amount;
      const updated = { ...current };
      if (nextQuantity <= 0) delete updated[productId];
      else updated[productId] = nextQuantity;
      return updated;
    });
  };

  const toggleFavorite = (productId) => {
    setFavorites((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  };

  const handleCheckout = (event) => {
    event.preventDefault();
    setOrderNumber(`VS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setCart({});
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  const scrollToProducts = () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <div className="announcement"><Sparkles size={13} /> Good things ship free over $100 <span className="announcement-dot">·</span> Thoughtful tech, always</div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Volt Supply home"><span className="brand-mark">V</span>volt<span className="wordmark-light">supply</span></a>
        <nav className={`main-nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#products" onClick={() => setMobileMenuOpen(false)}>Shop all</a>
          <a href="#curated" onClick={() => setMobileMenuOpen(false)}>Our point of view</a>
          <a href="#footer" onClick={() => setMobileMenuOpen(false)}>Good to know</a>
        </nav>
        <div className="header-actions">
          <button className={`icon-button wishlist-trigger ${favoritesOnly ? 'is-active' : ''}`} aria-label="Show saved items" title="Show saved items" onClick={() => { setFavoritesOnly((value) => !value); scrollToProducts(); }}><Heart size={19} /><span className="header-action-label">Saved</span></button>
          <button className="bag-button" aria-label={`Open cart, ${cartCount} items`} onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>Bag</span><span className="bag-count">{cartCount}</span></button>
          <button className="icon-button mobile-menu-button" aria-label="Toggle menu" onClick={() => setMobileMenuOpen((value) => !value)}>{mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <img className="hero-photo" src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=2000&q=90" alt="A considered collection of modern everyday electronics" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="eyebrow light-eyebrow"><span /> A little less scrolling. A lot more good stuff.</p>
            <h1>Good tech.<br /><em>No noise.</em></h1>
            <p className="hero-description">The everyday electronics worth making room for. Chosen with care, made to keep up.</p>
            <button className="button button-lime" onClick={scrollToProducts}>Find your next favorite <ArrowRight size={17} /></button>
          </div>
          <div className="hero-caption"><span className="caption-rule" /> VOLT EDIT / 01 <span>TECH FOR REAL LIFE</span></div>
          <div className="hero-index">01 <span>/</span> 03</div>
        </section>

        <section className="trust-strip" aria-label="Shop benefits">
          <div><Truck size={18} /><span>Free shipping over $100</span></div>
          <span className="trust-divider" />
          <div><ShieldCheck size={18} /><span>Easy 30-day returns</span></div>
          <span className="trust-divider" />
          <div><Headphones size={18} /><span>Real humans, real help</span></div>
        </section>

        <section className="catalog-section" id="products">
          <div className="catalog-heading">
            <div>
              <p className="eyebrow"><span /> THE GOOD STUFF</p>
              <h2>Find your <em>frequency.</em></h2>
              <p className="section-subtitle">50 considered picks. No endless aisle energy.</p>
            </div>
            <div className="catalog-tools">
              <label className="search-field"><Search size={17} /><input aria-label="Search products" placeholder="Find something good..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>/</kbd></label>
              <label className="sort-field"><ArrowDownUp size={15} /><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select><ChevronDown size={14} /></label>
            </div>
          </div>
          <div className="catalog-body">
            <aside className="category-rail" aria-label="Filter by category">
              <p className="rail-label">SHOP BY</p>
              {categories.map((category) => (
                <button className={`category-option ${activeCategory === category ? 'is-selected' : ''}`} key={category} onClick={() => { setActiveCategory(category); setFavoritesOnly(false); }}>
                  <span>{category}</span><span className="category-arrow">{activeCategory === category ? <ArrowRight size={14} /> : ''}</span>
                </button>
              ))}
              <button className={`category-option saved-filter ${favoritesOnly ? 'is-selected' : ''}`} onClick={() => setFavoritesOnly((value) => !value)}><span>Saved for later</span><Heart size={14} fill={favoritesOnly ? 'currentColor' : 'none'} /></button>
              <div className="rail-note"><span className="rail-note-icon"><Sparkles size={16} /></span><p>Small edits.<br />Better everyday.</p></div>
            </aside>

            <div className="products-area">
              <div className="mobile-category-scroll" aria-label="Product categories">
                {categories.map((category) => <button key={category} className={activeCategory === category ? 'is-selected' : ''} onClick={() => { setActiveCategory(category); setFavoritesOnly(false); }}>{category}</button>)}
              </div>
              <div className="results-line"><span>{visibleProducts.length} GOOD FINDS</span><span>{activeCategory === 'All gear' ? 'THE WHOLE COLLECTION' : activeCategory.toUpperCase()}</span></div>
              {visibleProducts.length ? <div className="product-grid">
                {visibleProducts.map((product, index) => (
                  <article className="product-card" key={product.id} style={{ '--card-index': index % 8 }}>
                    <button className="product-image-button" onClick={() => setSelectedProduct(product)} aria-label={`View ${product.name}`}>
                      <img className="product-image" src={product.image} alt={product.name} loading="lazy" />
                      {product.badge && <span className={`product-badge ${product.badge === 'JUST IN' ? 'badge-new' : ''}`}>{product.badge}</span>}
                    </button>
                    <button className={`favorite-button ${favorites.includes(product.id) ? 'is-active' : ''}`} onClick={() => toggleFavorite(product.id)} aria-label={`${favorites.includes(product.id) ? 'Remove' : 'Save'} ${product.name}`}><Heart size={17} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button>
                    <div className="product-meta"><span>{product.category}</span><span className="product-rating"><span>★</span> {product.rating} <small>({product.reviews})</small></span></div>
                    <button className="product-title" onClick={() => setSelectedProduct(product)}>{product.name}</button>
                    <div className="product-bottom"><div className="price-line"><span>{formatPrice(product.price)}</span><del>{formatPrice(product.oldPrice)}</del></div><button className="add-button" onClick={() => addToCart(product.id)} aria-label={`Add ${product.name} to bag`}><Plus size={16} /></button></div>
                  </article>
                ))}
              </div> : <div className="empty-results"><span className="empty-search"><Search size={22} /></span><h3>Nothing on this frequency.</h3><p>Try another search or reset the filters.</p><button className="text-button" onClick={() => { setQuery(''); setActiveCategory('All gear'); setFavoritesOnly(false); }}>Show me everything <ArrowRight size={15} /></button></div>}
              <div className="catalog-end"><span>END OF THE GOOD STUFF</span><span>THAT'S {products.length} VERY GOOD THINGS.</span></div>
            </div>
          </div>
        </section>

        <section className="curated-section" id="curated">
          <div className="curated-image-wrap"><img src="https://images.unsplash.com/photo-1519669417670-68775a50919c?auto=format&fit=crop&w=1200&q=85" alt="Warm light falling across a listening setup" loading="lazy" /><span className="image-note">A GOOD PAUSE, ON PURPOSE</span></div>
          <div className="curated-copy"><p className="eyebrow"><span /> OUR POINT OF VIEW</p><h2>More life.<br /><em>Less tech stuff.</em></h2><p>Technology should fit into your day, not take it over. So we look for the thoughtful details, the useful upgrades, and the things that just feel right to use.</p><button className="text-button" onClick={scrollToProducts}>Meet your next everyday essential <ArrowRight size={16} /></button><span className="curated-mark">V—S / EDITION 01</span></div>
        </section>

        <section className="newsletter-section">
          <span className="newsletter-spark"><Sparkles size={19} /></span><div><p className="eyebrow light-eyebrow"><span /> OCCASIONAL GOOD NEWS</p><h2>A better kind of inbox.</h2><p>New finds, useful ideas. No daily noise.</p></div><form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); alert('You’re on the list. Look out for a little good news soon.'); }}><label className="sr-only" htmlFor="newsletter-email">Your email address</label><input id="newsletter-email" type="email" placeholder="Your email address" required /><button aria-label="Subscribe to newsletter"><ArrowRight size={18} /></button></form><span className="newsletter-stamp">GOOD<br />THINGS<br />AHEAD</span>
        </section>
      </main>

      <footer className="site-footer" id="footer"><a className="wordmark footer-wordmark" href="#top"><span className="brand-mark">V</span>volt<span className="wordmark-light">supply</span></a><span>Good tech, picked with care.</span><div className="footer-links"><a href="#products">Shop</a><a href="mailto:hello@voltsupply.example">Get in touch</a><span>© 2026 VOLT SUPPLY</span></div></footer>

      {(cartOpen || checkoutOpen || selectedProduct || orderNumber) && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) { setCartOpen(false); setCheckoutOpen(false); setSelectedProduct(null); if (orderNumber) setOrderNumber(''); } }} />}

      {selectedProduct && <section className="product-dialog" role="dialog" aria-modal="true" aria-label={selectedProduct.name}><button className="dialog-close" aria-label="Close product details" onClick={() => setSelectedProduct(null)}><X size={19} /></button><div className="dialog-image"><img src={selectedProduct.image} alt={selectedProduct.name} /></div><div className="dialog-content"><p className="eyebrow"><span /> {selectedProduct.category.toUpperCase()}</p><h2>{selectedProduct.name}</h2><div className="dialog-rating"><span>★</span> {selectedProduct.rating} <span>·</span> {selectedProduct.reviews} reviews</div><p className="dialog-description">{selectedProduct.description}</p><div className="dialog-price">{formatPrice(selectedProduct.price)} <del>{formatPrice(selectedProduct.oldPrice)}</del></div><button className="button button-dark dialog-add" onClick={() => { addToCart(selectedProduct.id); setSelectedProduct(null); setCartOpen(true); }}>Add to bag <ShoppingBag size={17} /></button><div className="dialog-perks"><span><Truck size={15} /> Free shipping over $100</span><span><ShieldCheck size={15} /> Easy 30-day returns</span></div></div></section>}

      {cartOpen && <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag"><div className="drawer-header"><button className="back-button" onClick={() => setCartOpen(false)}><ArrowLeft size={16} /> Keep browsing</button><button className="dialog-close drawer-x" aria-label="Close bag" onClick={() => setCartOpen(false)}><X size={19} /></button></div><div className="drawer-title"><div><p className="eyebrow"><span /> YOUR BAG</p><h2>The good stuff <span>({cartCount})</span></h2></div><ShoppingBag size={22} /></div>{cartItems.length ? <><div className="cart-list">{cartItems.map((product) => <div className="cart-item" key={product.id}><img src={product.image} alt="" /><div className="cart-item-info"><span className="cart-category">{product.category}</span><h3>{product.name}</h3><strong>{formatPrice(product.price)}</strong><div className="quantity-control"><button aria-label={`Remove one ${product.name}`} onClick={() => changeQuantity(product.id, -1)}><Minus size={13} /></button><span>{cart[product.id]}</span><button aria-label={`Add one ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={13} /></button></div></div><button className="remove-item" aria-label={`Remove ${product.name}`} onClick={() => setCart((current) => { const next = { ...current }; delete next[product.id]; return next; })}><X size={15} /></button></div>)}</div><div className="drawer-bottom"><div className="shipping-progress">{subtotal >= 100 ? <><Check size={15} /> You unlocked free shipping.</> : <><Truck size={15} /> Add {formatPrice(100 - subtotal)} for free shipping.</>}<div className="progress-track"><span style={{ width: `${Math.min(subtotal, 100)}%` }} /></div></div><div className="subtotal-line"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div className="shipping-line"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : 'On us'}</span></div><button className="button button-dark checkout-button" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Head to checkout <ArrowRight size={17} /></button><p className="checkout-note"><ShieldCheck size={13} /> Secure checkout · Taxes calculated at checkout</p></div></> : <div className="empty-cart"><span><ShoppingBag size={24} /></span><h3>Your bag is taking a little breather.</h3><p>Go find something good for it.</p><button className="button button-dark" onClick={() => { setCartOpen(false); scrollToProducts(); }}>Browse the good stuff <ArrowRight size={16} /></button></div>}</aside>}

      {checkoutOpen && <section className="checkout-dialog" role="dialog" aria-modal="true" aria-label="Checkout"><div className="checkout-heading"><div><p className="eyebrow"><span /> JUST A FEW DETAILS</p><h2>Make it <em>yours.</em></h2></div><button className="dialog-close" aria-label="Close checkout" onClick={() => setCheckoutOpen(false)}><X size={19} /></button></div><form className="checkout-form" onSubmit={handleCheckout}><div className="checkout-fields"><label>Email address<input type="email" name="email" placeholder="you@example.com" required /></label><div className="field-row"><label>First name<input name="firstName" autoComplete="given-name" required /></label><label>Last name<input name="lastName" autoComplete="family-name" required /></label></div><label>Street address<input name="address" autoComplete="street-address" required /></label><div className="field-row"><label>City<input name="city" autoComplete="address-level2" required /></label><label>ZIP code<input name="zip" autoComplete="postal-code" required /></label></div><label>Payment method<select name="payment"><option>Pay on delivery (demo)</option><option>Card payment (demo)</option></select></label></div><div className="checkout-summary"><h3>YOUR GOOD STUFF <span>{cartCount} ITEMS</span></h3>{cartItems.map((product) => <div className="summary-item" key={product.id}><span>{product.name} <small>× {cart[product.id]}</small></span><span>{formatPrice(product.price * cart[product.id])}</span></div>)}<div className="summary-total"><span>Total <small>incl. shipping</small></span><strong>{formatPrice(subtotal + shipping)}</strong></div><button className="button button-dark checkout-button" type="submit">Place demo order <ArrowRight size={17} /></button><p className="checkout-note"><ShieldCheck size={13} /> Demo checkout. No payment is processed.</p></div></form></section>}

      {orderNumber && <section className="order-dialog" role="dialog" aria-modal="true" aria-label="Order confirmed"><button className="dialog-close" aria-label="Close confirmation" onClick={() => setOrderNumber('')}><X size={19} /></button><div className="order-check"><Check size={25} /></div><p className="eyebrow"><span /> THAT'S A WRAP</p><h2>Good choice.<br /><em>Really good choice.</em></h2><p>Your demo order is confirmed. No payment was collected, but your taste is excellent.</p><div className="order-number">ORDER NO. <strong>{orderNumber}</strong></div><button className="button button-dark" onClick={() => { setOrderNumber(''); scrollToProducts(); }}>Back to the good stuff <ArrowRight size={16} /></button></section>}

      <button className="mobile-bag-fab" aria-label={`Open cart, ${cartCount} items`} onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>Bag</span><span className="bag-count">{cartCount}</span></button>
    </>
  );
}

export default App;
