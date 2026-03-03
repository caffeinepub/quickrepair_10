import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContactInquiry, MechanicApplication } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactInquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllApplications() {
  const { actor, isFetching } = useActor();
  return useQuery<MechanicApplication[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      email: string;
      serviceType: string;
      address: string;
      description: string;
      preferredTime: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitInquiry(
        data.name,
        data.phone,
        data.email,
        data.serviceType,
        data.address,
        data.description,
        data.preferredTime,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

export function useSubmitApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      dateOfBirth: string;
      phone: string;
      serviceType: string;
      experience: string;
      address: string;
      motivation: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitApplication(
        data.name,
        data.dateOfBirth,
        data.phone,
        data.serviceType,
        data.experience,
        data.address,
        data.motivation,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
