export class Monitor {

    static OK: number = 0;
    static WARNING: number = 1;
    static DANGER: number = 2;

    /**
     * When lowerIsBetter = false:
     *  Above okThreshold is OK
     *  Below dangerThreshold is DANGER
     *  Between the two is WARNING
     * 
     * When lowerIsBetter = true:
     *  Below ok Threshold is OK
     *  Above dangerThreshold is DANGER
     *  Between the two is WARNING
     */
    okThreshold: number;
    dangerThreshold: number;
    lowerIsBetter: boolean ;

    constructor(okThreshold: number,
        dangerThreshold: number,
        lowerIsBetter: boolean) {
        this.okThreshold = okThreshold;
        this.dangerThreshold = dangerThreshold;
        this.lowerIsBetter = lowerIsBetter;
    }

    getStatus(value: number): number
    {
        if (this.lowerIsBetter)
        {
            if (value < this.okThreshold) {
                return Monitor.OK;
            }
            else if (value > this.dangerThreshold) {
                return Monitor.DANGER;
            }
            else {
                return Monitor.WARNING;
            }
        }
        else
        {
            if (value > this.okThreshold) {
                return Monitor.OK;
            }
            else if (value < this.dangerThreshold) {
                return Monitor.DANGER;
            }
            else {
                return Monitor.WARNING;
            }
        }
    }
}