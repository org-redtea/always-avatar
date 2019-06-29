import {Component, h, Prop} from '@stencil/core';
import {getColorPalletCache, getSignCache, getSVGGenerationData} from '../../utils/utils';

@Component({
  tag: 'always-avatar',
  shadow: true,
  // language=CSS
  styles: `
    :host {
      display: inline-block;
      overflow: hidden;
      border-radius: 50%;
      user-select: none;
    }

    span {
      display: inline-block;
      vertical-align: top;
      white-space: normal;
      text-align: center;
    }
    
    svg {
      display: inline-block;
      pointer-events: none;
      vertical-align: middle;
      fill: currentColor;
      height: 35%;
      margin-bottom: -4%;
    }
  `
})
export class AlwaysAvatar {
  @Prop() source: string = '';
  @Prop() size: number | string = 48;

  render() {
    const sign = this.getSign();
    const pallet = getColorPalletCache(sign);
    const svgGenerationData = getSVGGenerationData(sign);
    const size = this.getSize();

    return (
      <span
        class={sign.length === 2 ? 'two' : ''}
        style={{
          backgroundColor: pallet[0],
          color: pallet[1],
          width: size + 'px',
          height: size + 'px',
          lineHeight: size + 'px'
        }}
      >{
        svgGenerationData.map(
          data => this.renderSvgContent(
            data.path,
            data.width,
            data.height
          )
        )
      }</span>
    );
  }

  getSize() {
    const parsed = parseFloat(this.size as string);
    return parsed >= 0 ? parsed : 48;
  }

  getSign() {
    return getSignCache(this.source) || 'AA';
  }

  renderSvgContent(path: string, viewBoxWidth: number, viewBoxHeight: number) {
    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
           viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
        <path d={path}/>
      </svg>
    );
  }
}
