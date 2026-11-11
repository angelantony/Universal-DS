import { propertyFormatNames } from 'style-dictionary/enums';
import { formattedVariables } from 'style-dictionary/utils';

export const TOKEN_FORMAT = 'uds/css';

/**
 * CSS custom properties wrapped in a cascade layer.
 * Aliases stay as var() references so themes can override semantic tokens at runtime.
 * @param {import('style-dictionary').StyleDictionary} styleDictionary
 */
export function registerTokenFormats(styleDictionary) {
  styleDictionary.registerFormat({
    name: TOKEN_FORMAT,
    format({ dictionary, options = {} }) {
      const selector = options.selector ?? ':root';
      const sourceDictionary = {
        ...dictionary,
        allTokens: dictionary.allTokens.filter((token) => token.isSource),
      };
      const variables = formattedVariables({
        format: propertyFormatNames.css,
        dictionary: sourceDictionary,
        outputReferences: options.outputReferences !== false,
        usesDtcg: true,
        formatting: { indentation: '    ' },
      });
      const version =
        typeof options.version === 'string'
          ? `    --uds-tokens-version: ${options.version};\n`
          : '';
      let reducedMotion = '';
      if (options.reducedMotion === true) {
        const durations = sourceDictionary.allTokens.filter(
          (token) => (token.$type ?? token.type) === 'duration',
        );
        if (durations.length > 0) {
          const lines = durations.map((token) => `      --${token.name}: 0s;`).join('\n');
          reducedMotion = `\n  @media (prefers-reduced-motion: reduce) {\n    ${selector} {\n${lines}\n    }\n  }`;
        }
      }
      const layerOrder = options.layerOrder ? `@layer ${options.layerOrder};\n\n` : '';
      const body = `@layer ${options.layer} {\n  ${selector} {\n${version}${variables}\n  }${reducedMotion}\n}\n`;
      return `${layerOrder}${body}`;
    },
  });
}

/** Flat map of CSS custom property name to resolved value, for contrast tests and tooling. */
export const RESOLVED_JSON_FORMAT = 'uds/resolved-json';

/**
 * @param {import('style-dictionary').StyleDictionary} styleDictionary
 */
export function registerResolvedJsonFormat(styleDictionary) {
  styleDictionary.registerFormat({
    name: RESOLVED_JSON_FORMAT,
    format({ dictionary }) {
      /** @type {Record<string, string | number>} */
      const resolved = {};
      const sourceTokens = dictionary.allTokens.filter((item) => item.isSource);
      for (const token of sourceTokens) {
        const value = token.value ?? token.$value;
        resolved[`--${token.name}`] =
          typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value);
      }
      return `${JSON.stringify(resolved, null, 2)}\n`;
    },
  });
}
