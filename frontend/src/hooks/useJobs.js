import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/api/client";
import { QUERY_KEYS } from "@/utils/constants";

export function useJobs() {
  const [search, setSearch] = useState("");
  const [workMode, setWorkMode] = useState("all");
  const [sort, setSort] = useState("match_score");

  const query = useQuery({
    queryKey: [QUERY_KEYS.JOBS],
    queryFn: getJobs,
    refetchOnMount: false,
  });

  const jobs = useMemo(() => query.data || [], [query.data]);

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const term = search.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        job.title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term);
      const matchesWorkMode = workMode === "all" || job.work_mode === workMode;
      return matchesSearch && matchesWorkMode;
    });

    result = [...result].sort((a, b) => {
      if (sort === "match_score") return b.match_score - a.match_score;
      if (sort === "newest") return new Date(b.posted_at) - new Date(a.posted_at);
      if (sort === "salary") {
        const aSalary = a.salary_max ?? -1;
        const bSalary = b.salary_max ?? -1;
        return bSalary - aSalary;
      }
      return 0;
    });

    return result;
  }, [jobs, search, workMode, sort]);

  return {
    jobs,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    filteredJobs,
    search,
    setSearch,
    workMode,
    setWorkMode,
    sort,
    setSort,
  };
}
