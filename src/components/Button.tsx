import { clsx } from 'clsx';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Link } from 'react-router';

type ButtonVariant = 'primary' | 'primary-small' | 'secondary' | 'outline';

interface BaseProps {
  variant: ButtonVariant;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = BaseProps &
  Omit<ComponentPropsWithRef<'button'>, keyof BaseProps> & { href?: never };

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithRef<'a'>, keyof BaseProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const BASE_CLASS =
  'inline-flex shrink-0 items-center justify-center rounded-lg whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'h-12 text-caption bg-primary text-white',
  'primary-small': 'h-9 text-body2 bg-primary text-white',
  secondary: 'h-12 text-caption bg-light-gray text-text-secondary',
  outline: 'h-9 text-body2 border border-text-subtitle text-text-subtitle',
};

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant, className, href, ...rest } = props;
    // Link는 다른 출처의 주소(구매하기)는 클릭을 가로채지 않아 일반 <a>처럼 동작한다.
    return (
      <Link to={href} className={clsx(BASE_CLASS, VARIANT_CLASS[variant], className)} {...rest} />
    );
  }

  const { variant, className, type = 'button', ...rest } = props;
  return (
    <button type={type} className={clsx(BASE_CLASS, VARIANT_CLASS[variant], className)} {...rest} />
  );
}
