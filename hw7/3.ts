/*
  9384 - Maximum
  -------
  by ch3cknull (@ch3cknull) #hard #array

  ### Question

  ### Description

  Implement the type `Maximum`, which takes an input type `T`, and returns the maximum value in `T`.

  If `T` is an empty array, it returns `never`. **Negative numbers** are not considered.

  For example:

  ```ts
  Maximum<[]> // never
  Maximum<[0, 2, 1]> // 2
  Maximum<[1, 20, 200, 150]> // 200
  ```

  ### Advanced

  Can you implement type `Minimum` inspired by `Maximum`?

  > View on GitHub: https://tsch.js.org/9384
*/

/* _____________ Your Code Here _____________ */

import {Equal} from "./test"

type Maximum<T extends any[], ArrNumber extends any[] = [], Elements = T[number]> =
    T extends [] ? never :
    Equal<Elements, ArrNumber['length']> extends true ? Elements :
    Maximum<T, [any, ...ArrNumber], Elements extends ArrNumber['length'] ? never : Elements>
