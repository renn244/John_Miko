import { closureApi } from "@/features/shared/closures/api/closure.api";
import { useQuery } from "@tanstack/react-query";

export const useGetClosuresQuery = (mode: 'withGlobal' | 'specific', accommodationId?: string) =>
  useQuery({
    queryKey: ['closure', 'get', mode, accommodationId],
    queryFn: () => closureApi.getClosuresByAccommodationId(mode, accommodationId),
    refetchOnWindowFocus: false,
  });

export const useGetClosureByDate = (accommodationId: string | undefined, date?: string) =>
  useQuery({
    queryKey: ['closure', 'get', 'byDate', accommodationId, date],
    queryFn: () => closureApi.getClosureByDate(accommodationId ?? undefined, date!),
    enabled: !!date,
    refetchOnWindowFocus: false,
  });

export const useGetResortClosureByDate = (date?: string) =>
  useQuery({
    queryKey: ['closure', 'get', 'resortByDate', date],
    queryFn: () => closureApi.getResortClosureByDate(date!),
    enabled: !!date,
    refetchOnWindowFocus: false,
  });
