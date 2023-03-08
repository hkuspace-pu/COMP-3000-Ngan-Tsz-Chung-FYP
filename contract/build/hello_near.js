function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}

// make PromiseIndex a nominal typing
var PromiseIndexBrand;
(function (PromiseIndexBrand) {
  PromiseIndexBrand[PromiseIndexBrand["_"] = -1] = "_";
})(PromiseIndexBrand || (PromiseIndexBrand = {}));
const TYPE_KEY = "typeInfo";
var TypeBrand;
(function (TypeBrand) {
  TypeBrand["BIGINT"] = "bigint";
  TypeBrand["DATE"] = "date";
})(TypeBrand || (TypeBrand = {}));
function serialize(valueToSerialize) {
  return JSON.stringify(valueToSerialize, function (key, value) {
    if (typeof value === "bigint") {
      return {
        value: value.toString(),
        [TYPE_KEY]: TypeBrand.BIGINT
      };
    }
    if (typeof this[key] === "object" && this[key] !== null && this[key] instanceof Date) {
      return {
        value: this[key].toISOString(),
        [TYPE_KEY]: TypeBrand.DATE
      };
    }
    return value;
  });
}
function deserialize(valueToDeserialize) {
  return JSON.parse(valueToDeserialize, (_, value) => {
    if (value !== null && typeof value === "object" && Object.keys(value).length === 2 && Object.keys(value).every(key => ["value", TYPE_KEY].includes(key))) {
      switch (value[TYPE_KEY]) {
        case TypeBrand.BIGINT:
          return BigInt(value["value"]);
        case TypeBrand.DATE:
          return new Date(value["value"]);
      }
    }
    return value;
  });
}

/**
 * A Promise result in near can be one of:
 * - NotReady = 0 - the promise you are specifying is still not ready, not yet failed nor successful.
 * - Successful = 1 - the promise has been successfully executed and you can retrieve the resulting value.
 * - Failed = 2 - the promise execution has failed.
 */
var PromiseResult;
(function (PromiseResult) {
  PromiseResult[PromiseResult["NotReady"] = 0] = "NotReady";
  PromiseResult[PromiseResult["Successful"] = 1] = "Successful";
  PromiseResult[PromiseResult["Failed"] = 2] = "Failed";
})(PromiseResult || (PromiseResult = {}));
/**
 * A promise error can either be due to the promise failing or not yet being ready.
 */
var PromiseError;
(function (PromiseError) {
  PromiseError[PromiseError["Failed"] = 0] = "Failed";
  PromiseError[PromiseError["NotReady"] = 1] = "NotReady";
})(PromiseError || (PromiseError = {}));

