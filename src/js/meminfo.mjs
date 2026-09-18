#!/usr/bin/env node
//#!/usr/bin/env -S node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/meminfo/
 * v2.0.4
 */

/*
 * this is the new SECOND version.
 *
 * primary goal was to transform the output of `cat /proc/meminfo`
 * into something "better", plus some additional options.
 *
 * as usual, all plain vanilla, without any dependencies.
 * so it runs 'as is'!
 *
 *
 * TODO * the `meminfo.syntax()` `--help` output needs to be done.
 *
 */

//
const
	DEFAULT_BASE = 1024,
	DEFAULT_PRECISION = 2,
	DEFAULT_RADIX = true,
	DEFAULT_SCIENTIFIC = true,
	DEFAULT_SPACES = true,
	DEFAULT_SHOW = true,
	DEFAULT_BASE_FLOAT = true;

//
const	kekse1 = Symbol.for(
		import.meta?.url ||
			'kekse1/meminfo');

//
if(!globalThis[kekse1])
{
	//
	globalThis[kekse1] = Date.now();
	
	//
	//THIS IS A QUICK-AND-DIRTY VERSION... just re-wrote it new (from scratch) for only this `meminfo` purpose..
	//you can find better versions (maybe) at < https://github.com/kekse1/radix/ > ... etc. pp.. ^_^ ...
	//
	Reflect.defineProperty(Math, 'size', { value: (_value, _base = DEFAULT_BASE, _precision = DEFAULT_PRECISION, _radix = DEFAULT_RADIX, _scientific = DEFAULT_SCIENTIFIC, _spaces = DEFAULT_SPACES, _show = DEFAULT_SHOW) => {
		if(_value <= 0)
		{
			return '0 Bytes';
		}
		
		if(typeof _base === 'object' && _base !== null)
		{
			if(typeof _base.show === 'boolean')
			{
				_show = _base.show;
			}
			
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

		if(typeof _show !== 'boolean')
		{
			_show = DEFAULT_SHOW;
		}
		
		if(typeof _spaces !== 'boolean')
		{
			_spaces = DEFAULT_SPACES;
		}
		
		if(typeof _scientific !== 'boolean')
		{
			_scientific = DEFAULT_SCIENTIFIC;
		}
		
		if(typeof _radix === 'number')
		{
			if(!Number.isRadix(_radix))
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
			if(!Number.isBase(_base))
			{
				throw new Error('Invalid base parameter [ 2 .. ]');
			}
		}
		else
		{
			_base = DEFAULT_BASE;
		}

		const	UNIT = Math.size.units;
		var	rest = _value,
			index = 0,
			maxIndex;

		if(_base === 1000 || _base === 1024)
		{
			maxIndex = (UNIT.length - 1);
		}
		else
		{
			maxIndex = null;
		}

		if(maxIndex === null) while(rest >= _base)
		{
			rest /= _base;
			++index;
		}
		else while(rest >= _base && index < maxIndex)
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
			
			if(_radix !== 10 && _show)
			{
				result = '(' + _radix + ')' + result;
			}
		}

		const	UNITS = (maxIndex === null ? null :
				Object.keys(UNIT[index]));

		if(UNITS === null || !UNITS.includes(_base.toString()))
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
	
	Reflect.defineProperty(String.prototype, 'isUpperCase', { get: function()
	{
		return (this.valueOf() === this.toUpperCase());
	}});
	
	Reflect.defineProperty(String.prototype, 'isLowerCase', { get: function()
	{
		return (this.valueOf() === this.toLowerCase());
	}});
	
	Reflect.defineProperty(Boolean, 'parse', { value: (_item) => {
		if(typeof _item === 'boolean')
		{
			return _item;
		}
		
		if(Number.isFinite(_item))
		{
			return !!_item;
		}
		
		if(typeof _item !== 'string')
		{
			return null;
		}
		
		if(!(_item = _item.trim()))
		{
			return true;
		}
		
		switch(_item = _item.toLowerCase())
		{
			case 'true': case 'yes': case 'on':
				return true;
			case 'false': case 'no': case 'off':
				return false;
		}
		
		return null;
	}});
	
	Reflect.defineProperty(Number, 'isRadix', { value: (_value) => {
		if(!Number.isFinite(_value))
		{
			return null;
		}
		
		return (!(_value < 2 || _value > 36) &&
				(_value % 1) === 0);
	}});
	
	Reflect.defineProperty(Number, 'isBase', { value: (_value) => {
		if(!Number.isFinite(_value))
		{
			return null;
		}
		
		if(Math.abs(_value) < 2)
		{
			return false;
		}
		
		if(!DEFAULT_BASE_FLOAT && (_value % 1) !== 0)
		{
			return false;
		}
		
		return true;
	}});
}

//
const
	DEFAULT_FILE = '/proc/meminfo',
	DEFAULT_FILE_BASE = 1024,
	DEFAULT_ENCODING = 'utf8',
	DEFAULT_SUFFIX = ' kB';
const
	DEFAULT_START = true;
const
	PRESETS = [ 'MEM', 'SWAP' ];
var
	ERROR = 0,
	ARGS = null;

//
const	meminfo = {};
export	default meminfo;
import	fs from 'node:fs';
import	os from 'node:os';

//
meminfo.size = (_value, _options = ARGS) => {
	_options = Object.assign({
			base: DEFAULT_BASE,
			precision: DEFAULT_PRECISION,
			radix: DEFAULT_RADIX,
			show: DEFAULT_SHOW },
		_options);

	return Math.size(_value,
		_options.base,
		_options.precision,
		_options.radix,
		DEFAULT_SCIENTIFIC,
		DEFAULT_SPACES,
		_options.show);
};

//
meminfo.syntax = (_exit = null) => {
	//
	//TODO/see also `meminfo.getParameters()`!1
	//
	throw new Error('todo');
	
	//
	if(Number.isFinite(_exit))
	{
		process.exit(Math.trunc(Math.
			abs(_exit)) % 256);
	}
};

//
// [ 'prec', 'precision', 'base', 'radix', 'locale', 'show' ];
//
//TODO/HELP @ `meminfo.syntax()`!1
//
meminfo.getParameters = () => {
	const	presets = [],
		result = {},
		fields = [];
	var	item, key;

	for(var i = 2, p = 0, f = 0; i < process.argv.length; ++i)
	{
		if(process.argv[i][0] === '-')
		{
			switch(process.argv[i])
			{
				case '--help': case '-h': case '-?':
					return meminfo.syntax(0);
			}

			item = process.argv[i].substr(1);
			
			if(item[0] === '-')
			{
				switch(key = item.substr(1).trim())
				{
					case 'prec':
					case 'precision':
					case 'base':
					case 'radix':
					case 'locale':
					case 'show':
						if(key === 'prec')
						{
							key = 'precision';
						}
						
						if(item = process.argv[++i])
						{
							item = item.trim();
						}
						break;
					default:
						console.error('Unknown parameter `' +
							process.argv[i] + '`.');
						return process.exit(4);
				}

				if(!item)
				{
					if(i === process.argv.length && (key === 'locale' || key === 'show'))
					{
						if(key === 'locale')
						{
							key = 'radix';
						}
						
						item = true;
					}
					else
					{
						console.error('Expecting a value for parameter `' +
							process.argv[i - 1] + '`!');
						return process.exit(5);
					}
				}
				
				if(key === 'show')
				{
					item = Boolean.parse(item);

					if(typeof item !== 'boolean')
					{
						console.error('Expecting a numeric or boolean ' +
							'value for parameter `' +
							process.argv[i - 1] + '`.');
						return process.exit(8);
					}
				}
				else if(key === 'locale')
				{
					key = 'radix';
					
					if(!item.isNumeric)
					{
						item = Boolean.parse(item);
						
						if(typeof item !== 'boolean')
						{
							console.error('Expecting a numeric or boolean ' +
								'value for parameter `' +
								process.argv[i - 1] + '`.');
							return process.exit(7);
						}
					}
				}
				else if(!item.isNumeric && typeof item !== 'boolean')
				{
					console.error('Expecting a numeric value for ' +
						'parameter `' + process.argv[i - 1] + '`.');
					return process.exit(6);
				}
				
				if(typeof item !== 'boolean')
				{
					item = Number(item);
				}
				
				switch(key)
				{
					case 'precision':
						result.precision = item;
						break;
					case 'base':
						result.base = item;
						break;
					case 'radix':
						result.radix = item;
						break;
					case 'show':
						result.show = item;
						break;
				}
			}
			else
			{
				console.error('Unknown parameter `' +
					process.argv[i] + '`.');
				return process.exit(3);
			}
		}
		else if(process.argv[i][0] === '@' && (item = process.argv[i].substr(1)).isNumeric)
		{
			result.radix = Number(item);
		}
		else if(process.argv[i][0] === '=' && (item = process.argv[i].substr(1)).isNumeric)
		{
			result.base = Number(item);
		}
		else if(process.argv[i].isNumeric)
		{
			result.base = Number(process.argv[i]);
		}
		else if(process.argv[i].isUpperCase)
		{
			if(!PRESETS.includes(process.argv[i]))
			{
				console.error('Preset `' +
					process.argv[i] +
					'` is unknown!');
				return process.exit(2);
			}
			
			if(!presets.includes(process.argv[i]))
			{
				presets[p++] = process.argv[i];
			}
		}
		else if(!fields.includes(item = process.argv[i].toLowerCase()))
		{
			fields[f++] = item;
		}
	}
	
	if(typeof result.radix === 'number' && !Number.isRadix(result.radix))
	{
		console.error('Your radix is not valid!');
		return process.exit(12);
	}

	if(typeof result.base === 'number' && !Number.isBase(result.base))
	{
		console.error('Your base is not valid!');
		return process.exit(13);
	}
	
	return Object.assign(result, { presets, fields });
};

meminfo.getData = (_errors = true) => {
	var data;

	try
	{
		data = fs.readFileSync(DEFAULT_FILE,
			{ encoding: DEFAULT_ENCODING });
	}
	catch(_err)
	{
		if(_errors) console.error('Unable to read `' +
			DEFAULT_FILE + '`! Falling back...' +
			os.EOL);
		ERROR = 246;
		return meminfo.getData.fallback();
	}

	data = data.split(os.EOL);
	var	line, key, value;
	const	result = {};

	for(var i = 0; i < data.length; ++i)
	{
		if(!(line = data[i].trim()))
		{
			continue;
		}
		
		if((line = line.split(':', 2)).length < 2)
		{
			continue;
		}
		
		key = line[0].trim();
		value = line[1].trim();

		if(value.endsWith(DEFAULT_SUFFIX))
		{
			value = value.slice(0, -(DEFAULT_SUFFIX.
						length)).trim();

			if(value.isNumeric)
			{
				value = Number(value * DEFAULT_FILE_BASE);
				value = meminfo.size(value, ARGS);
			}
		}
		
		result[key] = value;
	}

	return result;
};

meminfo.prepareData = (_data) => {
	var	maxValue = 0,
		maxKey = 0,
		len;

	for(const idx in _data)
	{
		if((len = idx.length) > maxKey)
		{
			maxKey = len;
		}
		
		if((len = _data[idx].length) > maxValue)
		{
			maxValue = len;
		}
	}

	maxKey += 2;
	const result = {};
	
	for(const idx in _data)
	{
		result[(idx + ': ').padEnd(maxKey, ' ')] =
			_data[idx].padStart(
				maxValue, ' ');
	}

	return result;
};

meminfo.getData.fallback = () => {
	const result = {};

	result.MemTotal = meminfo.size(
		os.totalmem(), ARGS);
	result.MemAvailable = meminfo.size(
		os.freemem(), ARGS);

	return result;
};

meminfo.filterData = (_data, _fields, _presets) => {
	meminfo.filterData.applyPresets(
		_fields, _presets);

	if(_fields.length === 0)
	{
		return { ... _data };
	}

	const	lower = new Set(),
		invalid = [],
		result = {};
	
	for(const idx in _data)
	{
		lower.add(idx.toLowerCase());
	}
	
	for(var i = 0, j = 0; i < _fields.length; ++i)
	{
		if(!lower.has(_fields[i]))
		{
			invalid[j++] = _fields[i];
		}
	}
	
	if(invalid.length > 0)
	{
		console.error('You defined ' + invalid.length.
			toLocaleString() + ' invalid fields:' + os.EOL);
		
		for(const i of invalid)
		{
			console.log('\t' + i);
		}
		
		if(invalid.length === _fields.length)
		{
			return process.exit(9);
		}
		
		ERROR = 10;
		console.log();
	}

	for(const idx in _data)
	{
		if(_fields.includes(idx.toLowerCase()))
		{
			result[idx] = _data[idx];
		}
	}

	if(Object.keys(result).length === 0)
	{
		console.error('No valid field left!');
		return process.exit(11);
	}

	return result;
};

meminfo.filterData.applyPresets = (_fields, _presets) => {
	if(_presets.length === 0)
	{
		return _fields;
	}

	if(_presets.includes('SWAP'))
	{
		if(!_fields.includes('SwapFree'))
		{
			_fields.unshift('SwapFree');
		}
		
		if(!_fields.includes('SwapTotal'))
		{
			_fields.unshift('SwapTotal');
		}
	}
	
	if(_presets.includes('MEM'))
	{
		if(!_fields.includes('MemAvailable'))
		{
			_fields.unshift('MemAvailable');
		}
		
		if(!_fields.includes('MemFree'))
		{
			_fields.unshift('MemFree');
		}

		if(!_fields.includes('MemTotal'))
		{
			_fields.unshift('MemTotal');
		}
	}
	
	for(var i = 0; i < _fields.length; ++i)
	{
		_fields[i] = _fields[i].toLowerCase();
	}
	
	return _fields;
};

meminfo.printData = (_data) => {
	var result = 0;

	for(const idx in _data)
	{
		console.log(
			idx +
			_data[idx]);
		++result;
	}
	
	return result;
};

//
meminfo.handle = (_errors = true) => {
	ARGS = meminfo.getParameters();
	const data = meminfo.filterData(
		meminfo.getData(_errors),
		ARGS.fields, ARGS.presets);
	const result = meminfo.prepareData(data);
	meminfo.printData(result);
	return data;
};

meminfo.start = (_errors = true, _exit = true) => {
	const result = meminfo.handle(_errors);
	if(_exit) process.exit(ERROR);
	return result;
};

//
if(DEFAULT_START)
{
	meminfo.start();
}

//
