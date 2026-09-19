#!/usr/bin/env node
//#!/usr/bin/env -S node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/meminfo/
 * v2.1.0
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
 *
 *
 *
 * TODO * the `meminfo.help()` `--help` output needs to be done.
 *
 * TODO * Math.size() => BigInt support! PLEASE CALCULATE WITH IT, NO CAST!!1 ...
 *		maybe first check if below Number.MAX_SAFE_INTEGER for current version,
 *		... etc.. THINK ABOUT IT: BigInt won't allow floating point results..
 *		and that's BAD for real base conversions...! :-/
 *
 *
 *
 */

//
const
	DEFAULT_BASE = 1024,
	DEFAULT_PRECISION = 4,
	DEFAULT_RADIX = true,
	DEFAULT_SCIENTIFIC = true,
	DEFAULT_SPACES = true,
	DEFAULT_SHOW = true;

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
	// _options{ base, index, precision, radix, scientific, spaces, show };
	//
	Reflect.defineProperty(Math, 'size', { value: (_value, _options) => {
		if(typeof _value === 'bigint')
		{
			throw new Error('todo');
		}
		else if(!Number.isFinite(_value))
		{
			throw new Error('Invalid _value argument (not a real number)');
		}

		const	negative = (_value < 0),
			UNIT = Math.size.units;
		_value = Math.abs(_value);
		
		if(!_value)
		{
			return '0 Bytes';
		}
		else if(_value === 1)
		{
			return ((negative ? '-' : '') + '1 Byte');
		}
		
		(() => {
			if(typeof _options !== 'object' || _options === null)
			{
				_options = {};
			}
			
			if(typeof _options.unit === 'string')
			{
				const unit = Math.size.findUnit(_options.unit);
				
				if(unit === null)
				{
					throw new Error('Unknown unit `' + unit + '`.');
				}
				
				_options.index = unit[0];
				_options.base = unit[1];
			}
			else
			{
				if(typeof _options.base === 'boolean')
				{
					_options.base = (_options.base ? 1024 : 1000);
				}
				else if(Number.isFinite(_options.base))
				{
					if(!Number.isBase(_options.base))
					{
						throw new Error('Invalid {base} option');
					}
				}
				else
				{
					_options.base = DEFAULT_BASE;
				}

				if(_options.index !== null)
				{
					if(Number.isFinite(_options.index))
					{
						_options.index = Math.trunc(
							Math.abs(_options.index));

						if(Math.size.isRegularBase(_options.base))
						{
							_options.index = Math.min(
								_options.index,
								UNIT.length);
						}
					}
					else
					{
						_options.index = null;
					}
				}
			}
			
			if(Number.isFinite(_options.precision))
			{
				_options.precision = Math.trunc(
					Math.abs(_options.precision));
			}
			else
			{
				_options.precision = DEFAULT_PRECISION;
			}
			
			if(typeof _options.radix !== 'boolean')
			{
				if(Number.isFinite(_options.radix))
				{
					if(!Number.isRadix(_options.radix))
					{
						throw new Error('Invalid {radix} option');
					}
				}
				else
				{
					_options.radix = DEFAULT_RADIX;
				}
			}
			
			if(typeof _options.scientific !== 'boolean')
			{
				_options.scientific = DEFAULT_SCIENTIFIC;
			}
			
			if(typeof _options.spaces !== 'boolean')
			{
				_options.spaces = DEFAULT_SPACES;
			}
			
			if(typeof _options.show !== 'boolean')
			{
				_options.show = DEFAULT_SHOW;
			}
		})();

		if(_options.index === 0)
		{
			return ((negative ? '-' : '') +
				(_value + ' Bytes'));
		}
		
		var	rest = _value,
			regularBase,
			index = 0,
			maxIndex;

		if(Math.size.isRegularBase(_options.base))
		{
			maxIndex = (UNIT.length - 1);
			regularBase = true;
		}
		else
		{
			maxIndex = Infinity;
			regularBase = false;
		}

		if(_options.index === null) while(rest >= _options.base && index < maxIndex)
		{
			rest /= _options.base;
			++index;
		}
		else while(index < _options.index)
		{
			rest /= _options.base;
			++index;
		}

		rest =	Math.round(rest, _options.precision);
		var	result;

		if(typeof _options.radix === 'boolean')
		{
			if(_options.radix)//&& rest >= 1000; ..
			{
				result = rest.toLocaleString();
			}
			else
			{
				result = rest.toFixed(
					_options.precision);
			}
		}
		else
		{
			result = rest.toString(_options.radix);
			
			if(_options.radix !== 10 && _options.show)
			{
				result = '(' + _options.radix + ')' + result;
			}
		}

		if(!regularBase)
		{
			const mul = (_options.scientific ? '×' : '*');
			const space = (_options.spaces ? ' ' : '');
			return ((negative ? '-' : '') + (result +
				space + mul + space +
				_options.base + '^' + index));
		}
		
		return ((negative ? '-' : '') + (result +
			' ' + UNIT[index][_options.base]));
	}});

	Math.size.isRegularBase = (_base) => (
		_base === 1000 || _base === 1024);

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

	Math.size.findUnit = (_unit) => {
		if(typeof _unit !== 'string')
		{
			return null;
		}

		if(!(_unit = _unit.trim()) || _unit[0].toLowerCase() === 'b')
		{
			return [ 0, 1000 ];
		}

		const	UNIT = Math.size.units;
		var	base;

		if(_unit.length === 1)
		{
			if(_unit.isLowerCase)
			{
				base = 1000;
			}
			else
			{
				base = 1024;
			}

			_unit = _unit.toLowerCase();

			for(var i = 0; i < UNIT.length; ++i)
			{
				if(UNIT[i][base][0].toLowerCase() === _unit)
				{
					return [ i, base ];
				}
			}
			
			return null;
		}

		if((_unit = _unit.substr(0, 2).toLowerCase()).includes('i'))
		{
			base = 1024;
		}
		else
		{
			base = 1000;
		}

		_unit =	_unit[0];

		for(var i = 0; i < UNIT.length; ++i)
		{
			if(UNIT[i][base][0].toLowerCase() === _unit)
			{
				return [ i, base ];
			}
		}

		return null;
	};

	//
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
		
		if(Math.abs(_value) <= 1)
		{
			return false;
		}
		
		//
		// now i allow all bases, including floating point values! :-)
		//
		/*if(!DEFAULT_BASE_FLOAT && (_value % 1) !== 0)
		{
			return false;
		}*/
		
		return true;
	}});

	//

}

