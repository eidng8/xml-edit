/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import {
  EditNodeEvent,
  EditNodeEventDetail,
  G8XmlEdit,
  XmlElement,
} from '../../../src';
import { click, rightClick } from '../helpers';

const first = '.g8-tree__node:nth-child(2)';

it('triggers event', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, { propsData: { xml: '<root/>' } });
  await rightClick(wrapper, first);
  await click(wrapper, '#g8-xml-menu-edit');
  const emitted = wrapper.emitted()[EditNodeEvent.TYPE];
  expect(emitted.length).toBe(1);
  const evt = emitted[0][0] as CustomEvent<EditNodeEventDetail>;
  delete evt.detail!.document.declaration.parent;
  delete evt.detail!.document.nodes![0].parent;
  delete evt.detail!.node.parent;
  expect(evt.detail).toEqual({
    creating: false,
    index: 0,
    document: {
      declaration: {
        attributes: [
          { name: 'version', value: '1.0' },
          { name: 'encoding', value: 'utf-8' },
          { name: 'standalone', value: 'no' },
        ],
      },
      nodes: [{ type: 'element', name: 'root' }],
    },
    parent: {
      declaration: {
        attributes: [
          { name: 'version', value: '1.0' },
          { name: 'encoding', value: 'utf-8' },
          { name: 'standalone', value: 'no' },
        ],
      },
      nodes: [{ type: 'element', name: 'root' }],
    },
    node: { type: 'element', name: 'root' },
  });
});

it('is cancellable', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [EditNodeEvent.TYPE]: (evt: Event) => evt.preventDefault(),
    },
  });
  await rightClick(wrapper, first);
  await click(wrapper, '#g8-xml-menu-edit');
  const emitted = wrapper.emitted()[EditNodeEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(wrapper.find('.g8-xml__popup').exists()).toBeFalsy();
});

it('uses return value in `detail`', async () => {
  expect.assertions(2);
  const wrapper = mount(G8XmlEdit, {
    propsData: { xml: '<root/>' },
    listeners: {
      [EditNodeEvent.TYPE]: (evt: CustomEvent<EditNodeEventDetail>) => {
        (evt.detail.node as XmlElement).name = 'abc';
      },
    },
  });
  await rightClick(wrapper, first);
  await click(wrapper, '#g8-xml-menu-edit');
  const emitted = wrapper.emitted()[EditNodeEvent.TYPE];
  expect(emitted.length).toBe(1);
  expect(
    (wrapper.find('.g8-xml__popup input').element as HTMLInputElement).value,
  ).toBe('abc');
});
