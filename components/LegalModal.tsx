
import React from 'react';

interface LegalModalProps {
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const isPrivacy = type === 'privacy';
  
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl h-[80vh] glass-panel rounded-[3rem] flex flex-col overflow-hidden border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-white/10 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-white italic tracking-tight">
              {isPrivacy ? 'Privacy Protocol' : 'Terms of Service'}
            </h2>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Legal Compliance v1.0.4</p>
          </div>
          <button onClick={onClose} className="size-12 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 custom-scrollbar text-white/80 leading-relaxed font-medium">
          {isPrivacy ? (
            <>
              <section>
                <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-4">1. Data Collection</h3>
                <p className="text-sm">Aether Weather & Panchang requests access to your precise geolocation to provide accurate atmospheric data and local Vedic calculations (Tithi, Sunrise/Sunset). This data is processed locally or sent via encrypted streams to our weather providers. We do not store your location history on our servers.</p>
              </section>
              <section>
                <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-4">2. AI Processing</h3>
                <p className="text-sm">Search queries and atmospheric parameters are processed via the Google Gemini API. By using the "Search" functionality, you agree to Google's Privacy Policy. No personally identifiable information (PII) is intentionally transmitted to AI models.</p>
              </section>
              <section>
                <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-4">3. Third-Party Services</h3>
                <p className="text-sm">We utilize OpenWeatherMap for fallback meteorological data. Their use of data is governed by their respective privacy policies.</p>
              </section>
              <section>
                <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-4">4. User Rights</h3>
                <p className="text-sm">You may revoke location permissions at any time through your system settings. As we do not maintain user accounts or persistent server-side profiles, there is no personal data to delete from our infrastructure.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-4">1. Acceptance of Terms</h3>
                <p className="text-sm">By accessing Aether, you agree to be bound by these terms. This application is provided "as is" for informational and spiritual purposes.</p>
              </section>
              <section>
                <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-4">2. Vedic Data Disclaimer</h3>
                <p className="text-sm">Panchang calculations, Tithis, and Rashifal predictions are based on traditional Vedic algorithms. These are intended for religious and cultural educational purposes. Aether does not guarantee the astronomical accuracy of these predictions for scientific use.</p>
              </section>
              <section>
                <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-4">3. Weather Accuracy</h3>
                <p className="text-sm">Meteorological data is sourced from AI-grounded searches and third-party APIs. While we strive for precision, atmospheric conditions can change rapidly. Do not rely solely on this app for life-safety decisions during extreme weather events.</p>
              </section>
              <section>
                <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-4">4. Usage Limits</h3>
                <p className="text-sm">Users are prohibited from reverse-engineering the application or attempting to scrape data from our integrated API streams.</p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 border-t border-white/10 flex justify-center">
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-transform"
           >
             I Understand
           </button>
        </div>
      </div>
    </div>
  );
};
