export default function truncateToTwoDecimalPlaces(str) {
    let num = parseFloat(str);
    num = Math.floor(num * 100) / 100;
    return num.toFixed(2);
};