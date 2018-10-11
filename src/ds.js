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
 
 
/*
 * Dataset helper functions
 *
 */
 export class DS {
 
  static csv(data_csv,sep=',') {
    let rows = data_csv.split('\n').filter( r => r.indexOf(sep) !== -1);
    let headers = rows[0].split(sep);
    let table = rows.slice(1).map(row => {
      let words = row.split(sep);
      return headers.reduce( (obj,h,i) => {
        obj[h] = words[i];
        console.log(obj[h]);
        return obj;
      }, 
      {});
    });
    table._order = 'row';
    return table;
  }

  static to_csv(data,sep=',') {
    // Headers
    let str = Object.keys(data[0]).reduce( (accu,key,i) => `${accu}${(i===0) ? '' : sep}${key}`,'') + '\n';
    // Values
    return str + data.map( d => Object.keys(d).reduce( (accu,h,i) => `${accu}${ (i===0) ? '' : sep }${d[h]}`,'') + '\n').join('');
  }
  
  // Remove some of the properties/columns of the DS object
  static del(...headers) {
    return (data) => {
      return data.map( (d) => headers.map( (d) => d[h]));
    }
  }
  
  // Extract column(s) as an object of arrays
  static columns(...headers) {
    return (data) => {
      let table = headers.reduce( (accu,h) => {
        accu[h] = data.map( (d) => d[h]);
        return accu;
      },{});
      table._order = 'column';
      return table;
    }
  }
  
  
  // Transpose
  static transpose() {
    return (data) => {
     // transpose = m => m[0].map((x,i) => m.map(x => x[i]))
     return Object.keys(data[0]).reduce( (accu,h,i) => {
      accu[h] = data.map ( d => d[h]);
      return accu;
     },{});
    }
  }
  
  // Join
  static join(other,key=undefined) {
    return (data) => {
      if (key === undefined) {
        // Join by indexes
        if (data.length >= other.length) {
          return data.map( (d,i) => Object.assign(other[i],d) );
        }
        else {
          return other.map( (d,i) => Object.assign(data[i],d) );
        }
      }
      else {
        // Join by key
        
      }
    }
  }
    
  // Concatenate
  static concat() {
  
  }
    
  // Merge
  static merge() {
  
  }
  
  // Group datum by key
  static groupBy(key) {
    return (data) => {
      return data.reduce(function(rv, d) {
        (rv[d[key]] = rv[d[key]] || []).push(d);
        return rv;
      }, {});
    };
  }

  
  static byKeyword(key,...values) {
    return (d) => values.includes(d[key]);
  }
  
  
} // End of class DS
