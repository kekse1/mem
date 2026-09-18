#!/usr/bin/env -S node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/mem/
 * v1.0.4
 */

/*
 *
 * BTW: the code is a little ugly... i wanted a really small script,
 * then i needed some more features and so on... dirty. but it worx. ^_^
 *
 * 
 * 
 * TODO * one mode for (nearly) EXACTLY SAME OUTPUT like
 *	`cat /proc/meminfo`, BUT w/ adapted sizes/units! ...
 *		=> good! see --raw or DEFAULT_RAW, etc.!1 ..
 *
 * 
 *
 * STILL TODO!!!! i just "needed" to jump to the
 * `bash` shell script version of this lil' tool..
 *
 * TODO * parse/use the `getopt()`!..
 * TODO * finish the `syntax()` for --help; ...
 *
 */

//
const
	_DEBUG = false;

//
const
	DEFAULT_BASE = 1024,
	DEFAULT_PRECISION = 2,
	//(bool) as "LOCALE":
	DEFAULT_RADIX = true,
	DEFAULT_SCIENTIFIC = true,
	DEFAULT_SPACES = true,
	DEFAULT_EOL = true;
var	//TODO/w/ options/etc....!!
	DEFAULT_RAW = false,
	DEFAULT_ZERO = false,
	DEFAULT_ALL = false,
	DEFAULT_FIELDS = [
		'MemTotal',
		'MemFree',
		'MemAvailable',
		'SwapTotal',
		'SwapFree'
	];
const
	DEFAULT_START = true,
	
	
DEFAULT_GETOPT_ERRORS = false,//zzzzz/TODO: (true);
	
	
	// if only "MemAvailable" => (node:os).freemem();
	DEFAULT_FILE = '/proc/meminfo',
	DEFAULT_FILE_ENCODING = 'utf8',
	DEFAULT_FILE_SIZE_SUFFIX = ' kB',
	DEFAULT_FILE_BASE = 1024;

//
if(DEFAULT_RAW)
{
	DEFAULT_ZERO = true;
}
else if(DEFAULT_ALL === null)
{
	DEFAULT_FIELDS.length = 1;
	DEFAULT_FIELDS[0] = 'MemAvailable';
}
else if(DEFAULT_ALL)
{
	DEFAULT_FIELDS.length = 0;
}

//
const	FIELDS = new Set(DEFAULT_FIELDS);

//
const	kekse1 = Symbol.for(
		import.meta?.url ||
			'kekse1/mem');

