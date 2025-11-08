import { describe, it, expect, jest } from '@jest/globals';

describe('Test', () => {
  it('should call save', async () => {
    const mockSave = jest.fn().mockResolvedValue(true);
    const obj = {
      save: mockSave,
      value: 1
    };

    obj.value = 2;
    await obj.save();

    expect(mockSave).toHaveBeenCalled();
  });
});