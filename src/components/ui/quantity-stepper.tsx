import { Button } from "@/components/ui/button";

type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  increaseLabel: string;
  decreaseLabel: string;
};

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  increaseLabel,
  decreaseLabel,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDecrement}
        aria-label={decreaseLabel}
      >
        -
      </Button>
      <span className="min-w-6 text-center text-sm text-text">{quantity}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onIncrement}
        aria-label={increaseLabel}
      >
        +
      </Button>
    </div>
  );
}
