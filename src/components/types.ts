/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

export interface XmlAttribute {
  name: string;
  value: string;
}

export interface XmlTreeDeclaration {
  attributes?: XmlAttribute[];
  parent: XmlTreeEntry;
}

export interface XmlTreeEntry {
  type: string;
  parent: XmlTreeEntry;
}

export interface XmlTreeCData extends XmlTreeEntry {
  type: 'cdata';
  cdata: string;
}

export interface XmlTreeComment extends XmlTreeEntry {
  type: 'comment';
  comment: string;
}

export interface XmlTreeDocType extends XmlTreeEntry {
  type: 'doctype';
  doctype: string;
}

export interface XmlTreeElement extends XmlTreeEntry {
  type: 'element';
  name: string;
  attributes?: XmlAttribute[];
  nodes?: XmlTreeEntry[];
}

export interface XmlTreeInstruction extends XmlTreeEntry {
  type: 'instruction';
  name: string;
  instruction: string;
}

export interface XmlTreeText extends XmlTreeEntry {
  type: 'text';
  text: string;
}

export interface XmlTreeRoot {
  declaration?: XmlTreeDeclaration;
  nodes?: XmlTreeEntry[];
}

export type XmlNodeTypes =
  | XmlTreeCData
  | XmlTreeComment
  | XmlTreeDocType
  | XmlTreeElement
  | XmlTreeInstruction
  | XmlTreeText;
