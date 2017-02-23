/**
 * html escape
 * @param text
 * @returns {number}
 */
module.exports = function(text) {
    return text ? text.replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/"/g, '&quot;').
        replace(/'/g, '&#039;')
        : '';
};