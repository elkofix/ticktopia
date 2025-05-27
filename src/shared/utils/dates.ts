export function formateDate(date: string) {
    return new Date(date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
export const formatDateYMD = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const getDaysBetween = (date: string, date2: string) => {
    const availabilityDate = new Date(date);
    const eventOpenDate = new Date(date2);
    const diffTime = eventOpenDate.getTime() - availabilityDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};


export const isLaterDate = (date: string) => {
    const now = new Date();
    const availabilityDate = new Date(date);
    return now >= availabilityDate;
};
