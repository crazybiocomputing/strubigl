/*
 *  StruBiGL: Structural Bioinformatics and WebGL
 *  Copyright (C) 2018  Jean-Christophe Taveau.
 *
 *  This file is part of StruBiGL
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with StruBiGL.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */
 

// Basic Vectors Functions
export const dot = (u,v) => u.x*v.x + u.y*v.y + u.z*v.z;

export const cross = (a,b) => ({
  x : a.y * b.z - a.z * b.y,
  y : a.z * b.x - a.x * b.z,
  z : a.x * b.y - a.y * b.x
});

export const length = (u) => Math.sqrt(u.x*u.x + u.y*u.y + u.z*u.z);
    
/**
* Pipe function
*/
export const pipe = (...funcs)  => funcs.reduce( (a,b) => (...args) => b(a(...args)) );

/**
 * Compose function
 */
 
export const compose = (...funcs)  => funcs.reduceRight((a, b) => (...args) => b(a(...args)) );

/**
* Filter function
*/
export const filter = (func) => (dataset) => dataset.filter(func);

/**
* Split function
*/
export const split = (txt) => txt.split(/\n/);

/**
* Merge of two arrays with a common key
*/
export const merge = (key) => (a1,a2) => a1.concat(a2).reduce((acc, x) => {
      acc[x[key]] = Object.assign(acc[x[key]] || {}, x);
      return acc;
  }, {});
