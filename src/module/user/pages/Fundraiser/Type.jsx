import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useCampaign from "@/hooks/useCampaign";
import { useFundraiseType } from "@/hooks/useFundraiseType";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Users,
  Heart,
  Building,
  Check,
  Info,
  Target,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/loading";
import { truncate } from "lodash";

let images = ["/you-self.png", "/someone-else.png", "/charity.png"];

const Type = () => {
  const { data, isLoading } = useFundraiseType();
  const { newCampaign, changeCampaignValue } = useCampaign();
  const [fundraiseTypes, setFundraiseTypes] = useState([]);
  const location = useLocation();
  const error = location.state?.error;

  const getTypeIcon = (index) => {
    const icons = [
      <Users className="w-5 h-5" />,
      <Heart className="w-5 h-5" />,
      <Building className="w-5 h-5" />,
    ];
    return icons[index] || <Target className="w-5 h-5" />;
  };

  useEffect(() => {
    let fds = data?.map((item, index) => {
      return {
        image: images[index],
        label: item.name,
        value: item.id,
        description: item.description,
        icon: getTypeIcon(index),
      };
    });
    setFundraiseTypes(fds);
  }, [data]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 md:px-10 py-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
          <LoadingSpinner message="Đang tải loại chiến dịch..." />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-6 md:px-10 py-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div variants={item} className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-4">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Chọn đối tượng thụ hưởng
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
          Bạn đang kêu gọi gây quỹ cho đối tượng nào?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Chọn đối tượng phù hợp để chúng tôi có thể hỗ trợ bạn tạo chiến dịch
          hiệu quả nhất
        </p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div variants={item}>
          <Alert
            variant="destructive"
            className="mb-6 border-destructive/50 bg-destructive/10"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Có lỗi xảy ra</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Types Selection */}
      <motion.div variants={item} className="max-w-3xl mx-auto">
        <ToggleGroup
          type="single"
          className="w-full flex flex-col gap-4"
          value={newCampaign.fundraiseTypeId}
          onValueChange={(value) =>
            changeCampaignValue("fundraiseTypeId", value)
          }
        >
          {fundraiseTypes?.map((typeItem, index) => (
            <motion.div
              key={typeItem.value}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <ToggleGroupItem
                className={`
                  relative w-full border-2 rounded-2xl text-base h-auto p-6 gap-6 flex justify-start
                  transition-all duration-300 group
                  hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10
                  data-[state=on]:border-primary data-[state=on]:bg-primary/10 
                  data-[state=on]:text-primary data-[state=on]:shadow-xl
                  data-[state=on]:shadow-primary/25
                `}
                value={typeItem.value}
                aria-label={`Select ${typeItem.label} fundraise type`}
              >
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 group-data-[state=on]:opacity-100 transition-opacity duration-300" />

                {/* Image Section */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={typeItem.image}
                      alt={typeItem.label}
                      className="w-full h-full object-cover"
                    />
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>

                  {/* Icon Badge */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary border-2 border-white shadow-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    {typeItem.icon}
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="flex-1 text-left min-w-0">
                  <motion.h3
                    className="font-bold text-lg md:text-xl mb-2 group-data-[state=on]:text-primary transition-colors duration-300"
                    whileHover={{ x: 5 }}
                  >
                    {typeItem.label}
                  </motion.h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {truncate(typeItem.description, { length: 76 })}
                  </p>

                  {/* Features list (if needed) */}
                  <motion.div
                    className="mt-3 opacity-0 group-hover:opacity-100 group-data-[state=on]:opacity-100 transition-all duration-300"
                    initial={{ height: 0 }}
                    whileHover={{ height: "auto" }}
                  >
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <Check className="w-3 h-3" />
                      <span>Phù hợp cho loại chiến dịch này</span>
                    </div>
                  </motion.div>
                </div>

                {/* Selection Indicator */}
                {newCampaign.fundraiseTypeId === typeItem.value && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-xl opacity-0 group-data-[state=on]:opacity-50 transition-opacity duration-500 -z-10" />
              </ToggleGroupItem>
            </motion.div>
          ))}
        </ToggleGroup>

        {/* Selected Confirmation */}
        {newCampaign.fundraiseTypeId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-primary">
                  Đã chọn:{" "}
                  {
                    fundraiseTypes?.find(
                      (t) => t.value === newCampaign.fundraiseTypeId
                    )?.label
                  }
                </h4>
                <p className="text-sm text-muted-foreground">
                  Bạn có thể thay đổi lựa chọn bất kỳ lúc nào
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          variants={item}
          className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-primary/5 rounded-2xl border border-blue-200/50"
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Lời khuyên khi chọn đối tượng
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • <strong>Cho bản thân:</strong> Phù hợp với chi phí y tế,
                  giáo dục cá nhân
                </li>
                <li>
                  • <strong>Cho người khác:</strong> Giúp đỡ gia đình, bạn bè
                  gặp khó khăn
                </li>
                <li>
                  • <strong>Từ thiện:</strong> Các dự án cộng đồng, tổ chức phi
                  lợi nhuận
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Type;
