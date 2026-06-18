"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  ShoppingBag, 
  Upload, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Minus, 
  X,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { CustomModal } from "@/components/ui/custom-modal";

interface Product {
  id: string;
  name: string;
  genericName: string;
  category: "prescription" | "otc" | "supplements" | "wellness";
  strength: string;
  manufacturer: string;
  price: number;
  inStock: boolean;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function MedicinePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "prescription" | "otc" | "supplements" | "wellness">("all");
  
  // Cart & Modal States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [checkoutSuccessOpen, setCheckoutSuccessOpen] = useState(false);
  
  // Upload Form States
  const [patientName, setPatientName] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "prescription", label: "Prescription Drugs" },
    { id: "otc", label: "Over-the-Counter" },
    { id: "supplements", label: "Supplements" },
    { id: "wellness", label: "Wellness & Care" }
  ] as const;

  const products: Product[] = [
    {
      id: "med-1",
      name: "Napa Extra",
      genericName: "Paracetamol & Caffeine",
      category: "otc",
      strength: "500mg/65mg",
      manufacturer: "Beximco Pharmaceuticals",
      price: 2.5,
      inStock: true,
      image: "💊"
    },
    {
      id: "med-2",
      name: "Maxpro",
      genericName: "Esomeprazole Magnesium",
      category: "prescription",
      strength: "20mg",
      manufacturer: "Renata Limited",
      price: 7.0,
      inStock: true,
      image: "💊"
    },
    {
      id: "med-3",
      name: "Alatrol",
      genericName: "Cetirizine Hydrochloride",
      category: "otc",
      strength: "10mg",
      manufacturer: "Square Pharmaceuticals",
      price: 3.0,
      inStock: true,
      image: "💊"
    },
    {
      id: "med-4",
      name: "Ancor",
      genericName: "Atorvastatin Calcium",
      category: "prescription",
      strength: "10mg",
      manufacturer: "Square Pharmaceuticals",
      price: 12.0,
      inStock: true,
      image: "💊"
    },
    {
      id: "med-5",
      name: "Ceevit",
      genericName: "Vitamin C (Ascorbic Acid)",
      category: "supplements",
      strength: "250mg",
      manufacturer: "Beximco Pharmaceuticals",
      price: 1.5,
      inStock: true,
      image: "🍊"
    },
    {
      id: "med-6",
      name: "Omega-3 Triple Strength",
      genericName: "Fish Oil Concentrate",
      category: "supplements",
      strength: "900mg",
      manufacturer: "CarePulse Nutrition",
      price: 850.0,
      inStock: true,
      image: "🐟"
    },
    {
      id: "med-7",
      name: "Moxacil",
      genericName: "Amoxicillin Trihydrate",
      category: "prescription",
      strength: "500mg",
      manufacturer: "Incepta Pharmaceuticals",
      price: 8.5,
      inStock: false,
      image: "💊"
    },
    {
      id: "med-8",
      name: "Digital Blood Pressure Monitor",
      genericName: "Automatic Upper Arm BP Monitor",
      category: "wellness",
      strength: "1 Unit",
      manufacturer: "Omron Healthcare",
      price: 3500.0,
      inStock: true,
      image: "🩺"
    }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prod.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prod.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "all" || prod.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Cart operations
  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, amount: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const handleCheckout = () => {
    setCart([]);
    setCartOpen(false);
    setCheckoutSuccessOpen(true);
  };

  const handlePrescriptionUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !fileName) return;
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadModalOpen(false);
      setPatientName("");
      setFileName("");
    }, 2500);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header / Pharmacy Showcase */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-950/0 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              CarePulse Pharmacy
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
              Order Geniune Medicines Online
            </h1>
            <p className="text-xs sm:text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
              Upload prescriptions or browse over-the-counter wellness essentials. Guaranteed genuine healthcare deliveries to your doorstep within 12 hours.
            </p>
          </div>
          
          <button 
            onClick={() => setUploadModalOpen(true)}
            className="flex-shrink-0 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-505 text-white px-6 py-3.5 rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Upload className="h-4.5 w-4.5" />
            Upload Prescription
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">
              Search Health Products
            </h2>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by brand name, generic name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-hidden focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-655 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <div 
                key={prod.id} 
                className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Image Badge / Label */}
                  <div className="relative bg-slate-50 dark:bg-slate-850 rounded-2xl h-36 flex items-center justify-center text-5xl select-none group-hover:scale-[1.02] transition-transform">
                    {prod.image}
                    <span className="absolute top-2.5 right-2.5 bg-white/90 dark:bg-slate-800/90 text-slate-500 text-[8px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border border-slate-100 dark:border-slate-700">
                      {prod.category}
                    </span>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate-400 font-semibold truncate uppercase">
                      {prod.manufacturer}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight truncate">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-slate-450 dark:text-slate-500 italic truncate font-medium">
                      {prod.genericName}
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-bold text-slate-600 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-750">
                        {prod.strength}
                      </span>
                      {prod.inStock ? (
                        <span className="text-[9px] font-bold text-emerald-600 uppercase">In Stock</span>
                      ) : (
                        <span className="text-[9px] font-bold text-rose-500 uppercase">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price and Cart Call to Action */}
                <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-850 mt-5 pt-3">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Unit Price</span>
                    <span className="text-base font-extrabold text-primary">৳{prod.price}</span>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(prod)}
                    disabled={!prod.inStock}
                    className="bg-primary hover:bg-primary/95 disabled:bg-slate-100 disabled:text-slate-400 text-white p-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed text-xs font-bold"
                  >
                    <Plus className="h-4 w-4" />
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl space-y-4">
            <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No Medicines Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any products in our database matching your inquiry. Please try searching another term.
            </p>
          </div>
        )}
      </div>

      {/* Cart Button Floating Badge */}
      {cart.length > 0 && (
        <button 
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white p-4.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer z-30"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full border border-primary">
              {cart.reduce((s, c) => s + c.quantity, 0)}
            </span>
          </div>
          <span className="text-xs font-bold hidden sm:inline">Check Cart (৳{cartTotal.toFixed(1)})</span>
        </button>
      )}

      {/* Cart Drawer Modal */}
      <CustomModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        title="Shopping Cart Items"
      >
        <div className="space-y-6">
          {cart.length > 0 ? (
            <>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
                        {item.product.image}
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white">{item.product.name}</span>
                        <span className="block text-[10px] text-slate-450 dark:text-slate-400 leading-normal">
                          ৳{item.product.price.toFixed(1)} &bull; {item.product.strength}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* Quantity Selectors */}
                      <div className="flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-850 rounded cursor-pointer"
                        >
                          <Minus className="h-3 w-3 text-slate-500" />
                        </button>
                        <span className="text-xs font-extrabold px-1 text-slate-900 dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-850 rounded cursor-pointer"
                        >
                          <Plus className="h-3 w-3 text-slate-500" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="border-t border-slate-150 dark:border-slate-800 pt-4 space-y-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-350">৳50.0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">Estimated Subtotal</span>
                  <span className="font-black text-primary">৳{(cartTotal + 50).toFixed(1)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setCartOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleCheckout}
                  className="bg-primary hover:bg-primary/95 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Proceed Checkout
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 space-y-3">
              <ShoppingBag className="h-10 w-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-xs">Your Cart is Empty</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Add health products and medicines to your cart first to continue checkout.
              </p>
            </div>
          )}
        </div>
      </CustomModal>

      {/* Prescription Upload Simulation Modal */}
      <CustomModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Medical Prescription"
      >
        <form onSubmit={handlePrescriptionUpload} className="space-y-4">
          {uploadSuccess ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 p-4 rounded-xl text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Upload Confirmed</h4>
              <p className="text-[10px] text-slate-450 dark:text-slate-400">
                Prescription uploaded successfully. CarePulse pharmacist will review and verify dosage shortly.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Patient Profile Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Select Prescription File *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. prescription_june.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-hidden focus:border-primary transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-505 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                >
                  Confirm Upload
                </button>
              </div>
            </>
          )}
        </form>
      </CustomModal>

      {/* Checkout Success Modal */}
      <CustomModal
        isOpen={checkoutSuccessOpen}
        onClose={() => setCheckoutSuccessOpen(false)}
        title="Order Placed Successfully!"
      >
        <div className="text-center py-6 space-y-4">
          <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Order Registered</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Your pharmaceutical order has been verified. The delivery driver will arrive at your registered address with the items. Cash-on-delivery is accepted, or settle transaction status inside your Patient Dashboard.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setCheckoutSuccessOpen(false)}
              className="bg-primary hover:bg-primary/95 text-white px-8 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors w-full sm:w-auto"
            >
              Done
            </button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
