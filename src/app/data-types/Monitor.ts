export class Monitor {

    okThreshold: Float32Array;
    warningThreshold: Float32Array;
    dangerThreshold: Float32Array;

    constructor(okThreshold: Float32Array,
        warningThreshold: Float32Array,
        dangerThreshold: Float32Array) {
        this.okThreshold = okThreshold;
        this.warningThreshold = warningThreshold;
        this.dangerThreshold = dangerThreshold;
    }
}