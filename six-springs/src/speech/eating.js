import { clamp, smooth } from '../math.js';
// Shared by the word, tongue and frog: launch, contact hold, return, one mouth frame.
export const EATING=Object.freeze({contact:3,release:5,home:10,gone:11});
export function eatingAt(age){
  return {reach:1-(1-clamp(age/EATING.contact,0,1))**2,
    home:smooth((age-EATING.release)/(EATING.home-EATING.release)),
    contact:age>=EATING.contact&&age<=EATING.release,done:age>=EATING.gone};
}
