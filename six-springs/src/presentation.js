/** rAF and performance.now() have different sampling instants. Clock itself stays strict. */
export const elapsedSeconds=(now,last)=>Math.max(0,(now-last)/1000);

/** Hold whole presentation packets, including picking geometry. No simulation work here. */
export class Exposure {
  reset() { this.packet=null; this.bucket=null; }
  sample(tick,evaluate,{hold=1,force=false}={}) {
    if(!Number.isSafeInteger(tick) || tick<0 || !Number.isSafeInteger(hold) || hold<1) throw new Error("Invalid exposure");
    const bucket=Math.floor(tick/hold);
    if(force || !this.packet || bucket!==this.bucket || hold!==this.hold) {
      this.packet=evaluate(); this.bucket=bucket; this.hold=hold;
    }
    return this.packet;
  }
}