//
if(!globalThis[kekse1])
{
	//
	globalThis[kekse1] = Date.now();
	
	//
	//THIS IS A QUICK-AND-DIRTY VERSION... just re-wrote it new (from scratch) for only this `mem` purpose..
	//you can find better versions (maybe) at < https://github.com/kekse1/radix/ > ... etc. pp.. ^_^ ...
	//
	Reflect.defineProperty(Math, 'size', { value: (_value, _base = DEFAULT_BASE, _precision = DEFAULT_PRECISION, _radix = DEFAULT_RADIX, _scientific = DEFAULT_SCIENTIFIC, _spaces = DEFAULT_SPACES) => {
		if(_value <= 0)
		{
			return '0';
			//return '0 Bytes';
		}
		
		if(typeof _base === 'object' && _base !== null)
		{
			if(typeof _base.spaces === 'boolean')
			{
				_spaces = _base.spaces;
			}

			if(typeof _base.scientific === 'boolean')
			{
				_scientific = _base.scientific;
			}
			
			if(typeof _base.radix === 'boolean' || Number.isFinite(_base.radix))
			{
				_radix = _base.radix;
			}
			
			if(Number.isFinite(_base.precision))
			{
				_precision = _base.precision;
			}
			
			if(typeof _base.base === 'boolean' || Number.isFinite(_base.base))
			{
				_base = _base.base;
			}
			else
			{
				_base = DEFAULT_BASE;
			}
		}

		if(typeof _spaces !== 'boolean')
		{
			_spaces = DEFAULT_SPACES;
		}
		
		if(typeof _scientific !== 'boolean')
		{
			_scientific = DEFAULT_SCIENTIFIC;
		}
		
		if(Number.isFinite(_radix))
		{
			if((_radix = Math.trunc(_radix)) < 2 || _radix > 36)
			{
				throw new Error('Invalid radix/locale argument');
			}
		}
		else if(typeof _radix !== 'boolean')
		{
			_radix = DEFAULT_RADIX;
		}
		
		if(!Number.isFinite(_precision))
		{
			_precision = DEFAULT_PRECISION;
		}

		if(typeof _base === 'boolean')
		{
			_base = (_base ? 1024 : 1000);
		}
		else if(Number.isFinite(_base))
		{
			if((_base = Math.abs(_base)) < 2 || !_base)
			{
				throw new Error('Invalid base parameter [ 2 .. ]');
			}
		}
		else
		{
			_base = DEFAULT_BASE;
		}

		const	UNIT = Math.size.units,
			UNITS = UNIT.length;
		var	rest = _value,
			index = 0;

		while(rest >= _base && index < (UNITS - 1))
		{
			rest /= _base;
			++index;
		}

		rest = Math.round(rest, _precision);
		var	result;

		if(typeof _radix === 'boolean')
		{
			if(_radix)//&& rest >= 1000; ..
			{
				result = rest.toLocaleString();
			}
			else
			{
				result = rest.toFixed(_precision);
			}
		}
		else
		{
			result = rest.toString(_radix);
		}
		
		if(!UNIT[index][_base])
		{
			const mul = (_scientific ? '×' : '*');
			const space = (_spaces ? ' ' : '');
			return (result + space + mul + space + _base + '^' + index);
		}
		
		return (result + ' ' + UNIT[index][_base]);
	}});
	
	Math.size.units = [
		{ 1000: 'Bytes', 1024: 'Bytes' },
		{ 1000: 'KB', 1024: 'KiB' },
		{ 1000: 'MB', 1024: 'MiB' },
		{ 1000: 'GB', 1024: 'GiB' },
		{ 1000: 'TB', 1024: 'TiB' },
		{ 1000: 'PB', 1024: 'PiB' },
		{ 1000: 'EB', 1024: 'EiB' },
		{ 1000: 'ZB', 1024: 'ZiB' },
		{ 1000: 'YB', 1024: 'YiB' }
	];
	
	Reflect.defineProperty(Math, '_round', { value: Math.round });
	Reflect.defineProperty(Math, 'round', { value: (_value, _precision = 0) => {
		if(!Number.isFinite(_precision) || _precision <= 0)
		{
			return Math._round(_value);
		}
		
		const coefficient = Math.pow(10, _precision);
		return ((Math._round(_value * coefficient) /
				coefficient) || 0);
	}});

	Reflect.defineProperty(String, 'tryCast', { value: (_item, _opts) => {
		if(typeof _item !== 'string')
		{
			return _item;
		}
		
		_opts = Object.assign({
				empty: false,
				array: false },
			_opts);

		var original = _item;
		_item = _item.trim();
		
		if(_item.length === 0)
		{
			return (_opts.empty ? true : '');
		}

		if(_item[_item.length - 1] === 'n')
		{
			const temp = _item.slice(0, -1);
			
			if(temp.isNumeric)
			{
				return BigInt(temp);
			}
		}
		else if(_item.isNumeric)
		{
			return Number(_item);
		}

		switch(_item.toLowerCase())
		{
			case 'true':
			case 'yes':
			case 'on':
				return true;
			case 'false':
			case 'no':
			case 'off':
				return false;
			case 'null':
				return null;
			case 'undefined':
				return undefined;
		}

		if(_opts.array && _item.includes(':'))
		{
			_item = _item.split(':');
			const res = new Array(_item.length);

			for(var i = 0; i < _item.length; ++i)
			{
				res[i] = String.tryCast(_item[i].trim(),
					Object.assign({}, _opts, {
						array: false }));
			}

			return res;
		}

		return original;
	}});

	Reflect.defineProperty(String.prototype, 'isNumeric', { get: function()
	{
		var	string = this.valueOf(),
			hadChar = false,
			c = 0, byte;

		while(string[c] === '-' || string[c] === '+')
		{
			++c;
		}

		if(c > 0)
		{
			string = string.substr(c);
		}

		if(string.length === 0)
		{
			return null;
		}
		
		for(var i = 0; i < string.length; ++i)
		{
			if(string[i] === '.')
			{
				if(hadChar)
				{
					return false;
				}
				
				hadChar = true;
			}
			else if((byte = string.charCodeAt(i)) < 48 || byte > 57)
			{
				return false;
			}
		}
		
		return true;
	}});
}

