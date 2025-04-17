
import React, { useState } from 'react';
import CandleCard from './CandleCard';
import CandleModal from './CandleModal';
import { useCandleContext } from '../context/CandleContext';
import { Candle } from '../types/candle';

const ProductsSection: React.FC = () => {
  const { candles } = useCandleContext();
  const [selectedCandle, setSelectedCandle] = useState<Candle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (candle: Candle) => {
    setSelectedCandle(candle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Filter candles to only show live ones that aren't marked as coming soon
  const liveCandles = candles.filter(candle => 
    (candle as any).isLive === true && !(candle as any).isComingSoon
  );

  return (
    <section id="products" className="section-padding bg-white">
      <div className="container mx-auto">
        <h2 className="section-title">Our Collections</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Discover our artisanal candles, each crafted with intention and care to bring warmth, light, and fragrance to your special moments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveCandles.length > 0 ? (
            liveCandles.map((candle) => (
              <div 
                key={candle.id} 
                className="opacity-0 animate-fade-in" 
                style={{ animationDelay: `${parseInt(candle.id) * 0.15}s` }}
              >
                <CandleCard
                  id={candle.id}
                  name={candle.name}
                  image={candle.image}
                  description={candle.description}
                  onClick={() => openModal(candle)}
                />
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No candles available at the moment. Check back soon!
            </div>
          )}
        </div>
        
        <CandleModal
          candle={selectedCandle}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </section>
  );
};

export default ProductsSection;
