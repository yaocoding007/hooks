import { useState, useMemo } from 'react';

/**
 * 定义类型有两种方式：
 * interface 和 type alias 类型别名
 * interface 只能定义对象类型
 *    可以实现接口的extends/ implements  merge
 *    type alias 没有办法实现这些功能
 * type 定义 组合类型??、交叉类型 ??、原始类型??
 */

/**
 * 组合类型(联合类型)??
 *   只能访问联合类型的所有类型里共有的成员
 *   function foo(value: string, type: string | number) {}
 *   需要类型保护！！！
 *     类型断言 (<Fish>pet).swim()
 *     自定义的类型守卫
 *     typeof 类型守卫
 *     instanceof 类型守卫
 *
 * 交叉类型?? 多个类型合并为一个类型， 包含了所需的所有类型的特性
 *   <First & Second>
 *
 * 原始类型?? type Name = string;
 */

type IState = string | number | boolean | undefined;

export interface Actions<T = IState> {
  setLeft: () => void;
  setRight: () => void;
  toggle: (value?: T) => void;
}

function useToggle<T = boolean | undefined>(): [boolean, Actions<T>];

function useToggle<T = IState>(defaultValue: T): [T, Actions<T>];

function useToggle<T = IState, U = IState>(
  defaultValue: T,
  reverseValue: U,
): [T | U, Actions<T | U>];

function useToggle<
  D extends IState = IState /* extends 是必须这么写吗？ */,
  R extends IState = IState
>(defaultValue: D = false as D, reverseValue?: R) {
  const [state, setState] = useState<D | R>(defaultValue);
  const reverseValueOrigin = useMemo(
    () => (reverseValue === undefined ? !defaultValue : reverseValue) as D | R, // as 断言
    [reverseValue],
  );

  const actions = useMemo(() => {
    // 切换返回值
    const toggle = (value?: D | R) => {
      // 强制返回状态值，适用于点击操作
      if (value !== undefined) {
        setState(value);
        return;
      }
      setState((s) => (s === defaultValue ? reverseValueOrigin : defaultValue));
    };
    // 设置默认值
    const setLeft = () => setState(defaultValue);
    // 设置取反值
    const setRight = () => setState(reverseValueOrigin);
    return {
      toggle,
      setLeft,
      setRight,
    };
  }, [setState]);

  return [state, actions];
}

export default useToggle;
