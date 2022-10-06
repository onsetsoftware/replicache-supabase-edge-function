var Tt = class {
    constructor(e) {
      this.Oe = e;
    }
    log(e, ...t) {
      for (let r of this.Oe) r.log(e, ...t);
    }
    async flush() {
      await Promise.all(
        this.Oe.map((e) => {
          var t;
          return (t = e.flush) == null ? void 0 : t.call(e);
        })
      );
    }
  },
  Ln = class {
    constructor(e, t = "info") {
      (this.debug = void 0), (this.info = void 0), (this.error = void 0);
      let r =
        (a) =>
        (...s) =>
          e.log(a, ...s);
      switch (t) {
        case "debug":
          this.debug = r("debug");
        case "info":
          this.info = r("info");
        case "error":
          this.error = r("error");
      }
    }
  };
var Vt = {
  log(n, ...e) {
    console[n](...e);
  },
};
var Me = class extends Ln {
  constructor(e = "info", t = Vt) {
    super(t, e), (this.St = e), (this.Ct = t);
  }
  addContext(e, t) {
    let r = t === void 0 ? e : `${e}=${t}`,
      a = {
        log: (s, ...o) => {
          this.Ct.log(s, r, ...o);
        },
      };
    return new Me(this.St, a);
  }
};

function S() {
  let n, e;
  return {
    promise: new Promise((r, a) => {
      (n = r), (e = a);
    }),
    resolve: n,
    reject: e,
  };
}
var ce = class {
    constructor() {
      this.Te = null;
    }
    async lock() {
      let e = this.Te,
        { promise: t, resolve: r } = S();
      return (this.Te = t), await e, r;
    }
    withLock(e) {
      return Wn(this.lock(), e);
    }
  },
  Ne = class {
    constructor() {
      (this.R = new ce()), (this.ie = null), (this.le = []);
    }
    read() {
      return this.R.withLock(async () => {
        await this.ie;
        let { promise: e, resolve: t } = S();
        return this.le.push(e), t;
      });
    }
    withRead(e) {
      return Wn(this.read(), e);
    }
    async write() {
      return await this.R.withLock(async () => {
        await this.ie, await Promise.all(this.le);
        let { promise: e, resolve: t } = S();
        return (this.ie = e), (this.le = []), t;
      });
    }
    withWrite(e) {
      return Wn(this.write(), e);
    }
  };
async function Wn(n, e) {
  let t = await n;
  try {
    return await e();
  } finally {
    t();
  }
}
async function At(n) {
  let e = await fetch(n),
    t = e.status,
    r = t === 200 ? "" : await e.text();
  return {
    response: e,
    httpRequestInfo: {
      httpStatusCode: t,
      errorMessage: r,
    },
  };
}
var Fn = async (n) => (await At(n)).httpRequestInfo,
  Ee = class extends Error {
    constructor(t) {
      super("Failed to push");
      this.name = "PushError";
      this.causedBy = t;
    }
  };

function y(n, e = "Assertion failed") {
  if (!n) throw new Error(e);
}

function I(n) {
  Lt(n, "string");
}

function b(n) {
  Lt(n, "number");
}

function zr(n) {
  Lt(n, "boolean");
}

function Lt(n, e) {
  typeof n !== e && Qe(n, e);
}

function H(n) {
  n === null && Qe(n, "object"), Lt(n, "object");
}

function $(n) {
  Array.isArray(n) || Qe(n, "array");
}

function rs(n, e) {
  let t = "Invalid type: ";
  return (
    n == null ? (t += n) : (t += `${typeof n} \`${n}\``), t + `, expected ${e}`
  );
}

function Qe(n, e) {
  throw new Error(rs(n, e));
}

function pe(n) {
  if (n === void 0) throw new Error("Expected non undefined value");
}
var et = Deno.env.get("NODE_ENV") === "production",
  Yr = et,
  Zr = et,
  Xr = et,
  Oe = !0,
  Qr = et,
  ea = et;
var as = Object.prototype.hasOwnProperty,
  ne = Object.hasOwn || ((n, e) => as.call(n, e));

function re(n, e) {
  if (n === e) return !0;
  if (typeof n != typeof e) return !1;
  switch (typeof n) {
    case "boolean":
    case "number":
    case "string":
      return !1;
  }
  if (((n = n), Array.isArray(n))) {
    if (!Array.isArray(e) || n.length !== e.length) return !1;
    for (let a = 0; a < n.length; a++) if (!re(n[a], e[a])) return !1;
    return !0;
  }
  if (n === null || e === null || Array.isArray(e)) return !1;
  (n = n), (e = e);
  let t = 0;
  for (let a in n)
    if (ne(n, a)) {
      if (!re(n[a], e[a])) return !1;
      t++;
    }
  let r = 0;
  for (let a in e) ne(e, a) && r++;
  return t === r;
}

function Ft(n) {
  return _n(n, []);
}

function _n(n, e) {
  switch (typeof n) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return n;
    case "object": {
      if (n === null) return null;
      if (e.includes(n)) throw new Error("Cyclic object");
      if ((e.push(n), Array.isArray(n))) {
        let r = n.map((a) => _n(a, e));
        return e.pop(), r;
      }
      let t = {};
      for (let r in n)
        if (ne(n, r)) {
          let a = n[r];
          a !== void 0 && (t[r] = _n(a, e));
        }
      return e.pop(), t;
    }
    default:
      throw new Error(`Invalid type: ${typeof n}`);
  }
}
var z = 1,
  Wt = 4,
  ss = 8;

function he(n) {
  switch (typeof n) {
    case "string":
      return z + Wt + n.length;
    case "number":
      return os(n)
        ? n <= -(2 ** 30) || n >= 2 ** 30 - 1
          ? z + 5
          : z + Wt
        : z + ss;
    case "boolean":
      return z;
    case "object":
      if (n === null) return z;
      if (Array.isArray(n)) {
        let e = 2 * z + Wt;
        for (let t of n) e += he(t);
        return e;
      }
      {
        let e = n,
          t = z;
        for (let r in e)
          if (ne(e, r)) {
            let a = e[r];
            a !== void 0 && (t += he(r) + he(a));
          }
        return t + Wt + z;
      }
  }
  throw new Error("invalid value");
}

function os(n) {
  return n === (n | 0);
}

function F(n) {
  if (!Zr) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
        return;
      case "object":
        return n === null ? void 0 : Array.isArray(n) ? ls(n) : is(n);
    }
    Qe(n, "JSON value");
  }
}

function is(n) {
  for (let e in n) ne(n, e) && n[e] !== void 0 && F(n[e]);
}

function ls(n) {
  for (let e = 0; e < n.length; e++) {
    let t = n[e];
    t !== void 0 && F(t);
  }
}

function Y(n) {
  return (
    typeof n == "object" && n !== null && n.error === "ClientStateNotFound"
  );
}

function ta(n) {
  if (typeof n != "object" || n === null)
    throw new Error("PullResponse must be an object");
  if (Y(n)) return;
  let e = n;
  e.cookie !== void 0 && F(e.cookie), b(e.lastMutationID), ds(e.patch);
}
var Bn = async (n) => {
  let { httpRequestInfo: e, response: t } = await At(n);
  return e.httpStatusCode !== 200
    ? {
        httpRequestInfo: e,
      }
    : {
        response: await t.json(),
        httpRequestInfo: e,
      };
};

function ds(n) {
  $(n);
  for (let e of n) cs(e);
}

function cs(n) {
  switch ((H(n), n.op)) {
    case "put":
      I(n.key), F(n.value);
      break;
    case "del":
      I(n.key);
      break;
    case "clear":
      break;
    default:
      throw new Error(
        `unknown patch op \`${n.op}\`, expected one of \`put\`, \`del\`, \`clear\``
      );
  }
}
var Te = class extends Error {
  constructor(t) {
    super("Failed to pull");
    this.name = "PullError";
    this.causedBy = t;
  }
};

function me(n, e) {
  let t = n.length,
    r = e.length,
    a = Math.min(t, r);
  for (let s = 0; s < a; ) {
    let o = n.codePointAt(s),
      i = e.codePointAt(s);
    if (o !== i) {
      if (o < 128 && i < 128) return o - i;
      let l = aa(o, na),
        u = aa(i, ra);
      return ps(na, l, ra, u);
    }
    s += hs(o);
  }
  return t - r;
}

function ps(n, e, t, r) {
  let a = Math.min(e, r);
  for (let s = 0; s < a; s++) {
    let o = n[s],
      i = t[s];
    if (o !== i) return o - i;
  }
  return e - r;
}

function hs(n) {
  return n > 65535 ? 2 : 1;
}
var sa = () =>
    Array.from(
      {
        length: 4,
      },
      () => 0
    ),
  na = sa(),
  ra = sa();

function aa(n, e) {
  if (n < 128) return (e[0] = n), 1;
  let t, r;
  if (n <= 2047) (t = 1), (r = 192);
  else if (n <= 65535) (t = 2), (r = 224);
  else if (n <= 1114111) (t = 3), (r = 240);
  else throw new Error("Invalid code point");
  e[0] = (n >> (6 * t)) + r;
  let a = 1;
  for (; t > 0; t--) {
    let s = n >> (6 * (t - 1));
    e[a++] = 128 | (s & 63);
  }
  return a;
}

function fe(n, e) {
  return me(n, e) > 0;
}

function _t(n, e) {
  return me(n, e) < 0;
}

function Bt(n, e) {
  return me(n, e) <= 0;
}

function Ve(n) {
  return n.indexName !== void 0;
}

function tt(n) {
  return typeof n == "string" ? [n] : n;
}

function oa(n) {
  if (!n) return {};
  let e, t, r, a;
  return (
    n.start &&
      (({ key: e, exclusive: t } = n.start),
      n.indexName
        ? typeof e == "string"
          ? (a = e)
          : ((a = e[0]), (r = e[1]))
        : (r = e)),
    {
      prefix: n.prefix,
      startSecondaryKey: a,
      startKey: r,
      startExclusive: t,
      limit: n.limit,
      indexName: n.indexName,
    }
  );
}
var Ut = class extends Error {
  constructor() {
    super("Transaction is closed");
  }
};

function M(n) {
  if (n.closed) throw new Ut();
}
async function Kt(n) {
  let e = [];
  for await (let t of n) e.push(t);
  return e;
}
var Jt = new WeakSet();

function qt(n) {
  return typeof n == "object" && n !== null;
}

function ia(n) {
  if (!Oe && qt(n) && !Jt.has(n)) throw new Error("Internal value expected");
}

function Z(n, e) {
  if (Oe) return ea && e >= 256 ? n : Ft(n);
  if (qt(n)) {
    if (Jt.has(n)) throw new Error("Unexpected internal value");
    let t = Ft(n);
    return Jt.add(t), t;
  }
  return n;
}

function la(n) {
  !Oe && qt(n) && Jt.add(n);
}

function R(n, e) {
  return Qr && e >= 256 ? n : qt(n) ? (ia(n), Ft(n)) : n;
}

function nt(n, e) {
  return re(Un(n), Un(e));
}

function Un(n) {
  return ia(n), n;
}

function ua(n, e) {
  return Un(n);
}
var rt = class {
    constructor(e, t) {
      (this.meta = e), (this.map = t);
    }
  },
  at = class extends rt {
    flush() {
      return this.map.flush();
    }
    clear() {
      return this.map.clear();
    }
  };
async function Gt(n, e, t, r, a, s, o = !1) {
  var i;
  try {
    for (let l of ms(r, a, s, o))
      switch (t) {
        case jt.Add:
          await e.put(l, a);
          break;
        case jt.Remove:
          await e.del(l);
          break;
      }
  } catch (l) {
    (i = n.info) == null || i.call(n, "Not indexing value", a, ":", l);
  }
}

function ms(n, e, t, r) {
  let a = ua(e, 0),
    s = fs(a, t);
  if (s === void 0) {
    if (r) return [];
    throw new Error(`No value at path: ${t}`);
  }
  let o = Array.isArray(s) ? s : [s],
    i = [];
  for (let l of o)
    if (typeof l == "string") i.push(qn([l, n]));
    else throw new Error("Unsupported target type");
  return i;
}
var Kn = "\0",
  Jn = "\0";

function qn(n) {
  let e = n[0],
    t = n[1];
  if (e.includes("\0"))
    throw new Error("Secondary key cannot contain null byte");
  return Kn + e + Jn + t;
}

function jn(n, e) {
  let t = qn([n, e || ""]);
  return e === void 0 ? t.slice(0, t.length - 1) : t;
}

function ye(n) {
  if (n[0] !== Kn) throw new Error("Invalid version");
  let e = Kn.length,
    t = Jn.length,
    r = n.indexOf(Jn, e);
  if (r === -1) throw new Error("Invalid formatting");
  let a = n.slice(e, r),
    s = n.slice(r + t);
  return [a, s];
}

function fs(n, e) {
  function t(s) {
    if (!(s.startsWith("+") || (s.startsWith("0") && s.length !== 1)))
      return parseInt(s, 10);
  }
  if (e === "") return n;
  if (!e.startsWith("/")) throw new Error(`Invalid JSON pointer: ${e}`);
  let r = e
      .split("/")
      .slice(1)
      .map((s) => s.replace(/~1/g, "/").replace(/~0/g, "~")),
    a = n;
  for (let s of r) {
    let o;
    if (Array.isArray(a)) {
      let i = t(s);
      if (i === void 0) return;
      o = a[i];
    } else {
      if (a === null) return;
      typeof a == "object" && ((a = a), (o = a[s]));
    }
    if (o === void 0) return;
    a = o;
  }
  return a;
}
var jt = ((t) => ((t[(t.Add = 0)] = "Add"), (t[(t.Remove = 1)] = "Remove"), t))(
  jt || {}
);
var Ae = class {
    constructor(e, t, r, a) {
      (this.Ve = e), (this.Ae = t), (this.$ = r), (this.Le = a);
    }
    [Symbol.asyncIterator]() {
      return this.values();
    }
    values() {
      let e = this.$.shouldDeepClone ? (t) => R(t[1], 2) : (t) => R(t[1], 256);
      return new st(this.ue(e));
    }
    keys() {
      let e = (t) => t[0];
      return new st(this.ue(e));
    }
    entries() {
      let e = this.$.shouldDeepClone
        ? (t) => [t[0], R(t[1], 2)]
        : (t) => [t[0], R(t[1], 256)];
      return new st(this.ue(e));
    }
    toArray() {
      return this.values().toArray();
    }
    ue(e) {
      return ys(e, this.Ve, this.Ae, this.$, this.Le);
    }
  },
  st = class {
    constructor(e) {
      this.z = e;
    }
    next() {
      return this.z.next();
    }
    [Symbol.asyncIterator]() {
      return this.z[Symbol.asyncIterator]();
    }
    toArray() {
      return Kt(this.z);
    }
  };
async function* ys(n, e, t, r, a) {
  var u;
  M(r);
  let { limit: s = 1 / 0 } = t,
    { prefix: o = "" } = t,
    i = (u = t.start) == null ? void 0 : u.exclusive,
    l = Ve(t);
  for await (let c of e) {
    let d = c[0];
    if (!(l ? d[0] : d).startsWith(o)) return;
    if (i) {
      if (((i = !0), l)) {
        if (gs(d, t.start.key)) continue;
      } else if (ws(d, t.start.key)) continue;
    }
    if ((yield n(c), --s === 0 && !l)) {
      a(d);
      return;
    }
  }
}

function gs(n, e) {
  let [t, r] = tt(e),
    [a, s] = tt(n);
  return a !== t ? !1 : r === void 0 ? !0 : s === r;
}

function ws(n, e) {
  return n === e;
}

function Is(n, e) {
  if (Ve(n)) {
    let [r, a] = xs(n);
    return new Ae(
      e(n.indexName, r, a),
      n,
      {
        closed: !1,
        shouldDeepClone: !1,
      },
      (s) => {}
    );
  }
  let t = Gn(n);
  return new Ae(
    e(t),
    n,
    {
      closed: !1,
      shouldDeepClone: !1,
    },
    (r) => {}
  );
}

function xs(n) {
  let { prefix: e, start: t } = n,
    r = [e != null ? e : "", void 0];
  if (!t) return r;
  let a = tt(t.key);
  return fe(a[0], r[0]) || (a[0] === r[0] && a[1] !== void 0) ? a : r;
}

function ca(n) {
  let { prefix: e, start: t } = n,
    r = "";
  if ((e !== void 0 && (r = jn(e, void 0)), !t)) return r;
  let { key: a } = t,
    [s, o] = tt(a),
    i = jn(s, o);
  return fe(i, r) ? i : r;
}
var bs = "0123456789abcdefghijklmnopqrstuv";