//
const memory = {
	OPTIONS: {
		base: DEFAULT_BASE,
		precision: DEFAULT_PRECISION,
		radix: DEFAULT_RADIX,//locale
		scientific: DEFAULT_SCIENTIFIC,
		spaces: DEFAULT_SPACES,
		eol: DEFAULT_EOL,
		zero: DEFAULT_ZERO,
		all: DEFAULT_ALL,
		raw: DEFAULT_RAW,
		fields: DEFAULT_FIELDS
	}
};

memory._OPTIONS = Object.
	keys(memory.OPTIONS);

const	MAP = {
		'b': 'base',
		'p': 'precision',
		'r': 'radix',
		's': 'scientific',
		'c': 'spaces',
		'e': 'eol',
		'f': 'fields',
		'z': 'zero',
		'a': 'all',
		'w': 'raw'
	};

var	LONG = [
		'base',
		'precision',
		'radix',
		'scientific',
		'spaces',
		'eol',
		'fields',
		'zero',
		'all',
		'raw'
	],
	SHORT = [
		'b',
		'p',
		'r',
		's',
		'c',
		'e',
		'f',
		'z',
		'a',
		'w'
	];

((_throw = true) => {
	const	WRONG_LONG = 1,
		WRONG_SHORT = 2;

	const	short = new Set(SHORT),
		long = new Set(LONG);
	var	wrong = 0, err;

	if(long.size !== LONG.length)
	{
		wrong |= WRONG_LONG;
	}
	
	if(short.size !== SHORT.length)
	{
		wrong |= WRONG_SHORT;
	}

	if(wrong)
	{
		err = '[DEBUG] The ';
		
		switch(wrong)
		{
			case WRONG_LONG:
				err += 'LONG[] is ';
				break;
			case WRONG_SHORT:
				err += 'SHORT[] is ';
				break;
			default:
				err += 'LONG[] and SHORT[] are ';
				break;
		}
		
		err += 'WRONG (ambiguous) - so maybe also the (MUCH TO SIMPLE) `getopt()`!?';
		
		if(_throw)
		{
			throw new Error(err);
		}

		console.error(err);
		process.exit(224);
	}

	LONG = long;
	SHORT = short;
	
	LONG.forEach((_item) => {
		if(!(_item in memory.OPTIONS))
		{
			err = '[DEBUG] The key `' + _item + '` is unknown in the `memory.OPTIONS[].`';

			if(_throw)
			{
				throw new Error(err);
			}
			
			console.error(err);
			process.exit(234);
		}
	});
	
	for(const idx in MAP)
	{
		if(idx.length !== 1)
		{
			err = '[DEBUG] The short item `' + idx + '` ain\'t one character wide.';

			if(_throw)
			{
				throw new Error(err);
			}
			
			console.error(err);
			process.exit(244);
		}
		
		if(!SHORT.has(idx))
		{
			err = '[DEBUG] The short item `' + idx + '` (mapped to `' +
				MAP[idx] + '`) is unknown.';
			
			if(_throw)
			{
				throw new Error(err);
			}
			
			console.error(err);
			process.exit(254);
		}
	}
})();

