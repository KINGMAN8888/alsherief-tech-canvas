import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn (class merging utility)', () => {
    it('merges simple class strings', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('deduplicates conflicting Tailwind classes (last wins)', () => {
        // tailwind-merge resolves p-2 vs p-4: last one wins
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('handles conditional classes', () => {
        const isActive = true;
        expect(cn('base', isActive && 'active')).toBe('base active');
        expect(cn('base', !isActive && 'inactive')).toBe('base');
    });

    it('ignores falsy values', () => {
        expect(cn('a', undefined, null, false, 'b')).toBe('a b');
    });

    it('handles array syntax', () => {
        expect(cn(['a', 'b'], 'c')).toBe('a b c');
    });

    it('handles object syntax', () => {
        expect(cn({ active: true, hidden: false })).toBe('active');
    });

    it('returns empty string for no arguments', () => {
        expect(cn()).toBe('');
    });

    it('merges text color conflicts', () => {
        expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });
});
