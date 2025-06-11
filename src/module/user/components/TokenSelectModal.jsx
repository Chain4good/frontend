import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TOKEN } from "@/hooks/useCharityDonation";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

const TokenSelectModal = ({ onSelect, selectedToken }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (token) => {
    onSelect(token); // Truyền toàn bộ token object
    setOpen(false);
  };

  // Convert TOKEN object to array with id and additional info
  const tokens = Object.entries(TOKEN).map(([id, token]) => ({
    id,
    name: token.name || id, // Fallback to id if name not provided
    symbol: token.symbol || id,
    icon: token.icon || "/icons/default-token.svg",
    description: token.description || `${id} token`,
    address: token.address,
    decimals: token.decimals,
  }));

  // Get selected token info
  const selectedTokenInfo =
    tokens.find((t) => t.id === selectedToken) || tokens[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <img
              src={selectedTokenInfo?.icon}
              alt={selectedTokenInfo?.symbol}
              className="w-6 h-6"
            />
            <span className="font-medium">{selectedTokenInfo?.name}</span>
            <span className="text-sm text-muted-foreground">
              ({selectedTokenInfo?.symbol})
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chọn token cho chiến dịch</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {tokens.map((token) => (
            <button
              key={token.id}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border transition-all",
                "hover:border-primary hover:bg-accent/50",
                selectedToken === token.id &&
                  "border-primary bg-accent ring-2 ring-primary/10"
              )}
              onClick={() => handleSelect(token)}
            >
              <img src={token.icon} alt={token.name} className="w-8 h-8" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{token.name}</h4>
                  <span className="text-sm text-muted-foreground">
                    ({token.symbol})
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {token.description}
                </p>
              </div>
              {selectedToken === token.id && (
                <div className="size-5 rounded-full bg-primary grid place-items-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelectModal;
