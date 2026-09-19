<img src="without.svg" /><br>
<img src="https://kekse.biz/github.php?draw&override=github:meminfo" />

# `meminfo`
Will present you your `/proc/meminfo` in a more clean/better way.

There are also some (command line) options (plus some `const DEFAULT*` in the script);
they still need documentation here and in the `meminfo.syntax()` `--help` function!

> [!NOTE]
> Later I'll also try to implement it as pure `bash` shell script.
> But this is still **TODO**.

<br><br>

## Download
Implemented in plain Vanilla JavaScript, **without any dependencies**.

* [Version v**2.1.1**](./src/js/meminfo.mjs) (updated **2026-09-19**);

<br><br>

## Supported command line arguments
There are few supported **argv[] parameters** (beneath possible `const DEFAULT_*`
switches in the code); they still need a documentation (in the `meminfo.help()`
function, and in here):

* `--prec[ision]`
* `--base`
* `--radix`
* `--locale`
* `--show`
* `--unit`
* `--index`

Additionally I introduced some **syntactic elements** to define some options w/ less
characters. These are **prefixes** to (mostyle numerical) values you need to append
directly (without any space or stuff):

* `@`: defines the `--radix`.
* `=`: defines the `--base`.

**Numeric** parameters will be treated like `=` or the `--base`.

**Upper Case** parameters are "**presets**". You can define more than one.
They set combinations of `/proc/meminfo` fields. See also the `const PRESETS[]`
(currently supported `MEM` and `SWAP`).

**All other parameters** define fields of `/proc/meminfo`. They can also be pure lower case;
if you define non-existing ones, it'll (also) inform you about your mistake.

**Last but not least**: defining a `+` argument will include ALL presets (additionally to
optionally user defined fields).

<br>

> [!NOTE]
> To keep the code minimal, I didn't implement a whole `getopt` module or stuff.
> Just a merely 'hard-coded' `meminfo.getParameters()` function for only the
> parameters used in here.

<br>

### Numbers
Defining the default `--locale` will use `.toLocaleString()`.

Using `--locale no` (or `off` or `false`) will use `.toFixed()` (w/ a
`--precision 4` as current default).

If you want your decimal output without fixed fraction amount, you can just
use `--radix 10` or `@10`. All other `--radix` (Integer [ 2 .. 36 ]) will
be `--show`n (like a cast), or disable such prefix using `--show off`.

<br>

### Base
The `--base` (or `=` or just the number) can also be used with any number,
including floating point values and negative ones (you'll see it in your
output)!

The only limit is `Math.abs() > 1`.

<br>

### Unit or Index
Normally the chosen unit is adjusted by the size.

You can fix the output unit via `--unit`. Either with one character, whereas
the base (1000/1024) is changed by the upper or lower case state of your char.
Or use two to three chars like `mib` for Mibibyte (base 1024) and `mb` for
Megabyte (base 1000).

Especially for your own bases (but also for both regular ones) you can use
the `--index` to set a special (division) index. Like `--index 1` for K(i)B.

<br><br>

## Example Screenshots
Here are example screenshots of my utility.

This is my newest version, which was intended to be a better
replacement for `cat /proc/meminfo` **only** (so it's renamed
from `mem` to `meminfo` now).

![v2](./img/meminfo.png)

<br>

> [!NOTE]
> My [old, original code base](./src/js/v1/mem.js) is still available here,
> including the [**older** screenshot](./img/mem.png).

<br><br><br>

# Contact
<img src="https://kekse.biz/github.php?override=github:meminfo&draw&text=meminfo@kekse.biz&angle=6&size=38pt&fg=150,20,90&font=OpenSans&ro&readonly&h=64&v=16" />

<br>

# Copyright and License
The Copyright is [(c) Sebastian Kucharczyk](COPYRIGHT.txt),
and it's licensed under the [MIT](LICENSE.txt) (also known as 'X' or 'X11' license).

<a href="https://kekse.biz/">
<img src="favicon.png" alt="Favicon" />
</a>

