import React, { Attributes, ReactNode } from 'react';

export function compareTwoString(str1: string, str2: string) {
  if (!str2.length) return true;
  return str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1;
}

export function addPropsToReactElement<T>(
  element: ReactNode,
  props?: Partial<T> & Attributes,
) {
  if (React.isValidElement(element)) {
    return React.cloneElement(element, props);
  }
  return element;
}

export function addPropsToChildren<T>(
  children: ReactNode,
  props?: Partial<T> & Attributes,
) {
  if (!Array.isArray(children)) {
    return addPropsToReactElement<T>(children, props);
  }
  return children.map((childElement) =>
    addPropsToReactElement<T>(childElement, props),
  );
}

export function arraysToDict(
  keys: Array<string | number>,
  values: Array<string | number>,
): Record<string | number, string | number> {
  return keys.reduce(
    (acc, key, index) => {
      acc[key] = values[index];
      return acc;
    },
    {} as Record<string | number, string | number>,
  );
}