function pa(n) {
  let e = 0,
    t = 0,
    r = 0,
    a = "",
    { length: s } = n;
  for (; e < s; ) {
    let o = n[e];
    t > 3
      ? ((r = o & (255 >> t)),
        (t = (t + 5) % 8),
        (r = (r << t) | ((e + 1 < s ? n[e + 1] : 0) >> (8 - t))),
        e++)
      : ((r = (o >> (8 - (t + 5))) & 31), (t = (t + 5) % 8), t === 0 && e++),
      (a += bs[r]);
  }
  return a;
}
var Ds = new TextEncoder(),
  ul = new TextDecoder();

function ha(n) {
  return Ds.encode(n);
}
var Cs = 20,
  Rs = 32,
  Hs = /^[0-9a-v]{32}$/,
  $n = /^t\/[0-9a-v]{30}$/;
async function Le(n) {
  let e = ha(JSON.stringify(n)),
    t = await crypto.subtle.digest("SHA-512", e),
    r = new Uint8Array(t, 0, Cs);
  return pa(r);
}
var D = "00000000000000000000000000000000",
  V = vs();

function vs() {
  return zn("t/");
}

function zn(n) {
  let e = 0;
  return () => n + (e++).toString().padStart(Rs - n.length, "0");
}

function ks(n) {
  return typeof n == "string" && (Hs.test(n) || $n.test(n));
}

function _(n) {
  return typeof n == "string" && $n.test(n);
}

function ge(n) {
  if ($n.test(n)) throw new Error("Unexpected temp hash");
}

function B(n) {
  if (!ks(n)) throw new Error(`Invalid hash: '${n}'`);
}

function zt(n, e) {
  let t = 0;
  for (; t < n; ) {
    let r = t + ((n - t) >> 1),
      a = e(r);
    if (a === 0) return r;
    a > 0 ? (t = r + 1) : (n = r);
  }
  return t;
}
var Yn = 0,
  lt = 1;

function Zn(n) {
  return se(n) ? n[lt].map((e) => e[1]) : [];
}
async function ot(n, e, t, r) {
  let a = await t.getNode(e);
  if (r !== t.rootHash) return ot(n, t.rootHash, t, t.rootHash);
  if (Xn(a)) return a;
  let { entries: s } = a,
    o = X(n, s);
  o === s.length && o--;
  let i = s[o];
  return ot(n, i[1], t, r);
}

function X(n, e) {
  return zt(e.length, (t) => me(n, e[t][0]));
}

function it(n, e, t) {
  return n !== e.length && e[n][0] === t;
}

function Ie(n) {
  if ((Ps(n), !Oe && Ms(n))) {
    let e = n[lt];
    for (let t of e) la(t[1]);
  }
}

function Ps(n) {
  if (Xr) return;
  $(n);

  function e(a, s) {
    $(a), I(a[0]), s(a[1]);
  }
  y(n.length >= 2);
  let [t, r] = n;
  b(t), $(r), t > 0 ? r.forEach((a) => e(a, I)) : r.forEach((a) => e(a, F));
}

function se(n) {
  return n[Yn] > 0;
}

function Ms(n) {
  return !se(n);
}
var Zt = class {
    constructor(e, t, r) {
      (this.entries = e), (this.hash = t), (this.isMutable = r);
    }
    maxKey() {
      return this.entries[this.entries.length - 1][0];
    }
    toChunkData() {
      return [this.level, this.entries];
    }
  },
  we = class extends Zt {
    constructor() {
      super(...arguments);
      this.level = 0;
    }
    async set(t, r, a) {
      let s,
        o = X(t, this.entries);
      return (
        it(o, this.entries, t) ? (s = 1) : (s = 0), this.We(a, o, s, [t, r])
      );
    }
    We(t, r, a, ...s) {
      if (this.isMutable)
        return this.entries.splice(r, a, ...s), t.updateNode(this), this;
      let o = Yt(this.entries, r, a, ...s);
      return t.newDataNodeImpl(o);
    }
    async del(t, r) {
      let a = X(t, this.entries);
      return it(a, this.entries, t) ? this.We(r, a, 1) : this;
    }
    async *keys(t) {
      for (let r of this.entries) yield r[0];
    }
    async *entriesIter(t) {
      for (let r of this.entries) yield r;
    }
  };

function Yt(n, e, t, ...r) {
  let a = n.slice(0, e);
  for (let s = 0; s < r.length; s++) a.push(r[s]);
  for (let s = e + t; s < n.length; s++) a.push(n[s]);
  return a;
}

function* ma(...n) {
  for (let e of n) yield* e;
}
var ae = class extends Zt {
  constructor(t, r, a, s) {
    super(t, r, s);
    this.level = a;
  }
  async set(t, r, a) {
    let s = X(t, this.entries);
    s === this.entries.length && s--;
    let o = this.entries[s][1],
      l = await (await a.getNode(o)).set(t, r, a),
      u = a.childNodeSize(l);
    return u > a.maxSize || u < a.minSize
      ? this.Fe(a, s, l)
      : this._e(a, s, [l.maxKey(), l.hash]);
  }
  async Fe(t, r, a) {
    let s = this.level - 1,
      o = this.entries,
      i,
      l,
      u;
    if (r > 0) {
      let h = o[r - 1][1],
        m = await t.getNode(h);
      (i = ma(m.entries, a.entries)), (l = r - 1), (u = 2);
    } else if (r < o.length - 1) {
      let h = o[r + 1][1],
        m = await t.getNode(h);
      (i = ma(a.entries, m.entries)), (l = r), (u = 2);
    } else (i = a.entries), (l = r), (u = 1);
    let c = Qn(
        i,
        t.getEntrySize,
        t.minSize - t.chunkHeaderSize,
        t.maxSize - t.chunkHeaderSize
      ),
      d = [];
    for (let h of c) {
      let m = t.newNodeImpl(h, s);
      d.push([m.maxKey(), m.hash]);
    }
    if (this.isMutable)
      return this.entries.splice(l, u, ...d), t.updateNode(this), this;
    let p = Yt(o, l, u, ...d);
    return t.newInternalNodeImpl(p, this.level);
  }
  _e(t, r, a) {
    if (this.isMutable)
      return this.entries.splice(r, 1, a), t.updateNode(this), this;
    let s = Yt(this.entries, r, 1, a);
    return t.newInternalNodeImpl(s, this.level);
  }
  async del(t, r) {
    let a = X(t, this.entries);
    if (a === this.entries.length) return this;
    let s = this.entries[a][1],
      o = await r.getNode(s),
      i = o.hash,
      l = await o.del(t, r);
    if (l.hash === i) return this;
    if (l.entries.length === 0) {
      let u = Yt(this.entries, a, 1);
      return r.newInternalNodeImpl(u, this.level);
    }
    return a === 0 && this.entries.length === 1
      ? l
      : r.childNodeSize(l) > r.minSize
      ? this._e(r, a, [l.maxKey(), l.hash])
      : this.Fe(r, a, l);
  }
  async *keys(t) {
    for (let r of this.entries) yield* (await t.getNode(r[1])).keys(t);
  }
  async *entriesIter(t) {
    for (let r of this.entries) yield* (await t.getNode(r[1])).entriesIter(t);
  }
  async getChildren(t, r, a) {
    let s = [];
    for (let o = t; o < r && o < this.entries.length; o++)
      s.push(a.getNode(this.entries[o][1]));
    return Promise.all(s);
  }
  async getCompositeChildren(t, r, a) {
    let { level: s } = this;
    if (r === 0) return new ae([], V(), s - 1, !0);
    let o = await this.getChildren(t, t + r, a);
    if (s > 1) {
      let l = [];
      for (let u of o) l.push(...u.entries);
      return new ae(l, V(), s - 1, !0);
    }
    y(s === 1);
    let i = [];
    for (let l of o) i.push(...l.entries);
    return new we(i, V(), !0);
  }
};

function Xt(n, e, t, r) {
  return t === 0 ? new we(n, e, r) : new ae(n, e, t, r);
}

function Xn(n) {
  return n.level === 0;
}

function Qn(n, e, t, r) {
  let a = [],
    s = [],
    o = 0,
    i = [];
  for (let l of n) {
    let u = e(l);
    u >= r
      ? (i.length > 0 && (a.push(i), s.push(o)),
        a.push([l]),
        s.push(u),
        (o = 0),
        (i = []))
      : o + u >= t
      ? (i.push(l), a.push(i), s.push(o + u), (o = 0), (i = []))
      : ((o += u), i.push(l));
  }
  return (
    o > 0 &&
      (s.length > 0 && o + s[s.length - 1] <= r
        ? a[a.length - 1].push(...i)
        : a.push(i)),
    a
  );
}
var ut = [0, []],
  fa = new we([], D, !1);
var ya = -1,
  wa = 0,
  dt = 1,
  ct = 2,
  en = 3,
  Qt = 0,
  ga = 1;

function* Ia(n, e) {
  let t = 0,
    r = 0,
    a;

  function s(i, l) {
    i[en] === ya && (i[en] = l);
  }

  function o() {
    return [t, 0, 0, ya];
  }
  for (; t < n.length && r < e.length; )
    n[t][Qt] === e[r][Qt]
      ? (re(n[t][ga], e[r][ga])
          ? a && (s(a, 0), yield a, (a = void 0))
          : (a || (a = o()), a[ct]++, a[dt]++, s(a, r)),
        t++,
        r++)
      : n[t][Qt] < e[r][Qt]
      ? (a || (a = o()), a[dt]++, t++)
      : (a || (a = o()), a[ct]++, s(a, r), r++);
  r < e.length && (a || (a = o()), (a[ct] += e.length - r), s(a, r)),
    t < n.length && (a || (a = o()), (a[dt] += n.length - t)),
    a && (s(a, 0), yield a);
}
var Ns = 11,
  k = class {
    constructor(e, t = D, r = he, a = Ns) {
      this.Be = new Map();
      (this.rootHash = t),
        (this.h = e),
        (this.getEntrySize = r),
        (this.chunkHeaderSize = a);
    }
    async getNode(e) {
      if (e === D) return fa;
      let t = this.Be.get(e);
      if (t) return t;
      let { data: r } = await this.h.mustGetChunk(e);
      Ie(r);
      let a = Xt(r[lt], e, r[Yn], !1);
      return this.Be.set(e, a), a;
    }
    async get(e) {
      let t = await ot(e, this.rootHash, this, this.rootHash),
        r = X(e, t.entries);
      if (!!it(r, t.entries, e)) return t.entries[r][1];
    }
    async has(e) {
      let t = await ot(e, this.rootHash, this, this.rootHash),
        r = X(e, t.entries);
      return it(r, t.entries, e);
    }
    async isEmpty() {
      let { rootHash: e } = this,
        t = await this.getNode(this.rootHash);
      return this.rootHash !== e ? this.isEmpty() : t.entries.length === 0;
    }
    scan(e) {
      return er(
        this.rootHash,
        () => this.rootHash,
        this.rootHash,
        e,
        async (t) => {
          let r = await this.getNode(t);
          if (r) return r.toChunkData();
          let { data: a } = await this.h.mustGetChunk(t);
          return Ie(a), a;
        }
      );
    }
    async *keys() {
      yield* (await this.getNode(this.rootHash)).keys(this);
    }
    async *entries() {
      yield* (await this.getNode(this.rootHash)).entriesIter(this);
    }
    [Symbol.asyncIterator]() {
      return this.entries();
    }
    async *diff(e) {
      let [t, r] = await Promise.all([
        this.getNode(this.rootHash),
        e.getNode(e.rootHash),
      ]);
      yield* tn(r, t, e, this);
    }
  };
async function* tn(n, e, t, r) {
  if (n.level > e.level) {
    let s = await n.getCompositeChildren(0, n.entries.length, t);
    yield* tn(s, e, t, r);
    return;
  }
  if (e.level > n.level) {
    let s = await e.getCompositeChildren(0, e.entries.length, r);
    yield* tn(n, s, t, r);
    return;
  }
  if (n.level === 0 && e.level === 0) {
    yield* Es(n.entries, e.entries);
    return;
  }
  let a = Ia(n.entries, e.entries);
  for (let s of a) {
    let [o, i] = await Promise.all([
      n.getCompositeChildren(s[wa], s[dt], t),
      e.getCompositeChildren(s[en], s[ct], r),
    ]);
    yield* tn(o, i, t, r);
  }
}

function* Es(n, e) {
  let t = n.length,
    r = e.length,
    a = 0,
    s = 0;
  for (; a < t && s < r; ) {
    let o = n[a][0],
      i = e[s][0];
    o === i
      ? (nt(n[a][1], e[s][1]) ||
          (yield {
            op: "change",
            key: o,
            oldValue: n[a][1],
            newValue: e[s][1],
          }),
        a++,
        s++)
      : o < i
      ? (yield {
          op: "del",
          key: o,
          oldValue: n[a][1],
        },
        a++)
      : (yield {
          op: "add",
          key: i,
          newValue: e[s][1],
        },
        s++);
  }
  for (; a < t; a++)
    yield {
      op: "del",
      key: n[a][0],
      oldValue: n[a][1],
    };
  for (; s < r; s++)
    yield {
      op: "add",
      key: e[s][0],
      newValue: e[s][1],
    };
}
async function* er(n, e, t, r, a) {
  if (t === D) return;
  let s = await a(t),
    o = [...s[lt]],
    i = 0;
  if ((r && (i = X(r, o)), se(s)))
    for (; i < o.length; i++) yield* er(n, e, o[i][1], r, a), (r = "");
  else
    for (; i < o.length; i++) {
      let l = e();
      if (n !== l) {
        yield* er(l, e, l, o[i][0], a);
        return;
      }
      yield o[i];
    }
}
async function We(n, e) {
  let t = [],
    r =
      e === "add"
        ? (a) => ({
            op: "add",
            key: a[0],
            newValue: a[1],
          })
        : (a) => ({
            op: "del",
            key: a[0],
            oldValue: a[1],
          });
  for await (let a of n.entries()) t.push(r(a));
  return t;
}
var oe = class extends k {
  constructor(t, r = D, a = 8 * 1024, s = 16 * 1024, o, i) {
    super(t, r, o, i);
    this.R = new ce();
    this.k = new Map();
    (this.minSize = a), (this.maxSize = s);
  }
  async getNode(t) {
    let r = this.k.get(t);
    return r || super.getNode(t);
  }
  Y(t) {
    y(t.isMutable), this.k.set(t.hash, t);
  }
  updateNode(t) {
    y(t.isMutable), this.k.delete(t.hash), (t.hash = V()), this.Y(t);
  }
  newInternalNodeImpl(t, r) {
    let a = new ae(t, V(), r, !0);
    return this.Y(a), a;
  }
  newDataNodeImpl(t) {
    let r = new we(t, V(), !0);
    return this.Y(r), r;
  }
  newNodeImpl(t, r) {
    let a = Xt(t, V(), r, !0);
    return this.Y(a), a;
  }
  childNodeSize(t) {
    let r = this.chunkHeaderSize;
    for (let a of t.entries) r += this.getEntrySize(a);
    return r;
  }
  put(t, r) {
    return this.R.withLock(async () => {
      let s = await (await this.getNode(this.rootHash)).set(t, r, this);
      if (this.childNodeSize(s) > this.maxSize) {
        let o = this.chunkHeaderSize,
          i = Qn(
            s.entries,
            this.getEntrySize,
            this.minSize - o,
            this.maxSize - o
          ),
          { level: l } = s,
          u = i.map((d) => {
            let p = this.newNodeImpl(d, l);
            return [p.maxKey(), p.hash];
          }),
          c = this.newInternalNodeImpl(u, l + 1);
        this.rootHash = c.hash;
        return;
      }
      this.rootHash = s.hash;
    });
  }
  del(t) {
    return this.R.withLock(async () => {
      let a = await (await this.getNode(this.rootHash)).del(t, this),
        s = this.rootHash !== a.hash;
      return (
        s &&
          (a.level > 0 && a.entries.length === 1
            ? (this.rootHash = a.entries[0][1])
            : (this.rootHash = a.hash)),
        s
      );
    });
  }
  clear() {
    return this.R.withLock(async () => {
      this.k.clear(), (this.rootHash = D);
    });
  }
  flush() {
    let t = (r, a, s) => {
      let o = this.k.get(r);
      if (o === void 0) return r;
      if (Xn(o)) {
        let u = s(o.toChunkData(), []);
        return a.push(u), u.hash;
      }
      let i = [];
      for (let u of o.entries) {
        let c = u[1],
          d = t(c, a, s);
        d !== c && (u[1] = d), i.push(d);
      }
      let l = s(o.toChunkData(), i);
      return a.push(l), l.hash;
    };
    return this.R.withLock(async () => {
      let r = this.h;
      if (this.rootHash === D) {
        let o = r.createChunk(ut, []);
        return await r.putChunk(o), o.hash;
      }
      let a = [],
        s = t(this.rootHash, a, r.createChunk);
      return (
        await Promise.all(a.map((o) => r.putChunk(o))),
        this.k.clear(),
        (this.rootHash = s),
        s
      );
    });
  }
};
async function xe(n, e) {
  return Kt(e.diff(n));
}
var x = "main";
var pt = class {
  constructor(e) {
    this.chunk = e;
  }
  get meta() {
    return this.chunk.data.meta;
  }
  isLocal() {
    return this.meta.type === 2;
  }
  isSnapshot() {
    return this.meta.type === 3;
  }
  isIndexChange() {
    return this.meta.type === 1;
  }
  get valueHash() {
    return this.chunk.data.valueHash;
  }
  async getMutationID(e, t) {
    let { meta: r } = this;
    switch (r.type) {
      case 1:
        return r.lastMutationID;
      case 3:
        return De(r), r.lastMutationID;
      case 2:
        return r.mutationID;
    }
  }
  async getNextMutationID(e, t) {
    return (await this.getMutationID(e, t)) + 1;
  }
  get indexes() {
    return this.chunk.data.indexes;
  }
};
async function be(n, e) {
  return (await rn(n, e)).filter((r) => r.isLocal());
}
async function U(n, e) {
  let t = await N(n, e);
  for (; !t.isSnapshot(); ) {
    let { meta: r } = t,
      { basisHash: a } = r;
    if (a === null) throw new Error(`Commit ${t.chunk.hash} has no basis`);
    t = await N(a, e);
  }
  return t;
}