//
memory.syntax = (_exit = null) => {
	//
	throw new Error('TODO (see also the `LONG` and `SHORT`...)!');
	
	//
	//TODO/...
	//.. see also the `getopt()` below. ^_^ ...
	//
	
	//
	if(Number.isFinite(_exit))
	{
		process.exit(Math.trunc(Math.abs(_exit)) % 256);
	}
};

memory.getMemoryInfo = (_params) => {
	if(FIELDS.size === 1 && FIELDS.has('MemAvailable'))
	{
		// *bewusst* *nicht* "MemAvailable". zur unterscheidung. ;-) ...
		return { 'Available': os.freemem(), errors: 0 };
	}
	
	var	errors = 0,
		info;
	
	try
	{
		info = fs.readFileSync(DEFAULT_FILE, {
			encoding: DEFAULT_FILE_ENCODING });
	}
	catch(_err)
	{
		console.error('ERROR trying to read the `' +
			DEFAULT_FILE + '` (' + _err.message + ')');
		console.error('Falling backing...' + os.EOL);
		
		return { 'Available': os.freemem() };
	}
	
	const	result = {};
	
	info = info.split(os.EOL);

	for(var i = 0; i < info.length; ++i)
	{
		if(!(info[i] = info[i].trim()))
		{
			continue;
		}

		info[i] = info[i].split(':', 2);
		
		if(info[i].length !== 2)
		{
			continue;
		}
		
		if(!(info[i][1] = info[i][1].trim()))
		{
			continue;
		}

		info[i][0] = info[i][0].trim();

		if(!DEFAULT_RAW && FIELDS.size > 0 && !FIELDS.has(info[i][0]))
		{
			continue;
		}

		if(DEFAULT_FILE_SIZE_SUFFIX)
		{
			if(info[i][1].endsWith(DEFAULT_FILE_SIZE_SUFFIX))
			{
				if(!(info[i][1] = info[i][1].slice(0, -(DEFAULT_FILE_SIZE_SUFFIX.length))))
				{
					continue;
				}
			}
			else if(!DEFAULT_RAW)
			{
				continue;
			}
		}

		if(!info[i][1].isNumeric)
		{
			console.error('Unable to read value for the `' +
				info[i][0] + '` entry. Skipping...');
			++errors;
			continue;
		}
		
		info[i][1] = (Number(info[i][1].split(' ')[0]) *
					DEFAULT_FILE_BASE);

		if(!info[i][1] && !DEFAULT_ZERO)
		{
			continue;
		}

		result[info[i][0]] = info[i][1];
	}
	
	result.errors = errors;
	return result;
};

memory.showFreeMemory = (_value = os.freemem(), _params, _key, _pad = _key.length) => {
//
//TODO/..!1
//
	_params = Object.assign({},
		memory.OPTIONS,
		_params);

	//
	console.log(_key.padStart(_pad, ' ') + ': ' + _value.toLocaleString() +
		' (' + _value.toString() + ') ' + 'Bytes');
	console.log(''.padStart(_pad + 2) + Math.size(_value, 1024) +
		os.EOL + ''.padStart(_pad + 2) + Math.size(_value, 1000));
};

