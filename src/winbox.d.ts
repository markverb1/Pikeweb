declare module "winbox/src/js/winbox.js" {
  export interface WinBoxControlType {
    class?: string;
    image?: string;
    click?: () => void;
    index?: number;
  }

  export interface WinBoxParams {
    id?: string;
    index?: number;
    root?: Node;
    tpl?: Node;
    title?: string;
    icon?: string;
    mount?: Node;
    html?: string;
    url?: string;

    x?: "right" | "center" | string | number;
    y?: "bottom" | "center" | string | number;
    width?: string | number;
    height?: string | number;

    minwidth?: string | number;
    minheight?: string | number;
    maxwidth?: string | number;
    maxheight?: string | number;

    left?: string | number;
    right?: string | number;
    top?: string | number;
    bottom?: string | number;

    min?: boolean;
    max?: boolean;
    hidden?: boolean;
    modal?: boolean;

    background?: string;
    border?: string | number;
    header?: number;
    class?: string | string[];

    oncreate?: (this: WinBoxInstance, params?: WinBoxParams) => void;
    onclose?: (this: WinBoxInstance, force?: boolean) => boolean;
    onfocus?: (this: WinBoxInstance) => void;
    onblur?: (this: WinBoxInstance) => void;
    onmove?: (this: WinBoxInstance, x: number, y: number) => void;
    onresize?: (this: WinBoxInstance, width: number, height: number) => void;
    onfullscreen?: (this: WinBoxInstance) => void;
    onminimize?: (this: WinBoxInstance) => void;
    onmaximize?: (this: WinBoxInstance) => void;
    onrestore?: (this: WinBoxInstance) => void;
    onhide?: (this: WinBoxInstance) => void;
    onshow?: (this: WinBoxInstance) => void;
    onload?: (this: WinBoxInstance) => void;
  }

  export interface WinBoxInstance {
    id: string | number;
    title: string;

    dom: Node;
    body: HTMLElement;

    x: string | number;
    y: string | number;
    width: string | number;
    height: string | number;

    min: boolean;
    max: boolean;
    hidden: boolean;
    focused: boolean;

    mount(src?: Element): this;
    unmount(dest?: Element): this;

    setTitle(title: string): this;
    setIcon(url: string): this;
    setBackground(background: string): this;
    setUrl(url: string): this;

    focus(state?: boolean): this;
    blur(state?: boolean): this;

    hide(state?: boolean): this;
    show(state?: boolean): this;

    minimize(state?: boolean): this;
    maximize(state?: boolean): this;
    fullscreen(state?: boolean): this;
    restore(): this;

    close(force?: boolean): boolean | undefined;

    move(x?: string | number, y?: string | number, skipUpdate?: boolean): this;
    resize(
      w?: string | number,
      h?: string | number,
      skipUpdate?: boolean,
    ): this;

    addControl(control: WinBoxControlType): this;
    removeControl(control: WinBoxControlType): this;

    addClass(classname: string): this;
    removeClass(classname: string): this;
    hasClass(classname: string): boolean;
    toggleClass(classname: string): this;

    onclose: (this: WinBoxInstance, force: boolean) => boolean;
    onfocus: (this: WinBoxInstance) => void;
    onblur: (this: WinBoxInstance) => void;
  }

  export interface WinBoxConstructor {
    new (title: string, params?: WinBoxParams): WinBoxInstance;
    new (params: WinBoxParams): WinBoxInstance;
    (title: string, params?: WinBoxParams): WinBoxInstance;
    (params: WinBoxParams): WinBoxInstance;
    stack(): WinBoxInstance[];
  }

  const WinBox: WinBoxConstructor;
  export default WinBox;
}
