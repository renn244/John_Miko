import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useMemo, useState } from 'react';

type InputListProps = {
  value: string[];
  onChange: (value: string[]) => void;
  invalid?: boolean;
  addPlaceholder?: string;
  itemPlaceholder?: string;
  emptyDescription?: string;
  listHeading?: string;
};

const normalize = (text: string) => text.trim();

const InputList = ({
  value,
  onChange,
  invalid = false,
  addPlaceholder = 'Type and press Enter',
  itemPlaceholder = 'Enter value',
  emptyDescription = "No items added yet. Start by typing a value and clicking 'Add'.",
  listHeading = 'Added Items',
}: InputListProps) => {
  const [draft, setDraft] = useState('');

  const normalizedValue = useMemo(() => value.map((v) => v ?? ''), [value]);

  const addDraft = () => {
    const nextValue = normalize(draft);
    if (!nextValue) return;

    onChange([...normalizedValue, nextValue]);
    setDraft('');
  };

  const updateAt = (index: number, next: string) => {
    const updated = [...normalizedValue];
    updated[index] = next;
    onChange(updated);
  };

  const removeAt = (index: number) => {
    onChange(normalizedValue.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex gap-3 mb-4">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addDraft();
            }
          }}
          aria-invalid={invalid}
          placeholder={addPlaceholder}
        />

        <Button type="button" onClick={addDraft}>
          Add
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {normalizedValue.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
            {listHeading} ({normalizedValue.length}):
          </p>

          <div className="space-y-2">
            {normalizedValue.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateAt(index, e.target.value)}
                  aria-invalid={invalid}
                  placeholder={itemPlaceholder}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeAt(index)}
                  aria-label="Remove"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-sm text-muted-foreground">{emptyDescription}</p>
        </div>
      )}
    </>
  );
};

InputList.displayName = 'InputList';

export { InputList };