function ht(n, e) {
  let t = n.meta,
    r;
  return De(t), [t.lastMutationID, t.cookieJSON];
}
async function rn(n, e) {
  let t = await N(n, e),
    r = [];
  for (; !t.isSnapshot(); ) {
    let { meta: a } = t,
      { basisHash: s } = a;
    if (s === null) throw new Error(`Commit ${t.chunk.hash} has no basis`);
    r.push(t), (t = await N(s, e));
  }
  return r.push(t), r;
}
async function N(n, e) {
  let t = await e.mustGetChunk(n);
  return Da(t);
}

function Os(n) {
  b(n.lastMutationID);
}

function Ts(n) {
  if ((b(n.mutationID), I(n.mutatorName), !n.mutatorName))
    throw new Error("Missing mutator name");
  F(n.mutatorArgsJSON),
    n.originalHash !== null && B(n.originalHash),
    b(n.timestamp);
}

function xa(n) {
  return !1;
}

function De(n) {
  y(!0), b(n.lastMutationID), F(n.cookieJSON);
}

function ba(n) {
  return !1;
}

function Vs(n) {
  switch ((H(n), n.basisHash !== null && I(n.basisHash), b(n.type), n.type)) {
    case 1:
      Os(n);
      break;
    case 2:
      Ts(n);
      break;
    case 3:
      De(n);
      break;
    default:
      throw new Error(`Invalid enum value ${n.type}`);
  }
}

function As(n) {
  H(n),
    I(n.name),
    I(n.keyPrefix),
    I(n.jsonPointer),
    n.allowEmpty !== void 0 && zr(n.allowEmpty);
}

function Ls(n) {
  H(n), As(n.definition), I(n.valueHash);
}

function tr(n, e, t, r, a, s, o, i, l, u) {
  return ar(n, {
    meta: {
      type: 2,
      basisHash: e,
      mutationID: t,
      mutatorName: r,
      mutatorArgsJSON: a,
      originalHash: s,
      timestamp: l,
    },
    valueHash: o,
    indexes: i,
  });
}

function nr(n, e, t, r, a, s) {
  return ar(n, an(e, t, r, a, s));
}

function an(n, e, t, r, a) {
  return (
    y(!0),
    {
      meta: {
        type: 3,
        basisHash: n,
        lastMutationID: e,
        cookieJSON: t,
      },
      valueHash: r,
      indexes: a,
    }
  );
}

function rr(n, e, t, r, a) {
  return ar(n, {
    meta: {
      type: 1,
      basisHash: e,
      lastMutationID: t,
    },
    valueHash: r,
    indexes: a,
  });
}

function Da(n) {
  return Ws(n), new pt(n);
}

function ar(n, e) {
  return new pt(n(e, mt(e)));
}

function mt(n) {
  let e = [n.valueHash],
    { meta: t } = n;
  switch (t.type) {
    case 1:
      t.basisHash && e.push(t.basisHash);
      break;
    case 2:
      t.basisHash && e.push(t.basisHash);
      break;
    case 3:
      break;
  }
  for (let r of n.indexes) e.push(r.valueHash);
  return e;
}

function Fe(n) {
  if (!Yr) {
    H(n), Vs(n.meta), I(n.valueHash), $(n.indexes);
    for (let e of n.indexes) Ls(e);
  }
}

function Ws(n) {
  let { data: e } = n;
  Fe(e);
  let t = new Set();
  for (let r of e.indexes) {
    let { name: a } = r.definition;
    if (t.has(a)) throw new Error(`Duplicate index ${a}`);
    t.add(a);
  }
}
var _e = class {
  constructor(e, t, r) {
    this.shouldDeepClone = !1;
    (this.h = e), (this.map = t), (this.indexes = r);
  }
  has(e) {
    return this.map.has(e);
  }
  get(e) {
    return this.map.get(e);
  }
  isEmpty() {
    return this.map.isEmpty();
  }
  getMapForIndex(e) {
    let t = this.indexes.get(e);
    if (t === void 0) throw new Error(`Unknown index name: ${e}`);
    return t.map;
  }
  get closed() {
    return this.h.closed;
  }
  close() {
    this.h.close();
  }
};

function ft(n) {
  return {
    type: 0,
    name: n,
  };
}

function Be(n) {
  return {
    type: 1,
    hash: n,
  };
}

function sr(n) {
  return Sa(ft(x), n);
}
async function Sa(n, e) {
  let [, t, r] = await Ca(n, e),
    a = Se(t, e);
  return new _e(e, r, a);
}
async function yt(n, e) {
  let t;
  switch (n.type) {
    case 1:
      t = n.hash;
      break;
    case 0: {
      let a = await e.getHead(n.name);
      if (a === void 0) throw new Error(`Unknown head: ${n.name}`);
      t = a;
      break;
    }
  }
  let r = await N(t, e);
  return [t, r];
}
async function Ca(n, e) {
  let [t, r] = await yt(n, e);
  return [t, r, new k(e, r.valueHash)];
}
async function gt(n, e) {
  let [t, r] = await yt(n, e);
  return [t, r, new oe(e, r.valueHash)];
}

function Se(n, e) {
  let t = new Map();
  for (let r of n.indexes)
    t.set(r.definition.name, new rt(r, new k(e, r.valueHash)));
  return t;
}

function or(n) {
  let e;
  return () => (e === void 0 && (e = n()), e);
}
var Ue = class extends _e {
  constructor(t, r, a, s, o, i) {
    super(t, r, o);
    this.shouldDeepClone = !0;
    (this.u = t),
      (this.I = a),
      (this.m = s),
      (this.de = i),
      a === void 0 ? y(s.basisHash === D) : y(s.basisHash === a.chunk.hash);
  }
  isRebase() {
    return this.m.type === 2 && this.m.originalHash !== null;
  }
  async put(t, r, a) {
    if (this.m.type === 1) throw new Error("Not allowed");
    let s = or(() => this.map.get(r));
    await sn(t, this.indexes, r, s, a), await this.map.put(r, a);
  }
  async del(t, r) {
    if (this.m.type === 1) throw new Error("Not allowed");
    let a = or(() => this.map.get(r));
    return (
      a !== void 0 && (await sn(t, this.indexes, r, a, void 0)), this.map.del(r)
    );
  }
  async clear() {
    if (this.m.type === 1) throw new Error("Not allowed");
    await this.map.clear();
    let t = [];
    for (let r of this.indexes.values()) t.push(r.clear());
    await Promise.all(t);
  }
  async createIndex(t, r, a, s, o) {
    var c;
    if (this.m.type === 2) throw new Error("Not allowed");
    let i = {
        name: r,
        keyPrefix: a,
        jsonPointer: s,
        allowEmpty: o,
      },
      l = this.indexes.get(r);
    if (l) {
      let d = l.meta.definition,
        p = (c = d.allowEmpty) != null ? c : !1;
      if (d.name === r && d.keyPrefix === a && d.jsonPointer === s && p === o)
        return;
      throw new Error("Index exists with different definition");
    }
    let u = new oe(this.u);
    for await (let d of this.map.scan(a)) await Gt(t, u, 0, d[0], d[1], s, o);
    this.indexes.set(
      r,
      new at(
        {
          definition: i,
          valueHash: D,
        },
        u
      )
    );
  }
  async dropIndex(t) {
    if (this.m.type === 2) throw new Error("Not allowed");
    if (!this.indexes.delete(t)) throw new Error(`No such index: ${t}`);
  }
  async commit(t) {
    return (await this.commitWithDiffs(t, !1))[0];
  }
  async commitWithDiffs(t, r) {
    let a = await this.map.flush(),
      s = [];
    if (r && this.I) {
      let d = new k(this.u, this.I.valueHash);
      s = await xe(d, this.map);
    }
    let o = [],
      i = new Map();
    s.length > 0 && i.set("", s);
    let l;
    r && this.I ? (l = Se(this.I, this.u)) : (l = new Map());
    for (let [d, p] of this.indexes) {
      let h = await p.flush();
      if (r) {
        let f = l.get(d);
        y(p !== f);
        let g = await (f ? xe(f.map, p.map) : We(p.map, "add"));
        g.length > 0 && i.set(d, g);
      }
      let m = {
        definition: p.meta.definition,
        valueHash: h,
      };
      o.push(m);
    }
    if (r) {
      for (let [d, p] of l)
        if (!this.indexes.has(d)) {
          let h = await We(p.map, "del");
          h.length > 0 && i.set(d, h);
        }
    }
    let u,
      c = this.m;
    switch (c.type) {
      case 2: {
        let {
          basisHash: d,
          mutationID: p,
          mutatorName: h,
          mutatorArgsJSON: m,
          originalHash: f,
          timestamp: g,
        } = c;
        u = tr(this.u.createChunk, d, p, h, m, f, a, o, g, this.de);
        break;
      }
      case 3: {
        {
          De(c);
          let { basisHash: d, lastMutationID: p, cookieJSON: h } = c;
          u = nr(this.u.createChunk, d, p, h, a, o);
        }
        break;
      }
      case 1: {
        let { basisHash: d, lastMutationID: p } = c;
        if (this.I !== void 0) {
          if ((await this.I.getMutationID(this.de, this.u)) !== p)
            throw new Error("Index change must not change mutationID");
          if (this.I.valueHash !== a)
            throw new Error("Index change must not change valueHash");
        }
        u = rr(this.u.createChunk, d, p, a, o);
        break;
      }
    }
    return (
      await Promise.all([
        this.u.putChunk(u.chunk),
        this.u.setHead(t, u.chunk.hash),
      ]),
      await this.u.commit(),
      [u.chunk.hash, i]
    );
  }
  close() {
    this.u.close();
  }
};
async function wt(n, e, t, r, a, s, o) {
  let [i, l, u] = await gt(n, a),
    c = await l.getNextMutationID(o, a),
    d = It(l, a);
  return new Ue(
    a,
    u,
    l,
    {
      type: 2,
      basisHash: i,
      mutatorName: e,
      mutatorArgsJSON: t,
      mutationID: c,
      originalHash: r,
      timestamp: s,
    },
    d,
    o
  );
}
async function ir(n, e, t, r, a, s) {
  y(!0);
  let [, o, i] = await gt(n, r),
    l = o.chunk.hash;
  return new Ue(
    r,
    i,
    o,
    {
      basisHash: l,
      type: 3,
      lastMutationID: e,
      cookieJSON: t,
    },
    a,
    s
  );
}
async function lr(n, e, t) {
  let [r, a, s] = await gt(n, e),
    o = await a.getMutationID(t, e),
    i = It(a, e);
  return new Ue(
    e,
    s,
    a,
    {
      basisHash: r,
      type: 1,
      lastMutationID: o,
    },
    i,
    t
  );
}
async function sn(n, e, t, r, a) {
  let s = [];
  for (let o of e.values())
    if (t.startsWith(o.meta.definition.keyPrefix)) {
      let i = await r();
      i !== void 0 &&
        s.push(
          Gt(
            n,
            o.map,
            1,
            t,
            i,
            o.meta.definition.jsonPointer,
            o.meta.definition.allowEmpty
          )
        ),
        a !== void 0 &&
          s.push(
            Gt(
              n,
              o.map,
              0,
              t,
              a,
              o.meta.definition.jsonPointer,
              o.meta.definition.allowEmpty
            )
          );
    }
  await Promise.all(s);
}

function It(n, e) {
  let t = new Map();
  for (let r of n.indexes)
    t.set(r.definition.name, new at(r, new oe(e, r.valueHash)));
  return t;
}

function ur(n, e) {
  return n.withRead(async (t) => {
    let r = await t.getHead(e);
    if (r === void 0) throw new Error(`No head found for ${e}`);
    return r;
  });
}
var ie = class extends Error {
  constructor(t) {
    super(`Chunk not found ${t}`);
    this.name = "ChunkNotFoundError";
    this.hash = t;
  }
};
async function Ke(n, e) {
  let t = await n.getChunk(e);
  if (t) return t;
  throw new ie(e);
}
var xt = class {
  constructor(e) {
    this.Z = new Set();
    this.dagRead = e;
  }
  async visitCommit(e, t = 1) {
    if (this.Z.has(e)) return;
    this.Z.add(e);
    let r = await this.dagRead.getChunk(e);
    if (!r) {
      if (t === 0) return;
      throw new ie(e);
    }
    let { data: a } = r;
    Fe(a), await this.visitCommitChunk(r);
  }
  async visitCommitChunk(e) {
    let { data: t } = e;
    await Promise.all([
      this.Rt(t.meta),
      this.Ht(t.valueHash),
      this.vt(t.indexes),
    ]);
  }
  Rt(e) {
    switch (e.type) {
      case 1:
        return this.kt(e);
      case 2:
        return this.Pt(e);
      case 3:
        return this.Mt(e);
    }
  }
  async ce(e, t) {
    e !== null && (await this.visitCommit(e, t));
  }
  async Mt(e) {
    await this.ce(e.basisHash, 0);
  }
  async Pt(e) {
    await this.ce(e.basisHash, 1),
      e.originalHash !== null && (await this.visitCommit(e.originalHash, 0));
  }
  kt(e) {
    return this.ce(e.basisHash, 1);
  }
  Ht(e) {
    return this.visitBTreeNode(e);
  }
  async visitBTreeNode(e) {
    if (e === D || this.Z.has(e)) return;
    this.Z.add(e);
    let t = await this.dagRead.mustGetChunk(e),
      { data: r } = t;
    Ie(r), await this.visitBTreeNodeChunk(t);
  }
  async visitBTreeNodeChunk(e) {
    let { data: t } = e;
    se(t) && (await this.Nt(e));
  }
  async Nt(e) {
    let { data: t } = e;
    await Promise.all(t[1].map((r) => this.visitBTreeNode(r[1])));
  }
  async vt(e) {
    await Promise.all(e.map(async (t) => this.visitBTreeNode(t.valueHash)));
  }
};
var Je = class {
    constructor() {
      this.Ue = new Map();
      this.Ke = new Map();
    }
    get mappings() {
      return this.Ke;
    }
    Je(e, t) {
      let r = this.Ue.get(e);
      if (r !== void 0) return r;
      let a = t();
      return this.Ue.set(e, a), a;
    }
    qe(e, t = 1) {
      return this.Je(e, () => this.transformCommit(e, t));
    }
    async transformCommit(e, t = 1) {
      if (this.shouldSkip(e)) return e;
      let r = await this.getChunk(e);
      if (!r) {
        if (t === 0) return e;
        throw new Error(`Chunk ${e} not found`);
      }
      let { data: a } = r;
      Fe(a);
      let s = await this.Et(a);
      return this.je(e, s, a, mt);
    }
    shouldSkip(e) {
      return !1;
    }
    shouldForceWrite(e) {
      return !1;
    }
    async mustGetChunk(e) {
      return Ke(this, e);
    }
    async je(e, t, r, a) {
      if (t !== r || this.shouldForceWrite(e)) {
        let s = await this.writeChunk(e, t, a);
        return this.Ke.set(e, s), s;
      }
      return e;
    }
    async Et(e) {
      let [t, r, a] = await Promise.all([
        this.Ot(e.meta),
        this.Tt(e.valueHash),
        this.Vt(e.indexes),
      ]);
      return t === e.meta && r === e.valueHash && a === e.indexes
        ? e
        : {
            meta: t,
            valueHash: r,
            indexes: a,
          };
    }
    Ot(e) {
      switch (e.type) {
        case 1:
          return this.At(e);
        case 2:
          return this.Lt(e);
        case 3:
          return this.Wt(e);
      }
    }
    pe(e, t) {
      return e !== null ? this.qe(e, t) : null;
    }
    async Wt(e) {
      let t = await this.pe(e.basisHash, 0);
      return t === e.basisHash
        ? e
        : ba(e)
        ? {
            basisHash: t,
            type: e.type,
            lastMutationIDs: e.lastMutationIDs,
            cookieJSON: e.cookieJSON,
          }
        : {
            basisHash: t,
            type: e.type,
            lastMutationID: e.lastMutationID,
            cookieJSON: e.cookieJSON,
          };
    }
    async Lt(e) {
      let t = this.pe(e.basisHash, 1),
        r = e.originalHash && this.qe(e.originalHash, 0),
        a = await t,
        s = await r;
      return a === e.basisHash && s === e.originalHash
        ? e
        : {
            basisHash: a,
            type: e.type,
            mutationID: e.mutationID,
            mutatorName: e.mutatorName,
            mutatorArgsJSON: e.mutatorArgsJSON,
            originalHash: s,
            timestamp: e.timestamp,
          };
    }
    async At(e) {
      let t = await this.pe(e.basisHash, 1);
      return t === e.basisHash
        ? e
        : {
            basisHash: t,
            type: e.type,
            lastMutationID: e.lastMutationID,
          };
    }
    Tt(e) {
      return this.he(e);
    }
    he(e) {
      return this.Je(e, () => this.transformBTreeNode(e));
    }
    async transformBTreeNode(e) {
      if (this.shouldSkip(e)) return e;
      let { data: t } = await this.mustGetChunk(e);
      Ie(t);
      let r = await this.transformBTreeNodeData(t);
      return this.je(e, r, t, Zn);
    }
    async transformBTreeNodeData(e) {
      let t = e[0],
        r = e[1],
        a;
      return (
        se(e) ? (a = await this.Ft(r)) : (a = await this._t(r)),
        a === r ? e : [t, a]
      );
    }
    async transformBTreeDataEntry(e) {
      return e;
    }
    async _t(e) {
      return this.me(e, (t) => this.transformBTreeDataEntry(t));
    }
    async transformBTreeInternalEntry(e) {
      let t = await this.he(e[1]);
      return t === e[1] ? e : [e[0], t];
    }
    async Ft(e) {
      return this.me(e, (t) => this.transformBTreeInternalEntry(t));
    }
    async me(e, t) {
      let r = await Promise.all(e.map(t));
      for (let a = 0; a < r.length; a++) if (e[a] !== r[a]) return r;
      return e;
    }
    Vt(e) {
      return this.me(e, (t) => this.transformIndexRecord(t));
    }
    async transformIndexRecord(e) {
      let t = await this.he(e.valueHash);
      return t === e.valueHash
        ? e
        : {
            definition: e.definition,
            valueHash: t,
          };
    }
  },
  bt = class extends Je {
    constructor(t) {
      super();
      this.dagWrite = t;
    }
    getChunk(t) {
      return this.dagWrite.getChunk(t);
    }
    async writeChunk(t, r, a) {
      let { dagWrite: s } = this,
        o = s.createChunk(r, a(r));
      return await s.putChunk(o), o.hash;
    }
  };

