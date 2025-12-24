import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchMedicines } from '../../utils/api';

export default function MedicineSearch({ value, onChange, onSelect }) {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Sync internal state if prop changes/resets
        setQuery(value || '');
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            // If the query exactly matches what we just selected, don't search again immediately to avoid flicker
            // But here we rely on the debounce effect naturally or user intention.

            setIsLoading(true);
            try {
                const results = await searchMedicines(query);
                setSuggestions(results);
                setIsOpen(true);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleInputChange = (e) => {
        const newVal = e.target.value;
        setQuery(newVal);
        onChange(newVal); // Propagate raw text change
        setIsOpen(true);
    };

    const handleSelect = (medicine) => {
        setQuery(medicine.name);
        setIsOpen(false);
        onSelect(medicine);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    className="input-field pl-9"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search medicine..."
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                </div>
            </div>

            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto mt-1 list-none p-0">
                    {suggestions.map((med) => (
                        <li
                            key={med.id}
                            onClick={() => handleSelect(med)}
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm border-b border-slate-50 last:border-none"
                        >
                            <div className="font-medium text-cyan-900">{med.name}</div>
                            {med.strengths.length > 0 && (
                                <div className="text-xs text-slate-500 truncate">
                                    Available: {med.strengths.join(', ')}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
