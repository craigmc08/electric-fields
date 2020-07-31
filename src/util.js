export const pipe = (...funcs) => start => funcs.reduce((val, func) => func(val), start);
export const property = propName => obj => obj[propName];
export const curry = func => {
    let args = [];
    function step(arg) {
        args.push(arg);
        if (args.length < func.length) {
            return step;
        }
        else return func(...args)
    }
    return step;
};

export const rgb = (r, g, b) => {
    return `rgb(${r},${g},${b})`;
};
export const hsl = (h, s, l) => {
    return `hsl(${h},${s}%,${l}%)`;
};

export const clamp = (min, max) => val => Math.min(Math.max(val, min), max);
export const clamp01 = clamp(0, 1);

/**
* Converts an HSL color value to RGB. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
* Assumes h, s, and l are contained in the set [0, 1] and
* returns r, g, and b in the set [0, 255].
*
* @param   {number}  h       The hue
* @param   {number}  s       The saturation
* @param   {number}  l       The lightness
* @return  {Array}           The RGB representation
*/
export function hslToRgb(h, s, l){
   var r, g, b;

   if(s == 0){
       r = g = b = l; // achromatic
   }else{
       var hue2rgb = function hue2rgb(p, q, t){
           if(t < 0) t += 1;
           if(t > 1) t -= 1;
           if(t < 1/6) return p + (q - p) * 6 * t;
           if(t < 1/2) return q;
           if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
           return p;
       }

       var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
       var p = 2 * l - q;
       r = hue2rgb(p, q, h + 1/3);
       g = hue2rgb(p, q, h);
       b = hue2rgb(p, q, h - 1/3);
   }

   return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Checks whether every pair of elements from the arrays satisfy the predicate
 * `f`
 * 
 * @param {(a: T, b: T) => boolean} f 
 * @param {T[]} arr1 
 * @param {T[]} arr2 
 */
export function arraysEqualBy(f, arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    return arr1.every((v, i) => f(v, arr2[i]));
}

/**
 * Deeply copies an object
 * 
 * @param {any} obj 
 * @param {any} visited 
 */
export function deepCopy(obj) {
    if (Array.isArray(obj)) {
        const newArray = [];
        for (let i = 0; i < obj.length; i++) {
            newArray[i] = deepCopy(obj[i]);
        }
        return newArray;
    } else if (typeof obj === 'object') {
        const newObj = Object.create(obj.__proto__);
        const entries = Object.entries(obj);
        entries.forEach(([k, v]) => {
            newObj[k] = deepCopy(v)
        });
        return newObj;
    } else {
        // Primitive
        return obj;
    }
}