/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function assertNumber(n) {
  if (!Number.isSafeInteger(n)) throw new Error(`Wrong integer: ${n}`);
}
function chain(...args) {
  const wrap = (a, b) => c => a(b(c));
  const encode = Array.from(args).reverse().reduce((acc, i) => acc ? wrap(acc, i.encode) : i.encode, undefined);
  const decode = args.reduce((acc, i) => acc ? wrap(acc, i.decode) : i.decode, undefined);
  return {
    encode,
    decode
  };
}
function alphabet(alphabet) {
  return {
    encode: digits => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== 'number') throw new Error('alphabet.encode input should be an array of numbers');
      return digits.map(i => {
        assertNumber(i);
        if (i < 0 || i >= alphabet.length) throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
        return alphabet[i];
      });
    },
    decode: input => {
      if (!Array.isArray(input) || input.length && typeof input[0] !== 'string') throw new Error('alphabet.decode input should be array of strings');
      return input.map(letter => {
        if (typeof letter !== 'string') throw new Error(`alphabet.decode: not string element=${letter}`);
        const index = alphabet.indexOf(letter);
        if (index === -1) throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
        return index;
      });
    }
  };
}
function join(separator = '') {
  if (typeof separator !== 'string') throw new Error('join separator should be string');
  return {
    encode: from => {
      if (!Array.isArray(from) || from.length && typeof from[0] !== 'string') throw new Error('join.encode input should be array of strings');
      for (let i of from) if (typeof i !== 'string') throw new Error(`join.encode: non-string input=${i}`);
      return from.join(separator);
    },
    decode: to => {
      if (typeof to !== 'string') throw new Error('join.decode input should be string');
      return to.split(separator);
    }
  };
}
function padding(bits, chr = '=') {
  assertNumber(bits);
  if (typeof chr !== 'string') throw new Error('padding chr should be string');
  return {
    encode(data) {
      if (!Array.isArray(data) || data.length && typeof data[0] !== 'string') throw new Error('padding.encode input should be array of strings');
      for (let i of data) if (typeof i !== 'string') throw new Error(`padding.encode: non-string input=${i}`);
      while (data.length * bits % 8) data.push(chr);
      return data;
    },
    decode(input) {
      if (!Array.isArray(input) || input.length && typeof input[0] !== 'string') throw new Error('padding.encode input should be array of strings');
      for (let i of input) if (typeof i !== 'string') throw new Error(`padding.decode: non-string input=${i}`);
      let end = input.length;
      if (end * bits % 8) throw new Error('Invalid padding: string should have whole number of bytes');
      for (; end > 0 && input[end - 1] === chr; end--) {
        if (!((end - 1) * bits % 8)) throw new Error('Invalid padding: string has too much padding');
      }
      return input.slice(0, end);
    }
  };
}
function normalize(fn) {
  if (typeof fn !== 'function') throw new Error('normalize fn should be function');
  return {
    encode: from => from,
    decode: to => fn(to)
  };
}
function convertRadix(data, from, to) {
  if (from < 2) throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
  if (to < 2) throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
  if (!Array.isArray(data)) throw new Error('convertRadix: data should be array');
  if (!data.length) return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data);
  digits.forEach(d => {
    assertNumber(d);
    if (d < 0 || d >= from) throw new Error(`Wrong integer: ${d}`);
  });
  while (true) {
    let carry = 0;
    let done = true;
    for (let i = pos; i < digits.length; i++) {
      const digit = digits[i];
      const digitBase = from * carry + digit;
      if (!Number.isSafeInteger(digitBase) || from * carry / from !== carry || digitBase - digit !== from * carry) {
        throw new Error('convertRadix: carry overflow');
      }
      carry = digitBase % to;
      digits[i] = Math.floor(digitBase / to);
      if (!Number.isSafeInteger(digits[i]) || digits[i] * to + carry !== digitBase) throw new Error('convertRadix: carry overflow');
      if (!done) continue;else if (!digits[i]) pos = i;else done = false;
    }
    res.push(carry);
    if (done) break;
  }
  for (let i = 0; i < data.length - 1 && data[i] === 0; i++) res.push(0);
  return res.reverse();
}
const gcd = (a, b) => !b ? a : gcd(b, a % b);
const radix2carry = (from, to) => from + (to - gcd(from, to));
function convertRadix2(data, from, to, padding) {
  if (!Array.isArray(data)) throw new Error('convertRadix2: data should be array');
  if (from <= 0 || from > 32) throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32) throw new Error(`convertRadix2: wrong to=${to}`);
  if (radix2carry(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const mask = 2 ** to - 1;
  const res = [];
  for (const n of data) {
    assertNumber(n);
    if (n >= 2 ** from) throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32) throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to) res.push((carry >> pos - to & mask) >>> 0);
    carry &= 2 ** pos - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding && pos >= from) throw new Error('Excess padding');
  if (!padding && carry) throw new Error(`Non-zero padding: ${carry}`);
  if (padding && pos > 0) res.push(carry >>> 0);
  return res;
}
function radix(num) {
  assertNumber(num);
  return {
    encode: bytes => {
      if (!(bytes instanceof Uint8Array)) throw new Error('radix.encode input should be Uint8Array');
      return convertRadix(Array.from(bytes), 2 ** 8, num);
    },
    decode: digits => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== 'number') throw new Error('radix.decode input should be array of strings');
      return Uint8Array.from(convertRadix(digits, num, 2 ** 8));
    }
  };
}
function radix2(bits, revPadding = false) {
  assertNumber(bits);
  if (bits <= 0 || bits > 32) throw new Error('radix2: bits should be in (0..32]');
  if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32) throw new Error('radix2: carry overflow');
  return {
    encode: bytes => {
      if (!(bytes instanceof Uint8Array)) throw new Error('radix2.encode input should be Uint8Array');
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: digits => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== 'number') throw new Error('radix2.decode input should be array of strings');
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
function unsafeWrapper(fn) {
  if (typeof fn !== 'function') throw new Error('unsafeWrapper fn should be function');
  return function (...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {}
  };
}
const base16 = chain(radix2(4), alphabet('0123456789ABCDEF'), join(''));
const base32 = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), padding(5), join(''));
chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), padding(5), join(''));
chain(radix2(5), alphabet('0123456789ABCDEFGHJKMNPQRSTVWXYZ'), join(''), normalize(s => s.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')));
const base64 = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), padding(6), join(''));
const base64url = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), padding(6), join(''));
const genBase58 = abc => chain(radix(58), alphabet(abc), join(''));
const base58 = genBase58('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
genBase58('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
genBase58('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz');
const XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
const base58xmr = {
  encode(data) {
    let res = '';
    for (let i = 0; i < data.length; i += 8) {
      const block = data.subarray(i, i + 8);
      res += base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], '1');
    }
    return res;
  },
  decode(str) {
    let res = [];
    for (let i = 0; i < str.length; i += 11) {
      const slice = str.slice(i, i + 11);
      const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
      const block = base58.decode(slice);
      for (let j = 0; j < block.length - blockLen; j++) {
        if (block[j] !== 0) throw new Error('base58xmr: wrong padding');
      }
      res = res.concat(Array.from(block.slice(block.length - blockLen)));
    }
    return Uint8Array.from(res);
  }
};
const BECH_ALPHABET = chain(alphabet('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join(''));
const POLYMOD_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 0x1ffffff) << 5;
  for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
    if ((b >> i & 1) === 1) chk ^= POLYMOD_GENERATORS[i];
  }
  return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i = 0; i < len; i++) {
    const c = prefix.charCodeAt(i);
    if (c < 33 || c > 126) throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod(chk) ^ c >> 5;
  }
  chk = bech32Polymod(chk);
  for (let i = 0; i < len; i++) chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 0x1f;
  for (let v of words) chk = bech32Polymod(chk) ^ v;
  for (let i = 0; i < 6; i++) chk = bech32Polymod(chk);
  chk ^= encodingConst;
  return BECH_ALPHABET.encode(convertRadix2([chk % 2 ** 30], 30, 5, false));
}
function genBech32(encoding) {
  const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
  const _words = radix2(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode(prefix, words, limit = 90) {
    if (typeof prefix !== 'string') throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
    if (!Array.isArray(words) || words.length && typeof words[0] !== 'number') throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
    const actualLength = prefix.length + 7 + words.length;
    if (limit !== false && actualLength > limit) throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    prefix = prefix.toLowerCase();
    return `${prefix}1${BECH_ALPHABET.encode(words)}${bechChecksum(prefix, words, ENCODING_CONST)}`;
  }
  function decode(str, limit = 90) {
    if (typeof str !== 'string') throw new Error(`bech32.decode input should be string, not ${typeof str}`);
    if (str.length < 8 || limit !== false && str.length > limit) throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase()) throw new Error(`String must be lowercase or uppercase`);
    str = lowered;
    const sepIndex = str.lastIndexOf('1');
    if (sepIndex === 0 || sepIndex === -1) throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = str.slice(0, sepIndex);
    const _words = str.slice(sepIndex + 1);
    if (_words.length < 6) throw new Error('Data must be at least 6 characters long');
    const words = BECH_ALPHABET.decode(_words).slice(0, -6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!_words.endsWith(sum)) throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return {
      prefix,
      words
    };
  }
  const decodeUnsafe = unsafeWrapper(decode);
  function decodeToBytes(str) {
    const {
      prefix,
      words
    } = decode(str, false);
    return {
      prefix,
      words,
      bytes: fromWords(words)
    };
  }
  return {
    encode,
    decode,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords
  };
}
genBech32('bech32');
genBech32('bech32m');
const utf8 = {
  encode: data => new TextDecoder().decode(data),
  decode: str => new TextEncoder().encode(str)
};
const hex = chain(radix2(4), alphabet('0123456789abcdef'), join(''), normalize(s => {
  if (typeof s !== 'string' || s.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
  return s.toLowerCase();
}));
const CODERS = {
  utf8,
  hex,
  base16,
  base32,
  base64,
  base64url,
  base58,
  base58xmr
};
`Invalid encoding type. Available types: ${Object.keys(CODERS).join(', ')}`;

var CurveType;
(function (CurveType) {
  CurveType[CurveType["ED25519"] = 0] = "ED25519";
  CurveType[CurveType["SECP256K1"] = 1] = "SECP256K1";
})(CurveType || (CurveType = {}));
var DataLength;
(function (DataLength) {
  DataLength[DataLength["ED25519"] = 32] = "ED25519";
  DataLength[DataLength["SECP256K1"] = 64] = "SECP256K1";
})(DataLength || (DataLength = {}));

const U64_MAX = 2n ** 64n - 1n;
const EVICTED_REGISTER = U64_MAX - 1n;
/**
 * Returns the account ID of the account that called the function.
 * Can only be called in a call or initialize function.
 */
function predecessorAccountId() {
  env.predecessor_account_id(0);
  return env.read_register(0);
}
/**
 * Returns the account ID of the current contract - the contract that is being executed.
 */
function currentAccountId() {
  env.current_account_id(0);
  return env.read_register(0);
}
/**
 * Returns the amount of NEAR attached to this function call.
 * Can only be called in payable functions.
 */
function attachedDeposit() {
  return env.attached_deposit();
}
/**
 * Reads the value from NEAR storage that is stored under the provided key.
 *
 * @param key - The key to read from storage.
 */
function storageRead(key) {
  const returnValue = env.storage_read(key, 0);
  if (returnValue !== 1n) {
    return null;
  }
  return env.read_register(0);
}
/**
 * Writes the provided bytes to NEAR storage under the provided key.
 *
 * @param key - The key under which to store the value.
 * @param value - The value to store.
 */
function storageWrite(key, value) {
  return env.storage_write(key, value, EVICTED_REGISTER) === 1n;
}
/**
 * Returns the arguments passed to the current smart contract call.
 */
function input() {
  env.input(0);
  return env.read_register(0);
}

/**
 * Tells the SDK to expose this function as a view function.
 *
 * @param _empty - An empty object.
 */
function view(_empty) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target, _key, _descriptor
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {};
}
function call({
  privateFunction = false,
  payableFunction = false
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target, _key, descriptor) {
    const originalMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    descriptor.value = function (...args) {
      if (privateFunction && predecessorAccountId() !== currentAccountId()) {
        throw new Error("Function is private");
      }
      if (!payableFunction && attachedDeposit() > 0n) {
        throw new Error("Function is not payable");
      }
      return originalMethod.apply(this, args);
    };
  };
}
function NearBindgen({
  requireInit = false,
  serializer = serialize,
  deserializer = deserialize
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return target => {
    return class extends target {
      static _create() {
        return new target();
      }
      static _getState() {
        const rawState = storageRead("STATE");
        return rawState ? this._deserialize(rawState) : null;
      }
      static _saveToStorage(objectToSave) {
        storageWrite("STATE", this._serialize(objectToSave));
      }
      static _getArgs() {
        return JSON.parse(input() || "{}");
      }
      static _serialize(value, forReturn = false) {
        if (forReturn) {
          return JSON.stringify(value, (_, value) => typeof value === "bigint" ? `${value}` : value);
        }
        return serializer(value);
      }
      static _deserialize(value) {
        return deserializer(value);
      }
      static _reconstruct(classObject, plainObject) {
        for (const item in classObject) {
          const reconstructor = classObject[item].constructor?.reconstruct;
          classObject[item] = reconstructor ? reconstructor(plainObject[item]) : plainObject[item];
        }
        return classObject;
      }
      static _requireInit() {
        return requireInit;
      }
    };
  };
}

// Candidate data structure
class Candidate {
  cid = 0;
  name = '';
  image = '';
  description = '';
  voteCount = 0;
  constructor(cid, name, image, description) {
    this.cid = cid;
    this.name = name;
    this.image = image;
    this.description = description;
    this.voteCount = 0;
  }
}

// Voting data structure
class Voting {
  vid = 0;
  title = '';
  description = '';
  candidates = [];
  votedAccountId = [];
  constructor(vid, title, description) {
    this.vid = vid;
    this.title = title;
    this.description = description;
  }
}

// Admin data structure
class Admin {
  aid = '';
  constructor(aid) {
    this.aid = aid;
  }
}

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2;

// E-Voting contract
let EVotingContract = (_dec = NearBindgen({}), _dec2 = call({}), _dec3 = call({}), _dec4 = call({}), _dec5 = view(), _dec6 = view(), _dec7 = call({}), _dec8 = call({}), _dec9 = call({}), _dec10 = call({}), _dec11 = view(), _dec12 = view(), _dec13 = call({}), _dec14 = view(), _dec15 = view(), _dec16 = view(), _dec(_class = (_class2 = class EVotingContract {
  constructor() {
    this.votings = new Array();
    this.admins = new Array();
  }

  //add a admin
  addAdmin({
    aid
  }) {
    if (this.admins.some(admin => admin.aid == aid)) {
      return;
    }
    const admin = new Admin(aid);
    this.admins.push(admin);
  }
  //delete a admin
  deleteAdmin({
    aid
  }) {
    this.admins = this.admins.filter(admin => admin.aid != aid);
  }
  //check admin
  isAdmin({
    aid
  }) {
    return this.admins.some(admin => admin.aid == aid);
  }
  // Get the list of admins  
  getAdmins() {
    return this.admins;
  }

  // Get the list of votings
  getVotings() {
    return this.votings;
  }

  //add a voting
  addVoting({
    title,
    description
  }) {
    const voting = new Voting(this.votings.length + 1, title, description);
    this.votings.push(voting);
  }
  deleteVoting({
    votingId
  }) {
    this.votings = this.votings.filter(voting => voting.vid != votingId);
  }

  //add candidate in a voting
  addCandidate({
    votingId,
    name,
    image,
    description
  }) {
    const voting = this.votings.find(v => v.vid == votingId);
    if (voting) {
      const candidate = new Candidate(voting.candidates.length + 1, name, image, description);
      voting.candidates.push(candidate);
    }
  }
  deleteCandidate({
    votingId,
    candidateId
  }) {
    const voting = this.votings.find(v => v.vid == votingId);
    if (voting) {
      voting.candidates = voting.candidates.filter(candidate => candidate.cid != candidateId);
    }
  }

  // Get the list of candidates in a specific voting
  getCandidates({
    votingId
  }) {
    const voting = this.votings.find(v => v.vid == votingId);
    if (voting) {
      return voting.candidates;
    }
    return [];
  }

  // Check if a candidate exists in a specific voting
  candidateExists({
    votingId,
    candidateName
  }) {
    const voting = this.votings.find(v => v.vid == votingId);
    if (voting) {
      return voting.candidates.some(candidate => candidate.name === candidateName);
    }
    return false;
  }

  // Allow a user to vote for a candidate in a specific voting
  vote({
    votingId,
    candidateId
  }) {
    const accountId = currentAccountId();
    const voting = this.votings.find(v => v.vid == votingId);
    if (voting) {
      if (voting.votedAccountId.some(aid => aid == accountId)) {
        // User has already voted
        return;
      }
      const candidate = voting.candidates.find(c => c.cid == candidateId);
      if (!candidate) {
        // Candidate does not exist
        return;
      }
      // Increment the candidate's vote count and mark the sender as having voted
      candidate.voteCount += 1;
      voting.votedAccountId.push(accountId);
      return;
    }
  }
  isVoted({
    votingId
  }) {
    const voting = this.votings.find(v => v.vid == votingId);
    if (voting) {
      return voting.votedAccountId.some(id => id == currentAccountId());
    }
    return false;
  }

  // Get the total number of candidates in a specific voting
  getCandidatesCount({
    votingId
  }) {
    const voting = this.votings.find(v => v.vid == votingId);
    if (voting) {
      return voting.candidates.length;
    }
    return 0;
  }

  // Get the total number of votings
  getVotingsCount() {
    return this.votings.length;
  }
}, (_applyDecoratedDescriptor(_class2.prototype, "addAdmin", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "addAdmin"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteAdmin", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteAdmin"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isAdmin", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "isAdmin"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getAdmins", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "getAdmins"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getVotings", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "getVotings"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "addVoting", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "addVoting"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteVoting", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteVoting"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "addCandidate", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "addCandidate"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "deleteCandidate", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "deleteCandidate"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCandidates", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "getCandidates"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "candidateExists", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "candidateExists"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "vote", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "vote"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isVoted", [_dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "isVoted"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCandidatesCount", [_dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "getCandidatesCount"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getVotingsCount", [_dec16], Object.getOwnPropertyDescriptor(_class2.prototype, "getVotingsCount"), _class2.prototype)), _class2)) || _class);
function getVotingsCount() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.getVotingsCount(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function getCandidatesCount() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.getCandidatesCount(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function isVoted() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.isVoted(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function vote() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.vote(_args);
  EVotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function candidateExists() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.candidateExists(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function getCandidates() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.getCandidates(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function deleteCandidate() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.deleteCandidate(_args);
  EVotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function addCandidate() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.addCandidate(_args);
  EVotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function deleteVoting() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.deleteVoting(_args);
  EVotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function addVoting() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.addVoting(_args);
  EVotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function getVotings() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.getVotings(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function getAdmins() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.getAdmins(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function isAdmin() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.isAdmin(_args);
  EVotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function deleteAdmin() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.deleteAdmin(_args);
  EVotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}
function addAdmin() {
  const _state = EVotingContract._getState();
  if (!_state && EVotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = EVotingContract._create();
  if (_state) {
    EVotingContract._reconstruct(_contract, _state);
  }
  const _args = EVotingContract._getArgs();
  const _result = _contract.addAdmin(_args);
  EVotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(EVotingContract._serialize(_result, true));
}

export { EVotingContract, addAdmin, addCandidate, addVoting, candidateExists, deleteAdmin, deleteCandidate, deleteVoting, getAdmins, getCandidates, getCandidatesCount, getVotings, getVotingsCount, isAdmin, isVoted, vote };
//# sourceMappingURL=hello_near.js.map
