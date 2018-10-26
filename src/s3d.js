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
 

/**
 * Structure3D Class
 *
 */ 
export class S3D {

  // Remove some of the properties of the S3D object
  static drop(header) {
  
  }
  
  // Multi-FASTA
  static fasta(data,info = {idCode:'0UNK', classification: ''}) {
    let header = `> ${info.idCode}:${data[0].chainID} - ${info.classification}\n`;
    let seq = data.map( (atom) => IUPAC.threeToOne(atom['resName'])).join('');
    return header + seq + '\n';
  }

  static centroid(data) {
    return data.reduce ( (c,d) => [c[0] + d.x, c[1] + d.y, c[2] + d.z],[0.0,0.0,0.0]).map( coord => coord/data.length);
  }
  
  // Compute the Bounding Box
  static bbox(data) {
    return data.reduce ( (box,d) => (
      {
        _min: {
          x:Math.min(box._min.x,d.x),
          y:Math.min(box._min.y,d.y),
          z:Math.min(box._min.z,d.z)
        },
        _max: {
          x:Math.max(box._max.x,d.x),
          y:Math.max(box._max.y,d.y),
          z:Math.max(box._max.z,d.z)
        }
      }),
      {
        _min: {
          x:Number.MAX_VALUE,
          y:Number.MAX_VALUE,
          z:Number.MAX_VALUE
        },
        _max: {
          x:Number.MIN_VALUE,
          y:Number.MIN_VALUE,
          z:Number.MIN_VALUE
        }
      }
    );
  }

  static translateAtoms(struct,tx,ty,tz) {
    return struct.map((xyz) => {
      let out = {};
      Object.keys(xyz).forEach( k => out[k] = xyz[k]);
      out.x = xyz.x + tx;
      out.y = xyz.y + ty;
      out.z = xyz.z + tz;
      return out;
    });
  }

  /**
   * Apply rotation matrix to an atom with a 3x3 matrix composed of array of arrays 
   **/
  static rotateOneAtom(xyz, mat3x3) {
    // Copy xyz into out
    let out = {};
    Object.keys(xyz).forEach( k => out[k] = xyz[k]);
    let x = xyz.x, 
        y = xyz.y, 
        z = xyz.z,
        w = 1.0; // mat3x3.m[0][3] * x + mat3x3.m[1][3] * y + mat3x3.m[2][3] * z + mat3x3.m[3][3];
        w = w || 1.0;
    out.x = (mat3x3[0][0] * x + mat3x3[1][0] * y + mat3x3[2][0] * z ) / w; // + mat3x3[3][0]) / w;
    out.y = (mat3x3[0][1] * x + mat3x3[1][1] * y + mat3x3[2][1] * z ) / w; // + mat3x3[3][1]) / w;
    out.z = (mat3x3[0][2] * x + mat3x3[1][2] * y + mat3x3[2][2] * z ) / w; // + mat3x3[3][2]) / w;
    return out;
  }

  static rotateAtoms(a,matrix) {
    return a.map((xyz) => S3D.transformOneAtom(xyz,matrix) );
  }


  /**
   * Amino acid composition
   */
  static composition(data) {
    return IUPAC.alphabet3.map( symbol => data.filter( d => d.resName === symbol).length / data.length);
  }
  
  /**
   * Features - Phi and Psi Dihedral Angles
   * Online tool - http://tomcat.cs.rhul.ac.uk/home/mxba001/pdb_proc.php
   * http://thegrantlab.org/bio3d/html/torsion.pdb.html
   */
  static phipsi (data) {
   
    const dihedral = (point0,point1,point2,point3) => {
      // UA = (A2−A1) × (A3−A1) is orthogonal to plane A and UB = (B2−B1) × (B3−B1)  

      let v1 = {x: point1.x-point0.x,y: point1.y-point0.y, z: point1.z-point0.z}; 
      let v2 = {x: point2.x-point1.x,y: point2.y-point1.y, z: point2.z-point1.z}; 
      let v3 = {x: point3.x-point2.x,y: point3.y-point2.y, z: point3.z-point2.z}; 
      let na= cross(v1,v2);
      let nb= cross(v2,v3);

      let sinAngle = dot(v1,nb) * length(v2);
      let cosAngle = dot(na,nb);
      return Math.atan2(sinAngle,cosAngle)/Math.PI*180.0;
    };
    
    //////////////// MAIN ////////////////
    
    let skelAtoms = data.filter( (d) => (d.name === 'N' || d.name === 'CA' || d.name === 'C') );

    let skelGroups = PDB.groupBy('resSeq')(skelAtoms);
    
    return Object.keys(skelGroups).map ( (key,index, keys) => {
      let current = skelGroups[key];
      // Previous C
      let c0 = (index !== 0) ? skelGroups[keys[index - 1]].filter( atom => atom.name === 'C')[0] : undefined; 
      
      // Next N
      let n1 = (index < keys.length - 1) ? skelGroups[keys[index + 1]].filter( atom => atom.name === 'N')[0] : undefined; 

      // Current
      let n   = current.filter( atom => atom.name === 'N')[0];
      let ca  = current.filter( atom => atom.name === 'CA')[0];
      let c   = current.filter( atom => atom.name === 'C')[0];

      let phi = (index === 0) ? 0.0 : dihedral(c0,n,ca,c);
      let psi = (index === keys.length - 1) ? 0.0 : dihedral(n,ca,c,n1);
      
      return {phi: phi, psi: psi, group: ca};
    });
  }
} // End of class S3D
