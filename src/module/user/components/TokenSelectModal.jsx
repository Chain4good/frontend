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
import { useEffect, useState } from "react";

const TokenSelectModal = ({ onSelect, selectedToken, campaignAcceptToken }) => {
  const [open, setOpen] = useState(false);

  const getTokenByAddress = (address) => {
    if (!address) return null;
    const match = Object.entries(TOKEN).find(
      ([_, token]) => token.address.toLowerCase() === address.toLowerCase()
    );
    return match ? { id: match[0], ...match[1] } : null;
  };

  useEffect(() => {
    if (campaignAcceptToken) {
      const acceptedToken = getTokenByAddress(campaignAcceptToken);
      if (acceptedToken) {
        onSelect(acceptedToken);
      }
    }
  }, [campaignAcceptToken]);

  const handleSelect = (token) => {
    onSelect(token);
    setOpen(false);
  };

  const tokens = Object.entries(TOKEN)
    .filter(
      ([_, token]) =>
        !campaignAcceptToken ||
        token.address.toLowerCase() === campaignAcceptToken.toLowerCase()
    )
    .map(([id, token]) => ({
      id,
      name: token.name || id,
      symbol: token.symbol || id,
      icon: token.icon || "/icons/default-token.svg",
      description: token.description || `${id} token`,
      address: token.address,
      decimals: token.decimals,
    }));

  const selectedTokenInfo =
    tokens.find((t) => t.id === selectedToken) || tokens[0];

  const isLocked = campaignAcceptToken && tokens.length === 1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          disabled={isLocked}
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
          {!isLocked && <ChevronDown className="h-4 w-4 opacity-50" />}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {campaignAcceptToken
              ? "Token được chấp nhận cho chiến dịch này"
              : "Chọn token cho chiến dịch"}
          </DialogTitle>
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
