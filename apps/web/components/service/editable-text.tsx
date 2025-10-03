import { Edit2 } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchService, useUpdateService } from "@/hooks/use-service";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  serviceId: string;
};

const schema = z.object({
  name: z.string().min(1, "name is required"),
});

type ValidationSchema = z.infer<typeof schema>;

export function EditableText({ serviceId }: Props) {
  const { service, isPending } = useFetchService(serviceId);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (service) {
      reset({ name: service.name });
    }
  }, [service, reset]);

  if (!service && !isPending) {
    notFound();
  }

  const {
    updateService,
    isEditing,
    setIsEditing,
    isPending: isMutating,
  } = useUpdateService(serviceId);

  const handleEdit = (data: ValidationSchema) => {
    if (!isValid) return;
    updateService({
      name: data.name,
      item_id: serviceId,
      description: service?.description || "",
    });
  };

  const handleCancel = () => {
    reset({ name: service?.name || "" });
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
      <h1 className="text-xl font-semibold">{service?.name || ""}</h1>
      <Edit2
        className="w-4 h-4 text-gray-400 group-hover:opacity-100 transition-opacity"
        size={10}
      />
    </button>
  );
}
