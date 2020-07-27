/**
 * @param {number} delay Milliseconds
 * @param {Function} func Function to call
 */
export default function debounce(delay, func) {
  let calledLast = Date.now();
  return function debounced() { 
    if (Date.now() - calledLast < delay) return;

    calledLast = Date.now();
    return func.apply(this, arguments);
  } 
}
