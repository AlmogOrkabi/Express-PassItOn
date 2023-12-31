const userStatuses = ['פעיל', 'לא פעיל', 'חסום']

const postCategories = ['ריהוט', 'מכשור חשמלי', 'כלי מטבח', 'כלי בית', 'צעצועים/משחקים', 'ספרים', 'ביגוד', 'כלי עבודה', 'ציוד ספורט וקמפינג', 'ציוד משרדי', 'פרטי תינוקות', 'יצירה', 'עיצוב הבית', 'ציוד לחיות מחמד', 'כלי נגינה', 'ציוד רפואי', 'טיפוח', 'תיקים', 'ציוד לבית הספר'];

const postStatuses = ['זמין', 'לא זמין למסירה', 'בתהליך מסירה', 'נמסר', 'סגור', 'מבוטל', 'בבדיקת מנהל'];

const reportTypes = ["מידע שגוי/מוטעה", "שימוש לרעה במערכת", "הטרדה/התנהגות לא הולמת", "ספאם", "הונאה", "מעבר על חוקי הפורמט", "פגיעה בפרטיות", "פרסום חוזר של פריטים שנמסרו בעבר", "אחר"];

const reportStatuses = ['פתוח', 'בטיפול מנהל', 'בבירור', 'סגור'];

const requestStatuses = ['נסגר', 'נשלח', 'אושר', 'נדחה', 'בוטל'];

module.exports = { userStatuses, postCategories, postStatuses, reportTypes, reportStatuses, requestStatuses };


// error types: (just for documentation purposes)
// error: 'INVALID_DETAILS'
// error: 'NOT_FOUND'
// error: 'UNAUTHORIZED'
// error: 'ACCESS_DENIED'