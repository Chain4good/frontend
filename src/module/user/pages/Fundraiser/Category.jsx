import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useCampaign from "@/hooks/useCampaign";
import { useCategory } from "@/hooks/useCategory";
import { useCountry } from "@/hooks/useCountry";
import {
  AlertCircle,
  MapPin,
  Grid3X3,
  Globe,
  Tag,
  Check,
  Sparkles,
  Heart,
  Users,
  GraduationCap,
  Stethoscope,
  Home,
  Briefcase,
  Shield,
  Info,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { truncate } from "lodash";

const Category = () => {
  const { data: categories, isLoading } = useCategory();
  const { data: countries, isLoading: isLoadingCountry } = useCountry();
  const { newCampaign, changeCampaignValue } = useCampaign();
  const location = useLocation();
  const error = location.state?.error;

  const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes("giáo dục") || name.includes("education"))
      return <GraduationCap className="w-4 h-4" />;
    if (
      name.includes("y tế") ||
      name.includes("medical") ||
      name.includes("sức khỏe")
    )
      return <Stethoscope className="w-4 h-4" />;
    if (name.includes("từ thiện") || name.includes("charity"))
      return <Heart className="w-4 h-4" />;
    if (name.includes("cộng đồng") || name.includes("community"))
      return <Users className="w-4 h-4" />;
    if (name.includes("nhà ở") || name.includes("housing"))
      return <Home className="w-4 h-4" />;
    if (name.includes("kinh doanh") || name.includes("business"))
      return <Briefcase className="w-4 h-4" />;
    if (name.includes("bảo vệ") || name.includes("protection"))
      return <Shield className="w-4 h-4" />;
    return <Tag className="w-4 h-4" />;
  };

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

  if (isLoading || isLoadingCountry) {
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
          <LoadingSpinner message="Đang tải danh mục và quốc gia..." />
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
          <Grid3X3 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Phân loại chiến dịch
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
          Thông tin chi tiết chiến dịch
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Chọn danh mục và địa điểm phù hợp để giúp mọi người hiểu rõ hơn về
          chiến dịch của bạn
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

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Location Section */}
        <motion.div variants={item} className="space-y-4">
          <div className="relative p-6 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Icon decoration */}
            <div className="absolute top-4 right-4">
              <motion.div
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Globe className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Khu vực sử dụng quỹ
                </h3>
                <p className="text-sm text-muted-foreground">
                  Chọn nơi bạn muốn rút khoản tiền quyên góp
                </p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Select
                value={newCampaign.countryId}
                onValueChange={(value) =>
                  changeCampaignValue("countryId", value)
                }
              >
                <SelectTrigger className="w-full h-12 border-2 hover:border-primary/50 focus:border-primary transition-colors">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <SelectValue placeholder="Chọn quốc gia/khu vực" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem
                      value={country.id}
                      key={country.id}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary/20 rounded-full" />
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {newCampaign.countryId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Check className="w-4 h-4" />
                  <span>
                    Đã chọn:{" "}
                    {
                      countries?.find((c) => c.id === newCampaign.countryId)
                        ?.name
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Category Section */}
        <motion.div variants={item} className="space-y-4">
          <div className="relative p-6 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Icon decoration */}
            <div className="absolute top-4 right-4">
              <motion.div
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Tag className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Danh mục chiến dịch
                </h3>
                <p className="text-sm text-muted-foreground">
                  Mô tả nào phù hợp nhất với lý do bạn kêu gọi gây quỹ?
                </p>
              </div>
            </div>

            <ToggleGroup
              type="single"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
              value={newCampaign.categoryId}
              onValueChange={(value) =>
                changeCampaignValue("categoryId", value)
              }
            >
              {categories?.data?.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ToggleGroupItem
                    variant="outline"
                    className={`
                      relative w-full h-auto p-4 rounded-xl border-2 transition-all duration-300
                      hover:border-primary/50 hover:bg-primary/5 hover:shadow-md
                      data-[state=on]:border-primary data-[state=on]:bg-primary/10 
                      data-[state=on]:text-primary data-[state=on]:shadow-lg
                      data-[state=on]:shadow-primary/25
                    `}
                    value={category.id}
                    aria-label={`Select ${category.name} category`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={category.icon}
                          alt={category.name}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">
                          {truncate(category.name, { length: 21 })}
                        </div>
                        {category.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selected indicator */}
                    {newCampaign.categoryId === category.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </ToggleGroupItem>
                </motion.div>
              ))}
            </ToggleGroup>

            {newCampaign.categoryId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Check className="w-4 h-4" />
                  <span>
                    Đã chọn danh mục:{" "}
                    {
                      categories?.data?.find(
                        (c) => c.id === newCampaign.categoryId
                      )?.name
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          variants={item}
          className="p-6 bg-gradient-to-r from-blue-50 to-primary/5 rounded-2xl border border-blue-200/50"
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Mẹo chọn danh mục phù hợp
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Chọn danh mục phù hợp nhất với mục đích chiến dịch</li>
                <li>
                  • Danh mục giúp người quyên góp dễ dàng tìm thấy chiến dịch
                </li>
                <li>• Địa điểm rõ ràng tăng niềm tin của người quyên góp</li>
                <li>
                  • Thông tin chính xác giúp chiến dịch được ưu tiên hiển thị
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Category;
