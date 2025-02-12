// src/components/DateTravelSelector.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const DateTravelSelector = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dates, setDates] = useState({
    startDate: new Date(),
    endDate: new Date(),
    travelers: 4,
    rooms: 2
  });

  const [showTravelersSelect, setShowTravelersSelect] = useState(false);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setDates(prev => ({
      ...prev,
      startDate: start,
      endDate: end
    }));
    onChange({
      ...dates,
      startDate: start,
      endDate: end
    });
  };

  const handleTravelersChange = (type, operation) => {
    setDates(prev => {
      const newValue = operation === 'increment' 
        ? prev[type] + 1 
        : Math.max(type === 'rooms' ? 1 : 1, prev[type] - 1);
      
      const newDates = {
        ...prev,
        [type]: newValue
      };
      
      // Si le nombre de chambres devient supérieur au nombre de voyageurs
      if (type === 'rooms' && newValue > prev.travelers) {
        newDates.travelers = newValue;
      }
      // Si le nombre de voyageurs devient inférieur au nombre de chambres
      if (type === 'travelers' && newValue < prev.rooms) {
        newDates.rooms = newValue;
      }
      
      onChange(newDates);
      return newDates;
    });
  };

  return (
    <div className="relative">
      <div className="border border-[#9557fa] rounded-xl p-4 cursor-pointer"
           onClick={() => setIsOpen(true)}>
        <div className="flex justify-between mb-2">
          <div>
            <div className="text-gray-500 text-sm">Date de Départ</div>
            <div>{dates.startDate.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Date de Retour</div>
            <div>{dates.endDate.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</div>
          </div>
        </div>
        <div 
          className="text-gray-500 text-sm cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setShowTravelersSelect(!showTravelersSelect);
          }}
        >
          {dates.travelers} Voyageur{dates.travelers > 1 ? 's' : ''}, {dates.rooms} Chambre{dates.rooms > 1 ? 's' : ''}
        </div>
      </div>

      {/* Calendrier Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl max-w-2xl w-full mx-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-semibold">Sélectionnez vos dates</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <DatePicker
              selected={dates.startDate}
              onChange={handleDateChange}
              startDate={dates.startDate}
              endDate={dates.endDate}
              selectsRange
              inline
              monthsShown={2}
              minDate={new Date()}
              dateFormat="dd/MM/yyyy"
            />
            <div className="mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-4 py-2 rounded-full"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sélecteur de voyageurs et chambres */}
      {showTravelersSelect && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-40">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Voyageurs</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTravelersChange('travelers', 'decrement')}
                  className="w-8 h-8 rounded-full border border-[#9557fa] text-[#9557fa] flex items-center justify-center"
                >
                  -
                </button>
                <span>{dates.travelers}</span>
                <button
                  onClick={() => handleTravelersChange('travelers', 'increment')}
                  className="w-8 h-8 rounded-full border border-[#9557fa] text-[#9557fa] flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span>Chambres</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTravelersChange('rooms', 'decrement')}
                  className="w-8 h-8 rounded-full border border-[#9557fa] text-[#9557fa] flex items-center justify-center"
                >
                  -
                </button>
                <span>{dates.rooms}</span>
                <button
                  onClick={() => handleTravelersChange('rooms', 'increment')}
                  className="w-8 h-8 rounded-full border border-[#9557fa] text-[#9557fa] flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowTravelersSelect(false)}
              className="w-full bg-gradient-to-r from-[#9557fa] to-[#fa9b3d] text-white px-4 py-2 rounded-full mt-4"
            >
              Confirmer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTravelSelector;