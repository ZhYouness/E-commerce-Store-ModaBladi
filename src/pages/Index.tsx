
import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Menu, X, Plus, Minus, Star, Heart, Filter, ChevronDown, ChevronRight } from 'lucide-react';

// Sample product data
const products = [
  {
    id: 1,
    name: 'Handwoven Berber Rug',
    price: 299.99,
    category: 'rugs',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop',
    description: 'Beautiful traditional Berber rug handwoven by skilled artisans in the Atlas Mountains.',
    rating: 4.8,
    availability: 'In Stock',
    gallery: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop'
    ]
  },
  {
    id: 2,
    name: 'Ceramic Tagine Set',
    price: 89.99,
    category: 'ceramics',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
    description: 'Authentic handcrafted ceramic tagine perfect for traditional Moroccan cooking.',
    rating: 4.6,
    availability: 'In Stock',
    gallery: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=500&fit=crop'
    ]
  },
  {
    id: 3,
    name: 'Moroccan Lantern',
    price: 45.99,
    category: 'lighting',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
    description: 'Intricate metal lantern with colorful glass panels, perfect for ambient lighting.',
    rating: 4.9,
    availability: 'Limited Stock',
    gallery: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop'
    ]
  },
  {
    id: 4,
    name: 'Embroidered Cushion',
    price: 34.99,
    category: 'textiles',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop',
    description: 'Luxurious silk cushion with traditional Moroccan embroidery patterns.',
    rating: 4.7,
    availability: 'In Stock',
    gallery: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop'
    ]
  },
  {
    id: 5,
    name: 'Argan Oil Beauty Set',
    price: 59.99,
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=500&fit=crop',
    description: 'Pure argan oil beauty collection sourced from traditional cooperatives.',
    rating: 4.8,
    availability: 'In Stock',
    gallery: [
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=500&fit=crop'
    ]
  },
  {
    id: 6,
    name: 'Vintage Brass Tray',
    price: 78.99,
    category: 'decor',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    description: 'Ornate brass serving tray with traditional engravings and patina finish.',
    rating: 4.5,
    availability: 'In Stock',
    gallery: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
    ]
  }
];

const categories = [
  { id: 'all', name: 'All Products', count: products.length },
  { id: 'rugs', name: 'Rugs & Carpets', count: products.filter(p => p.category === 'rugs').length },
  { id: 'ceramics', name: 'Ceramics', count: products.filter(p => p.category === 'ceramics').length },
  { id: 'textiles', name: 'Textiles', count: products.filter(p => p.category === 'textiles').length },
  { id: 'lighting', name: 'Lighting', count: products.filter(p => p.category === 'lighting').length },
  { id: 'decor', name: 'Home Decor', count: products.filter(p => p.category === 'decor').length },
  { id: 'beauty', name: 'Beauty', count: products.filter(p => p.category === 'beauty').length }
];

const EcommerceApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [user, setUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Navigation
  const navigateTo = (page, productId = null) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProduct(products.find(p => p.id === productId));
      setSelectedImage(0);
    }
    setIsMobileMenuOpen(false);
  };

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigateTo('home')}>
            <h1 className="text-2xl font-bold text-orange-800">Souk Marrakech</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => navigateTo('home')}
              className={`${currentPage === 'home' ? 'text-orange-600' : 'text-gray-700'} hover:text-orange-600 transition-colors`}
            >
              Home
            </button>
            <button 
              onClick={() => navigateTo('shop')}
              className={`${currentPage === 'shop' ? 'text-orange-600' : 'text-gray-700'} hover:text-orange-600 transition-colors`}
            >
              Shop
            </button>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <button 
              onClick={() => navigateTo('cart')}
              className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <button 
              onClick={() => navigateTo(user ? 'account' : 'login')}
              className="p-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <User className="h-6 w-6" />
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => navigateTo('home')}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600"
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo('shop')}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600"
              >
                Shop
              </button>
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  // Homepage Component
  const Homepage = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-100 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-orange-900 mb-6">
              Discover Authentic
              <span className="block text-yellow-600">Moroccan Treasures</span>
            </h1>
            <p className="text-xl text-orange-700 mb-8 max-w-2xl mx-auto">
              Handcrafted with love by traditional artisans. Bring the warmth and beauty of Morocco into your home.
            </p>
            <button 
              onClick={() => navigateTo('shop')}
              className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-orange-900 mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(1).map(category => (
              <div 
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  navigateTo('shop');
                }}
                className="text-center cursor-pointer group hover:transform hover:scale-105 transition-all duration-200"
              >
                <div className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full p-6 mb-4 group-hover:from-orange-300 group-hover:to-yellow-300">
                  <div className="w-12 h-12 mx-auto bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{category.name.charAt(0)}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-orange-800 group-hover:text-orange-600">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} items</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-orange-900 mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <button 
              onClick={() => navigateTo('shop')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-yellow-400 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Special Offer</h2>
          <p className="text-xl text-orange-100 mb-6">
            Free shipping on orders over $100. Limited time offer!
          </p>
          <button 
            onClick={() => navigateTo('shop')}
            className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-orange-50">
          <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
        </button>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
        </div>
        <p className="text-2xl font-bold text-orange-600 mb-4">${product.price}</p>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigateTo('product', product.id)}
            className="flex-1 bg-orange-100 text-orange-600 py-2 px-4 rounded-lg hover:bg-orange-200 transition-colors"
          >
            View Details
          </button>
          <button 
            onClick={() => addToCart(product)}
            className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );

  // Shop Page Component
  const ShopPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-orange-900">Our Collection</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {category.name} ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange[0] === 0 && priceRange[1] === 500}
                      onChange={() => setPriceRange([0, 500])}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">All Prices</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange[0] === 0 && priceRange[1] === 50}
                      onChange={() => setPriceRange([0, 50])}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Under $50</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange[0] === 50 && priceRange[1] === 100}
                      onChange={() => setPriceRange([50, 100])}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">$50 - $100</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange[0] === 100 && priceRange[1] === 500}
                      onChange={() => setPriceRange([100, 500])}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">$100+</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Product Details Page Component
  const ProductDetailsPage = () => {
    const [quantity, setQuantity] = useState(1);

    if (!selectedProduct) return <div>Product not found</div>;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Image Gallery */}
              <div>
                <div className="mb-4">
                  <img 
                    src={selectedProduct.gallery[selectedImage]} 
                    alt={selectedProduct.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
                {selectedProduct.gallery.length > 1 && (
                  <div className="flex space-x-2">
                    {selectedProduct.gallery.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden ${
                          selectedImage === index ? 'ring-2 ring-orange-500' : ''
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{selectedProduct.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">({selectedProduct.rating})</span>
                </div>

                <p className="text-3xl font-bold text-orange-600 mb-4">${selectedProduct.price}</p>

                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProduct.availability === 'In Stock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedProduct.availability}
                  </span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{selectedProduct.description}</p>

                {/* Quantity and Add to Cart */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct, quantity);
                      setQuantity(1);
                    }}
                    className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>

                <button className="w-full border border-orange-600 text-orange-600 py-3 px-6 rounded-lg hover:bg-orange-50 transition-colors font-semibold">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Cart Page Component
  const CartPage = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-orange-900 mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some beautiful Moroccan items to get started!</p>
            <button 
              onClick={() => navigateTo('shop')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-orange-600 font-bold">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{getTotalPrice() > 100 ? 'Free' : '$9.99'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">
                      ${(getTotalPrice() + (getTotalPrice() > 100 ? 0 : 9.99) + getTotalPrice() * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigateTo('checkout')}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={() => navigateTo('shop')}
                className="w-full mt-3 border border-orange-600 text-orange-600 py-3 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Checkout Page Component
  const CheckoutPage = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    });

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // Here you would normally process the order
      alert('Order placed successfully! (Demo mode - no actual payment processed)');
      setCart([]);
      navigateTo('home');
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-orange-900 mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Address</h2>
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Payment Information */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h2>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Name on Card"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
                  />
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-orange-600 text-white py-4 rounded-lg hover:bg-orange-700 transition-colors font-semibold text-lg"
                >
                  Place Order
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-4 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{getTotalPrice() > 100 ? 'Free' : '$9.99'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">
                      ${(getTotalPrice() + (getTotalPrice() > 100 ? 0 : 9.99) + getTotalPrice() * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Login Page Component
  const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loginData, setLoginData] = useState({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: ''
    });

    const handleInputChange = (e) => {
      setLoginData({
        ...loginData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (isLogin) {
        // Mock login
        setUser({ name: 'John Doe', email: loginData.email });
        navigateTo('home');
      } else {
        // Mock registration
        setUser({ name: `${loginData.firstName} ${loginData.lastName}`, email: loginData.email });
        navigateTo('home');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-orange-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to your account' : 'Join our community of Moroccan art lovers'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={loginData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={loginData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            )}
            
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={loginData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />

            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={loginData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            )}

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Footer Component
  const Footer = () => (
    <footer className="bg-orange-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Souk Marrakech</h3>
            <p className="text-orange-200 mb-4">
              Authentic Moroccan crafts and treasures, handpicked from the souks of Marrakech.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-orange-200 hover:text-white">Facebook</a>
              <a href="#" className="text-orange-200 hover:text-white">Instagram</a>
              <a href="#" className="text-orange-200 hover:text-white">Twitter</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateTo('home')} className="text-orange-200 hover:text-white">Home</button></li>
              <li><button onClick={() => navigateTo('shop')} className="text-orange-200 hover:text-white">Shop</button></li>
              <li><a href="#" className="text-orange-200 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-orange-200 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-orange-200 hover:text-white">Rugs & Carpets</a></li>
              <li><a href="#" className="text-orange-200 hover:text-white">Ceramics</a></li>
              <li><a href="#" className="text-orange-200 hover:text-white">Textiles</a></li>
              <li><a href="#" className="text-orange-200 hover:text-white">Home Decor</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-orange-200 hover:text-white">Shipping Info</a></li>
              <li><a href="#" className="text-orange-200 hover:text-white">Returns</a></li>
              <li><a href="#" className="text-orange-200 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-orange-200 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-orange-800 mt-8 pt-8 text-center">
          <p className="text-orange-200">
            © 2024 Souk Marrakech. All rights reserved. Handcrafted with ❤️ in Morocco.
          </p>
        </div>
      </div>
    </footer>
  );

  // Main App Component
  return (
    <div className="App">
      <Header />
      
      {currentPage === 'home' && <Homepage />}
      {currentPage === 'shop' && <ShopPage />}
      {currentPage === 'product' && <ProductDetailsPage />}
      {currentPage === 'cart' && <CartPage />}
      {currentPage === 'checkout' && <CheckoutPage />}
      {currentPage === 'login' && <LoginPage />}
      
      <Footer />
    </div>
  );
};

export default EcommerceApp;
