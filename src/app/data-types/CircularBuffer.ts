export class CircularBuffer
{
    size: number;
    buffer: any[] = [];

    top: number = 0;
    bottom: number = 0;
    empty: boolean = true;

    constructor(size: number)
    {
        this.size = size;
    }

    push(value: any)
    {
        this.buffer.push(value);
        this.top++;

        // loop back around upon hitting the end
        if (this.top >= this.size) this.top = 0;

        this.empty = false;
    }

    pop(value: any): any
    {
        if (this.empty) return null;

        var result: any = this.buffer[this.bottom];
        this.bottom++;

        // loop back around upon hitting the end
        if (this.bottom >= this.size) this.bottom = 0;

        // Mark as empty if bottom now equals top
        if (this.bottom === this.top) this.empty = true;
    }

    getData(): any[] { return this.buffer; }
}