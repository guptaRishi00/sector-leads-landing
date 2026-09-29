'use client';

import type * as React from 'react';
import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useMemo,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Info } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { Label } from './label';
import { Separator } from './separator';

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'flex flex-col gap-6',
        'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className,
      )}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'mb-3 font-medium',
        'data-[variant=legend]:text-base',
        'data-[variant=label]:text-sm',
        className,
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4',
        className,
      )}
      {...props}
    />
  );
}

// Adapted: an invalid field keeps its label in the foreground colour; only the control
// edge and the error message turn red (upstream reds the whole field).
const fieldVariants = cva('group/field flex w-full gap-3', {
  variants: {
    orientation: {
      vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
      horizontal: [
        'flex-row items-center',
        '[&>[data-slot=field-label]]:flex-auto',
        'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      ],
      responsive: [
        'flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto',
        '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
        '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      ],
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

function FieldRoot({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-content"
      className={cn('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4',
        'has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10',
        className,
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        'text-[13px] leading-normal font-normal text-muted-foreground group-has-[[data-orientation=horizontal]]/field:text-balance',
        'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
        className,
      )}
      {...props}
    />
  );
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        'relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2',
        className,
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (!errors?.length) {
      return null;
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message;
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
      </ul>
    );
  }, [children, errors]);

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn('text-[13px] font-normal text-destructive', className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  FieldRoot,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};

interface FieldControlProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
  'aria-required'?: boolean | 'true' | 'false';
}

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  id?: string;
  layout?: 'stack' | 'inline';
  className?: string;
  children: ReactElement<FieldControlProps>;
}

// A labelled control: wires the id, aria-describedby (hint, then error), aria-invalid and
// aria-required onto its single child. `inline` puts a checkbox or switch before the label.
export function Field({
  label,
  hint,
  error,
  required = false,
  id,
  layout = 'stack',
  className,
  children,
}: FieldProps) {
  const generatedId = useId();
  const child = Children.only(children);
  // A child element passed in from a server component can arrive as a lazy reference with no props.
  const childProps: FieldControlProps = isValidElement<FieldControlProps>(child) ? child.props : {};
  const controlId = id ?? childProps.id ?? `field-${generatedId}`;
  const hintId = hint !== undefined ? `${controlId}-hint` : undefined;
  const errorId = error !== undefined ? `${controlId}-error` : undefined;
  const describedBy =
    [childProps['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  const control = isValidElement<FieldControlProps>(child)
    ? cloneElement(child, {
        id: controlId,
        ...(describedBy !== undefined && { 'aria-describedby': describedBy }),
        ...(error !== undefined && { 'aria-invalid': true }),
        ...(required && { 'aria-required': true }),
      })
    : child;

  const labelNode = (
    <FieldLabel htmlFor={controlId}>
      {label}
      {required && (
        <span aria-hidden="true" className="-ml-1.5 text-destructive">
          *
        </span>
      )}
    </FieldLabel>
  );

  // The error is described by the control, not announced as an alert, so it is read
  // when the field is focused rather than interrupting.
  const messages = (
    <>
      {hint !== undefined && <FieldDescription id={hintId}>{hint}</FieldDescription>}
      {error !== undefined && (
        <FieldError id={errorId} role={undefined} className="flex items-start gap-1.5">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>{error}</span>
        </FieldError>
      )}
    </>
  );

  if (layout === 'inline') {
    return (
      <FieldRoot orientation="horizontal" className={cn('items-start gap-2.5', className)}>
        <div className="flex h-5 items-center">{control}</div>
        <FieldContent className="gap-1">
          {labelNode}
          {messages}
        </FieldContent>
      </FieldRoot>
    );
  }

  return (
    <FieldRoot className={cn('min-w-0 gap-2', className)}>
      {labelNode}
      {control}
      {messages}
    </FieldRoot>
  );
}
