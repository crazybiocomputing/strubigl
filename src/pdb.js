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
 
 
import {IUPAC} from './iupac.js';


export class PDB {

  /*
    COLUMNS       DATA  TYPE     FIELD             DEFINITION
    ------------------------------------------------------------------------------------
     1 -  6       Record name    "HEADER"
    11 - 50       String(40)     classification    Classifies the molecule(s).
    51 - 59       Date           depDate           Deposition date. This is the date the
                                                   coordinates  were received at the PDB.
    63 - 66       IDcode         idCode            This identifier is unique within the PDB.
  */
  static get header() {
    return [
      {field: 'record',value: 'HEADER', type: 'string',start: 0,end: 6},
      {field: 'classification',type: 'string',start: 10,end: 50},
      {field: 'depDate',type: 'string',start: 50,end: 59},
      {field: 'idCode',type: 'string',start: 62,end: 66}
    ];
  }
  
  /*
    COLUMNS       DATA  TYPE     FIELD         DEFINITION
    ----------------------------------------------------------------------------------
     1 -  6       Record name    "TITLE "
     9 - 10       Continuation   continuation  Allows concatenation of multiple records.
    11 - 80       String         title         Title of the  experiment.
  */
  static get title() {
    return [
      {field: 'record',value: 'TITLE',type: 'string',start: 0,end: 6},
      {field: 'continuation',type: 'number',start: 8,end: 10},
      {field: 'title',type: 'string',start: 10,end: 80}
    ]
  }
  

  /**
   * Parse PDB file split in rows for the given headers
   *
   * @return {DS} - A DataSet Object
   * @author Jean-Christophe Taveau
     */
  static parse(...headers) {
    return (rows) => {
      // TODO
      /* Algorithm:
       For each row,
         Extract record and store its value
         Get the good header among the `headers` array
         For each field of the selected header
           calculate each substring and store it in the accumulator with the correspond field
        Return an array of objects
      */
    }
  }

  
  /**
   * Use in combination with filter(..) for filtering rows depending of 'record' field
   *
   * @return {[string]} - An array of String
   * @author Jean-Christophe Taveau
   */
  static byRecord(...values) {
    return (row) => (values.includes(row.substring(0,6).trim() ));
  }
 
} // End of class PDB


