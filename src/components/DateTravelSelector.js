import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function DateTravelSelector({ onChange, initialData }) {
  const [dates, setDates] = useState({
    startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
    endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
    travelers: initialData?.travelers || 4,
    rooms: initialData?.rooms || 2
  });

  const handleDateChange = (key, value) => {
    const newDates = { ...dates, [key]: value };
    setDates(newDates);
    onChange(newDates);
  };

  const handleNumberChange = (key, value) => {
    const newValue = Math.max(1, parseInt(value) || 1);
    const newDates = { ...dates, [key]: newValue };
    setDates(newDates);
    onChange(newDates);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sélecteur de dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de départ
          </label>
          <DatePicker
            selected={dates.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date de retour
          </label>
          <DatePicker
            selected={dates.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            dateFormat="dd/MM/yyyy"
            minDate={dates.startDate}
          />
        </div>
      </div>

      {/* Sélecteur de voyageurs et chambres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de voyageurs
          </label>
          <input
            type="number"
            value={dates.travelers}
            onChange={(e) => handleNumberChange('travelers', e.target.value)}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de chambres
          </label>
          <input
            type="number"
            value={dates.rooms}
            onChange={(e) => handleNumberChange('rooms', e.target.value)}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>
    </div>
  );
}

export default DateTravelSelector;