import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// 1. Lógica de BMI (Sin cambios)
const calculateBmi = (weight_kg, height_cm) => {
    if (height_cm === 0) return 0.0;
    const height_m = height_cm / 100;
    return weight_kg / (height_m * height_m);
};

// 2. Lógica de Puntuación (Cálculo de Riesgo)
// NO modificamos nada aquí para garantizar que la glucosa NO afecte el score.
export const calculateRisk = (data) => {
    let score = 0;

    // --- INICIO DE CÁLCULO DE SCORE ---

    // 1. Edad
    if (data.age_range === "40-59 años") score += 2;
    else if (data.age_range === "60 años o más") score += 3;

    // 2. BMI
    const bmi = calculateBmi(data.weight_kg, data.height_cm);
    if (bmi >= 25 && bmi < 30) score += 2;
    else if (bmi >= 30) score += 4;

    // 3. Cintura/Talla
    const waist = parseFloat(data.waist_size || 0);
    if ((data.sex === "Hombre" && waist > 34) || (data.sex === "Mujer" && waist > 32)) {
        score += 3;
    }

    // 4. Antecedentes
    if (data.family_diabetes === "Sí") score += 4;

    // 5. Actividad Física
    if (data.physical_activity_days === "0-4 días") score += 3;

    // 6. Sedentarismo
    if (data.sitting_hours === "4+ horas") score += 3;

    // 7. Refrescos
    if (data.sugary_drinks_freq === "Diario (o casi diario)") score += 3;

    // 8. Verduras
    if (data.vegetables_freq === "Casi nunca o nunca") score += 3;

    // 9. Antojitos / Comida Rápida
    if (data.fast_food_freq === "5 o más / semana") score += 3;

    // 10. Acantosis
    if (data.acanthosis_nigricans === "Sí") score += 6;

    // --- FIN DE CÁLCULO DE SCORE ---

    // --- RANGOS DE RIESGO ---
    let risk_level = "Bajo";
    let message = "Riesgo Bajo (0-9 Puntos): Población sin factores de riesgo dominantes.";

    if (score >= 10 && score <= 20) {
        risk_level = "Medio";
        message = "Riesgo Medio (10-20 Puntos): Población con alta carga de riesgo conductual.";
    } else if (score >= 21) {
        risk_level = "Alto";
        message = "Riesgo Alto (21+ Puntos): Población con múltiples factores de riesgo.";
    }

    return {
        score,
        bmi: parseFloat(bmi.toFixed(2)),
        risk_level,
        message,
    };
};

// 3. Función para GUARDAR en Firestore
export const submitSurvey = async (surveyData) => {

    // 1. Calculamos el riesgo (Aquí la glucosa es ignorada totalmente)
    const results = calculateRisk(surveyData);

    // 2. Preparamos la glucosa explícitamente
    // Nos aseguramos que sea un número flotante para la base de datos.
    // Si viene vacío, guardamos null o 0 según prefieras.
    const glucoseValue = surveyData.glucose_level ? parseFloat(surveyData.glucose_level) : null;

    // 3. Construimos el objeto final
    const documentToSave = {
        ...surveyData,         // Copia todos los campos del form (nombre, edad, etc.)
        glucose_level: glucoseValue, // Sobreescribimos/Aseguramos la glucosa formateada
        ...results,            // Agregamos score, risk_level, bmi
        created_at: serverTimestamp(),
    };

    try {
        const docRef = await addDoc(collection(db, "encuestas"), documentToSave);
        console.log("Encuesta guardada con ID:", docRef.id);

        return {
            id: docRef.id,
            ...results // Retornamos los resultados al frontend para mostrar la alerta/mensaje
        };
    } catch (error) {
        console.error("Error al guardar en Firestore:", error);
        throw error;
    }
};