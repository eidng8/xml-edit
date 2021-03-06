/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { G8XmlEdit } from '../../src';
import {
  click,
  enterRawXml,
  enterText,
  expandTreeNode,
  inputValue,
  rawValue,
  rightClick,
  rightClickBadge,
  rightClickDeclaration,
  savePopup,
} from './helpers';

const first = '.g8-tree__node:nth-child(2)';

describe('Node editing', () => {
  it('edits declaration node', async () => {
    expect.assertions(3);
    const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
    await rightClickDeclaration(wrapper);
    await enterText(wrapper, 'ascii');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['declaration-changed'].length).toBe(1);
    delete emitted['declaration-changed'][0][0].detail.parent;
    expect(emitted['declaration-changed'][0][0].detail).toEqual({
      attributes: [
        {
          name: 'version',
          value: '1.0',
        },
        {
          name: 'encoding',
          value: 'ascii',
        },
        {
          name: 'standalone',
          value: 'no',
        },
      ],
    });
    expect(wrapper.find('.g8-tree__node').text()).toMatch(
      /version="1.0"\s+encoding="ascii"\s+standalone="no"/,
    );
  });

  it('validates declaration encoding', async () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
    await rightClickDeclaration(wrapper);
    await enterText(wrapper, 'abc');
    await savePopup(wrapper);
    expect(wrapper.emitted()['declaration-changed']).toBeUndefined();
  });

  it('edits CDATA node', async () => {
    expect.assertions(4);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<![CDATA[a]]><root/>' },
    });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<![CDATA[a]]>');
    await enterText(wrapper, 'abc', 'textarea');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    delete emitted['node-changed'][0][0].detail.parent;
    expect(emitted['node-changed'][0][0].detail).toEqual({
      type: 'cdata',
      cdata: 'abc',
    });
    expect(wrapper.find(first).text()).toBe('abc');
  });

  it('edits comment node', async () => {
    expect.assertions(4);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<!--a--><root/>' },
    });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<!--a-->');
    await enterText(wrapper, 'abc', 'textarea');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    delete emitted['node-changed'][0][0].detail.parent;
    expect(emitted['node-changed'][0][0].detail).toEqual({
      type: 'comment',
      comment: 'abc',
    });
    expect(wrapper.find(first).text()).toBe('abc');
  });

  it('edits DOCTYPE node', async () => {
    expect.assertions(4);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<!DOCTYPE note SYSTEM "note.dtd"><root/>' },
    });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<!DOCTYPE note SYSTEM "note.dtd">');
    await enterText(wrapper, 'abc', 'textarea');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    delete emitted['node-changed'][0][0].detail.parent;
    expect(emitted['node-changed'][0][0].detail).toEqual({
      type: 'doctype',
      doctype: 'abc',
    });
    expect(wrapper.find(first).text()).toBe('abc');
  });

  it('edits element node', async () => {
    expect.assertions(4);
    const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<root/>');
    await enterText(wrapper, 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    delete emitted['node-changed'][0][0].detail.parent;
    expect(emitted['node-changed'][0][0].detail).toEqual({
      type: 'element',
      name: 'abc',
    });
    expect(wrapper.find(first).text()).toBe('abc');
  });

  it('edits process instruction with attribute', async () => {
    expect.assertions(4);
    const wrapper = mount(G8XmlEdit, {
      propsData: {
        xml: '<?test abc="def"?><root/>',
        showAttrValue: true,
        piUseAttribute: true,
      },
    });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<?test abc="def"?>');
    await enterText(wrapper, 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    delete emitted['node-changed'][0][0].detail.parent;
    expect(emitted['node-changed'][0][0].detail).toEqual({
      type: 'instruction',
      name: 'abc',
      attributes: [{ name: 'abc', value: 'def' }],
    });
    expect(wrapper.find(first).text()).toMatch(/abc\s+abc\s*="def"/);
  });

  it('edits process instruction without attribute', async () => {
    expect.assertions(4);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<?test abc="def"?><root/>' },
    });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('<?test abc="def"?>');
    await enterText(wrapper, 'abc', 'textarea');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    delete emitted['node-changed'][0][0].detail.parent;
    expect(emitted['node-changed'][0][0].detail).toEqual({
      type: 'instruction',
      name: 'test',
      instruction: 'abc',
    });
    expect(wrapper.find(first).text()).toBe('test abc');
  });

  it('edits text node', async () => {
    expect.assertions(4);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root>test</root>' },
    });
    await expandTreeNode(wrapper, first);
    await rightClick(wrapper, `${first} .g8-tree__node`);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('test');
    await enterText(wrapper, 'abc', 'textarea');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    delete emitted['node-changed'][0][0].detail.parent;
    expect(emitted['node-changed'][0][0].detail).toEqual({
      type: 'text',
      text: 'abc',
    });
    expect(wrapper.find(`${first} .g8-tree__node`).text()).toBe('abc');
  });

  it('does not allow saving invalid XML', async () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    await enterText(wrapper, '&');
    await savePopup(wrapper);
    expect(wrapper.emitted()['node-changed']).toBeUndefined();
  });
});

describe('Attribute editing', () => {
  it('edits element attribute', async () => {
    expect.assertions(6);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root test="abc"/>', showAttrValue: true },
    });
    await rightClickBadge(wrapper, `${first} .g8-tree__node__entry__tags__tag`);
    expect(wrapper.find('.g8-xml__popup__header__title').text()).toBe('test');
    expect(inputValue(wrapper, 'textarea')).toBe('abc');
    await enterText(wrapper, 'def', 'textarea');
    await savePopup(wrapper);
    const emitted = wrapper.emitted()['attribute-changed'];
    expect(emitted.length).toBe(1);
    delete emitted[0][0].detail.node.parent;
    expect(emitted[0][0].detail.node).toEqual({
      type: 'element',
      name: 'root',
      attributes: [
        {
          name: 'test',
          value: 'def',
        },
      ],
    });
    expect(emitted[0][0].detail.attribute).toEqual({
      name: 'test',
      value: 'def',
    });
    expect(wrapper.find(first).text()).toMatch(/root\s+test\s*="def"/);
  });
});

describe('Edit raw XML', () => {
  it('edits text node', async () => {
    expect.assertions(4);
    const wrapper = mount(G8XmlEdit, {
      propsData: { xml: '<root>test</root>' },
    });
    await expandTreeNode(wrapper, first);
    await rightClick(wrapper, `${first} .g8-tree__node`);
    await click(wrapper, '#g8-xml-menu-edit');
    expect(rawValue(wrapper)).toBe('test');
    await enterRawXml(wrapper, 'abc');
    await savePopup(wrapper);
    const emitted = wrapper.emitted();
    expect(emitted['node-changed'].length).toBe(1);
    delete emitted['node-changed'][0][0].detail.parent;
    expect(emitted['node-changed'][0][0].detail).toEqual({
      type: 'text',
      text: 'abc',
    });
    expect(wrapper.find(`${first} .g8-tree__node`).text()).toBe('abc');
  });

  it('does not allow saving invalid XML', async () => {
    expect.assertions(1);
    const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
    await rightClick(wrapper, first);
    await click(wrapper, '#g8-xml-menu-edit');
    await enterRawXml(wrapper, '&');
    await savePopup(wrapper);
    expect(wrapper.emitted()['node-changed']).toBeUndefined();
  });
});
