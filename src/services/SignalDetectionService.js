class SignalDetectionService {
    isShortSign(data) {
        if (data.length < 2) return false;

        const prev = data[0];
        const curr = data[data.length - 1];

        const prevFunding = Number(prev.fundingRate ?? 0);
        const currFunding = Number(curr.fundingRate ?? 0);
        const prevOI = Number(prev.openInterest ?? 0);
        const currOI = Number(curr.openInterest ?? 0);
        const prevVdelta = Number(prev.vdelta ?? 0);
        const currVdelta = Number(curr.vdelta ?? 0);

        // Funding rate flipped from negative to positive
        const fundingRateFlipped = prevFunding < 0 && currFunding > 0;

        // Adjusted realistic thresholds
        const strongFunding = currFunding > 0.0001; // if currFun > 0.1,  it's too high gpt said
        const oiUp = currOI > prevOI; // OI must increase
        const vdeltaDown = currVdelta < prevVdelta && currVdelta < 0; // vdelta trending negative

        return fundingRateFlipped && strongFunding && oiUp && vdeltaDown;
    }

    isLongSign(data) {
        if (data.length < 2) return false;

        const prev = data[0];
        const curr = data[data.length - 1];

        // Parse numeric values safely (fallback to 0 if missing)
        const prevFunding = Number(prev.fundingRate ?? 0);
        const currFunding = Number(curr.fundingRate ?? 0);

        const prevOI = Number(prev.openInterest ?? 0);
        const currOI = Number(curr.openInterest ?? 0);

        const prevVd = Number(prev.vdelta ?? 0);
        const currVd = Number(curr.vdelta ?? 0);

        const marketCap = Number(curr.marketCap ?? 0);

        // Rule A: funding rate flipped from + to - AND OI up AND vdelta up
        const fundingRateFlipped = prevFunding > 0 && currFunding < 0;
        const oiUp = currOI > prevOI;
        const vdeltaUp = currVd > prevVd;
        const ruleA = fundingRateFlipped && oiUp && vdeltaUp;

        // Rule B: vdelta increased massively relative to marketCap
        // Only consider this rule when marketCap is valid (> 0)
        const vdeltaHuge = marketCap > 0 && Math.abs(currVd) >= 0.5 * Math.abs(marketCap);

        return ruleA || vdeltaHuge;
    }
}

module.exports = SignalDetectionService;