/**
 * Given the price impact severity, get user swap button text.
 *
 * @param priceImpactSeverity price impact severity of the trade.
 */
export default function PriceImpactSwapText(priceImpactSeverity: 0 | 1 | 2 | 3 | 4): string {
    switch(priceImpactSeverity){
        case 2:
            return 'Moderate Price Impact';
        case 3:
            return 'High Price Impact';
        case 4:
            return 'Extreme Price Impact';
        default:
            return 'Swap';
    }
}
