#!/usr/bin/env -S node --no-warnings=MODULE_TYPELESS_PACKAGE_JSON

/*
 * Copyright (c) Sebastian Kucharczyk <kuchen@kekse.biz>
 * https://kekse.biz/ https://github.com/kekse1/mem/
 * v0.4.0
 */

/*
 * STILL TODO!!!! i just "needed" to jump to the
 * `bash` shell script version of this lil' tool..
 *
 * TODO * parse/use the `getCmdLineParams()`!..
 * TODO * finish the `syntax()` for --help; ...
 *
 */

//
const
	DEFAULT_BASE = 1024,
	DEFAULT_PRECISION = 3,
	DEFAULT_LOCALE = true,
	DEFAULT_SCIENTIFIC = true,
	DEFAULT_SPACES = true,
	DEFAULT_EOL = true;
const
	DEFAULT_START = true,
	// if only "MemAvailable", we'll use the `(node:os).freemem()`!
	DEFAULT_FILE = '/proc/meminfo',
	DEFAULT_FILE_ENCODING = 'utf8',
	DEFAULT_FILE_SIZE_SUFFIX = ' kB',
	DEFAULT_FILE_BASE = 1024,
	DEFAULT_ZERO = true,
	DEFAULT_EASY = false,
	DEFAULT_FIELDS = [
		'MemTotal',
		'MemFree',
		'MemAvailable',
		'SwapTotal',
		'SwapFree'
	];

//
if(DEFAULT_EASY)
{
	DEFAULT_FIELDS.length = 1;
	DEFAULT_FIELDS[0] = 'MemAvailable';
}

//
const	FIELDS = new Set(DEFAULT_FIELDS);

//
const	kekse1 = Symbol.for(import.meta?.url || 'kekse1/mem'),
	memory = {};

const syntax = (_exit = null) => {
	//
	throw new Error('TODO');
	
	//
	//TODO/...
	//.. see also the `getCmdLineParams()` below. ^_^ ...
	//
	
	//
	if(Number.isFinite(_exit))
	{
		process.exit(Math.trunc(Math.abs(_exit)) % 256);
	}
};

memory.getMemoryInfo = (_params) => {
	if(FIELDS.size === 0)
	{
		FIELDS.add('MemAvailable');
	}

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
		
		info[i][1] = info[i][1].trim();

		if(!info[i][1].endsWith(DEFAULT_FILE_SIZE_SUFFIX))
		{
			continue;
		}

		info[i][0] = info[i][0].trim();
		
		if(!FIELDS.has(info[i][0]))
		{
			continue;
		}

		info[i][1] = (Number(info[i][1].split(' ')[0]) *
					DEFAULT_FILE_BASE);

		if(Number.isNaN(info[i][1]))
		{
			console.error('Unable to read value for the `' +
				info[i][0] + '` entry. Skipping...');
			++errors;
			continue;
		}
		
		if(!info[i][1] && !DEFAULT_ZERO)
		{
			continue;
		}

		/*switch(info[i][0])
		{
			case 'MemTotal':
				info[i][0] = 'Total';
				break;
			case 'MemFree':
				info[i][0] = 'Free';
				break;
			case 'MemAvailable':
				info[i][0] = 'Available';
				break;
		}*/
		
		result[info[i][0]] = info[i][1];
	}
	
	result.errors = errors;
	return result;
};

memory.showFreeMemory = (_value = os.freemem(), _params, _key, _pad = _key.length) => {
	//
	//TODO/see also `getCmdLineParams()`, etc...
	//
	/*_params = Object.assign({
		base: DEFAULT_BASE,
		precision: DEFAULT_PRECISION,
		locale: DEFAULT_LOCALE,
		scientific: DEFAULT_SCIENTIFIC,
		spaces: DEFAULT_SPACES,
		eol: DEFAULT_EOL,
		fields: DEFAULT_FIELDS,
		default: DEFAULT_ENV },
			_params);
	 */

	//
	console.log(_key.padStart(_pad, ' ') + ': ' + _value.toLocaleString() +
		' (' + _value.toString() + ') ' + 'Bytes');
	console.log(''.padStart(_pad + 2) + Math.size(_value, 1024) +
		os.EOL + ''.padStart(_pad + 2) + Math.size(_value, 1000));
};

memory.getCmdLineParams = (_vector = process.argv, _start = 2) => {
	const result = {
		base: [],
		precision: null,
		locale: null,
		scientific: null,
		spaces: null,
		eol: null,
		full: null,
		fields: [],
		easy: null };
	
	for(var i = _start, b = 0; i < _vector.length; ++i)
	{
		switch(_vector[i])
		{
			case '--help':
			case '-h':
			case '-?':
				return syntax(0);
			case '--base':
			case '-b':
				break;
			case '--precision':
			case '-p':
				break;
			case '--locale':
			case '--radix':
			case '-l':
			case '-r':
				break;
			case '--scientific':
			case '-s':
				break;
			case '--spaces':
			case '-S':
				break;
			case '--eol':
			case '-E':
				break;
			case '--fields':
			case '-f':
				break;
			case '--easy':
			case '-e':
				break;
		}
	}
};

//
if(!globalThis[kekse1])
{
	//
	globalThis[kekse1] = Date.now();
	
	//
	//THIS IS A QUICK-AND-DIRTY VERSION... just re-wrote it new (from scratch) for only this `mem` purpose..
	//you can find better versions (maybe) at < https://github.com/kekse1/radix/ > ... etc. pp.. ^_^ ...
	//
	Reflect.defineProperty(Math, 'size', { value: (_value, _base = DEFAULT_BASE, _precision = DEFAULT_PRECISION, _locale = DEFAULT_LOCALE, _scientific = DEFAULT_SCIENTIFIC, _spaces = DEFAULT_SPACES) => {
		if(_value <= 0)
		{
			return '0 Bytes';
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
			
			if(typeof _base.locale === 'boolean' || Number.isFinite(_base.locale))
			{
				_locale = _base.locale;
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
		
		if(Number.isFinite(_locale))
		{
			if((_locale = Math.trunc(_locale)) < 2 || _locale > 36)
			{
				throw new Error('Invalid radix for locale argument');
			}
		}
		else if(typeof _locale !== 'boolean')
		{
			_locale = DEFAULT_LOCALE;
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

		if(typeof _locale === 'boolean')
		{
			if(_locale)//&& rest >= 1000; ..
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
			result = rest.toString(_locale);
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
}

//
export default memory;
import os from 'node:os';
import fs from 'node:fs';

//
memory.start = () => {
	const	params = memory.getCmdLineParams(),
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

	for(const idx in result)
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
if(DEFAULT_START)
{
	memory.start();
}

//
