/*
  517 - Multiply
  -------
  by null (@uid11) #extreme #math #template-literal

  ### Question

  **This challenge continues from [476 - Sum](https://tsch.js.org/476), it is recommended that you finish that one first, and modify your code based on it to start this challenge.**

  Implement a type `Multiply<A, B>` that multiplies two non-negative integers and returns their product as a string. Numbers can be specified as string, number, or bigint.

  For example,

  ```ts
  type T0 = Multiply<2, 3> // '6'
  type T1 = Multiply<3, '5'> // '15'
  type T2 = Multiply<'4', 10> // '40'
  type T3 = Multiply<0, 16> // '0'
  type T4 = Multiply<'13', '21'> // '273'
  type T5 = Multiply<'43423', 321543n> // '13962361689'
  ```

  > View on GitHub: https://tsch.js.org/517
*/

/* _____________ Your Code Here _____________ */
type NumberLike = string | number | bigint
type ToString<N extends NumberLike> = `${N}`;

type Remaind10<T extends any[]> =
    T extends [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ...infer R] ?
    {
        remainder: ToString<R['length']>
        carry: '1'
    }
    : {
        remainder: ToString<T['length']>
        carry: '0'
    }


type Digit<T extends string, R extends any[] = []> =
    T extends `${number}` ?
    T extends `${R['length']}` ?
    R
    : Digit<T, [1, ...R]>
    : []


type DigitAdd<A extends any[], B extends any[], carry extends string = '0'> =
    Remaind10<[...A, ...B, ...carry extends '1' ?
        [1]
        : []]>

type SumInner<
    A extends string,
    B extends string,
    carry extends string = '0'
> =
    A extends `${infer AL}${infer AR}` ?
    B extends `${infer BL}${infer BR}` ?
    `${DigitAdd<Digit<AL>, Digit<BL>, carry>['remainder']
    }${SumInner<AR, BR, DigitAdd<Digit<AL>, Digit<BL>, carry>['carry']>
    }`
    : `${DigitAdd<Digit<AL>, Digit<carry>>['remainder']
    }${SumInner<AR, '0', DigitAdd<Digit<AL>, Digit<carry>>['carry']>
    }`
    : B extends `${infer BL}${infer BR}` ?
    `${DigitAdd<Digit<BL>, Digit<carry>>['remainder']
    }${SumInner<'', BR, DigitAdd<Digit<BL>, Digit<carry>>['carry']>
    }`
    : carry

type Reverse<T extends String> =
    T extends `${infer L}${infer R}` ?
    `${Reverse<R>}${L}`
    : ''

type Sum<A extends string, B extends string> =
    Reverse<SumInner<Reverse<A>, Reverse<B>>>

type MulNumToDigit<A extends string, B extends any[]> =
    B extends [1, ...infer Tail] ?
    Sum<A, MulNumToDigit<A, Tail>>
    : '0'

type TrimLeftZeroes<L extends string> =
    L extends `0${infer S}` ?
    TrimLeftZeroes<S>
    : L extends '' ? '0' : L

type Mul10<Num extends string> = `${Num}${Num extends '' ? '' : 0}`

type InnerMultiply<Left extends string, Right extends string, Res extends string = ''> =
    Right extends `${infer H}${infer T}` ?
    InnerMultiply<Left, T, Sum<Mul10<Res>, MulNumToDigit<Left, Digit<H>>>>
    : TrimLeftZeroes<Res>

type Multiply<
    Left extends NumberLike,
    Right extends NumberLike> = InnerMultiply<ToString<Left>, ToString<Right>>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from './test'

type cases = [
    Expect<Equal<Multiply<2, 3>, '6'>>,
    Expect<Equal<Multiply<3, '5'>, '15'>>,
    Expect<Equal<Multiply<'4', 10>, '40'>>,
    Expect<Equal<Multiply<0, 16>, '0'>>,
    Expect<Equal<Multiply<'13', '21'>, '273'>>,
    Expect<Equal<Multiply<'43423', 321543n>, '13962361689'>>,
    Expect<Equal<Multiply<9999, 1>, '9999'>>,
    Expect<Equal<Multiply<4325234, '39532'>, '170985150488'>>,
    Expect<Equal<Multiply<100_000n, '1'>, '100000'>>,
    Expect<Equal<Multiply<259, 9125385>, '2363474715'>>,
    Expect<Equal<Multiply<9, 99>, '891'>>,
    Expect<Equal<Multiply<315, '100'>, '31500'>>,
    Expect<Equal<Multiply<11n, 13n>, '143'>>,
    Expect<Equal<Multiply<728, 0>, '0'>>,
    Expect<Equal<Multiply<'0', 213>, '0'>>,
    Expect<Equal<Multiply<0, '0'>, '0'>>,
]