//
const
	DEFAULT_FILE = '/proc/meminfo',
	DEFAULT_FILE_BASE = 1024,
	DEFAULT_ENCODING = 'utf8',
	DEFAULT_SUFFIX = ' kB',
	DEFAULT_FILE_POW = 1;
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
meminfo.size = (_value, _options = ARGS) => Math.
	size(_value, Object.assign({
			base: DEFAULT_BASE,
			precision: DEFAULT_PRECISION,
			radix: DEFAULT_RADIX,
			show: DEFAULT_SHOW,
			scientific: DEFAULT_SCIENTIFIC,
			spaces: DEFAULT_SPACES,
			index: null,
			unit: null
		}, _options));

//
meminfo.help = (_exit = null) => {
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
// [ 'prec', 'precision', 'base', 'radix', 'locale', 'show', 'unit', 'index' ];
//
//TODO/HELP @ `meminfo.help()`!1
//
meminfo.getParameters = () => {
	const	presets = [],
		result = {},
		fields = [];
	var	item,
		key;

	for(var i = 2; i < process.argv.length; ++i)
	{
		switch(process.argv[i])
		{
			case '--help':
			case '-h':
			case '-?':
				return meminfo.help(0);
		}
	}
	
	for(var i = 2, p = 0, f = 0; i < process.argv.length; ++i)
	{
		if(process.argv[i] === '--')
		{
			break;
		}
		else if(process.argv[i] === '+')
		{
			for(const pre of PRESETS)
			{
				if(!presets.includes(pre))
				{
					presets[p++] = pre;
				}
			}
		}
		else if(process.argv[i][0] === '-')
		{
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
					case 'index':
					case 'unit':
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
				
				if(item && (item[0] === '-' || item[0] === '@' || item[0] === '='))
				{
					item = '';
					--i;
				}
				else if(!item)
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
				else if(key === 'unit')
				{
					if(!(item = item.trim()))
					{
						console.error('Your `--unit` parameter needs a real (string) value.');
						return process.exit(16);
					}
				}
				else if(key === 'index')
				{
					if(item.isNumeric)
					{
						item = Number(item);
					}
					else
					{
						console.error('Your `--index` parameter needs a numeric value.');
						return process.exit(17);
					}
				}
				else if(!item.isNumeric && typeof item !== 'boolean')
				{
					console.error('Expecting a numeric value for ' +
						'parameter `' + process.argv[i - 1] + '`.');
					return process.exit(6);
				}
				else if(typeof item !== 'boolean')
				{
					item = Number(item);
				}

				result[key] = item;
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
	
	if(typeof result.unit === 'string')
	{
		if(typeof result.index === 'number')
		{
			console.error('You can\'t define BOTH `--unit` and `--index`.');
			return process.exit(14);
		}
	}
	else if(typeof result.index === 'number')
	{
		if(!Number.isFinite(result.index) || result.index < 0 || (result.index % 1) !== 0)
		{
			console.error('Your `--index` is not a valid positive integer.');
			return process.exit(15);
		}
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
				value = Number(value *
					DEFAULT_FILE_BASE **
					DEFAULT_FILE_POW);
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
	const result = meminfo.
		prepareData(data);
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
