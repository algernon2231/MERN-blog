
export const slugify = (...args) => {
    const value = args.join(' ');
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
}

export const ucfirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
