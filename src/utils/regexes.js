export const regexes = {
    Email: /^\w+@\w+\.[Cc][Oo][Mm]$/,
    NoWhiteSpace: /^[^\s]+$/,
    AlphaNumeric: /^[a-zA-Z0-9]+$/,
    AlphaNumericSpace: /^[a-zA-Z\d\s]*$/,
    AlphaNumericSpaceDash: /^[a-zA-Z\d\-\s]*$/,
    AlphaNumericSpaceDashDotComma: /^[a-zA-Z\d\-\s\.\,]*$/,
    PhoneNumber:/^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/
};