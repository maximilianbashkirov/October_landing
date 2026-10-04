import React, { useState, useEffect } from 'react';
import { Send, Mail, ChevronDown } from 'lucide-react';

// lucide-react removed brand icons, so Instagram is drawn locally in the same style
const Instagram = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const products = [
    {
      id: 1,
      name: 'october 2003',
      price: '8 900 ₽',
      image: 'https://placehold.co/600x800/E8E8E8/B22222?text=HOODIE+DROP+001',
      description: 'Oversized hoodie with spider web embroidery'
    },
    {
      id: 2,
      name: 'october 2003',
      price: '6 500 ₽',
      image: 'https://placehold.co/600x800/E8E8E8/B22222?text=T-SHIRT+LIMITED',
      description: 'Limited edition tee with heart web print'
    },
    {
      id: 3,
      name: 'october 2003',
      price: '7 200 ₽',
      image: 'https://placehold.co/600x800/E8E8E8/B22222?text=SWEATER+CROP',
      description: 'Cropped sweater with spider details'
    }
  ];

  const contactLinks = [
    { icon: Instagram, label: '@october_2003', href: 'https://instagram.com', color: 'hover:text-pink-600' },
    { icon: Send, label: '@october_brand', href: 'https://t.me', color: 'hover:text-blue-500' },
    { icon: Mail, label: 'hello@october.com', href: 'mailto:hello@october.com', color: 'hover:text-red-600' }
  ];

  const SpiderWeb = ({ className }) => (
    <svg viewBox="0 0 200 200" className={className}>
      <defs>
        <radialGradient id="webGrad" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#B22222" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#B22222" stopOpacity="0.8"/>
        </radialGradient>
      </defs>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line key={i} x1="100" y1="100" x2={100 + 90 * Math.cos(angle * Math.PI / 180)} y2={100 + 90 * Math.sin(angle * Math.PI / 180)} stroke="url(#webGrad)" strokeWidth="1" fill="none" />
      ))}
      {[20, 40, 60, 80].map((radius, i) => (
        <polygon key={i} points={[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
          const r = radius + i * 5;
          return `${100 + r * Math.cos(angle * Math.PI / 180)},${100 + r * Math.sin(angle * Math.PI / 180)}`;
        }).join(' ')} fill="none" stroke="url(#webGrad)" strokeWidth="1" />
      ))}
      <path d="M100 95 C100 95, 95 90, 92 92 C88 96, 92 100, 100 108 C108 100, 112 96, 108 92 C105 90, 100 95, 100 95" fill="#B22222" />
    </svg>
  );

  const Spider = ({ className }) => (
    <svg viewBox="0 0 100 120" className={className}>
      <g fill="#1a1a1a">
        <ellipse cx="50" cy="70" rx="15" ry="20" />
        <circle cx="50" cy="45" r="12" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i - 3.5) * 0.4;
          const x1 = 50 + Math.sin(angle) * 15;
          const y1 = 60 + Math.cos(angle) * 10;
          const x2 = 50 + Math.sin(angle) * 35 + (i < 4 ? -10 : 10);
          const y2 = 60 + Math.cos(angle) * 20 + (i % 2) * 10;
          return (
            <path key={i} d={`M ${x1} ${y1} Q ${x1 + (x2-x1)/2} ${y1} ${x2} ${y2}`} stroke="#1a1a1a" strokeWidth="2" fill="none" />
          );
        })}
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-[#E8E8E8] to-gray-200 overflow-x-hidden relative">
      {/* Эффект шума (зернистости) */}
      <div className="noise-overlay" />

      {/* Кастомный курсор */}
      <div 
        className="fixed w-4 h-4 bg-[#B22222] rounded-full pointer-events-none z-[10000] mix-blend-difference transition-transform duration-100 hidden md:block"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: `scale(${selectedProduct ? 1.5 : 1})`
        }}
      />

      {/* Навигация */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="flex justify-between items-center p-6 md:p-8">
          <div className="text-[#B22222] font-black text-lg tracking-widest">OCTOBER</div>
          <div className="flex gap-6 text-sm font-bold text-gray-700">
            <button className="hover:text-[#B22222] transition-colors">SHOP</button>
            <button className="hover:text-[#B22222] transition-colors">ABOUT</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <SpiderWeb className="w-full h-full absolute top-20" />
        </div>

        <div className={`relative z-10 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="relative">
            <div 
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-wider text-[#B22222] transform -rotate-2 select-none"
              style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}
            >
              OCTOBER
            </div>
            
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-64 h-32">
              <SpiderWeb className="w-full h-full opacity-60" />
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 animate-spider-drop">
                <div className="w-0.5 h-16 bg-gradient-to-b from-[#B22222] to-gray-800 mx-auto"></div>
                <Spider className="w-12 h-16 mt-1 drop-shadow-xl" />
              </div>
            </div>

            <div className="mt-32 flex justify-center">
              <div className="w-96 h-2 bg-gradient-to-r from-transparent via-[#B22222] to-transparent rounded-full opacity-30"></div>
            </div>
          </div>
        </div>

        <div className={`absolute bottom-10 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <ChevronDown className="w-8 h-8 text-[#B22222] animate-bounce" />
        </div>
      </section>

      {/* Products Section */}
      <section className="relative py-32 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-[#B22222] mb-4 tracking-tight">DROP 001</h2>
            <p className="text-gray-500 text-lg font-medium">Limited Edition • October 2003</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`group cursor-pointer transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
              >
                <div className="relative overflow-hidden bg-[#E8E8E8] rounded-2xl aspect-[3/4] mb-6 border border-gray-200">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#B22222] bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-[#B22222] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    CLICK TO ORDER
                  </div>
                  <div className="absolute top-4 left-4 w-16 h-16 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
                    <SpiderWeb className="w-full h-full" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-[#B22222] transition-colors">{product.name}</h3>
                  <p className="text-gray-500 font-medium mb-3 text-sm">{product.description}</p>
                  <p className="text-2xl font-black text-[#B22222]">{product.price}</p>

                  <div className={`mt-6 overflow-hidden transition-all duration-500 ${selectedProduct === product.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pt-6 border-t-2 border-[#E8E8E8]">
                      <p className="text-xs font-black text-gray-700 mb-4 uppercase tracking-widest">Связаться для покупки</p>
                      <div className="flex justify-center gap-6">
                        {contactLinks.map((contact, i) => (
                          <a key={i} href={contact.href} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center gap-2 text-gray-600 transition-all duration-300 ${contact.color} hover:scale-110`}>
                            <contact.icon className="w-6 h-6" />
                            <span className="text-[10px] font-bold uppercase">{contact.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 text-xs text-gray-400 font-medium transition-opacity duration-300 ${selectedProduct === product.id ? 'opacity-0' : 'opacity-100'}`}>
                    Нажми, чтобы открыть ссылки ↓
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="relative py-32 px-4 bg-[#B22222] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Spider className="w-20 h-24 mx-auto mb-8 opacity-50" />
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            WE ARE<br />
            <span className="text-[#E8E8E8]">OCTOBER</span>
          </h2>
          <p className="text-xl md:text-2xl font-medium text-white text-opacity-90 mb-12 leading-relaxed">
            Born in 2003. For those who dare to be different.<br />
            Streetwear with a dark soul.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2024 October 2003. All rights reserved.</p>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Spider className="w-4 h-5" />
              <span>Made with darkness</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;