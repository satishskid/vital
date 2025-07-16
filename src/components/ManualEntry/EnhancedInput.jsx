import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck, FiInfo } from 'react-icons/fi';

const SafeIcon = ({ icon: Icon, ...props }) => {
  if (!Icon) return <div {...props} />;
  return <Icon {...props} />;
};

const EnhancedInput = ({ 
  type = 'text',
  value, 
  onChange, 
  placeholder, 
  suggestions = [], 
  className = '',
  error = null,
  label,
  tooltip,
  min,
  max,
  step,
  unit = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (type === 'suggestions' && value) {
      const filtered = suggestions.filter(suggestion => 
        suggestion.label.toLowerCase().includes(value.toString().toLowerCase()) ||
        suggestion.value.toString().includes(value.toString())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [value, suggestions, type]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (type === 'suggestions') {
      setIsOpen(true);
      setHighlightedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (type !== 'suggestions' || !isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
          handleSuggestionClick(filteredSuggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const renderInput = () => {
    const baseInputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
      error ? 'border-red-300' : 'border-gray-300'
    } ${className}`;

    if (type === 'dropdown') {
      return (
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`${baseInputClass} flex items-center justify-between text-left`}
          >
            <span className={value ? 'text-gray-900' : 'text-gray-500'}>
              {value ? suggestions.find(s => s.value === value)?.label || value : placeholder}
              {unit && value && ` ${unit}`}
            </span>
            <SafeIcon 
              icon={FiChevronDown} 
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.value}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      value === suggestion.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === suggestions.length - 1 ? 'rounded-b-lg' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{suggestion.label}</div>
                        {suggestion.description && (
                          <div className="text-sm text-gray-500">{suggestion.description}</div>
                        )}
                      </div>
                      {value === suggestion.value && (
                        <SafeIcon icon={FiCheck} className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (type === 'suggestions') {
      return (
        <div className="relative" ref={dropdownRef}>
          <input
            ref={inputRef}
            type="number"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className={baseInputClass}
          />
          
          <AnimatePresence>
            {isOpen && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.value}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      index === highlightedIndex ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-900'
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === filteredSuggestions.length - 1 ? 'rounded-b-lg' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{suggestion.label}</div>
                        {suggestion.description && (
                          <div className="text-sm text-gray-500">{suggestion.description}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Default input
    return (
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={baseInputClass}
      />
    );
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {tooltip && (
            <div className="relative inline-block ml-2">
              <div className="group">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiInfo} className="w-4 h-4" />
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  {tooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
          )}
        </label>
      )}
      
      {renderInput()}
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default EnhancedInput;
