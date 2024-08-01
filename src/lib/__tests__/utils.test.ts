import {cn} from '../utils';

describe('cn', () => {
    it('combines multiple class names', () => {
        const result = cn('class1', 'class2');
        expect(result).toBe('class1 class2');
    });

    it('merges Tailwind class names correctly', () => {
        const result = cn('bg-red-500', 'bg-blue-500');
        expect(result).toBe('bg-blue-500');
    });

    it('handles conditional class names', () => {
        const result = cn('class1', false && 'class2', 'class3');
        expect(result).toBe('class1 class3');
    });

    it('handles empty inputs', () => {
        const result = cn();
        expect(result).toBe('');
    });

    it('handles undefined and null inputs', () => {
        const result = cn('class1', undefined, null, 'class2');
        expect(result).toBe('class1 class2');
    });

    it('handles array inputs', () => {
        const result = cn(['class1', 'class2'], 'class3');
        expect(result).toBe('class1 class2 class3');
    });
});