//
memory.getopt = (_vector = process.argv, _start = 2, _error = DEFAULT_GETOPT_ERRORS) => {
	//
	const	ERRORS = (_error === null || _error === true),
		opts = memory._OPTIONS,
		keys = [ SHORT, LONG ],
		result = [];
	var	dashes,
		item,
		i, j,
		err;

	for(const key of opts)
	{
		result[key] = null;
	}
	
	result.base = [];
	result.fields = [];

	if(!_DEBUG)
	{
		return result;
	}
	
	//
	for(var k = _start; k < _vector.length; ++k) switch(_vector[i])
	{
		case '--help':
		case '-h':
		case '-?':
			return memory.syntax(0);
			break;
	}

	//
	loop: for(i = _start, j = 0; i < _vector.length; ++i)
	{
		if(!(item = _vector[i].trim()))
		{
			continue;
		}
		
		dashes = 0;
		while(item[dashes++] === '-');

		if(--dashes === 1 || dashes === 2)
		{
			if(!(item = item.substr(dashes).trim()))
			{
				switch(dashes)
				{
					case 1:
						result[j++] = _vector[i];
						break;
					case 2:
						break loop;
				}

				continue loop;
			}

			switch(dashes)
			{
				case 1:
					if(item.length !== 1)
					{
						result[j++] = _vector[i];
						continue loop;
					}
					break;
				case 2:
					if(item.length === 1)
					{
						result[j++] = _vector[i];
						continue loop;
					}
					break;
				default:
					result[j++] = String.tryCast(
						_vector[i], {
							array: false,
							empty: false });
					continue loop;
			}

			if(!keys[dashes - 1].has(item))
			{
				if(ERRORS)
				{
					err = 'The key `' + _vector[i] + '` is unknown.';

					if(_error === null)
					{
						throw new Error(err);
					}

					console.error(err);
					process.exit(127);
				}
				else
				{
					result[j++] = String.tryCast(
						_vector[i], {
							array: false,
							empty: false });
				}
				
				continue loop;
			}
			
			if(dashes === 1 && !(item = MAP[item]))
			{
				err = 'The short key `' + _vector[i] + '` ain\'t really mapped to a long key!';
				
				if(_error === null)
				{
					throw new Error(err);
				}
				
				console.error(err);
				process.exit(125);
			}
console.dir({item});
			switch(item)
			{
				case 'base': // integer => array[];
					break;
				case 'precision': // integer
					break;
				case 'radix': // integer
					break;
				case 'scientific': // boolean
					break;
				case 'spaces': // boolean
					break;
				case 'eol': // boolean
					break;
				case 'zero': // boolean
					break;
				case 'all': // boolean/null
					break;
				case 'fields': // string/array => array[];
					break;

				default:
					if(ERRORS)
					{
						err = 'Short key `' + _vector[i] + '` maps to an unknown long item `--' + item + '`!';

						if(_error === null)
						{
							throw new Error(err);
						}
						
						console.error(err);
						process.exit(126);
					}
					
					result[j++] = String.tryCast(
						_vector[i], {
							array: false,
							empty: false });
					continue loop;
			}
			
			//
			//zzzz/...
			//..
			//
		}
		else
		{
			result[j++] = _vector[i];
		}
	}
	
	for(; i < _vector.length; ++i)
	{
		result[j++] = _vector[i];
	}

//debug/zzzzz
console.dir({result,O:memory.OPTIONS}); process.exit(111);

	return result;
};

//
memory.start = () => {
	const	params = memory.getopt(),
		result = memory.getMemoryInfo(params);
	var	maxLen = 0,
		count = 0,
		len;

	for(const idx in result)
	{
		if((len = idx.length) > maxLen)
		{
			maxLen = len;
		}
	}

	if(result.errors)
	{
		console.log();
	}

	delete result.errors;

	if(DEFAULT_RAW) for(const idx in result)
	{
		console.log((idx + ':').padEnd(maxLen + 2, ' ') +
			Math.size(result[idx]));
	}
	else for(const idx in result)
	{
		if(++count > 1 && DEFAULT_EOL)//params.eol (much TODO); ...
		{
			console.log();
		}
		
		memory.showFreeMemory(
			result[idx],
			params,
			idx,
			maxLen);
	}
};

//
export default memory;
import os from 'node:os';
import fs from 'node:fs';

if(DEFAULT_START)
{
	memory.start();
}

//
