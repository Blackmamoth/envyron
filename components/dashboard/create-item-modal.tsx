import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Dispatch, SetStateAction, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CreateItemSchema, createItemSchema } from "@/validation/service"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createServiceQueryOptions } from "@/lib/queryOptions/service"

type Props = {
  activeTab: string
  isCreateModalOpen: boolean
  setIsCreateModalOpen: Dispatch<SetStateAction<boolean>>
}



export default function CreateItemModal({ activeTab, isCreateModalOpen, setIsCreateModalOpen }: Props) {

  const router = useRouter()

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({ resolver: zodResolver(createItemSchema) })

  const queryClient = useQueryClient()

  const createServiceMutation = useMutation({
    ...createServiceQueryOptions(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["services"] })
      toast.success(response.message)
      router.push(`/services/editor/${response.service.id}`)
    },
    onError: (response) => {
      toast.error(response.message)
    }
  })

  const handleCreateItem = async (data: CreateItemSchema) => {
    if (!isValid) return;

    if (activeTab === "services") {
      createServiceMutation.mutate(data)
    }
  }

  useEffect(() => {
    if (isCreateModalOpen) {
      reset()
    }
  }, [isCreateModalOpen])

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogContent className="bg-[var(--envyron-navy)] border-[var(--envyron-teal)]/30 text-white">
        <DialogHeader>
          <DialogTitle>Create New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateItem)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--envyron-light-teal)]">Name *</label>
              <Input
                placeholder={`Enter ${activeTab.slice(0, -1)} name...`}
                className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-gray-500 focus:border-[var(--envyron-light-teal)]"
                {...register("name")}
              />
              {errors.name &&
                <p className="text-[var(--envyron-error)] text-sm mt-1">
                  {errors.name?.message}
                </p>
              }
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--envyron-light-teal)]">Description (optional)</label>
              <Textarea
                placeholder={`Describe your ${activeTab.slice(0, -1)}...`}
                className="bg-[var(--envyron-navy)]/60 border-[var(--envyron-teal)]/30 text-white placeholder:text-gray-500 focus:border-[var(--envyron-light-teal)] resize-none"
                rows={3}
                {...register("description")}
              />
              {errors.description &&
                <p className="text-[var(--envyron-error)] text-sm mt-1">
                  {errors.description?.message}
                </p>
              }
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCreateModalOpen(false)
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
  )
}
