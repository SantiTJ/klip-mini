// File: /lib/utils.ts

/**
 * Une un array de clases en una sola cadena,
 * filtrando valores falsy.
 */
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
