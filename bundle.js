!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var o=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.x=t,this.y=n}return r(e,[{key:"add",value:function(t){var n=t.x,r=t.y;return new e(this.x+n,this.y+r)}},{key:"subtract",value:function(t){var n=t.x,r=t.y;return new e(this.x-n,this.y-r)}},{key:"scaleXY",value:function(t,n){return new e(this.x*t,this.y*n)}},{key:"scale",value:function(e){return this.scaleXY(e,e)}},{key:"dot",value:function(e){var t=e.x,n=e.y;return this.x*t+this.y*n}},{key:"rotate",value:function(t){var n=Math.atan2(this.y,this.x)+t,r=this.mag();return new e(Math.cos(n)*r,Math.sin(n)*r)}},{key:"setAngle",value:function(t){var n=this.mag();return new e(Math.cos(t)*n,Math.sign(t)*n)}},{key:"angle",value:function(){return Math.atan2(this.y,this.x)}},{key:"sqrMag",value:function(){return this.x*this.x+this.y*this.y}},{key:"mag",value:function(){return Math.sqrt(this.x*this.x+this.y*this.y)}},{key:"normalize",value:function(){return this.scale(1/this.mag())}},{key:"copy",value:function(){return new e(this.x,this.y)}}],[{key:"FromAngle",value:function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return new e(Math.cos(t)*n,Math.sin(t)*n)}},{key:"SqrDist",value:function(e,t){return e.subtract(t).sqrMag()}},{key:"Dist",value:function(e,t){return e.subtract(t).mag()}}]),e}();t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.hslToRgb=function(e,t,n){var r,o,i;if(0==t)r=o=i=n;else{var a=function(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+6*(t-e)*n:n<.5?t:n<2/3?e+(t-e)*(2/3-n)*6:e},u=n<.5?n*(1+t):n+t-n*t,l=2*n-u;r=a(l,u,e+1/3),o=a(l,u,e),i=a(l,u,e-1/3)}return[Math.round(255*r),Math.round(255*o),Math.round(255*i)]};t.pipe=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return t.reduce(function(e,t){return t(e)},e)}},t.property=function(e){return function(t){return t[e]}},t.curry=function(e){var t=[];return function n(r){return t.push(r),t.length<e.length?n:e.apply(void 0,t)}},t.rgb=function(e,t,n){return"rgb("+e+","+t+","+n+")"},t.hsl=function(e,t,n){return"hsl("+e+","+t+"%,"+n+"%)"};var r=t.clamp=function(e,t){return function(n){return Math.min(Math.max(n,e),t)}};t.clamp01=r(0,1)},function(e,t,n){"use strict";var r=c(n(0)),o=c(n(3)),i=c(n(4)),a=n(1),u=c(n(5)),l=(c(n(7)),c(n(8)));function c(e){return e&&e.__esModule?e:{default:e}}var f=1280,s=720,d=15,h=3,v=document.getElementById("canvas"),y=v.getContext("2d");v.width=f,v.height=s;var p=[],g=[],m=new Proxy({selected:-1},{get:function(e,t){return"select"===t?function(t){e.selected=t,void 0!==g[t]&&g[t].select()}:"deselect"===t?function(){e.selected=-1,g.forEach(function(e){return e.deselect()})}:e[t]}}),b=document.getElementById("add-point"),w=document.getElementById("remove-point");function M(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,n=void 0,l=void 0,c=void 0;void 0===t?(n=o.default.Sign(o.default.RangeInt(1,4)),l=o.default.Position(0,f,0,s),c=new i.default(l,n)):(n=t.charge,l=t.pos,c=t),p.push(c);var v=new u.default(n>0?"+":"-",l.x,l.y,Math.abs(n)*h+d,n>0?(0,a.hsl)(120,100,75):(0,a.hsl)(0,100,75),f,s),y=e;v.on("move",function(t){var n=t.x,o=t.y;p[e]=new i.default(new r.default(n,o),p[y].charge,p[y].v),x()}),v.on("click",function(){m.select(e)}),v.on("declick",function(){m.deselect(e)}),g.push(v)}function x(){(0,l.default)(y,p)}Date.now();function k(){Date.now();Date.now(),requestAnimationFrame(k)}window.onload=function(){setTimeout(function(){!function(){var e=f/2-f/4,t=f/2+f/4,n=s/2;M(0,new i.default(new r.default(e,n),3)),M(1,new i.default(new r.default(t,n),3)),M(2,new i.default(new r.default(f/2,s/2),-3)),b.addEventListener("click",function(){M(p.length),x()}),w.addEventListener("click",function(){var e=p.length-1;e<0||(p.pop(),g[e].Destroy(),g.pop(),x())}),x()}(),k()},1)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(e){return e&&e.__esModule?e:{default:e}}(n(0));var o=function(e,t){return void 0===t?Math.random()*e:Math.random()*(t-e)+e};t.default={Range:o,RangeInt:function(e,t){return Math.floor(o(e,t))},Sign:function(e){return e*(2*Math.floor(2*Math.random())-1)},Position:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:t;return new r.default(o(e,t),o(n,i))},Direction:function(){return r.default.FromAngle(o(0,2*Math.PI))}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=function(e){return e&&e.__esModule?e:{default:e}}(n(0));var i=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.pos=t,this.charge=n}return r(e,[{key:"fieldMag",value:function(e){return 899e7*this.charge/o.default.SqrDist(e,this.pos)}},{key:"field",value:function(e){return e.subtract(this.pos).normalize().scale(this.fieldMag(e))}},{key:"force",value:function(e){return this.field(e.pos).scale(e.charge)}}]),e}();t.default=i,i.k=899e7},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(1),a=function(e){return e&&e.__esModule?e:{default:e}}(n(6));function u(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var l=[];window.addEventListener("mousemove",function(e){l.forEach(function(t){return t.onMove.bind(t)(e)})}),window.addEventListener("mouseup",function(e){l.forEach(function(t){return t.onStop.bind(t)(e)})}),window.addEventListener("click",function(e){e.defaultPrevented||l.forEach(function(e){return e.dispatch("declick")})});var c=function(e){function t(e,n,r,o,i,a,u){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var c=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return c.handleHolder=document.getElementById("handles"),c.symbol=e,c.x=n,c.y=r,c.size,c.width=a,c.height=u,c.mx=0,c.my=0,c.moving=!1,c.el=document.createElement("div"),c.el.style.setProperty("--symbol","'"+e+"'"),c.el.style.setProperty("--size",o+"px"),c.el.style.backgroundColor=i,c.el.classList="handle",c.renderPosition(),c.el.addEventListener("mousedown",c.onStart.bind(c)),c.el.addEventListener("click",c.onClick.bind(c)),c.handleHolder.appendChild(c.el),l.push(c),c}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default),o(t,[{key:"onStart",value:function(){this.mx=this.x,this.my=this.y,this.moving=!0}},{key:"onMove",value:function(e){if(this.moving){var t=this.screenToCanvas(e.pageX,e.pageY),n=r(t,2),o=n[0],i=n[1];this.mx=o,this.my=i,this.updatePosition()}}},{key:"onStop",value:function(){this.moving=!1,this.dispatch("move",{rapid:!1,x:this.x,y:this.y})}},{key:"onClick",value:function(e){e.preventDefault(),this.dispatch("click")}},{key:"screenToCanvas",value:function(e,t){return[e-this.handleHolder.offsetLeft,t-this.handleHolder.offsetTop]}},{key:"updatePosition",value:function(){var e=(0,i.clamp)(0,this.width)(this.mx),t=(0,i.clamp)(0,this.height)(this.my),n=e!=this.x||t!=this.y;this.x=e,this.y=t,n&&this.renderPosition()}},{key:"renderPosition",value:function(){this.el.style.setProperty("--x",this.x+"px"),this.el.style.setProperty("--y",this.y+"px"),this.dispatch("move",{rapid:!0,x:this.x,y:this.y})}},{key:"Destroy",value:function(){var e=this;this.el.remove();var t=l.findIndex(function(t){return t==e});-1!=t&&(t==l.length&&l.pop(),l=[].concat(u(l.slice(0,t)),u(l.slice(t+1))))}},{key:"select",value:function(){this.el.setAttribute("data-selected",!0)}},{key:"deselect",value:function(){this.el.setAttribute("data-selected",!1)}}]),t}();t.default=c},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var o=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.handlers=new Map}return r(e,[{key:"on",value:function(e,t){this.handlers.has(e)||this.handlers.set(e,[]),this.handlers.set(e,[].concat(function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(this.handlers.get(e)),[t]))}},{key:"dispatch",value:function(e,t){this.handlers.has(e)&&this.handlers.get(e).forEach(function(e){return e(t)})}}]),e}();t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=e[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){o=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(o)throw i}}return n}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}();t.default=function(e,t){var n=e.canvas,f=n.width,s=n.height;e.clearRect(0,0,f,s),e.fillStyle="rgb(0, 0, 0)",e.fillRect(0,0,f,s);for(var d=0,h=new Uint8ClampedArray(f*s*4),v=0;v<s;v+=a){for(var y=function(e){var n=new i.default(0,0),s=new i.default(e,v);t.forEach(function(e){n=n.add(e.field(s))});var y=n.angle()+Math.PI,p=y<0?2*Math.PI+y:y,g=Math.floor(p/Math.PI*180),m=(g+180)%360,b=n.mag(),w=Math.pow(b,l)*u;w=Math.floor(w/(100/c))*(100/c);for(var M=(0,o.hslToRgb)(m/360,1,w/100),x=r(M,3),k=x[0],_=x[1],P=x[2],O=0;O<a;O++)for(var E=0;E<a;E++){var j=4*(O*f+E);h[d+j]=k,h[d+j+1]=_,h[d+j+2]=P,h[d+j+3]=255}d+=4*a},p=0;p<f;p+=a)y(p);d+=a*f*4-4*f}var g=new ImageData(h,f,s);e.putImageData(g,0,0)};var o=n(1),i=function(e){return e&&e.__esModule?e:{default:e}}(n(0));var a=10,u=.015,l=.5,c=100},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){var n=e.canvas,o=n.width,i=n.height,a=new Uint8ClampedArray(o*i*4).map(function(e,t){return t%4==3?255:e}),u=function(e,t,n,r,u){var l=arguments.length>5&&void 0!==arguments[5]?arguments[5]:255;if(!(e>o||e<0||t>i||t<0)){var c=4*(Math.floor(t)*o+Math.floor(e));a[c]=n,a[c+1]=r,a[c+2]=u,a[c+3]=l}};t.forEach(function(e){for(var n=e.pos,a=n.x,l=n.y,c=8*Math.abs(Math.floor(e.charge)),f=2*Math.PI/c,s=Math.ceil(200),d=function(e){var n=new r.default(a,l);n=n.add(r.default.FromAngle(e,10));for(var c=0;c<s;c++){for(var f=t.reduce(function(e,t){return e.add(t.field(n))},new r.default(0,0)),d=f.normalize(),h=0;h<=5;h++)u(n.x,n.y,180,210,255),n=n.add(d);if(n.x<0||n.x>o||n.y<0||n.y>i)break}},h=0;h<2*Math.PI;h+=f)d(h)});var l=new ImageData(a,o,i);e.putImageData(l,0,0)};var r=function(e){return e&&e.__esModule?e:{default:e}}(n(0))}]);