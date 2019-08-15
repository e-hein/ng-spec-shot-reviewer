ng spec shot reviewer
=====================

support reviewing results of [protractor-image-comparison](https://www.npmjs.com/package/protractor-image-comparison) tests

usage variant a) global installation:
-------------------------------------
```shell
npm i -g ng-spec-shot-reviewer
cd <root-of-your-project-with-test-results>
ng e2e
ng-spec-shot-reviewer
```

usage variant b) local installation:
------------------------------------
```shell
npm i --save-dev ng-spec-shot-reviewer
```
add a script to your package.json e.g.:
```json
{
  (...)
  "scripts": {
    (...)
    "e2e": "ng e2e",
    "protractor": "protractor ./e2e/protractor.standalone.conf.js",
    "review": "ng-spec-shot-reviewer"
  }
  (...)
}
```
and run the script:
```shell
npm run review
```

finally:
--------
open your browser at [http://localhost:8090/spec-shot-reviewer/en](http://localhost:8090/spec-shot-reviewer/en)

more description coming soon ...
