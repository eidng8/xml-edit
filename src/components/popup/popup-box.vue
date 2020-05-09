<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div class="g8-xml__popup" @click.self="close($event)">
    <div class="g8-xml__popup__box">
      <div class="g8-xml__popup__header">
        <div class="g8-xml__popup__header__title">
          <slot name="title">Popup</slot>
        </div>
        <button
          class="g8-xml__popup__header__close"
          tabindex="-1"
          @click="close($event)"
        >
          &#215;
        </button>
      </div>
      <div class="g8-xml__popup__body">
        <slot>something here</slot>
      </div>
      <div class="g8-xml__popup__footer">
        <slot name="footer">
          <button tabindex="9999" @click="save($event)">
            {{ texts.save }}
          </button>
          <button tabindex="9999" @click="close($event)">
            {{ texts.cancel }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getTexts } from '../../translations/translation';

@Component({ name: 'popup-box' })
export default class PopupBox extends Vue {
  private texts = getTexts();

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    document.addEventListener('keyup', this.keyup);
  }

  // noinspection JSUnusedLocalSymbols
  private mounted(): void {
    this.$nextTick(() => this.initFocus());
  }

  // noinspection JSUnusedLocalSymbols
  private beforeDestroy(): void {
    document.removeEventListener('keyup', this.keyup);
  }

  private initFocus(): void {
    const input = this.$el.querySelector(
      '.g8-xml__popup__attributes .g8-xml__popup__control input,textarea',
    ) as HTMLInputElement | HTMLTextAreaElement;
    if (input) input.focus();
  }

  private close(evt: Event): void {
    this.$emit('close', evt);
  }

  private save(evt: Event): void {
    this.$emit('save', evt);
    this.close(evt);
  }

  private keyup(evt: KeyboardEvent): void {
    if ('Escape' == evt.key) {
      this.close(evt);
    } else if ('Enter' == evt.key) {
      const tag = (evt.target as HTMLElement).localName;
      if (!evt.ctrlKey && ('textarea' == tag || 'select' == tag)) {
        /* istanbul ignore next: unable to unit test */
        return;
      }
      this.save(evt);
    } else {
      return;
    }
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }
}
</script>