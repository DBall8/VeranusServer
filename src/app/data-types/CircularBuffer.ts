export class CircularBuffer
{
    size: number;
    buffer: any[];

    top: number = 0;
    bottom: number = 0;
    empty: boolean = true;

    constructor(size: number, buffer?: any[]) {
        this.size = size;

        if (buffer) {
            this.buffer = buffer;
        }
        else {
            this.buffer = [];
        }
    }

    push(value: any)
    {
        this.buffer[this.top] = value;
        this.top++;

        // If this isn't the first element added, but top and bottom were the same before
        // that means we are starting to override bottom values
        if ((this.top - 1 == this.bottom) && !this.empty) {
            this.bottom++;
            if (this.bottom >= this.size) this.bottom = 0;
        }

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

    // Return buffer in proper order
    getData(): any[]{
        var result: any[] = [];

        if (this.empty) return result;

        var index: number = this.bottom;
        do {
            result.push(this.buffer[index]);
            index = (index >= this.size - 1) ? 0 : index + 1;
        } while (index != this.top);

        return result;
    }


}