import { Input } from "@/components/ui/input";
import {
  Delete,
  Search as SearchIcon,
  SearchX,
  Loader2,
  Filter,
  TrendingUp,
  History,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "@/services/campaignService";
import ListCampaign from "@/components/ListCampaign";
import { Skeleton } from "@/components/ui/skeleton";
import FilterCampaign from "@/components/FilterCampaign";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const Search = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    fundraiseTypeId: undefined,
    categoryId: undefined,
    status: undefined,
    countryId: undefined,
    sort: undefined,
    sortBy: undefined,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const searchContainerRef = useRef(null);

  // Trending searches mock data
  const trendingSearches = [
    "Trẻ em vùng cao",
    "Người già neo đơn",
    "Bệnh hiểm nghèo",
    "Học bổng",
    "Môi trường",
  ];

  const saveToHistory = (term) => {
    if (!term.trim()) return;
    const newHistory = [term, ...searchHistory.filter((h) => h !== term)].slice(
      0,
      5
    );
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      if (searchValue.trim()) {
        saveToHistory(searchValue);
      }
      setFilters((prev) => ({
        ...prev,
        search: searchValue,
        page: 1,
      }));
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleSearchClick = (term) => {
    setSearchTerm(term);
    setShowHistory(false);
    debouncedSearch(term);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowHistory(false);
    debouncedSearch.cancel();
    setFilters((prev) => ({
      ...prev,
      search: "",
      page: 1,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const renderEmptyState = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="flex justify-center mb-4">
          <SearchX className="h-20 w-20 text-muted-foreground/50" />
        </div>
        <h3 className="text-2xl font-medium mb-3">
          Không tìm thấy kết quả nào
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả của bạn
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {trendingSearches.map((term) => (
            <Badge
              key={term}
              variant="outline"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleSearchClick(term)}
            >
              {term}
            </Badge>
          ))}
        </div>
      </motion.div>
    );
  };

  const { data: searchResult, isFetching } = useQuery({
    queryKey: ["search", filters],
    queryFn: () => getCampaigns(filters),
  });

  const renderLoadingState = () => {
    return (
      <div className="md:max-w-7xl md:p-0 p-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg overflow-hidden border bg-card"
            >
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const onClearFilters = () => {
    setSearchTerm("");
    setFilters((prev) => ({
      ...prev,
      page: 1,
      limit: 10,
      search: undefined,
      fundraiseTypeId: undefined,
      categoryId: undefined,
      status: undefined,
      countryId: undefined,
      sort: undefined,
      sortBy: undefined,
    }));
  };

  return (
    <>
      <Helmet>
        <title>
          {searchTerm
            ? `Tìm kiếm: ${searchTerm} | Chain4Good`
            : "Tìm kiếm chiến dịch | Chain4Good"}
        </title>
        <meta
          name="description"
          content="Tìm kiếm các chiến dịch từ thiện, tổ chức gây quỹ và phi lợi nhuận trên Chain4Good. Khám phá và quyên góp cho những dự án phù hợp với bạn."
        />
        <meta
          property="og:title"
          content={
            searchTerm
              ? `Tìm kiếm: ${searchTerm} | Chain4Good`
              : "Tìm kiếm chiến dịch | Chain4Good"
          }
        />
        <meta
          property="og:description"
          content="Tìm kiếm các chiến dịch từ thiện, tổ chức gây quỹ và phi lợi nhuận trên Chain4Good. Khám phá và quyên góp cho những dự án phù hợp với bạn."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <div className="container mx-auto pt-14">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-4 mb-12"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Tìm kiếm các tổ chức gây quỹ
            </h1>
            <p className="text-base text-muted-foreground">
              Tìm người gây quỹ theo tên, địa điểm, chức danh hoặc từ khóa của
              người đó
            </p>
          </motion.div>

          <div
            className="max-w-2xl mx-auto mb-8 relative"
            ref={searchContainerRef}
          >
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowHistory(true)}
                placeholder="Tìm kiếm chiến dịch..."
                className="h-14 pl-12 pr-24 text-lg rounded-full bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary transition-colors"
              />
              {searchTerm && (
                <Button
                  onClick={handleClearSearch}
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>

            <AnimatePresence>
              {showHistory &&
                (searchHistory.length > 0 || trendingSearches.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute w-full mt-2 bg-background rounded-lg border shadow-lg z-50"
                  >
                    <ScrollArea className="h-[300px]">
                      {searchHistory.length > 0 && (
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <History className="w-4 h-4" />
                              <span>Tìm kiếm gần đây</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearHistory}
                              className="text-xs hover:text-destructive"
                            >
                              Xóa lịch sử
                            </Button>
                          </div>
                          <div className="space-y-1">
                            {searchHistory.map((term) => (
                              <Button
                                key={term}
                                variant="ghost"
                                className="w-full justify-start text-left"
                                onClick={() => handleSearchClick(term)}
                              >
                                {term}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="p-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>Xu hướng tìm kiếm</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {trendingSearches.map((term) => (
                            <Badge
                              key={term}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => handleSearchClick(term)}
                            >
                              {term}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mx-auto">
          <div className="md:max-w-7xl md:p-0 p-4 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FilterCampaign
                filters={filters}
                setFilters={setFilters}
                onClearFilters={onClearFilters}
              />
            </motion.div>

            {isFetching ? (
              renderLoadingState()
            ) : (
              <>
                {searchResult?.meta?.total === 0 && (
                  <div id="search-list">{renderEmptyState()}</div>
                )}
                {searchResult?.data?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {searchTerm && (
                      <p className="font-semibold text-[20px] mb-6 leading-6">
                        {searchResult?.meta?.total} kết quả tìm kiếm cho "
                        <span className="text-primary">{searchTerm}</span>"
                      </p>
                    )}

                    <ListCampaign campaigns={searchResult?.data} />
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Search;
