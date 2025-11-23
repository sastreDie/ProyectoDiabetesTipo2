import React, { useState } from 'react';
import QuestionCard from './QuestionCard';
import { submitSurvey } from '../api';

// 1. Agregamos glucose_level al estado inicial
const initialFormState = {
    age_range: '',
    sex: '',
    weight_kg: '',
    height_cm: '',
    waist_size: '',
    family_diabetes: '',
    physical_activity_days: '',
    sitting_hours: '',
    sugary_drinks_freq: '',
    vegetables_freq: '',
    fast_food_freq: '',
    acanthosis_nigricans: '',
    glucose_level: '', // <--- ¡IMPORTANTE!
};

const SurveyForm = ({ onSurveySubmit }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (id, value) => {
        let finalValue = value;

        // --- LÓGICA NUEVA: Bloqueo de puntos en Altura ---
        if (id === 'height_cm') {
            // Reemplaza puntos (.) y comas (,) por nada ('')
            finalValue = finalValue.replace(/[.,]/g, '');

            // Opcional: Si quieres asegurarte que sean solo números
            // finalValue = finalValue.replace(/[^0-9]/g, '');
        }

        setFormData(prev => ({
            ...prev,
            [id]: finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- VALIDACIÓN DE SEGURIDAD ---
        // Validamos que la altura sea razonable para un adulto (mayor a 100cm)
        // Si es menor a 100, probablemente intentaron poner metros o se equivocaron.
        if (formData.height_cm && parseInt(formData.height_cm) < 100) {
            setError("La altura parece incorrecta. Por favor ingrésala en CENTÍMETROS (ejemplo: 160, 170, 180).");
            setIsLoading(false);
            // Hacemos scroll hacia arriba para que vean el error
            window.scrollTo(0, 0);
            return;
        }

        setIsLoading(true);
        setError(null);

        // ... Aquí sigue tu lógica original de envío ...
        try {
            const resultData = await submitSurvey(formData);
            onSurveySubmit(resultData);
        } catch (err) {
            setError('Error al guardar los datos. Intenta de nuevo.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="survey-form">

            <QuestionCard
                id="age_range"
                question="1. ¿En qué rango de edad te encuentras?"
                type="radio"
                options={['Menos de 40 años', '40-59 años', '60 años o más']}
                value={formData.age_range}
                onChange={handleChange}
            />

            <QuestionCard
                id="sex"
                question="2. ¿Cuál es tu sexo (asignado al nacer)?"
                note="Se usa 'sexo asignado al nacer' porque los riesgos (ej. diabetes gestacional) están ligados a la biología"
                type="radio"
                options={['Mujer', 'Hombre']}
                value={formData.sex}
                onChange={handleChange}
            />

            <QuestionCard
                id="weight_kg"
                question="3. ¿Cuánto pesas actualmente (en kilogramos)?"
                type="number"
                placeholder="Ej. 78"
                value={formData.weight_kg}
                onChange={handleChange}
            />

            <QuestionCard
                id="height_cm"
                question="4. ¿Cuánto mides (en centímetros)?"
                type="number"
                placeholder="Ej. 165"
                value={formData.height_cm}
                onChange={handleChange}
            />

            <QuestionCard
                id="waist_size"
                question="5. ¿Qué talla de cintura del pantalon utilizas?"
                note="Para mayor precision mide a la altura del ombligo en pulgadas."
                type="number"
                placeholder="Ej. 30"
                value={formData.waist_size}
                onChange={handleChange}
            />

            <QuestionCard
                id="family_diabetes"
                question="6. ¿Alguno de tus familiares directos (padres, hermanos) ha sido diagnosticado con diabetes?"
                type="radio"
                options={['Sí', 'No', 'No sé']}
                value={formData.family_diabetes}
                onChange={handleChange}
            />

            <QuestionCard
                id="physical_activity_days"
                question="7. En una semana normal, ¿cuántos días realizas al menos 30 minutos de actividad física?"
                type="radio"
                options={['5 o más días', '0-4 días']}
                value={formData.physical_activity_days}
                onChange={handleChange}
            />

            <QuestionCard
                id="sitting_hours"
                question="8. Pensando en un día típico, ¿cuántas horas en total pasas sentado?"
                note="Suma trabajo, transporte, comidas y descanso en el sillón"
                type="radio"
                options={['Menos de 4 horas', '4+ horas']}
                value={formData.sitting_hours}
                onChange={handleChange}
            />

            <QuestionCard
                id="sugary_drinks_freq"
                question="9. ¿Con qué frecuencia tomas refrescos, jugos o aguas con azúcar?"
                type="radio"
                options={['Diario (o casi diario)', 'Casi nunca o nunca']}
                value={formData.sugary_drinks_freq}
                onChange={handleChange}
            />

            <QuestionCard
                id="vegetables_freq"
                question="10. ¿Con qué frecuencia comes verduras o ensaladas?"
                type="radio"
                options={['Diario (en 2 o más comidas)', 'Casi nunca o nunca']}
                value={formData.vegetables_freq}
                onChange={handleChange}
            />

            <QuestionCard
                id="fast_food_freq"
                question="11. ¿Cuántas veces por semana comes 'antojitos' o comida rápida?"
                type="radio"
                options={['5 o más / semana', 'Menos de 5 / semana']}
                value={formData.fast_food_freq}
                onChange={handleChange}
            />

            <QuestionCard
                id="acanthosis_nigricans"
                question="12. ¿Has notado manchas oscuras y gruesas en tu cuello, axilas o ingles?"
                type="radio"
                options={['Sí', 'No', 'No estoy seguro/a']}
                value={formData.acanthosis_nigricans}
                onChange={handleChange}
            />
            <QuestionCard
                id="glucose_level"
                question="13. ¿Cuál fue tu nivel de glucosa medido? (mg/dL)"
                note="Dato informativo. No afecta el puntaje de riesgo."
                type="number"
                placeholder="Ej. 98"
                value={formData.glucose_level}
                onChange={handleChange}
            />

            <div className="form-footer">
                <div className="disclaimer-box">
                    <p><strong>Advertencia:</strong> Este formulario es una herramienta de tamizaje y <strong>no es un diagnóstico médico</strong>.</p>
                    <p>Los resultados se basan en factores de riesgo estadísticos.</p>
                </div>

                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? 'Calculando...' : 'Calcular mi Riesgo'}
                </button>
            </div>
        </form>
    );
};

export default SurveyForm;