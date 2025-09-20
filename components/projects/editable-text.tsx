import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2 } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getProjectQueryOptions,
  updateProjectMutationOptions,
} from "@/lib/queryOptions/project";

type Props = {
  projectId: string;
};

const schema = z.object({
  name: z.string().min(1, "name is required"),
});

type ValidationSchema = z.infer<typeof schema>;

export function EditableText({ projectId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const { data, isPending, isError, error } = useQuery(
    getProjectQueryOptions(projectId),
  );
  const project = data?.project;

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  // Update form when project data changes
  useEffect(() => {
    if (project?.name) {
      reset({ name: project.name });
    }
  }, [project?.name, reset]);

  if (isError) {
    toast.error(error.message);
  }

  if (!project && !isPending) {
    notFound();
  }

  const queryClient = useQueryClient();

  const { mutate, isPending: isMutating } = useMutation({
    ...updateProjectMutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setIsEditing(false);
      toast.success("Project updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
      setIsEditing(false);
    },
  });

  const handleEdit = (data: ValidationSchema) => {
    if (!isValid) return;
    mutate({
      name: data.name,
      item_id: projectId,
      description: project?.description || "",
    });
  };

  const handleCancel = () => {
    reset({ name: project?.name || "" });
    setIsEditing(false);
  };

  return isEditing ? (
    <div className="flex gap-2">
      <Input autoFocus {...register("name")} />
      <Button
        disabled={!isValid || isMutating}
        size="sm"
        onClick={handleSubmit(handleEdit)}
      >
        {isMutating ? "Saving..." : "Save"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCancel}
        disabled={isMutating}
      >
        Cancel
      </Button>
    </div>
  ) : (
    <button
      type="button"
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setIsEditing(true);
        }
      }}
    >
      <h1 className="text-xl font-semibold">{project?.name || ""}</h1>
      <Edit2
        className="w-4 h-4 text-gray-400 group-hover:opacity-100 transition-opacity"
        size={10}
      />
    </button>
  );
}
