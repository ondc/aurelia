// fulfill.js
// Douglas Crockford
// 2018-10-03

// Public Domain

const rx_delete_default = /[<>&%"\\]/g;

const rx_syntactic_variable = /\{([^{}:\s]+)(?::([^{}:\s]+))?\}/g;

//. Capturing groups:
//.     [0] original (symbolic variable wrapped in braces)
//.     [1] path
//.     [2] encoding

type Encoder = (replacement: string | number | boolean | Container, path: string, encoding: string) => string;
type EncoderOrEncoders = Encoder | { [key: string]: Encoder };
type Container = { [key: string]: string | number | boolean | Container };
type Replacement = (path: string, encoding: string) => string;

function default_encoder(replacement: string | number | boolean | Container, path: string, encoding: string): string {
  return String(replacement).replace(rx_delete_default, '');
}

const fn = Object.freeze(function fulfill(
  str: string,
  container: Container | Replacement,
  encoder: EncoderOrEncoders = default_encoder
): string {

  // The 'fulfill' function takes a string containing symbolic variables, a
  // generator function or an object or array containing values to replace
  // the symbolic variables, and an optional encoder function or object of encoder
  // functions. The default encoder removes all angle brackets.

  // Most of the work is done by the string 'replace' method that finds the
  // symbolic variables, presenting them as the original substring, a path string,
  // and an optional encoding string.

  return str.replace(
    rx_syntactic_variable,
    function (original: string, path: string, encoding: string = ''): string {
      try {

        // Use the path to obtain a single replacement from the container of values.
        // The path contains wun or more names (or numbers) separated by periods.

        let replacement: Replacement | Container | string | number | boolean = (
          typeof container === 'function'
            ? container
            : path.split('.').reduce(
              function (refinement: Container, element: string): Container {
                return refinement[element] as Container;
              },
              container
            )
        );

        // If the replacement value is a function,
        // call it to obtain a replacement value.

        if (typeof replacement === 'function') {
          replacement = replacement(path, encoding);
        }

        // If an encoder object was provided, call wun of its functions.
        // If the encoder is a function, call it.

        replacement = (
          typeof encoder === 'object'
            ? encoder[encoding]
            : encoder
        )(replacement, path, encoding);

        // If the replacement is a number or boolean, convert it to a string.

        if (
          typeof replacement === 'number'
          || typeof replacement === 'boolean'
        ) {
          replacement = String(replacement);
        }

        // If the replacement is a string, then do the substitution.
        // Otherwise, leave the symbolic variable in its original state.

        return (
          typeof replacement === 'string'
            ? replacement
            : original
        );

        // If anything goes wrong, then leave the symbolic variable
        // in its original state.

      } catch (ignore) {
        return original;
      }
    }
  );
});

export { fn as fulfill };
