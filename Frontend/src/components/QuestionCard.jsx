import React from 'react';

const QuestionCard = ({ id, question, type, options, value, onChange, placeholder, note }) => {
    
    // El 'handler' que le dice al formulario qué (id) y cómo (valor) cambiar
    const handleChange = (e) => {
        onChange(id, e.target.value);
    };

    const renderInput = () => {
        // Si es de tipo 'radio', mapea las opciones
        if (type === 'radio') {
            return (
                <div className="radio-options">
                    {options.map((option, index) => (
                        <label key={index} className="radio-label">
                            <input
                                type="radio"
                                name={id}
                                value={option}
                                checked={value === option}
                                onChange={handleChange}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            );
        }

        // Si es de tipo 'number', muestra un input numérico
        if (type === 'number') {
            return (
                <input
                    type="number"
                    id={id}
                    name={id}
                    className="number-input"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder || ''}
                    required
                />
            );
        }
        
        return null;
    };

    return (
        <div className="question-card">
            <label htmlFor={id} className="question-label">{question}</label>
            {note && <p className="question-note">{note}</p>}
            {renderInput()}
        </div>
    );
};

export default QuestionCard;