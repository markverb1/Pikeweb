export class WriteOnceBool {
  private _value = false;
  private _set = false;

  get value(): boolean {
    return this._value;
  }

  set value(v: boolean) {
    if (v === true) {
      if (this._set) throw new Error("Already set to true");
      this._value = true;
      this._set = true;
    }
  }
}
