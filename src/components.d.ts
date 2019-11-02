/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface AlwaysAvatar {
    'size': number | string;
    'source': string;
  }
}

declare global {


  interface HTMLAlwaysAvatarElement extends Components.AlwaysAvatar, HTMLStencilElement {}
  var HTMLAlwaysAvatarElement: {
    prototype: HTMLAlwaysAvatarElement;
    new (): HTMLAlwaysAvatarElement;
  };
  interface HTMLElementTagNameMap {
    'always-avatar': HTMLAlwaysAvatarElement;
  }
}

declare namespace LocalJSX {
  interface AlwaysAvatar extends JSXBase.HTMLAttributes<HTMLAlwaysAvatarElement> {
    'size'?: number | string;
    'source'?: string;
  }

  interface IntrinsicElements {
    'always-avatar': AlwaysAvatar;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}

