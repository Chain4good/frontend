import { Input } from "@/components/ui/input";
import { Delete, Search as SearchIcon, SearchX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "@/services/campaignService";
import ListCampaign from "@/components/ListCampaign";
import { Skeleton } from "@/components/ui/skeleton";
import FilterCampaign from "@/components/FilterCampaign";
import { Helmet } from "react-helmet-async";

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
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

  const handleClearSearch = () => {
    setSearchTerm("");
    debouncedSearch.cancel();
    setFilters((prev) => ({
      ...prev,
      search: "",
      page: 1,
    }));
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const renderEmptyState = () => {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-4">
          <SearchX className="h-16 w-16 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-medium mb-2">Không tìm thấy kết quả nào</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả của bạn
        </p>
      </div>
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
            <div
              key={index}
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
            </div>
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

      <main className="min-h-screen">
        <div className="container mx-auto pt-14">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h1 className="text-3xl font-semibold">
              Tìm kiếm các tổ chức gây quỹ và phi lợi nhuận
            </h1>
            <p className="text-base text-muted-foreground">
              Tìm người gây quỹ theo tên, địa điểm, chức danh hoặc từ khóa của
              người đó
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm chiến dịch..."
                className="h-14 pl-12 pr-24 text-lg rounded-full bg-background border-muted-foreground/20 hover:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary transition-colors"
              />
              {searchTerm && (
                <Button
                  onClick={handleClearSearch}
                  variant="text"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10"
                >
                  <Delete size={32} strokeWidth={1.25} />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="mx-auto">
          <div className="md:max-w-7xl md:p-0 p-4 mx-auto">
            <FilterCampaign
              filters={filters}
              setFilters={setFilters}
              onClearFilters={onClearFilters}
            />
            {isFetching ? (
              renderLoadingState()
            ) : (
              <>
                {searchResult?.meta?.total === 0 && (
                  <div id="search-list">{renderEmptyState()}</div>
                )}
                {/* {!searchTerm && (
              <div className="text-center py-16 text-muted-foreground">
                Nhập từ khóa để bắt đầu tìm kiếm
              </div>
            )} */}
                {searchResult?.data?.length > 0 && (
                  <>
                    {searchTerm && (
                      <p className="font-semibold text-[20px] mb-6 leading-6">
                        {searchResult?.meta?.total} kết quả tìm kiếm cho "
                        {searchTerm}"
                      </p>
                    )}

                    <ListCampaign campaigns={searchResult?.data} />
                  </>
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
