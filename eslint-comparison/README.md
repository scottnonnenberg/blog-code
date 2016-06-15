# Post: ESLint Part 3: Comparison

https://blog.scottnonnenberg.com/eslint-part-3-comparison/

These are the sub-projects I used to generate the configuration comparison table in the post. You can do the comparisons yourself by running an `npm install` in your target comparison directories, then using [`@scottnonnenberg/eslint-compare-config`](https://github.com/scottnonnenberg/eslint-compare-config) to do the comparison:

```bash
npm install -g @scottnonnenberg/eslint-compare-config
cd eslint-comparison
eslint-compare-config airbnb defaults --score
eslint-compare-config airbnb defaults
```

Enjoy