function Dt() {
  let n = new Uint8Array(36);
  return crypto.getRandomValues(n), Us(n);
}
var Bs = [
  0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 3, 0, 0, 0, 2, 1, 0, 0, 0, 2, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

function Us(n) {
  return Bs.map((e, t) => {
    switch (e) {
      case 0:
        return (n[t] & 15).toString(16);
      case 1:
        return ((n[t] & 3) + 8).toString(16);
      case 3:
        return "4";
      case 2:
        return "-";
    }
  }).join("");
}

function on(n) {
  H(n), b(n.httpStatusCode), I(n.errorMessage);
}

function ln(n, e, t, r, a) {
  let s = {
      headers: {
        "Content-type": "application/json",
        Authorization: r,
        "X-Replicache-RequestID": a,
      },
      body: JSON.stringify(t),
      method: "POST",
    },
    o = new Request(e, s);
  return n(o);
}
var K = "sync";
async function Ha(n, e, t) {
  for (let r of t)
    switch (r.op) {
      case "put": {
        await e.put(n, r.key, Z(r.value, 257));
        break;
      }
      case "del":
        await e.del(n, r.key);
        break;
      case "clear":
        await e.clear();
        break;
    }
}

function un(n) {
  return n instanceof Error ? n : new Error(String(n));
}
var Js = 0;
async function St(n, e, t, r, a, s, o, i = !0) {
  var v, G;
  let { pullURL: l, pullAuth: u, schemaVersion: c } = t,
    [d, p] = await s.withRead(async (O) => {
      let W = await O.getHead(x);
      if (!W) throw new Error("Internal no main head found");
      let C = await U(W, O),
        ee = await C.getMutationID(e, O),
        te = C.meta.cookieJSON;
      return [ee, te];
    }),
    h = {
      profileID: n,
      clientID: e,
      cookie: p,
      lastMutationID: d,
      pullVersion: Js,
      schemaVersion: c,
    };
  (v = o.debug) == null || v.call(o, "Starting pull...");
  let m = Date.now(),
    { response: f, httpRequestInfo: g } = await qs(r, l, h, u, a);
  if (
    ((G = o.debug) == null ||
      G.call(
        o,
        `...Pull ${f ? "complete" : "failed"} in `,
        Date.now() - m,
        "ms"
      ),
    !f)
  )
    return {
      httpRequestInfo: g,
      syncHead: D,
    };
  if (!i || Y(f))
    return {
      httpRequestInfo: g,
      pullResponse: f,
      syncHead: D,
    };
  let w = await dn(o, s, p, f, e);
  if (w === null) throw new Error("Overlapping sync JsLogInfo");
  return {
    httpRequestInfo: g,
    pullResponse: f,
    syncHead: w,
  };
}
async function dn(n, e, t, r, a) {
  return await e.withWrite(async (s) => {
    var g;
    let o = s,
      i = await o.getHead(x);
    if (i === void 0) throw new Error("Main head disappeared");
    let l = await U(i, o),
      [u, c] = ht(l, a);
    if (!nt(t, c)) return null;
    if (r.lastMutationID < u)
      throw new Error(
        `Received lastMutationID ${r.lastMutationID} is < than last snapshot lastMutationID ${u}; ignoring client view`
      );
    let d = Z((g = r.cookie) != null ? g : null, 256);
    if (r.patch.length === 0 && r.lastMutationID === u && nt(d, c)) return D;
    let p = await rn(i, o),
      h;
    for (let w of p)
      if ((await w.getMutationID(a, o)) <= r.lastMutationID) {
        h = w;
        break;
      }
    if (!h) throw new Error("Internal invalid chain");
    let m = await ir(Be(l.chunk.hash), r.lastMutationID, d, s, It(h, s), a);
    await Ha(n, m, r.patch);
    let f = new k(o, h.valueHash);
    for await (let w of m.map.diff(f))
      await sn(
        n,
        m.indexes,
        w.key,
        () => Promise.resolve(w.oldValue),
        w.newValue
      );
    return await m.commit(K);
  });
}
async function cr(n, e, t, r) {
  return await n.withWrite(async (a) => {
    var W;
    let s = a,
      o = await s.getHead(K);
    if (o === void 0) throw new Error("Missing sync head");
    if (o !== t)
      throw (
        ((W = e.error) == null ||
          W.call(e, "maybeEndPull, Wrong sync head. Expecting:", t, "got:", o),
        new Error("Wrong sync head"))
      );
    let i = await U(o, s),
      l = await s.getHead(x);
    if (l === void 0) throw new Error("Missing main head");
    let u = await U(l, s),
      { meta: c } = i,
      d = c.basisHash;
    if (i === null) throw new Error("Sync snapshot with no basis");
    if (d !== u.chunk.hash) throw new Error("Overlapping syncs");
    let p = await N(o, s),
      h = [],
      m = await p.getMutationID(r, s),
      f = await be(l, s);
    for (let C of f) (await C.getMutationID(r, s)) > m && h.push(C);
    h.reverse();
    let g = new Map();
    if (h.length > 0)
      return {
        syncHead: o,
        replayMutations: h,
        diffs: g,
      };
    let w = await N(l, s),
      v = new k(s, w.valueHash),
      G = new k(s, p.valueHash),
      O = await xe(v, G);
    if (
      (O.length > 0 && g.set("", O),
      await Gs(w, p, s, g),
      await Promise.all([a.setHead(x, o), a.removeHead(K)]),
      await a.commit(),
      e.debug)
    ) {
      let [C, ee] = ht(u, r),
        [te, ke] = ht(i, r);
      e.debug(
        "Successfully pulled new snapshot w/last_mutation_id:",
        te,
        "(prev:",
        C,
        "), cookie: ",
        ke,
        "(prev:",
        ee,
        "), sync head hash:",
        o,
        ", main head hash:",
        l,
        ", value_hash:",
        p.valueHash,
        "(prev:",
        u.valueHash
      );
    }
    return {
      syncHead: o,
      replayMutations: [],
      diffs: g,
    };
  });
}
async function qs(n, e, t, r, a) {
  try {
    let s = await ln(n, e, t, r, a);
    return js(s), s;
  } catch (s) {
    throw new Te(un(s));
  }
}

function js(n) {
  if (typeof n != "object" || n === null)
    throw new Error("Expected result to be an object");
  n.response !== void 0 && ta(n.response), on(n.httpRequestInfo);
}
async function Gs(n, e, t, r) {
  let a = Se(n, t),
    s = Se(e, t);
  for (let [o, i] of a) {
    let l = s.get(o);
    if (l !== void 0) {
      y(l !== i);
      let u = await xe(i.map, l.map);
      s.delete(o), u.length > 0 && r.set(o, u);
    } else {
      let u = await We(i.map, "del");
      u.length > 0 && r.set(o, u);
    }
  }
  for (let [o, i] of s) {
    let l = await We(i.map, "add");
    l.length > 0 && r.set(o, l);
  }
}
var $s = 0;

function zs(n) {
  return {
    id: n.mutationID,
    name: n.mutatorName,
    args: n.mutatorArgsJSON,
    timestamp: n.timestamp,
  };
}
async function Ct(n, e, t, r, a, s, o, i, l) {
  var d, p;
  let u = await e.withRead(async (h) => {
    let m = await h.getHead(x);
    if (!m) throw new Error("Internal no main head");
    return await be(m, h);
  });
  u.reverse();
  let c;
  if (u.length > 0) {
    let h = [];
    for (let g of u)
      if (g.isLocal()) h.push(zs(g.meta));
      else throw new Error("Internal non local pending commit");
    let m = {
      profileID: r,
      clientID: a,
      mutations: h,
      pushVersion: $s,
      schemaVersion: l,
    };
    (d = t.debug) == null || d.call(t, "Starting push...");
    let f = Date.now();
    (c = await Ys(s, o, m, i, n)),
      (p = t.debug) == null ||
        p.call(t, "...Push complete in ", Date.now() - f, "ms");
  }
  return c;
}
async function Ys(n, e, t, r, a) {
  try {
    let s = await ln(n, e, t, r, a);
    return on(s), s;
  } catch (s) {
    throw new Ee(un(s));
  }
}
var pr = "";

function Zs() {
  if (pr === "") {
    let n = new Uint8Array(4);
    crypto.getRandomValues(n),
      (pr = Array.from(n, (e) => e.toString(16)).join(""));
  }
  return pr;
}
var hr = new Map();

function cn(n) {
  let e = hr.get(n);
  return e ? (e++, hr.set(n, e)) : (hr.set(n, 0), (e = 0)), `${n}-${Zs()}-${e}`;
}
var Xs = 0,
  Rt = class {
    constructor(e, t, r, a = "openReadTransaction") {
      (this.clientID = e),
        (this.dbtx = t),
        (this.e = r.addContext(a).addContext("txid", Xs++));
    }
    async get(e) {
      M(this.dbtx);
      let t = await this.dbtx.get(e);
      return t !== void 0 ? R(t, 257) : void 0;
    }
    async has(e) {
      return M(this.dbtx), this.dbtx.has(e);
    }
    async isEmpty() {
      return M(this.dbtx), this.dbtx.isEmpty();
    }
    scan(e) {
      return va(e, this.dbtx, Qs);
    }
  };

function Qs(n) {}

function va(n, e, t) {
  let r = eo(e, n);
  return to(r, n != null ? n : {}, e, t);
}
var hn = class {
    constructor(e) {
      this.P = new Set();
      this.M = [];
      this.n = e;
    }
    get clientID() {
      return this.n.clientID;
    }
    isEmpty() {
      return (
        this.M.push({
          options: {},
        }),
        this.n.isEmpty()
      );
    }
    get(e) {
      return this.P.add(e), this.n.get(e);
    }
    has(e) {
      return this.P.add(e), this.n.has(e);
    }
    scan(e) {
      let t = {
        options: oa(e),
        inclusiveLimitKey: void 0,
      };
      return (
        this.M.push(t),
        va(e, this.n.dbtx, (r) => {
          t.inclusiveLimitKey = r;
        })
      );
    }
    get keys() {
      return this.P;
    }
    get scans() {
      return this.M;
    }
  },
  Ce = class extends Rt {
    constructor(t, r, a, s = "openWriteTransaction") {
      super(t, r, a, s);
    }
    async get(t) {
      M(this.dbtx);
      let r = await this.dbtx.get(t);
      return r === void 0 ? void 0 : R(r, 3);
    }
    async put(t, r) {
      M(this.dbtx);
      let a = Z(r, 1);
      await this.dbtx.put(this.e, t, a);
    }
    async del(t) {
      return M(this.dbtx), await this.dbtx.del(this.e, t);
    }
    async commit(t) {
      let r = this.dbtx;
      M(r);
      let a = r.isRebase() ? K : x;
      return await r.commitWithDiffs(a, t);
    }
  },
  mn = class extends Ce {
    constructor(e, t, r) {
      super(e, t, r, "openIndexTransaction");
    }
    async createIndex(e) {
      var t, r;
      M(this.dbtx),
        await this.dbtx.createIndex(
          this.e,
          e.name,
          (t = e.prefix) != null ? t : "",
          e.jsonPointer,
          (r = e.allowEmpty) != null ? r : !1
        );
    }
    async dropIndex(e) {
      M(this.dbtx), await this.dbtx.dropIndex(e);
    }
  };

function eo(n, e) {
  return e && Ve(e) ? no(n, e) : n.map.scan(Gn(e));
}

function Gn(n) {
  if (!n) return "";
  let { prefix: e = "", start: t } = n;
  return t && fe(t.key, e) ? t.key : e;
}

function to(n, e, t, r) {
  return new Ae(n, e, t, r);
}
async function* no(n, e) {
  let t = n.getMapForIndex(e.indexName);
  for await (let r of t.scan(ca(e))) yield [ye(r[0]), r[1]];
}
var qe = class extends Error {
  constructor(t) {
    super(t);
    this.name = "AbortError";
  }
};

function je(n, e) {
  return n === 0
    ? Promise.resolve()
    : new Promise((t, r) => {
        let a = setTimeout(() => {
          t();
        }, n);
        e &&
          e.addEventListener("abort", () => {
            a && clearTimeout(a), r(new qe("Aborted"));
          });
      });
}
var ka = 30,
  Pa = 6e4,
  Ht = class {
    constructor(e) {
      this.X = S();
      this.t = !1;
      this.Q = void 0;
      (this.fe = e), this.run();
    }
    close() {
      this.t = !0;
    }
    send() {
      var e, t;
      (t = (e = this.fe).debug) == null || t.call(e, "send"), this.X.resolve();
    }
    async run() {
      let e = [],
        t = S(),
        r,
        a = 0,
        s = this.fe,
        { debug: o } = s,
        i = 0;
      for (o == null || o("Starting connection loop"); !this.t; ) {
        o == null ||
          o(mr(e) ? "Last request failed. Trying again" : "Waiting for a send");
        let l = [this.X.promise],
          u = s.watchdogTimer;
        if (
          (u !== null && l.push(je(u)),
          await Promise.race(l),
          this.t ||
            (o == null || o("Waiting for debounce"),
            await je(s.debounceDelay),
            this.t))
        )
          break;
        if (
          (o == null || o("debounced"), (this.X = S()), a >= s.maxConnections)
        ) {
          if (
            (o == null ||
              o("Too many request in flight. Waiting until one finishes..."),
            await this.Bt(),
            this.t)
          )
            break;
          o == null || o("...finished");
        }
        a > 0 || mr(e)
          ? ((i = ao(i, s, e)),
            o == null ||
              o(
                mr(e)
                  ? "Last connection errored. Sleeping for"
                  : "More than one outstanding connection (" +
                      a +
                      "). Sleeping for",
                i,
                "ms"
              ))
          : (i = 0);
        let c = Math.min(s.maxDelayMs, Math.max(s.minDelayMs, i));
        if (r !== void 0) {
          let d = Date.now() - r;
          if (c > d && (await Promise.race([je(c - d), t.promise]), this.t))
            break;
        }
        a++,
          (async () => {
            let d = Date.now(),
              p;
            try {
              (r = d),
                o == null || o("Sending request"),
                (p = await s.invokeSend()),
                o == null || o("Send returned", p);
            } catch (h) {
              o == null || o("Send failed", h), (p = !1);
            }
            if (this.t) {
              o == null || o("Closed after invokeSend");
              return;
            }
            o == null ||
              o("Request done", {
                duration: Date.now() - d,
                ok: p,
              }),
              e.push({
                duration: Date.now() - d,
                ok: p,
              }),
              oo(e) && (t.resolve(), (t = S())),
              a--,
              this.Ut(),
              p || this.X.resolve();
          })();
      }
    }
    Ut() {
      if (this.Q) {
        let e = this.Q;
        (this.Q = void 0), e();
      }
    }
    Bt() {
      let { promise: e, resolve: t } = S();
      return (this.Q = t), e;
    }
  },
  ro = 9;

function ao(n, e, t) {
  let { length: r } = t;
  if (r === 0) return n;
  let { ok: a } = t[t.length - 1],
    { maxConnections: s, minDelayMs: o } = e;
  if (!a) return n === 0 ? o : n * 2;
  if (r > 1) {
    let l = t[t.length - 2];
    for (; t.length > ro; ) t.shift();
    if (a && !l.ok) return o;
  }
  return (so(t.filter(({ ok: l }) => l).map(({ duration: l }) => l)) / s) | 0;
}

function so(n) {
  n.sort();
  let { length: e } = n,
    t = e >> 1;
  return e % 2 === 1 ? n[t] : (n[t - 1] + n[t]) / 2;
}

function mr(n) {
  return n.length > 0 && !n[n.length - 1].ok;
}

function oo(n) {
  return n.length > 1 && !n[n.length - 2].ok && n[n.length - 1].ok;
}
var fn = class {
    constructor(e, t, r) {
      this.maxConnections = 1;
      (this.rep = e), (this.invokeSend = t), (this.logger = r);
    }
    get maxDelayMs() {
      return this.rep.requestOptions.maxDelayMs;
    }
    get minDelayMs() {
      return this.rep.requestOptions.minDelayMs;
    }
    get debug() {
      return this.logger.debug;
    }
  },
  yn = class extends fn {
    constructor() {
      super(...arguments);
      this.debounceDelay = 0;
    }
    get watchdogTimer() {
      return this.rep.pullInterval;
    }
  },
  gn = class extends fn {
    constructor() {
      super(...arguments);
      this.watchdogTimer = null;
    }
    get debounceDelay() {
      return this.rep.pushDelay;
    }
  };
var io = new Set(),
  fr = class {
    constructor(e, t, r, a) {
      this.ze = !0;
      this.Ye = void 0;
      this.P = io;
      this.M = [];
      (this.Ge = e), (this.$e = t), (this.onError = r), (this.onDone = a);
    }
    invoke(e, t, r) {
      return this.Ge(e);
    }
    matches(e) {
      for (let [t, r] of e) if (lo(this.P, this.M, t, r)) return !0;
      return !1;
    }
    updateDeps(e, t) {
      (this.P = e), (this.M = t);
    }
    onData(e) {
      (this.ze || !re(e, this.Ye)) &&
        ((this.Ye = e), (this.ze = !1), this.$e(e));
    }
  },
  yr = class {
    constructor(e, t) {
      this.onError = void 0;
      this.onDone = void 0;
      var r, a;
      (this.Ze = e),
        (this.ee = (r = t.prefix) != null ? r : ""),
        (this.F = t.indexName),
        (this.Xe = (a = t.initialValuesInFirstDiff) != null ? a : !1);
    }
    onData(e) {
      e !== void 0 && this.Ze(e);
    }
    async invoke(e, t, r) {
      let a = async (s, o, i, l) => {
        var p;
        let u;
        if (t === 0) {
          if (!this.Xe) return;
          y(r === void 0);
          let h = [];
          for await (let m of e
            .scan({
              prefix: o,
              indexName: s,
            })
            .entries())
            h.push({
              op: "add",
              key: m[0],
              newValue: m[1],
            });
          u = h;
        } else {
          y(r);
          let h = (p = r.get(s != null ? s : "")) != null ? p : [];
          u = l(h);
        }
        let c = [],
          { length: d } = u;
        for (let h = Ea(u, o, i); h < d && i(u[h]).startsWith(o); h++)
          c.push(u[h]);
        return t === 0 || c.length > 0 ? c : void 0;
      };
      return this.F
        ? await a(
            this.F,
            this.ee,
            (s) => s.key[0],
            (s) => Ma(s, ye)
          )
        : await a(
            void 0,
            this.ee,
            (s) => s.key,
            (s) => Ma(s, (o) => o)
          );
    }
    matches(e) {
      var r;
      let t = e.get((r = this.F) != null ? r : "");
      return t === void 0 ? !1 : ho(t, this.ee, this.F);
    }
    updateDeps(e, t) {}
  };

function Ma(n, e) {
  return n.map((t) => {
    let r = e(t.key);
    switch (t.op) {
      case "add":
        return {
          op: "add",
          key: r,
          newValue: R(t.newValue, 1),
        };
      case "change":
        return {
          op: "change",
          key: r,
          oldValue: R(t.oldValue, 1),
          newValue: R(t.newValue, 1),
        };
      case "del":
        return {
          op: "del",
          key: r,
          oldValue: R(t.oldValue, 1),
        };
    }
  });
}
var wn = class {
  constructor(e, t) {
    this.i = new Set();
    this.ye = new Set();
    this.hasPendingSubscriptionRuns = !1;
    (this._ = e), (this.e = t);
  }
  Qe(e) {
    return this.i.add(e), this.Kt(e), () => this.i.delete(e);
  }
  addSubscription(e, { onData: t, onError: r, onDone: a }) {
    let s = new fr(e, t, r, a);
    return this.Qe(s);
  }
  addWatch(e, t) {
    let r = new yr(e, t != null ? t : {});
    return this.Qe(r);
  }
  clear() {
    var e;
    for (let t of this.i) (e = t.onDone) == null || e.call(t);
    this.i.clear();
  }
  async fire(e) {
    let t = po(this.i, e);
    await this.et(t, 1, e);
  }
  async et(e, t, r) {
    var o, i;
    let a = [...e];
    if (a.length === 0) return;
    let s = await this._((l) =>
      Promise.allSettled(
        a.map(async (u) => {
          let c = new hn(l);
          try {
            return await u.invoke(c, t, r);
          } finally {
            u.updateDeps(c.keys, c.scans);
          }
        })
      )
    );
    for (let l = 0; l < a.length; l++) {
      let u = a[l],
        c = s[l];
      c.status === "fulfilled"
        ? u.onData(c.value)
        : u.onError
        ? u.onError(c.reason)
        : (i = (o = this.e).error) == null || i.call(o, c.reason);
    }
  }
  async Kt(e) {
    if ((this.ye.add(e), !this.hasPendingSubscriptionRuns)) {
      (this.hasPendingSubscriptionRuns = !0),
        await Promise.resolve(),
        (this.hasPendingSubscriptionRuns = !1);
      let t = [...this.ye];
      this.ye.clear(), await this.et(t, 0, void 0);
    }
  }
};

function lo(n, e, t, r) {
  if (t === "") {
    for (let a of r) if (n.has(a.key)) return !0;
  }
  for (let a of e) if (uo(a, t, r)) return !0;
  return !1;
}

function uo(n, e, t) {
  for (let r of t) if (co(n, e, r.key)) return !0;
  return !1;
}

function co(n, e, t) {
  let {
    indexName: r = "",
    limit: a,
    prefix: s,
    startKey: o,
    startExclusive: i,
    startSecondaryKey: l,
  } = n.options;
  if (e !== r) return !1;
  if (!r)
    return a !== void 0 && a <= 0
      ? !1
      : !s && !o
      ? !0
      : !(
          (s && (!t.startsWith(s) || Na(n, t))) ||
          (o && ((i && Bt(t, o)) || _t(t, o) || Na(n, t)))
        );
  if (!s && !o && !l) return !0;
  let [u, c] = ye(t);
  return !(
    (s && !u.startsWith(s)) ||
    (l && ((i && Bt(u, l)) || _t(u, l))) ||
    (o && ((i && Bt(c, o)) || _t(c, o)))
  );
}

function Na(n, e) {
  let { inclusiveLimitKey: t } = n;
  return n.options.limit !== void 0 && t !== void 0 && fe(e, t);
}

function* po(n, e) {
  for (let t of n) t.matches(e) && (yield t);
}

function ho(n, e, t) {
  if (e === "") return !0;
  let r = t ? (s) => ye(s.key)[0] : (s) => s.key,
    a = Ea(n, e, r);
  return a < n.length && r(n[a]).startsWith(e);
}

function Ea(n, e, t) {
  return zt(n.length, (r) => me(e, t(n[r])));
}
var Re = Symbol(),
  Ge = class {
    constructor(e) {
      this.p = new Map();
      this.B = e;
    }
    async has(e) {
      switch (this.p.get(e)) {
        case void 0:
          return this.B.has(e);
        case Re:
          return !1;
        default:
          return !0;
      }
    }
    async get(e) {
      let t = this.p.get(e);
      switch (t) {
        case Re:
          return;
        case void 0:
          return this.B.get(e);
        default:
          return t;
      }
    }
    async put(e, t) {
      this.p.set(e, t);
    }
    async del(e) {
      this.p.set(e, Re);
    }
    release() {
      this.B.release();
    }
    get closed() {
      return this.B.closed;
    }
  };
var mo = {
    durability: "relaxed",
  },
  bn = "chunks";
var L = class {
    constructor(e) {
      this.t = !1;
      this.U = yo(e);
    }
    async read() {
      return await this.te(Ta);
    }
    async withRead(e) {
      let t = await this.te(Ta);
      try {
        return await e(t);
      } finally {
        t.release();
      }
    }
    async write() {
      return await this.te(Oa);
    }
    async withWrite(e) {
      let t = await this.te(Oa);
      try {
        return await e(t);
      } finally {
        t.release();
      }
    }
    async close() {
      (await this.U).close(), (this.t = !0);
    }
    get closed() {
      return this.t;
    }
    async te(e) {
      let t = await this.U;
      try {
        return e(t);
      } catch (r) {
        if (
          !this.t &&
          r instanceof DOMException &&
          r.name === "InvalidStateError"
        ) {
          this.U = fo(t.name);
          let a = await this.U;
          return e(a);
        } else throw r;
      }
    }
  },
  In = class {
    constructor(e) {
      this.t = !1;
      this.n = e;
    }
    async has(e) {
      return (await xn(wr(this.n).count(e))) > 0;
    }
    get(e) {
      return xn(wr(this.n).get(e));
    }
    release() {
      this.t = !0;
    }
    get closed() {
      return this.t;
    }
  },
  gr = class extends Ge {
    constructor(t) {
      super(new In(t));
      this.nt = 0;
      this.t = !1;
      (this.n = t), (this.tt = this.Jt());
    }
    async Jt() {
      let t = this.n,
        r = new Promise((a, s) => {
          (t.onabort = () => a(2)),
            (t.oncomplete = () => a(1)),
            (t.onerror = () => s(t.error));
        });
      this.nt = await r;
    }
    async commit() {
      if (this.p.size === 0) return;
      let t = wr(this.n);
      if (
        (this.p.forEach((r, a) => {
          r === Re ? t.delete(a) : t.put(r, a);
        }),
        await this.tt,
        this.nt === 2)
      )
        throw new Error("Transaction aborted");
    }
    release() {
      this.t = !0;
    }
    get closed() {
      return this.t;
    }
  };

function Oa(n) {
  let e = n.transaction(bn, "readwrite", mo);
  return new gr(e);
}

function Ta(n) {
  let e = n.transaction(bn, "readonly");
  return new In(e);
}

function fo(n) {
  let { promise: e, resolve: t, reject: r } = S(),
    a = indexedDB.open(n),
    s = !1;
  return (
    (a.onupgradeneeded = () => {
      (s = !0), r(new Error(`Replicache IndexedDB not found: ${n}`));
    }),
    (a.onsuccess = () => {
      s ? a.result.close() : t(a.result);
    }),
    (a.onerror = () => {
      r(a.error);
    }),
    e
      .then((o) => {
        o.onversionchange = () => o.close();
      })
      .catch((o) => {
        if (s) indexedDB.deleteDatabase(n);
        else throw o;
      }),
    e
  );
}

function wr(n) {
  return n.objectStore(bn);
}

function yo(n) {
  let e = indexedDB.open(n);
  return (
    (e.onupgradeneeded = () => {
      e.result.createObjectStore(bn);
    }),
    xn(e).then((r) => ((r.onversionchange = () => r.close()), r))
  );
}

function xn(n) {
  return new Promise((e, t) => {
    (n.onsuccess = () => e(n.result)), (n.onerror = () => t(n.error));
  });
}
async function Dn(n) {
  await xn(indexedDB.deleteDatabase(n));
}
var Ir = class {
  constructor(e, t, r) {
    (this.hash = e), (this.data = t), (this.meta = r);
  }
};

function xr(n) {
  if (!Array.isArray(n)) throw new Error("Meta must be an array");
  for (let e of n) I(e);
}

function vt(n, e, t) {
  let r = t(n);
  return E(r, n, e);
}

function E(n, e, t) {
  return y(!t.includes(n), "Chunk cannot reference itself"), new Ir(n, e, t);
}
async function Sn(n, e) {
  let t = await Le(n);
  return E(t, n, e);
}

function le(n) {
  throw new Error("unexpected call to compute chunk hash");
}

function kt(n) {
  return `c/${n}/d`;
}

function $e(n) {
  return `c/${n}/m`;
}

function Cn(n) {
  return `c/${n}/r`;
}

function br(n) {
  return `h/${n}`;
}
async function Rn(n, e, t) {
  let r = [],
    a = [];
  for (let i of n)
    i.old !== i.new && (i.old && a.push(i.old), i.new && r.push(i.new));
  let s = new Map(),
    o = new Map();
  for (let i of r) await Dr(i, 1, s, o, t);
  for (let i of a) await Dr(i, -1, s, o, t);
  return await Promise.all(Array.from(e.values(), (i) => Aa(i, s, o, t))), s;
}
async function Dr(n, e, t, r, a) {
  if ((await Aa(n, t, r, a), Io(n, e, t))) {
    let s = await a.getRefs(n);
    if (s !== void 0) {
      let o = s.map((i) => Dr(i, e, t, r, a));
      await Promise.all(o);
    }
  }
}

function Aa(n, e, t, r) {
  let a = t.get(n);
  return (
    a === void 0 &&
      ((a = (async () => {
        let s = (await r.getRefCount(n)) || 0;
        return e.set(n, s), s;
      })()),
      t.set(n, a)),
    a
  );
}

function Io(n, e, t) {
  let r = t.get(n);
  return b(r), t.set(n, r + e), (r === 0 && e === 1) || (r === 1 && e === -1);
}
var J = class {
    constructor(e, t, r) {
      (this.N = e), (this.d = t), (this.f = r);
    }
    async read() {
      return new Pt(await this.N.read(), this.f);
    }
    async withRead(e) {
      return this.N.withRead((t) => e(new Pt(t, this.f)));
    }
    async write() {
      return new Hn(await this.N.write(), this.d, this.f);
    }
    async withWrite(e) {
      return this.N.withWrite((t) => e(new Hn(t, this.d, this.f)));
    }
    async close() {
      await this.N.close();
    }
  },
  Pt = class {
    constructor(e, t) {
      (this.n = e), (this.assertValidHash = t);
    }
    async hasChunk(e) {
      return await this.n.has(kt(e));
    }
    async getChunk(e) {
      let t = await this.n.get(kt(e));
      if (t === void 0) return;
      let r = await this.n.get($e(e)),
        a;
      return r !== void 0 ? (xr(r), (a = r)) : (a = []), E(e, t, a);
    }
    async mustGetChunk(e) {
      return Ke(this, e);
    }
    async getHead(e) {
      let t = await this.n.get(br(e));
      if (t !== void 0) return B(t), t;
    }
    close() {
      this.n.release();
    }
    get closed() {
      return this.n.closed;
    }
  },
  Hn = class extends Pt {
    constructor(t, r, a) {
      super(t, a);
      this.ge = new Set();
      this.we = new Map();
      this.createChunk = (t, r) => vt(t, r, this.d);
      this.d = r;
    }
    get kvWrite() {
      return this.n;
    }
    async putChunk(t) {
      let { hash: r, data: a, meta: s } = t;
      this.assertValidHash(r);
      let o = kt(r),
        i = this.n.put(o, a),
        l;
      if (s.length > 0) {
        for (let u of s) this.assertValidHash(u);
        l = this.n.put($e(r), s);
      }
      this.ge.add(r), await i, await l;
    }
    setHead(t, r) {
      return this.K(t, r);
    }
    removeHead(t) {
      return this.K(t, void 0);
    }
    async K(t, r) {
      let a = await this.getHead(t),
        s = br(t),
        o;
      r === void 0 ? (o = this.n.del(s)) : (o = this.n.put(s, r));
      let i = this.we.get(t);
      i === void 0
        ? this.we.set(t, {
            new: r,
            old: a,
          })
        : (i.new = r),
        await o;
    }
    async commit() {
      let t = await Rn(this.we.values(), this.ge, this);
      await this.qt(t), await this.n.commit();
    }
    async getRefCount(t) {
      let r = await this.n.get(Cn(t));
      if (r !== void 0) {
        if ((b(r), r < 0 || r > 65535 || r !== (r | 0)))
          throw new Error(
            `Invalid ref count ${r}. We expect the value to be a Uint16`
          );
        return r;
      }
    }
    async getRefs(t) {
      let r = await this.n.get($e(t));
      return r !== void 0 && xr(r), r;
    }
    async qt(t) {
      let r = [];
      t.forEach((a, s) => {
        if (a === 0) r.push(this.jt(s));
        else {
          let o = Cn(s);
          r.push(this.n.put(o, a));
        }
      }),
        await Promise.all(r);
    }
    async jt(t) {
      await Promise.all([
        this.n.del(kt(t)),
        this.n.del($e(t)),
        this.n.del(Cn(t)),
      ]),
        this.ge.delete(t);
    }
    close() {
      this.n.release();
    }
  };
var He = class {
    constructor(e, t, r, a, s = he) {
      this.x = new Ne();
      this.H = new Map();
      this.D = new Map();
      this.s = new Map();
      (this.y = new Cr(t, s, this.s)), (this.E = e), (this.d = r), (this.f = a);
    }
    async read() {
      let e = await this.x.read();
      return new vn(this.H, this.D, this.y, this.E, e, this.f);
    }
    async withRead(e) {
      let t = await this.read();
      try {
        return await e(t);
      } finally {
        t.close();
      }
    }
    async write() {
      let e = await this.x.write();
      return new Sr(this.H, this.D, this.y, this.E, this.s, e, this.d, this.f);
    }
    async withWrite(e) {
      let t = await this.write();
      try {
        return await e(t);
      } finally {
        t.close();
      }
    }
    async close() {}
    get refCountsSnapshot() {
      return new Map(this.s);
    }
  },
  vn = class {
    constructor(e, t, r, a, s, o) {
      this.H = new Map();
      this.D = new Map();
      this.ne = void 0;
      this.t = !1;
      (this.H = e),
        (this.D = t),
        (this.y = r),
        (this.E = a),
        (this.b = s),
        (this.assertValidHash = o);
    }
    async hasChunk(e) {
      return (await this.getChunk(e)) !== void 0;
    }
    async getChunk(e) {
      if (_(e)) return this.D.get(e);
      let t = this.y.get(e);
      return (
        t === void 0 &&
          ((t = await (await this.Gt()).getChunk(e)),
          t !== void 0 && this.y.put(t)),
        t
      );
    }
    async mustGetChunk(e) {
      return Ke(this, e);
    }
    async getHead(e) {
      return this.H.get(e);
    }
    close() {
      var e;
      this.t ||
        (this.b(),
        (e = this.ne) == null || e.then((t) => t.close()),
        (this.t = !0));
    }
    get closed() {
      return this.t;
    }
    async Gt() {
      return this.ne || (this.ne = this.E.read()), this.ne;
    }
  },
  Sr = class extends vn {
    constructor(t, r, a, s, o, i, l, u) {
      super(t, r, a, s, i, u);
      this.O = new Map();
      this.S = new Map();
      this.createChunk = (t, r) => vt(t, r, this.d);
      (this.s = o), (this.d = l);
    }
    async putChunk(t) {
      let { hash: r, meta: a } = t;
      if ((this.assertValidHash(r), a.length > 0))
        for (let s of a) this.assertValidHash(s);
      this.S.set(r, t);
    }
    async setHead(t, r) {
      await this.K(t, r);
    }
    async removeHead(t) {
      await this.K(t, void 0);
    }
    async K(t, r) {
      let a = await this.getHead(t),
        s = this.O.get(t);
      s === void 0
        ? this.O.set(t, {
            new: r,
            old: a,
          })
        : (s.new = r);
    }
    async hasChunk(t) {
      return this.S.has(t) || super.hasChunk(t);
    }
    async getChunk(t) {
      return this.S.get(t) || super.getChunk(t);
    }
    async getHead(t) {
      let r = this.O.get(t);
      return r ? r.new : super.getHead(t);
    }
    async commit() {
      let t = await Rn(this.O.values(), new Set(this.S.keys()), this),
        r = [],
        a = [];
      t.forEach((s, o) => {
        s === 0
          ? (this.s.delete(o),
            this.S.delete(o),
            _(o) ? this.D.delete(o) : a.push(o))
          : this.s.set(o, s);
      }),
        this.S.forEach((s, o) => {
          _(o) ? this.D.set(o, s) : r.push(s);
        }),
        this.O.forEach((s, o) => {
          s.new ? this.H.set(o, s.new) : this.H.delete(o);
        }),
        this.y.updateForCommit(r, a),
        this.S.clear(),
        this.O.clear(),
        this.close();
    }
    async getRefCount(t) {
      return this.s.get(t);
    }
    async getRefs(t) {
      var a, s;
      let r = this.S.get(t);
      return r
        ? r.meta
        : _(t)
        ? (a = this.D.get(t)) == null
          ? void 0
          : a.meta
        : (s = this.y.getWithoutUpdatingLRU(t)) == null
        ? void 0
        : s.meta;
    }
  },
  Cr = class {
    constructor(e, t, r) {
      this.a = new Map();
      this.T = 0;
      (this.J = e), (this.Ie = t), (this.s = r);
    }
    get(e) {
      let t = this.a.get(e);
      return (
        t && (this.a.delete(e), this.a.set(e, t)), t == null ? void 0 : t.chunk
      );
    }
    getWithoutUpdatingLRU(e) {
      var t;
      return (t = this.a.get(e)) == null ? void 0 : t.chunk;
    }
    put(e) {
      let { hash: t } = e,
        r = this.a.get(t);
      if (r) {
        this.a.delete(t), this.a.set(t, r);
        return;
      }
      let a = this.s.get(t);
      if (a === void 0 || a < 1) return;
      let s = this.Ie(e.data);
      s > this.J ||
        ((this.T += s),
        this.a.set(t, {
          chunk: e,
          size: s,
        }),
        e.meta.forEach((o) => {
          this.s.set(o, (this.s.get(o) || 0) + 1);
        }),
        this.rt());
    }
    rt() {
      if (!(this.T <= this.J))
        for (let e of this.a) {
          if (this.T <= this.J) break;
          this.delete(e[1]);
        }
    }
    delete(e) {
      let { hash: t } = e.chunk;
      (this.T -= e.size),
        this.a.delete(t),
        e.chunk.meta.forEach((r) => {
          let a = this.s.get(r);
          pe(a), y(a > 0);
          let s = a - 1;
          if (s === 0) {
            this.s.delete(r);
            let o = this.a.get(r);
            o &&
              (y(e.chunk.hash !== r, "Found a chunk that references itself"),
              this.delete(o));
          } else this.s.set(r, s);
        });
    }
    updateForCommit(e, t) {
      let r = [];
      for (let a of e) {
        let { hash: s } = a,
          o = this.a.get(s);
        if (o) this.a.delete(s), this.a.set(s, o);
        else {
          let i = this.Ie(a.data);
          this.T += i;
          let l = {
            chunk: a,
            size: i,
          };
          this.a.set(s, l), i > this.J && r.push(l);
        }
      }
      for (let a of t) {
        let s = this.a.get(a);
        s && ((this.T -= s.size), this.a.delete(a));
      }
      for (let a of r) this.delete(a);
      this.rt();
    }
  };
var kn = "clients";

function xo(n) {
  H(n);
  let { heartbeatTimestampMs: e, headHash: t } = n;
  b(e), B(t);
}

function bo(n) {
  H(n);
  let e = new Map();
  for (let t in n)
    if (ne(n, t)) {
      let r = n[t];
      r !== void 0 && (xo(r), e.set(t, r));
    }
  return e;
}

function Do(n, e) {
  return (
    n.forEach((t) => {
      e.assertValidHash(t.headHash);
    }),
    Object.fromEntries(n)
  );
}

function So(n) {
  return Object.fromEntries(n);
}
async function Ye(n) {
  let e = await n.getHead(kn);
  return Rr(e, n);
}
async function Rr(n, e) {
  if (!n) return new Map();
  let t = await e.getChunk(n);
  return bo(t == null ? void 0 : t.data);
}
var q = class extends Error {
  constructor(t) {
    super(`Client state not found, id: ${t}`);
    this.name = "ClientStateNotFoundError";
    this.id = t;
  }
};
async function Hr(n, e) {
  if (!(await Pn(n, e))) throw new q(n);
}
async function Pn(n, e) {
  return !!(await La(n, e));
}
async function La(n, e) {
  return (await Ye(e)).get(n);
}
async function vr(n) {
  let e = Dt(),
    t = await j(async (a) => {
      let s;
      for (let u of a.values())
        (!s || s.heartbeatTimestampMs < u.heartbeatTimestampMs) && (s = u);
      let o,
        i = [];
      if (s) {
        let u = s;
        o = await n.withRead(async (c) => {
          let d = await U(u.headHash, c);
          return an(
            d.meta.basisHash,
            0,
            d.meta.cookieJSON,
            d.valueHash,
            d.indexes
          );
        });
      } else {
        let u = await Sn(ut, []);
        i.push(u), (o = an(null, 0, null, u.hash, []));
      }
      let l = await Sn(o, mt(o));
      return (
        i.push(l),
        {
          clients: new Map(a).set(e, {
            heartbeatTimestampMs: Date.now(),
            headHash: l.hash,
            mutationID: 0,
            lastServerAckdMutationID: 0,
          }),
          chunksToPut: i,
        }
      );
    }, n),
    r = t.get(e);
  return pe(r), [e, r, t];
}

function Co(n) {
  let e = So(n);
  return Le(e);
}
var Q = Symbol();
async function j(n, e) {
  let [t, r] = await e.withRead(async (a) => {
    let s = await a.getHead(kn);
    return [await Rr(s, a), s];
  });
  return Wa(n, t, r, e);
}
async function Wa(n, e, t, r) {
  let a = await n(e);
  if (a === Q) return e;
  let { clients: s, chunksToPut: o } = a,
    i = await Co(s),
    l = await r.withWrite(async (u) => {
      let c = await u.getHead(kn);
      if (c !== t)
        return {
          updateApplied: !1,
          clients: await Rr(c, u),
          clientsHash: c,
        };
      let d = Do(s, u),
        p = Array.from(s.values(), (f) => f.headHash),
        h = E(i, d, p),
        m = [];
      if (o) for (let f of o) m.push(u.putChunk(f));
      return (
        await Promise.all([...m, u.putChunk(h), u.setHead(kn, h.hash)]),
        await u.commit(),
        {
          updateApplied: !0,
          clients: s,
          clientsHash: i,
        }
      );
    });
  return l.updateApplied ? l.clients : Wa(n, l.clients, l.clientsHash, r);
}
var Mn = class extends Je {
  constructor(t, r) {
    super();
    this.at = new Map();
    (this.C = t), (this.st = r);
  }
  get fixedChunks() {
    return this.at;
  }
  shouldSkip(t) {
    return !this.C.has(t);
  }
  shouldForceWrite(t) {
    return this.C.has(t);
  }
  async getChunk(t) {
    let r = this.C.get(t);
    return y(r !== void 0), r;
  }
  async writeChunk(t, r, a) {
    let s = await this.st(r),
      o = E(s, r, a(r));
    return this.at.set(s, o), s;
  }
};
var Nn = class extends xt {
  constructor() {
    super(...arguments);
    this.C = new Map();
  }
  get gatheredChunks() {
    return this.C;
  }
  async visitCommit(t, r) {
    if (!!_(t)) return super.visitCommit(t, r);
  }
  async visitCommitChunk(t) {
    return this.C.set(t.hash, t), super.visitCommitChunk(t);
  }
  async visitBTreeNode(t) {
    if (!!_(t)) return super.visitBTreeNode(t);
  }
  async visitBTreeNodeChunk(t) {
    return this.C.set(t.hash, t), super.visitBTreeNodeChunk(t);
  }
};
var En = class extends bt {
  constructor(t, r) {
    super(t);
    this.re = r;
  }
  shouldSkip(t) {
    return _(t) ? !1 : !this.re.has(t);
  }
  shouldForceWrite(t) {
    return this.re.has(t);
  }
  async writeChunk(t, r, a) {
    let s = this.re.get(t),
      o = a(r),
      i = s ? E(s, r, o) : this.dagWrite.createChunk(r, o);
    return await this.dagWrite.putChunk(i), i.hash;
  }
};
async function kr(n, e, t, r) {
  if (r()) return;
  let a = t.withRead((h) => Hr(n, h)),
    [s, o, i, l] = await Ro(e, n);
  if (s.size === 0) {
    await a;
    return;
  }
  let u = Ho(s, o);
  await a;
  let [c, d, p] = await u;
  r() || (await ko(t, c, p, n, i, l), await vo(e, d));
}
async function Ro(n, e) {
  return await n.withRead(async (t) => {
    let r = await t.getHead(x);
    y(r);
    let a = new Nn(t);
    await a.visitCommit(r);
    let s = await N(r, t),
      o = await U(r, t),
      i,
      { meta: l } = o;
    return (
      De(l),
      (i = l.lastMutationID),
      [a.gatheredChunks, r, await s.getMutationID(e, t), i]
    );
  });
}
async function Ho(n, e) {
  let t = new Mn(n, Le),
    r = await t.transformCommit(e),
    { fixedChunks: a, mappings: s } = t;
  return [a, s, r];
}
async function vo(n, e) {
  await n.withWrite(async (t) => {
    for (let r of [x, K]) {
      let a = await t.getHead(r);
      if (!a) {
        if (r === K) break;
        throw new Error(`No head found for ${r}`);
      }
      let o = await new En(t, e).transformCommit(a);
      await t.setHead(r, o);
    }
    await t.commit();
  });
}
async function ko(n, e, t, r, a, s) {
  let o = e.values();
  await j(
    (i) => ({
      clients: new Map(i).set(r, {
        heartbeatTimestampMs: Date.now(),
        headHash: t,
        mutationID: a,
        lastServerAckdMutationID: s,
      }),
      chunksToPut: o,
    }),
    n
  );
}

function ue(n, e, t, r, a) {
  var o;
  if (a.aborted) return;
  r = r.addContext("bgIntervalProcess", n);
  let s = setInterval(async () => {
    var i, l, u;
    (i = r.debug) == null || i.call(r, "Running");
    try {
      await e();
    } catch (c) {
      a.aborted
        ? (l = r.debug) == null ||
          l.call(r, "Error running most likely due to close.", c)
        : (u = r.error) == null || u.call(r, "Error running.", c);
    }
  }, t);
  (r = r.addContext("intervalID", s)),
    (o = r.debug) == null || o.call(r, "Starting"),
    a.addEventListener("abort", () => {
      var i;
      (i = r.debug) == null || i.call(r, "Stopping"), clearInterval(s);
    });
}
var Po = 60 * 1e3,
  Fa;

function Pr(n, e, t, r, a) {
  ue(
    "Heartbeat",
    async () => {
      Fa = Mo(n, e);
      try {
        return await Fa;
      } catch (s) {
        if (s instanceof q) {
          t();
          return;
        }
        throw s;
      }
    },
    Po,
    r,
    a
  );
}
async function Mo(n, e) {
  let t = await j((r) => {
    let a = r.get(n);
    return a
      ? {
          clients: new Map(r).set(n, {
            heartbeatTimestampMs: Date.now(),
            headHash: a.headHash,
            mutationID: a.mutationID,
            lastServerAckdMutationID: a.lastServerAckdMutationID,
          }),
        }
      : Q;
  }, e);
  if (t.get(n) === void 0) throw new q(n);
  return t;
}
var No = 7 * 24 * 60 * 60 * 1e3,
  Eo = 5 * 60 * 1e3,
  _a;

function Mr(n, e, t, r) {
  ue("ClientGC", () => ((_a = Oo(n, e)), _a), Eo, t, r);
}
async function Oo(n, e) {
  return j((t) => {
    let r = Date.now(),
      a = Array.from(t).filter(
        ([s, o]) => s === n || r - o.heartbeatTimestampMs <= No
      );
    return a.length === t.size
      ? Q
      : {
          clients: new Map(a),
        };
  }, e);
}
var To = 0,
  Vo = "replicache-dbs-v" + To,
  On = "dbs",
  Ba = "profileId",
  Ao = "";

function Lo() {
  return Ao + Vo;
}

function Wo(n) {
  H(n);
  for (let [e, t] of Object.entries(n)) I(e), Fo(t), y(e === t.name);
}

function Fo(n) {
  H(n),
    I(n.name),
    I(n.replicacheName),
    b(n.replicacheFormatVersion),
    I(n.schemaVersion),
    n.lastOpenedTimestampMS !== void 0 && b(n.lastOpenedTimestampMS);
}
var ve = class {
  constructor(e = (t) => new L(t)) {
    this.v = e(Lo());
  }
  putDatabase(e) {
    return this.ot({ ...e, lastOpenedTimestampMS: Date.now() });
  }
  putDatabaseForTesting(e) {
    return this.ot(e);
  }
  ot(e) {
    return this.v.withWrite(async (t) => {
      let a = { ...(await this.xe(t)), [e.name]: e };
      return await t.put(On, a), await t.commit(), a;
    });
  }
  clearDatabases() {
    return this.v.withWrite(async (e) => {
      await e.del(On), await e.commit();
    });
  }
  deleteDatabases(e) {
    return this.v.withWrite(async (t) => {
      let a = { ...(await this.xe(t)) };
      for (let s of e) delete a[s];
      await t.put(On, a), await t.commit();
    });
  }
  getDatabases() {
    return this.v.withRead((e) => this.xe(e));
  }
  close() {
    return this.v.close();
  }
  async xe(e) {
    let t = await e.get(On);
    return t || (t = {}), Wo(t), t;
  }
  async getProfileID() {
    return this.v.withWrite(async (e) => {
      let t = await e.get(Ba);
      return (
        t === void 0 &&
          ((t = `p${Dt().replace(/-/g, "")}`),
          await e.put(Ba, t),
          await e.commit()),
        I(t),
        t
      );
    });
  }
};
var _o = 12 * 60 * 60 * 1e3,
  Ua = 30 * 24 * 60 * 60 * 1e3,
  Bo = 5 * 60 * 1e3;

function Nr(n, e, t) {
  Uo(n, t),
    ue(
      "CollectIDBDatabases",
      async () => {
        await Ka(n, t, Date.now(), Ua);
      },
      _o,
      e,
      t
    );
}
async function Uo(n, e) {
  try {
    await je(Bo, e), await Ka(n, e, Date.now(), Ua);
  } catch (t) {
    if (t instanceof qe) return;
    throw t;
  }
}
async function Ka(n, e, t, r, a = Ko) {
  let s = await n.getDatabases(),
    o = Object.values(s),
    l = (await Promise.all(o.map(async (c) => [c.name, await Jo(c, t, r, a)])))
      .filter((c) => c[1])
      .map((c) => c[0]),
    { errors: u } = await Ja(n, l, e);
  if (u.length) throw u[0];
}
async function Ja(n, e, t) {
  let r = await Promise.allSettled(e.map(async (o) => (await Dn(o), o))),
    a = [],
    s = [];
  for (let o of r)
    o.status === "fulfilled" ? a.push(o.value) : s.push(o.reason);
  return (
    a.length && !(t != null && t.aborted) && (await n.deleteDatabases(a)),
    {
      dropped: a,
      errors: s,
    }
  );
}

function Ko(n) {
  let e = new L(n);
  return new J(e, le, ge);
}
async function Jo(n, e, t, r) {
  if (n.replicacheFormatVersion > Ze) return !1;
  if (n.lastOpenedTimestampMS !== void 0)
    return e - n.lastOpenedTimestampMS >= t;
  let a = r(n.name),
    s = await a.withRead(Ye);
  return await a.close(), qo(s, e, t);
}

function qo(n, e, t) {
  for (let r of n.values()) if (e - r.heartbeatTimestampMs < t) return !1;
  return !0;
}
async function qa() {
  let n = new ve(),
    e = await n.getDatabases(),
    t = Object.values(e).map((a) => a.name),
    r = await Ja(n, t);
  return r.dropped.length && (await n.deleteDatabases(r.dropped)), r;
}

function Ga(n) {
  return new Promise((e) => {
    typeof requestIdleCallback == "function"
      ? requestIdleCallback(() => e(), {
          timeout: n,
        })
      : setTimeout(() => e(), n);
  });
}
var $a = "1.0",
  hm = parseInt($a.split(".")[1], 10);
var Er = "/api/" + $a,
  Or = "/api/:apiMajor.:apiMinor",
  jo = Er + "/customer",
  mm = Or + "/customer",
  za = Er + "/license/status",
  fm = Or + "/license/status",
  Ya = Er + "/license/active",
  ym = Or + "/license/active",
  Mt = "/admin",
  gm = Mt + "/download",
  wm = Mt + "/license/:key",
  Im = Mt + "/licenses/active",
  xm = Mt + "/actives",
  bm = Mt + "/populate";

function Tr(n) {
  Ar(n, "string");
}

function Vr(n) {
  Ar(n, "boolean");
}

function Ar(n, e) {
  typeof n !== e && Za(n, e);
}

function Tn(n) {
  n === null && Za(n, "object"), Ar(n, "object");
}

function Go(n, e) {
  let t = "Invalid type: ";
  return (
    n == null ? (t += n) : (t += `${typeof n} \`${n}\``), t + `, expected ${e}`
  );
}

function Za(n, e) {
  throw new Error(Go(n, e));
}
var km = new URL("https://replicache-license.herokuapp.com/");
async function Lr(n, e, t, r, a) {
  var d, p;
  a = a.addContext("licenseActive");
  let s = new URL(Ya, e),
    o = {
      licenseKey: t,
      profileID: r,
    },
    i = JSON.stringify(o);
  (d = a.debug) == null || d.call(a, `Sending ${s}`, i);
  let u = await (
    await n("post", s.toString(), i, [
      ["Content-Type", "application/json"],
      ["Accept", "application/json"],
    ])
  ).text();
  (p = a.debug) == null || p.call(a, `Got ${s}`, u);
  let c = JSON.parse(u);
  $o(c);
}
async function Wr(n, e, t, r) {
  var c, d;
  r = r.addContext("getLicenseStatus");
  let a = new URL(za, e),
    s = {
      licenseKey: t,
    },
    o = JSON.stringify(s);
  (c = r.debug) == null || c.call(r, `Sending ${a}`, o);
  let l = await (
    await n("post", a.toString(), o, [
      ["Content-Type", "application/json"],
      ["Accept", "application/json"],
    ])
  ).text();
  (d = r.debug) == null || d.call(r, `Got ${a}`, l);
  let u = JSON.parse(l);
  return zo(u), u;
}

function $o(n) {
  Tn(n);
}

function zo(n) {
  Tn(n), Tr(n.status), Vr(n.disable), Vr(n.pleaseUpdate);
}
var Nt = "This key only good for automated testing",
  Vn = new URL("https://replicache-license.herokuapp.com/"),
  Yo = new URL("https://replicache-license-staging.herokuapp.com/");
async function Xo(n, e, t, r) {
  return fetch(e, {
    method: n,
    body: t,
    headers: r,
  });
}
async function Fr(n, e, t, r) {
  let a = await Xo(n, e, t, r);
  if (a.status !== 200)
    throw new Error(`Got ${a.status} fetching ${e}: ${await a.text()}`);
  return a;
}

function Xa(n, e, t) {
  let r = setInterval(n, e);
  t.addEventListener("abort", () => {
    clearInterval(r);
  });
}
var Qo = 10 * 2 ** 20,
  An = class {
    constructor(e, t) {
      this.be = !1;
      (this.ae = e),
        (this.it = t.enableMutationRecovery),
        (this.e = t.lc),
        (this.V = t.wrapInOnlineCheck),
        (this.A = t.wrapInReauthRetries),
        (this.L = t.isPushDisabled),
        (this.q = t.isPullDisabled);
    }
    async recoverMutations(e, t, r, a, s) {
      var u, c, d;
      let { e: o } = this,
        i = this.ae;
      if (!this.it || this.be || !i.online || i.closed || this.L()) return !1;
      let l = "Recovering mutations.";
      (u = o.debug) == null || u.call(o, "Start:", l);
      try {
        (this.be = !0), await t, await this.lt(a, r, e);
        for (let p of Object.values(await s.getDatabases())) {
          if (i.closed)
            return (
              (c = o.debug) == null ||
                c.call(o, "Exiting early due to close:", l),
              !0
            );
          p.name === i.idbName ||
            p.replicacheName !== i.name ||
            p.replicacheFormatVersion !== Ze ||
            (await this.lt(p));
        }
      } catch (p) {
        _r(p, o, l, i);
      } finally {
        (d = o.debug) == null || d.call(o, "End:", l), (this.be = !1);
      }
      return !0;
    }
    async lt(e, t, r) {
      var l, u, c;
      let { e: a } = this,
        s = this.ae,
        o = `Recovering mutations from db ${e.name}.`;
      (l = a.debug) == null || l.call(a, "Start:", o);
      let i;
      try {
        if (!t) {
          let h = new L(e.name);
          t = i = new J(h, le, ge);
        }
        let d = r || (await t.withRead((h) => Ye(h))),
          p = new Set();
        for (; d; ) {
          let h;
          for (let [m, f] of d) {
            if (s.closed) {
              (u = a.debug) == null ||
                u.call(a, "Exiting early due to close:", o);
              return;
            }
            if (!p.has(m) && (p.add(m), (h = await this.$t(f, m, t, e)), h))
              break;
          }
          d = h;
        }
      } catch (d) {
        _r(d, a, o, s);
      } finally {
        await (i == null ? void 0 : i.close()),
          (c = a.debug) == null || c.call(a, "End:", o);
      }
    }
    async $t(e, t, r, a) {
      var m, f, g, w, v, G, O, W;
      let { e: s } = this,
        o = this.ae,
        { V: i, A: l, L: u, q: c } = this,
        d = await o.clientID;
      if (d === t || e.lastServerAckdMutationID >= e.mutationID) return;
      let p = `Recovering mutations for ${t}.`;
      (m = s.debug) == null || m.call(s, "Start:", p);
      let h;
      try {
        let C = (h = new He(r, Qo, le, B));
        if (
          (await C.withWrite(async (P) => {
            await P.setHead(x, e.headHash), await P.commit();
          }),
          u())
        ) {
          (f = s.debug) == null ||
            f.call(
              s,
              `Cannot recover mutations for client ${t} because push is disabled.`
            );
          return;
        }
        let { pusher: ee, pushURL: te } = o,
          ke = "recoveringMutationsPush";
        if (
          !(await i(async () => {
            let { result: P } = await l(
              async (de, Pe) => {
                pe(C);
                let Xe = await Ct(
                  de,
                  C,
                  Pe,
                  await o.profileID,
                  t,
                  ee,
                  te,
                  o.auth,
                  a.schemaVersion
                );
                return {
                  result: Xe,
                  httpRequestInfo: Xe,
                };
              },
              ke,
              o.pushURL,
              s
            );
            return !!P && P.httpStatusCode === 200;
          }, ke))
        ) {
          (g = s.debug) == null ||
            g.call(
              s,
              `Failed to recover mutations for client ${t} due to a push error.`
            );
          return;
        }
        if (c()) {
          (w = s.debug) == null ||
            w.call(
              s,
              `Cannot confirm mutations were recovered for client ${t} because pull is disabled.`
            );
          return;
        }
        let { puller: Et, pullURL: Ot } = o,
          Gr = "recoveringMutationsPull",
          T;
        if (
          !(await i(async () => {
            let { result: P } = await l(
              async (de, Pe) => {
                let Xe = {
                    pullAuth: o.auth,
                    pullURL: Ot,
                    schemaVersion: a.schemaVersion,
                    puller: Et,
                  },
                  $r = await St(
                    await o.profileID,
                    t,
                    Xe,
                    Xe.puller,
                    de,
                    C,
                    Pe,
                    !1
                  );
                return {
                  result: $r,
                  httpRequestInfo: $r.httpRequestInfo,
                };
              },
              Gr,
              o.pullURL,
              s
            );
            return (
              (T = P.pullResponse),
              !!T && P.httpRequestInfo.httpStatusCode === 200
            );
          }, Gr))
        ) {
          (v = s.debug) == null ||
            v.call(
              s,
              `Failed to recover mutations for client ${t} due to a pull error.`
            );
          return;
        }
        return (
          T && Y(T)
            ? (G = s.debug) == null ||
              G.call(
                s,
                `Client ${d} cannot recover mutations for client ${t}. The client no longer exists on the server.`
              )
            : (O = s.debug) == null ||
              O.call(
                s,
                `Client ${d} recovered mutations for client ${t}.  Details`,
                {
                  mutationID: e.mutationID,
                  lastServerAckdMutationID: e.lastServerAckdMutationID,
                  lastMutationID: T == null ? void 0 : T.lastMutationID,
                }
              ),
          await j((P) => {
            pe(T);
            let de = P.get(t);
            if (!de) return Q;
            if (Y(T)) {
              let Pe = new Map(P);
              return (
                Pe.delete(t),
                {
                  clients: Pe,
                }
              );
            }
            return de.lastServerAckdMutationID >= T.lastMutationID
              ? Q
              : {
                  clients: new Map(P).set(t, {
                    ...de,
                    lastServerAckdMutationID: T.lastMutationID,
                  }),
                };
          }, r)
        );
      } catch (C) {
        _r(C, s, p, o);
        return;
      } finally {
        await (h == null ? void 0 : h.close()),
          (W = s.debug) == null || W.call(s, "End:", p);
      }
    }
  };

function _r(n, e, t, r) {
  var a, s;
  r.closed
    ? (a = e.debug) == null ||
      a.call(
        e,
        `Mutation recovery error likely due to close during:
${t}
Error:
`,
        n
      )
    : (s = e.error) == null ||
      s.call(
        e,
        `Mutation recovery error during:
${t}
Error:
`,
        n
      );
}
async function Qa(n, e, t, r, a, s) {
  var w;
  let o = n.meta,
    i = o.mutatorName;
  xa(o) &&
    y(o.clientID === s, "mutationClientID must match clientID of LocalMeta");
  let l = r[i];
  l || (w = a.error) == null || w.call(a, `Cannot rebase unknown mutator ${i}`);
  let u = l || (async () => {}),
    c = o.mutatorArgsJSON,
    d = R(c, 4),
    [, p] = await yt(Be(t), e),
    h = await p.getNextMutationID(s, e);
  if (h !== o.mutationID)
    throw new Error(
      `Inconsistent mutation ID: original: ${o.mutationID}, next: ${h}`
    );
  let m = await wt(Be(t), i, c, n.chunk.hash, e, o.timestamp, s),
    f = new Ce(s, m, a);
  await u(f, d);
  let [g] = await f.commit(!1);
  return g;
}
var ei = 401,
  Ze = 4,
  ti = 100 * 2 ** 20,
  ni = 5 * 60 * 1e3,
  ri = 24 * 60 * 60 * 1e3,
  ai = 5 * 60 * 1e3;

function ns(n, e) {
  let t = `rep:${n}:${Ze}`;
  return e ? `${t}:${e}` : t;
}
var si = 8,
  oi = 1e3,
  es = () => {},
  ts = {
    type: "NotFoundOnServer",
  },
  Br = {
    type: "NotFoundOnClient",
  },
  Jr = class {
    constructor(e) {
      this.t = !1;
      this.De = !0;
      this.Ce = null;
      this.se = Promise.resolve(void 0);
      this.ct = {};
      this.pt = 0;
      this.ht = 0;
      this.j = new ve();
      this.ft = new AbortController();
      this.He = new ce();
      this.ve = !1;
      this.onSync = null;
      this.onClientStateNotFound = ii;
      this.getAuth = null;
      this.gt = async () => {
        var e;
        this.t ||
          (((e = Kr()) == null ? void 0 : e.visibilityState) === "visible" &&
            (await this.wt()));
      };
      this.onOnlineChange = null;
      this._ = async (e) => {
        await this.c;
        let t = await this.l;
        return this.o.withRead(async (r) => {
          let a = await sr(r),
            s = new Rt(t, a, this.e);
          try {
            return await e(s);
          } catch (o) {
            throw await this.Ee(o);
          }
        });
      };
      let {
        name: t,
        logLevel: r = "info",
        logSinks: a = [Vt],
        pullURL: s = "",
        auth: o,
        pushDelay: i = 10,
        pushURL: l = "",
        schemaVersion: u = "",
        pullInterval: c = 6e4,
        mutators: d = {},
        requestOptions: p = {},
        puller: h = Bn,
        pusher: m = Fn,
        licenseKey: f,
        experimentalKVStore: g,
      } = e;
      if (
        ((this.auth = o != null ? o : ""),
        (this.pullURL = s),
        (this.pushURL = l),
        t === void 0 || t === "")
      )
        throw new Error("name is required and must be non-empty");
      (this.name = t),
        (this.schemaVersion = u),
        (this.pullInterval = c),
        (this.pushDelay = i),
        (this.puller = h),
        (this.pusher = m);
      let w = e,
        { enableLicensing: v = !0, enableMutationRecovery: G = !0 } = w;
      (this.ke = v),
        w.exposeInternalAPI &&
          w.exposeInternalAPI({
            persist: () => this.yt(),
          });
      let O = a.length === 1 ? a[0] : new Tt(a);
      (this.e = new Me(r, O).addContext("name", t)),
        (this.i = new wn(this._, this.e));
      let W = g || new L(this.idbName);
      (this.w = new J(W, le, ge)), (this.o = new He(this.w, ti, this.Zt(), B));
      let C = S();
      (this.c = C.promise), (this.g = f);
      let ee = S();
      this.zt = ee.promise;
      let te = S();
      this.Yt = te.promise;
      let { minDelayMs: ke = ka, maxDelayMs: jr = Pa } = p;
      (this.mt = {
        maxDelayMs: jr,
        minDelayMs: ke,
      }),
        (this.Re = new Ht(
          new yn(this, () => this.Xt(), this.e.addContext("PULL"))
        )),
        (this.oe = new Ht(
          new gn(this, () => this.Qt(), this.e.addContext("PUSH"))
        )),
        (this.mutate = this.en(d));
      let Et = S();
      this.Se = Et.promise;
      let Ot = S();
      (this.l = Ot.promise),
        (this.ut = new An(this, {
          lc: this.e,
          enableMutationRecovery: G,
          wrapInOnlineCheck: this.V.bind(this),
          wrapInReauthRetries: this.A.bind(this),
          isPullDisabled: this.q.bind(this),
          isPushDisabled: this.L.bind(this),
        })),
        this.tn(Et.resolve, Ot.resolve, C.resolve, ee.resolve, te.resolve);
    }
    get idbName() {
      return ns(this.name, this.schemaVersion);
    }
    get dt() {
      return {
        name: this.idbName,
        replicacheName: this.name,
        replicacheFormatVersion: Ze,
        schemaVersion: this.schemaVersion,
      };
    }
    get requestOptions() {
      return this.mt;
    }
    Zt() {
      return V;
    }
    async tn(e, t, r, a, s) {
      var c;
      await Ur.get(this.name),
        await this.j.getProfileID().then(e),
        await this.j.putDatabase(this.dt);
      let [o, i, l] = await vr(this.w);
      t(o),
        await this.o.withWrite(async (d) => {
          await d.setHead(x, i.headHash), await d.commit();
        }),
        r(),
        (this.se = this.nn()),
        await this.se,
        await this.rn(a),
        this.pull(),
        this.an();
      let { signal: u } = this.ft;
      Pr(
        o,
        this.w,
        () => {
          this.G(o, Br);
        },
        this.e,
        u
      ),
        Mr(o, this.w, this.e, u),
        Nr(this.j, this.e, u),
        Xa(() => this.Pe(), ni, u),
        this.Pe(l),
        (c = Kr()) == null || c.addEventListener("visibilitychange", this.gt),
        await this.sn(s, this.e, u);
    }
    async wt() {
      let e = await this.l,
        t = await this.w.withRead((r) => Pn(e, r));
      return t || this.G(e, Br), !t;
    }
    async rn(e) {
      var t, r, a, s, o, i, l, u, c, d;
      if (!this.ke) {
        e(!0);
        return;
      }
      if (!this.g) {
        await this.Me(
          this.e,
          "license key ReplicacheOptions.licenseKey is not set",
          !0,
          e
        );
        return;
      }
      if (
        ((r = (t = this.e).debug) == null ||
          r.call(t, `Replicache license key: ${this.g}`),
        this.g === Nt)
      ) {
        (s = (a = this.e).info) == null ||
          s.call(
            a,
            "Skipping license check for TEST_LICENSE_KEY. You may ONLY use this key for automated (e.g., unit/CI) testing. See https://replicache.dev for more information."
          ),
          e(!0),
          (this.Ce = setTimeout(async () => {
            await this.Me(this.e, "Test key expired", !0, e);
          }, ai));
        return;
      }
      try {
        let p = await Wr(Fr, Vn, this.g, this.e);
        if (
          (p.pleaseUpdate &&
            ((i = (o = this.e).error) == null ||
              i.call(
                o,
                "You are using an old version of Replicache that uses deprecated licensing features. Please update Replicache else it may stop working."
              )),
          p.status === "VALID")
        )
          (u = (l = this.e).debug) == null || u.call(l, "License is valid.");
        else {
          await this.Me(this.e, `status: ${p.status}`, p.disable, e);
          return;
        }
      } catch (p) {
        (d = (c = this.e).error) == null ||
          d.call(c, `Error checking license: ${p}`);
      }
      e(!0);
    }
    async Me(e, t, r, a) {
      var s, o;
      (s = e.error) == null ||
        s.call(
          e,
          `** REPLICACHE LICENSE NOT VALID ** Replicache license key '${this.g}' is not valid (${t}). Please run 'npx replicache get-license' to get a license key or contact hello@replicache.dev for help.`
        ),
        r &&
          (await this.close(),
          (o = e.error) == null || o.call(e, "** REPLICACHE DISABLED **")),
        a(!1);
    }
    async sn(e, t, r) {
      if (!this.ke || !this.g || this.g === Nt) {
        e(!1);
        return;
      }
      let a = async () => {
        var s, o;
        try {
          await Lr(Fr, Vn, this.g, await this.profileID, t);
        } catch (i) {
          (o = (s = this.e).info) == null ||
            o.call(s, `Error sending license active ping: ${i}`);
        }
      };
      await a(), e(!0), ue("LicenseActive", a, ri, t, r);
    }
    get profileID() {
      return this.Se;
    }
    get clientID() {
      return this.l;
    }
    get online() {
      return this.De;
    }
    get closed() {
      return this.t;
    }
    async close() {
      var a;
      this.t = !0;
      let { promise: e, resolve: t } = S();
      Ur.set(this.name, e),
        this.ft.abort(),
        (a = Kr()) == null ||
          a.removeEventListener("visibilitychange", this.gt),
        await this.c;
      let r = [this.o.close(), this.w.close(), this.j.close()];
      this.Re.close(),
        this.oe.close(),
        this.i.clear(),
        this.Ce && clearTimeout(this.Ce),
        await Promise.all(r),
        Ur.delete(this.name),
        t();
    }
    async nn() {
      if (!this.t) return await this.c, await ur(this.o, x);
    }
    async Ne(e, t) {
      let r = await this.se;
      e !== void 0 &&
        e !== r &&
        ((this.se = Promise.resolve(e)), await this.i.fire(t));
    }
    async createIndex(e) {
      await this.It((t) => t.createIndex(e));
    }
    async dropIndex(e) {
      await this.It((t) => t.dropIndex(e));
    }
    async It(e) {
      await this.c;
      let t = await this.l;
      await this.o.withWrite(async (r) => {
        let a = await lr(ft(x), r, t),
          s = new mn(t, a, this.e);
        await e(s);
        let [o, i] = await s.commit(!0);
        y(!i.has("")), await this.Ne(o, i);
      });
    }
    async xt(e, t) {
      for (;;) {
        if (this.t) return;
        await this.c;
        let r = await this.l,
          a = this.e.addContext("maybeEndPull").addContext("request_id", t),
          { replayMutations: s, diffs: o } = await cr(this.o, a, e, r);
        if (!s || s.length === 0) {
          await this.Ne(e, o), this.bt();
          return;
        }
        for (let i of s)
          this.i.hasPendingSubscriptionRuns && (await Promise.resolve()),
            (e = await this.o.withWrite((l) => Qa(i, l, e, this.ct, a, r)));
      }
    }
    async Xt() {
      return this.q()
        ? !0
        : this.He.withLock(() =>
            this.V(async () => {
              try {
                this.W(0, 1);
                let { syncHead: e, requestID: t, ok: r } = await this.on();
                if (!r) return !1;
                e !== D && (await this.xt(e, t));
              } catch (e) {
                throw await this.Ee(e);
              } finally {
                this.W(0, -1);
              }
              return !0;
            }, "Pull")
          );
    }
    q() {
      return this.pullURL === "" && this.puller === Bn;
    }
    async V(e, t) {
      var a, s, o, i, l;
      let r = !0;
      try {
        return await e();
      } catch (u) {
        return (
          u instanceof Ee || u instanceof Te
            ? ((r = !1),
              (s = (a = this.e).info) == null ||
                s.call(
                  a,
                  `${t} threw:
`,
                  u,
                  `
with cause:
`,
                  u.causedBy
                ))
            : (i = (o = this.e).info) == null ||
              i.call(
                o,
                `${t} threw:
`,
                u
              ),
          !1
        );
      } finally {
        this.De !== r &&
          ((this.De = r),
          (l = this.onOnlineChange) == null || l.call(this, r),
          r && this.Pe());
      }
    }
    async A(e, t, r, a, s = es, o = es) {
      var c, d;
      let i = await this.clientID,
        l = 0,
        u;
      a = a.addContext(t);
      do {
        let p = cn(i),
          h = a.addContext("request_id", p),
          { httpRequestInfo: m, result: f } = await e(p, h);
        if (((u = f), !m))
          return {
            result: f,
            authFailure: !1,
          };
        let { errorMessage: g, httpStatusCode: w } = m;
        if (
          ((g || w >= 400) &&
            ((c = h.error) == null ||
              c.call(
                h,
                `Got error response from server (${r}) doing ${t}: ${w}` +
                  (g ? `: ${g}` : "")
              )),
          w !== ei)
        )
          return {
            result: f,
            authFailure: !1,
          };
        if (!this.getAuth)
          return {
            result: f,
            authFailure: !0,
          };
        let v;
        try {
          await s(), (v = await this.getAuth());
        } finally {
          await o();
        }
        if (v == null)
          return {
            result: f,
            authFailure: !0,
          };
        (this.auth = v), l++;
      } while (l < si);
      return (
        (d = a.info) == null ||
          d.call(a, "Tried to reauthenticate too many times"),
        {
          result: u,
          authFailure: !0,
        }
      );
    }
    L() {
      return this.pushURL === "" && this.pusher === Fn;
    }
    async Qt() {
      if (this.L()) return !0;
      await this.c;
      let e = await this.Se,
        t = await this.l;
      return this.V(async () => {
        let { result: r } = await this.A(
          async (a, s) => {
            try {
              this.W(1, 0);
              let o = await Ct(
                a,
                this.o,
                s,
                e,
                t,
                this.pusher,
                this.pushURL,
                this.auth,
                this.schemaVersion
              );
              return {
                result: o,
                httpRequestInfo: o,
              };
            } finally {
              this.W(-1, 0);
            }
          },
          "push",
          this.pushURL,
          this.e
        );
        return r === void 0 || r.httpStatusCode === 200;
      }, "Push");
    }
    an() {
      this.oe.send();
    }
    pull() {
      this.Re.send();
    }
    async poke(e) {
      await this.c;
      let t = await this.l,
        r = cn(t),
        a = this.e.addContext("handlePullResponse").addContext("request_id", r);
      await this.He.withLock(async () => {
        if (Y(e.pullResponse)) {
          this.G(t, ts);
          return;
        }
        let s = await dn(a, this.o, Z(e.baseCookie, 256), e.pullResponse, t);
        if (s === null)
          throw new Error(
            "unexpected base cookie for poke: " + JSON.stringify(e)
          );
        await this.xt(s, r);
      });
    }
    async on() {
      await this.c;
      let e = await this.profileID,
        t = await this.l,
        {
          result: { beginPullResponse: r, requestID: a },
        } = await this.A(
          async (i, l) => {
            let u = {
                pullAuth: this.auth,
                pullURL: this.pullURL,
                schemaVersion: this.schemaVersion,
                puller: this.puller,
              },
              c = await St(e, t, u, u.puller, i, this.o, l);
            return {
              result: {
                beginPullResponse: c,
                requestID: i,
              },
              httpRequestInfo: c.httpRequestInfo,
            };
          },
          "pull",
          this.pullURL,
          this.e,
          () => this.W(0, -1),
          () => this.W(0, 1)
        );
      if (Y(r.pullResponse)) {
        let i = await this.l;
        this.G(i, ts);
      }
      let { syncHead: s, httpRequestInfo: o } = r;
      return {
        requestID: a,
        syncHead: s,
        ok: o.httpStatusCode === 200,
      };
    }
    async yt() {
      var t, r;
      if (this.t) return;
      await this.c;
      let e = await this.clientID;
      try {
        await this.He.withLock(() => kr(e, this.o, this.w, () => this.closed));
      } catch (a) {
        if (a instanceof q) this.G(e, Br);
        else if (this.t)
          (r = (t = this.e).debug) == null ||
            r.call(t, "Exception persisting during close", a);
        else throw a;
      }
    }
    G(e, t) {
      var r, a, s;
      (a = (r = this.e).error) == null ||
        a.call(r, `Client state not found, clientID: ${e}`),
        (s = this.onClientStateNotFound) == null || s.call(this, t);
    }
    bt() {
      this.ve ||
        ((this.ve = !0),
        (async () => (await Ga(oi), await this.yt(), (this.ve = !1)))());
    }
    W(e, t) {
      (this.pt += e), (this.ht += t);
      let r = e + t,
        a = this.pt + this.ht;
      if ((r === 1 && a === 1) || a === 0) {
        let s = a > 0;
        Promise.resolve().then(() => {
          var o;
          return (o = this.onSync) == null ? void 0 : o.call(this, s);
        });
      }
    }
    subscribe(e, t) {
      return this.i.addSubscription(e, t);
    }
    experimentalWatch(e, t) {
      return this.i.addWatch(e, t);
    }
    async query(e) {
      return this._(e);
    }
    ln(e, t) {
      return (
        (this.ct[e] = t),
        async (r) => (await this.un(e, t, r, performance.now())).result
      );
    }
    en(e) {
      let t = Object.create(null);
      for (let r in e) t[r] = this.ln(r, e[r]);
      return t;
    }
    async un(e, t, r, a) {
      let s = Z(r != null ? r : null, 2);
      this.i.hasPendingSubscriptionRuns && (await Promise.resolve()),
        await this.c;
      let o = await this.l;
      return await this.o.withWrite(async (i) => {
        let l = ft(x),
          c = await wt(l, e, s, null, i, a, o),
          d = new Ce(o, c, this.e);
        try {
          let p = await t(d, r),
            [h, m] = await d.commit(!0);
          return (
            this.oe.send(),
            await this.Ne(h, m),
            this.bt(),
            {
              result: p,
              ref: h,
            }
          );
        } catch (p) {
          throw await this.Ee(p);
        }
      });
    }
    async Ee(e) {
      return e instanceof ie && (await this.wt()) ? new q(await this.l) : e;
    }
    async Pe(e) {
      return this.ut.recoverMutations(e, this.c, this.w, this.dt, this.j);
    }
    experimentalPendingMutations() {
      return this.o.withRead(async (e) => {
        let t = await e.getHead(x);
        if (t === void 0) throw new Error("Missing main head");
        let r = await be(t, e),
          a = await this.l;
        return Promise.all(
          r.map(async (s) => ({
            id: await s.getMutationID(a, e),
            name: s.meta.mutatorName,
            args: R(s.meta.mutatorArgsJSON, 5),
          }))
        );
      });
    }
  },
  Ur = new Map();

function Kr() {
  return typeof document != "undefined" ? document : void 0;
}

function ii() {
  typeof location != "undefined" && location.reload();
}

function qr(n) {
  var e;
  return (
    ((e = n[Symbol.asyncIterator]) == null ? void 0 : e.call(n)) ||
    n[Symbol.iterator]()
  );
}
async function* li(n, e, t) {
  let r = qr(n),
    a = qr(e),
    s = await r.next(),
    o = await a.next();
  for (;;) {
    if (s.done) {
      if (o.done) return;
      yield o.value, (o = await a.next());
      continue;
    }
    if (o.done) {
      yield s.value, (s = await r.next());
      continue;
    }
    let i = t(s.value, o.value);
    i === 0
      ? (yield o.value, (s = await r.next()), (o = await a.next()))
      : i < 0
      ? (yield s.value, (s = await r.next()))
      : (yield o.value, (o = await a.next()));
  }
}
async function* ui(n, e) {
  for await (let t of n) e(t) && (yield t);
}
var di = "11.2.1";
export {
  Jr as Replicache,
  Nt as TEST_LICENSE_KEY,
  Ut as TransactionClosedError,
  Vt as consoleLogSink,
  qa as deleteAllReplicacheData,
  ui as filterAsyncIterable,
  Ve as isScanIndexOptions,
  ns as makeIDBName,
  Is as makeScanResult,
  li as mergeAsyncIterables,
  di as version,
};
