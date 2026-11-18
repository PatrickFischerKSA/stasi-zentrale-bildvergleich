import type { ButtonHTMLAttributes } from 'react';
export function Button({variant, size, className='', ...props}: ButtonHTMLAttributes<HTMLButtonElement> & {variant?: 'ink' | 'outline'; size?: 'sm'}) {
 return <button type="button" className={`inline-flex items-center justify-center gap-2 rounded-sm border px-3 py-2 text-sm hover:opacity-75 disabled:opacity-50 [&_svg]:size-4 ${variant==='ink' ? 'bg-ink text-ink-foreground' : 'bg-background'} ${size==='sm' ? 'text-xs' : ''} ${className}`} {...props}/>;
}
