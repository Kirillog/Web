/*
  9898 - Appear only once
  -------
  by X.Q. Chen (@brenner8023) #medium

  ### Question

  Find the elements in the target array that appear only once. For example：input: `[1,2,2,3,3,4,5,6,6,6]`，ouput: `[1,4,5]`.

  > View on GitHub: https://tsch.js.org/9898
*/

/* _____________ Your Code Here _____________ */

type FindEles<T extends any[], Seen = never> =
    T extends [infer Head, ...infer R] ?
    (Head extends Seen ?
        FindEles<R, Seen>
        : (Head extends R[number] ?
            FindEles<R, Seen | Head>
            : [Head, ...FindEles<R, Seen | Head>]))
    : []

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from './test'
type A = FindEles<[2, 2, 3, 3, 6, 6, 6]>;

type cases = [
  Expect<Equal<FindEles<[1, 2, 2, 3, 3, 4, 5, 6, 6, 6]>, [1, 4, 5]>>,
  Expect<Equal<FindEles<[2, 2, 3, 3, 6, 6, 6]>, []>>,
  Expect<Equal<FindEles<[1, 2, 3]>, [1, 2, 3]>>,
]