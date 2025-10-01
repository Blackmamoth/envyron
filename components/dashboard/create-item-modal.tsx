import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createServiceMutationOptions } from "@/lib/queryOptions/service";
import { createTemplateMutationOptions } from "@/lib/queryOptions/template";
import { createItemSchema, createProjectSchema } from "@/lib/validation";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Template } from "@/types";
import type z from "zod";
import { createProjectMutationOptions } from "@/lib/queryOptions/project";

type Props = {
  activeTab: string;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>;
  templates: Template[];
};

export default function CreateItemModal({
  activeTab,
  isCreateModalOpen,
  setIsCreateModalOpen,
  templates,
}: Props) {
  const router = useRouter();

  const schema =
    activeTab === "projects" ? createProjectSchema : createItemSchema;

  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const queryClient = useQueryClient();

  const createServiceMutation = useMutation({
    ...createServiceMutationOptions(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success(response.message);
      router.push(`/services/editor/${response.service.id}`);
    },
    onError: (response) => {
      toast.error(response.message);
    },
  });

  const createTemplateMutation = useMutation({
    ...createTemplateMutationOptions(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(response.message);
      router.push(`/templates/builder/${response.template.id}`);
    },
    onError: (response) => {
      toast.error(response.message);
    },
  });

  const createProjectMutation = useMutation({
    ...createProjectMutationOptions(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(response.message);
      router.push(`/projects/workspace/${response.project.id}`);
    },
    onError: (response) => {
      toast.error(response.message);
    },
  });

  const handleCreateItem = async (data: FormValues) => {
    if (!isValid) return;

    if (activeTab === "services") {
      createServiceMutation.mutate(data);
    } else if (activeTab === "templates") {
      createTemplateMutation.mutate(data);
    } else {
      createProjectMutation.mutate(data);
    }
  };

  useEffect(() => {
    if (isCreateModalOpen) {
      reset();
    }
  }, [isCreateModalOpen, reset]);

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="bg-[var(--envyron-navy)] border-[var(--envyron-teal)]/30 text-white">
        <DialogHeader>
          <DialogTitle>
            Create New{" "}
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateItem)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-[var(--envyron-light-teal)]"
              >
                Name *
              </label>
              <Input
                placeholder={`Enter ${activeTab.slice(0, -1)} name...`}
                className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-gray-500 focus:border-[var(--envyron-light-teal)]"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-[var(--envyron-error)] text-sm mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-[var(--envyron-light-teal)]"
              >
                Description (optional)
              </label>
              <Textarea
                placeholder={`Describe your ${activeTab.slice(0, -1)}...`}
                className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-gray-500 focus:border-[var(--envyron-light-teal)] resize-none"
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-[var(--envyron-error)] text-sm mt-1">
                  {errors.description?.message}
                </p>
              )}
            </div>
            {activeTab === "projects" && (
              <div className="space-y-2">
                <label
                  htmlFor="template"
                  className="text-sm font-medium text-[var(--envyron-light-teal)]"
                >
                  Template (optional)
                </label>
                <Controller
                  name={"template" as any}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white focus:border-[var(--envyron-light-teal)]">
                        <SelectValue placeholder="Choose a template..." />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--envyron-navy)] border-[var(--envyron-teal)]/30">
                        <SelectItem
                          value="none"
                          className="text-white hover:bg-[var(--envyron-teal)]/20"
                        >
                          Start from scratch
                        </SelectItem>
                        {templates.map((template) => (
                          <SelectItem
                            key={template.id}
                            value={template.id}
                            className="text-white hover:bg-[var(--envyron-teal)]/20"
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {template.name}
                              </span>
                              <span className="text-xs text-[var(--envyron-light-teal)]/70">
                                {template.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}{" "}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCreateModalOpen(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={false}
                className="bg-[var(--envyron-teal)] hover:bg-[var(--envyron-light-teal)] text-white"
              >
                Create
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
