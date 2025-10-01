export class Vec {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        if (x instanceof Vec) {
            this.x = x.x;
            this.y = x.y;
            return;
        }
        if (y === undefined)
            return;
        this.x = x;
        this.y = y;
    }
    set(x, y) {
        if (x instanceof Vec) {
            this.x = x.x;
            this.y = x.y;
            return this;
        }
        if (y === undefined)
            return this;
        this.x = x;
        this.y = y;
        return this;
    }
    add(v) {
        return new Vec(this.x + v.x, this.y + v.y);
    }
    addSelf(v) {
        this.set(this.add(v));
        return this;
    }
    sub(v) {
        return new Vec(this.x - v.x, this.y - v.y);
    }
    subSelf(v) {
        this.set(this.sub(v));
        return this;
    }
    scale(s) {
        return new Vec(this.x * s, this.y * s);
    }
    scaleSelf(s) {
        this.set(this.scale(s));
        return this;
    }
    div(s) {
        return new Vec(this.x / s, this.y / s);
    }
    divSelf(s) {
        this.set(this.div(s));
        return this;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    magSq() {
        return this.dot(this);
    }
    mag() {
        return Math.sqrt(this.magSq());
    }
    normalize() {
        let m = this.mag();
        if (m > Vec.epsilon) {
            return this.scale(1 / m);
        }
        return new Vec(0, 0);
    }
    normalizeSelf() {
        this.set(this.normalize());
        return this;
    }
    normalizeTo(len) {
        return this.normalize().scale(len);
    }
    normalizeToSelf(len) {
        this.set(this.normalizeTo(len));
        return this;
    }
    distanceToSq(v) {
        return this.sub(v).magSq();
    }
    distanceTo(v) {
        return this.sub(v).mag();
    }
    perp() {
        return new Vec(-this.y, this.x);
    }
    perpSelf() {
        this.set(this.perp());
        return this;
    }
    rotate(theta) {
        let cos = Math.cos(theta);
        let sin = Math.sin(theta);
        return new Vec(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }
    rotateSelf(theta) {
        this.set(this.rotate(theta));
        return this;
    }
    lerp(v, t) {
        return this.scale(1 - t).add(v.scale(t));
    }
    lerpSelf(v, t) {
        this.set(this.lerp(v, t));
        return this;
    }
    angleTo(v) {
        return Vec.angleBetween(this, v);
    }
    angle() {
        return Math.atan2(this.y, this.x);
    }
    copy() {
        return new Vec(this.x, this.y);
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    projectOnto(v) {
        let dp = this.dot(v);
        let magSq = v.magSq();
        if (magSq === 0)
            return new Vec(0, 0);
        let scalar = dp / magSq;
        return v.scale(scalar);
    }
    projectOntoSelf(v) {
        this.set(this.projectOnto(v));
        return this;
    }
    static random2D() {
        let angle = Math.random() * Math.PI * 2;
        return new Vec(Math.cos(angle), Math.sin(angle));
    }
    static fromAngle(angle) {
        return new Vec(Math.cos(angle), Math.sin(angle));
    }
    static get ZERO() {
        return new Vec(0, 0);
    }
    static get X() {
        return new Vec(1, 0);
    }
    static get Y() {
        return new Vec(0, 1);
    }
    static angleBetween(a, b) {
        let dot = a.dot(b);
        let mags = a.mag() * b.mag();
        if (mags === 0)
            return 0;
        let amt = dot / mags;
        if (amt <= -1)
            return Math.PI;
        if (amt >= 1)
            return 0;
        return Math.acos(amt);
    }
    static angleFromTo(a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }
}
Vec.epsilon = 1e-4;
