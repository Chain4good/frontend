import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useCampaign from "@/hooks/useCampaign";
import { useFundraiseType } from "@/hooks/useFundraiseType";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

let images = ["/you-self.png", "/someone-else.png", "/charity.png"];
const Type = () => {
  const { data } = useFundraiseType();
  const { newCampaign, changeCampaignValue } = useCampaign();
  const [fundraiseTypes, setFundraiseTypes] = useState([]);
  const location = useLocation();
  const error = location.state?.error;

  useEffect(() => {
    let fds = data?.map((item, index) => {
      return {
        image: images[index],
        label: item.name,
        value: item.id,
        description: item.description,
      };
    });
    setFundraiseTypes(fds);
  }, [data]);

  return (
    <div className="px-20 w-full ">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="mb-4 text-2xl">
        <h2>Bạn đang kêu gọi gây quỹ cho đối tượng nào?</h2>
      </div>
      <div className="w-full">
        <ToggleGroup
          type="single"
          className="w-full flex flex-col gap-4"
          value={newCampaign.fundraiseTypeId}
          onValueChange={(value) =>
            changeCampaignValue("fundraiseTypeId", value)
          }
        >
          {fundraiseTypes?.map((item, index) => (
            <ToggleGroupItem
              className="w-full border rounded-2xl hover:bg-primary/10 h-fit p-4 gap-4 flex justify-start"
              key={item.value}
              value={item.value}
            >
              <img src={item.image} className="rounded-2xl w-20" />
              <div className="text-left font-thin">
                <h3>{item.label}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};

export default Type;
