export function convertToInt(targetHonor: string) {
    if (targetHonor.includes(",")) {
        targetHonor = targetHonor.replace(",", ".");
    }
    if (targetHonor.endsWith("b") || targetHonor.endsWith("B")) {
        targetHonor = (parseFloat(targetHonor.slice(0, -1)) * 1000000000).toString();
    } else if (targetHonor.endsWith("m") || targetHonor.endsWith("M")) {
        targetHonor = (parseFloat(targetHonor.slice(0, -1)) * 1000000).toString();
    } else if (targetHonor.endsWith("k") || targetHonor.endsWith("K")) {
        targetHonor = (parseFloat(targetHonor.slice(0, -1)) * 1000).toString();
    } else {
        targetHonor = parseFloat(targetHonor).toString();
    }
    return parseInt(targetHonor);
}
