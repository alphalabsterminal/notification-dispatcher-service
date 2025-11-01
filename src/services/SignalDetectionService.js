class SignalDetectionService {
    isShortSign(data) {
        if (data.length < 2) return false;

        const prev = data[0]; // ~1 hour ago
        const curr = data[data.length - 1]; // latest

        const fundingRateFlipped = prev.fundingRate < 0 && curr.fundingRate > 0;

        return (
            fundingRateFlipped &&
            curr.fundingRate > 0.1 &&
            curr.openInterest > prev.openInterest * 0.9 &&
            curr.vdelta < prev.vdelta &&
            curr.vdelta < 0
        );
    }

    isLongSign(data) {
        if (data.length < 2) return false;

        const prev = data[0]; // oldest snapshot (~1h ago)
        const curr = data[data.length - 1]; // latest snapshot

        const fundingRateFlipped = prev.fundingRate > 0 && curr.fundingRate < 0;
        const oiUp = curr.openInterest > prev.openInterest;
        const vdeltaUp = curr.vdelta > prev.vdelta;
        const vdeltaHuge = curr.vdelta >= 0.5 * curr.marketCap;

        return (
            (fundingRateFlipped && oiUp && vdeltaUp) ||
            vdeltaHuge
        );
    }
}

module.exports = SignalDetectionService;