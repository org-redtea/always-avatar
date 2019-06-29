import {Component, h, Prop} from '@stencil/core';
import {getColorPalletCache, getSignCache} from '../../utils/utils';

@Component({
  tag: 'always-avatar',
  shadow: true,
  styles:
  `
    :host {
      display: inline-block;
      overflow: hidden;
      border-radius: 50%;
      user-select: none;
    }
    
    span {
      display: inline-block;
      vertical-align: top;
      text-align: center;
    }
  `
})
export class AlwaysAvatar {
  @Prop() source: string;
  @Prop() size: number | string = 48;

  render() {
    const sign = getSignCache(this.source);
    const pallet = getColorPalletCache(sign);
    console.log(sign, pallet);
    const size = this.getSize();

    return (
      <span
        style={{
          backgroundColor: pallet[0],
          color: pallet[1],
          width: size + 'px',
          height: size + 'px',
          fontSize: size * 0.5 + 'px',
          lineHeight: size + 'px'
        }}
      >{sign}</span>
    );
  }

  getSize() {
    const parsed = parseFloat(this.size as string);
    return parsed >= 0 ? parsed : 48;
  }
}
